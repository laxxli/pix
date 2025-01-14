const {
  expect,
  HttpTestServer,
  sinon,
} = require('../../../test-helper');

const moduleUnderTest = require('../../../../lib/application/campaign-participations');

const campaignParticipationController = require('../../../../lib/application/campaign-participations/campaign-participation-controller');

describe('Unit | Application | Router | campaign-participation-router ', function() {

  let httpTestServer;

  beforeEach(async () => {
    sinon.stub(campaignParticipationController, 'save').callsFake((request, h) => h.response('ok').code(200));

    httpTestServer = new HttpTestServer();
    await httpTestServer.register(moduleUnderTest);
  });

  describe('POST /api/campaign-participations', () => {

    it('should return 200 when participant have external id', async () => {
      // when
      const participantExternalId = 'toto';
      const response = await httpTestServer.request('POST', '/api/campaign-participations', {
        data: {
          type: 'campaign-participations',
          attributes: {
            'participant-external-id': participantExternalId,
          },
        },
      });

      // then
      expect(response.statusCode).to.equal(200);
    });

    it('should return 400 when participant external id exceeds 255 characters', async () => {
      // when
      const participantExternalId256Characters = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
      const response = await httpTestServer.request('POST', '/api/campaign-participations', {
        data: {
          type: 'campaign-participations',
          attributes: {
            'participant-external-id': participantExternalId256Characters,
          },
        },
      });

      // then
      expect(response.statusCode).to.equal(400);
    });
  });
});
