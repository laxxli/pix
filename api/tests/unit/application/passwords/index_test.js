const { expect, sinon, HttpTestServer } = require('../../../test-helper');

const moduleUnderTest = require('../../../../lib/application/passwords');

const passwordController = require('../../../../lib/application/passwords/password-controller');

describe('Unit | Router | Password router', () => {

  let httpTestServer;

  beforeEach(async() => {
    sinon.stub(passwordController, 'checkResetDemand');
    sinon.stub(passwordController, 'createResetDemand');
    sinon.stub(passwordController, 'updateExpiredPassword').callsFake((request, h) => h.response().created());

    httpTestServer = new HttpTestServer();
    await httpTestServer.register(moduleUnderTest);
  });

  describe('POST /api/password-reset-demands', () => {

    const method = 'POST';
    const url = '/api/password-reset-demands';

    it('should return 200 http status code', async () => {
      // given
      passwordController.createResetDemand.returns('ok');

      const payload = {
        data: {
          attributes: {
            email: 'uzinagaz@example.net',
            'temporary-key': 'clé',
          },
          type: 'password-reset',
        },
      };

      // when
      const response = await httpTestServer.request(method, url, payload);

      // then
      expect(response.statusCode).to.equal(200);
    });

    context('When payload has a bad format or no email is provided', () => {

      it('should return 400 http status code', async () => {
        // given
        const payload = {
          data: {
            attributes: {},
          },
        };

        // when
        const response = await httpTestServer.request(method, url, payload);

        // then
        expect(response.statusCode).to.equal(400);
      });
    });
  });

  describe('GET /api/password-reset-demands/{temporaryKey}', () => {

    const method = 'GET';
    const url = '/api/password-reset-demands/ABCDEF123';

    it('should return 201 http status code', async () => {
      // given
      passwordController.checkResetDemand.resolves('ok');

      // when
      const response = await httpTestServer.request(method, url);

      // then
      expect(response.statusCode).to.equal(200);
    });
  });

  describe('POST /api/expired-password-updates', () => {

    const method = 'POST';
    const url = '/api/expired-password-updates';

    it('should return 201 http status code', async () => {
      // given
      const payload = {
        data: {
          attributes: {
            username: 'firstName.lastName0110',
            expiredPassword: 'expiredPassword01',
            newPassword: 'Password123',
          },
          type: 'password-reset',
        },
      };

      // when
      const response = await httpTestServer.request(method, url, payload);

      // then
      expect(response.statusCode).to.equal(201);
    });

    context('When the payload has the wrong format or no username or expiredPassword or newPassword is provided.', () => {

      it('should return 400 http status code', async () => {
        // given
        const payload = {
          data: {
            attributes: {
              username: 'firstName.lastName0110',
              expiredPassword: 'expiredPassword01',
              newPassword: null,
            },
            type: 'password-reset',
          },
        };

        // when
        const response = await httpTestServer.request(method, url, payload);

        // then
        expect(response.statusCode).to.equal(400);
      });
    });
  });

});
