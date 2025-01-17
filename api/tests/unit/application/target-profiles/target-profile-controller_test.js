const { expect, sinon, hFake } = require('../../../test-helper');
const targetProfileController = require('../../../../lib/application/target-profiles/target-profile-controller');
const usecases = require('../../../../lib/domain/usecases');

describe('Unit | Controller | target-profile-controller', () => {

  describe('#updateTargetProfileName', () => {

    let request;

    beforeEach(() => {

      sinon.stub(usecases, 'updateTargetProfileName');

      request = {
        params: {
          id: '123',
        },
        payload: {
          data: {
            attributes: {
              name: 'Pixer123',
            },
          },
        },
      };
    });

    context('successful case', () => {

      it('should succeed', async () => {
        // when
        const response = await targetProfileController.updateTargetProfileName(request, hFake);

        // then
        expect(response.statusCode).to.equal(204);
      });

      it('should update target profile name', async () => {
        // when
        await targetProfileController.updateTargetProfileName(request, hFake);

        // then
        expect(usecases.updateTargetProfileName).to.have.been.calledOnce;
        expect(usecases.updateTargetProfileName).to.have.been.calledWithMatch({ id: 123, name: 'Pixer123' });
      });
    });
  });

  describe('#outdateTargetProfile', () => {

    let request;

    beforeEach(() => {

      sinon.stub(usecases, 'outdateTargetProfile');

      request = {
        params: {
          id: 123,
        },
      };
    });

    context('successful case', () => {

      it('should succeed', async () => {
        // when
        const response = await targetProfileController.outdateTargetProfile(request, hFake);

        // then
        expect(response.statusCode).to.equal(204);
      });

      it('should outdate target profile', async () => {
        // when
        await targetProfileController.outdateTargetProfile(request, hFake);

        // then
        expect(usecases.outdateTargetProfile).to.have.been.calledWithMatch({ id: 123 });
      });
    });
  });
});
