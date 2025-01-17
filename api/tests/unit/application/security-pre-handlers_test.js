const { expect, sinon, hFake } = require('../../test-helper');

const securityPreHandlers = require('../../../lib/application/security-pre-handlers');
const tokenService = require('../../../lib/domain/services/token-service');
const checkUserHasRolePixMasterUseCase = require('../../../lib/application/usecases/checkUserHasRolePixMaster');
const checkUserIsAdminInOrganizationUseCase = require('../../../lib/application/usecases/checkUserIsAdminInOrganization');
const checkUserBelongsToOrganizationManagingStudentsUseCase = require('../../../lib/application/usecases/checkUserBelongsToOrganizationManagingStudents');
const checkUserBelongsToScoOrganizationAndManagesStudentsUseCase = require('../../../lib/application/usecases/checkUserBelongsToScoOrganizationAndManagesStudents');
const checkUserBelongsToOrganizationUseCase = require('../../../lib/application/usecases/checkUserBelongsToOrganization');

const config = require('../../../lib/config');

describe('Unit | Application | SecurityPreHandlers', () => {

  describe('#checkUserHasRolePixMaster', () => {
    let hasRolePixMasterStub;

    beforeEach(() => {
      sinon.stub(tokenService, 'extractTokenFromAuthChain');
      hasRolePixMasterStub = sinon.stub(checkUserHasRolePixMasterUseCase, 'execute');
    });

    context('Successful case', () => {
      const request = { auth: { credentials: { accessToken: 'valid.access.token', userId: 1234 } } };

      beforeEach(() => {
        hasRolePixMasterStub.resolves({ user_id: 1234 });
      });

      it('should authorize access to resource when the user is authenticated and has role PIX_MASTER', async () => {
        // given

        // when
        const response = await securityPreHandlers.checkUserHasRolePixMaster(request, hFake);

        // then
        expect(response.source).to.equal(true);
      });
    });

    context('Error cases', () => {

      const request = { auth: { credentials: { accessToken: 'valid.access.token' } } };

      it('should forbid resource access when user was not previously authenticated', async () => {
        // given
        delete request.auth.credentials;

        // when
        const response = await securityPreHandlers.checkUserHasRolePixMaster(request, hFake);

        // then
        expect(response.statusCode).to.equal(403);
        expect(response.isTakeOver).to.be.true;
      });

      it('should forbid resource access when user has not role PIX_MASTER', async () => {
        // given
        checkUserHasRolePixMasterUseCase.execute.resolves(false);

        // when
        const response = await securityPreHandlers.checkUserHasRolePixMaster(request, hFake);

        // then
        expect(response.statusCode).to.equal(403);
        expect(response.isTakeOver).to.be.true;
      });

      it('should forbid resource access when an error is thrown by use case', async () => {
        // given
        checkUserHasRolePixMasterUseCase.execute.rejects(new Error('Some error'));

        // when
        const response = await securityPreHandlers.checkUserHasRolePixMaster(request, hFake);

        // then
        expect(response.statusCode).to.equal(403);
        expect(response.isTakeOver).to.be.true;
      });

    });
  });

  describe('#checkRequestedUserIsAuthenticatedUser', () => {

    beforeEach(() => {
      sinon.stub(tokenService, 'extractTokenFromAuthChain');
    });

    context('Successful case', () => {

      it('should authorize access to resource when the authenticated user is the same as the requested user (id)', async () => {
        // given
        const request = { params: { id: '1234' }, auth: { credentials: { accessToken: 'valid.access.token', userId: 1234 } } };

        // when
        const response = await securityPreHandlers.checkRequestedUserIsAuthenticatedUser(request, hFake);

        // then
        expect(response.source).to.equal(true);
      });

      it('should authorize access to resource when the authenticated user is the same as the requested user (userId)', async () => {
        // given
        const request = { params: { userId: '1234' }, auth: { credentials: { accessToken: 'valid.access.token', userId: 1234 } } };

        // when
        const response = await securityPreHandlers.checkRequestedUserIsAuthenticatedUser(request, hFake);

        // then
        expect(response.source).to.equal(true);
      });
    });

    context('Error cases', () => {

      const request = { params: { id: '1234' }, auth: { credentials: { accessToken: 'valid.access.token' } } };

      it('should forbid resource access when user was not previously authenticated', async () => {
        // given
        delete request.auth.credentials;

        // when
        const response = await securityPreHandlers.checkRequestedUserIsAuthenticatedUser(request, hFake);

        // then
        expect(response.statusCode).to.equal(403);
        expect(response.isTakeOver).to.be.true;
      });

      it('should forbid resource access when requested user is not the same as authenticated user', async () => {
        // given
        request.params.id = '5678';

        // when
        const response = await securityPreHandlers.checkRequestedUserIsAuthenticatedUser(request, hFake);

        // then
        expect(response.statusCode).to.equal(403);
        expect(response.isTakeOver).to.be.true;
      });
    });
  });

  describe('#checkUserIsAdminInOrganization', () => {
    let isAdminInOrganizationStub;

    beforeEach(() => {
      sinon.stub(tokenService, 'extractTokenFromAuthChain');
      isAdminInOrganizationStub = sinon.stub(checkUserIsAdminInOrganizationUseCase, 'execute');
    });

    context('Successful case', () => {
      const request = { auth: { credentials: { accessToken: 'valid.access.token', userId: 1234 } }, params: { id: 5678 } };

      beforeEach(() => {
        isAdminInOrganizationStub.resolves(true);
      });

      it('should authorize access to resource when the user is authenticated and is ADMIN in Organization', async () => {
        // given

        // when
        const response = await securityPreHandlers.checkUserIsAdminInOrganization(request, hFake);

        // then
        expect(response.source).to.equal(true);
      });
    });

    context('Error cases', () => {

      const request = { auth: { credentials: { accessToken: 'valid.access.token' } }, params: { id: 5678 } };

      it('should forbid resource access when user was not previously authenticated', async () => {
        // given
        delete request.auth.credentials;

        // when
        const response = await securityPreHandlers.checkUserIsAdminInOrganization(request, hFake);

        // then
        expect(response.statusCode).to.equal(403);
        expect(response.isTakeOver).to.be.true;
      });

      it('should forbid resource access when user is not ADMIN in Organization', async () => {
        // given
        checkUserIsAdminInOrganizationUseCase.execute.resolves(false);

        // when
        const response = await securityPreHandlers.checkUserIsAdminInOrganization(request, hFake);

        // then
        expect(response.statusCode).to.equal(403);
        expect(response.isTakeOver).to.be.true;
      });

      it('should forbid resource access when an error is thrown by use case', async () => {
        // given
        checkUserIsAdminInOrganizationUseCase.execute.rejects(new Error('Some error'));

        // when
        const response = await securityPreHandlers.checkUserIsAdminInOrganization(request, hFake);

        // then
        expect(response.statusCode).to.equal(403);
        expect(response.isTakeOver).to.be.true;
      });

    });
  });

  describe('#checkUserIsAdminInOrganizationOrHasRolePixMaster', () => {
    let isAdminInOrganizationStub;
    let hasRolePixMasterStub;

    beforeEach(() => {
      sinon.stub(tokenService, 'extractTokenFromAuthChain');
      isAdminInOrganizationStub = sinon.stub(checkUserIsAdminInOrganizationUseCase, 'execute');
      hasRolePixMasterStub = sinon.stub(checkUserHasRolePixMasterUseCase, 'execute');
    });

    context('Successful case', () => {
      const request = { auth: { credentials: { accessToken: 'valid.access.token', userId: 1234 } }, params: { id: 5678 } };

      beforeEach(() => {
        isAdminInOrganizationStub.resolves(true);
        hasRolePixMasterStub.resolves(true);
      });

      it('should authorize access to resource when the user is authenticated and is PIX_MASTER', async () => {
        // given
        checkUserIsAdminInOrganizationUseCase.execute.resolves(false);

        // when
        const response = await securityPreHandlers.checkUserIsAdminInOrganizationOrHasRolePixMaster(request, hFake);

        // then
        expect(response.source).to.equal(true);
      });

      it('should authorize access to resource when the user is authenticated and is ADMIN in Organization', async () => {
        // given
        checkUserHasRolePixMasterUseCase.execute.resolves(false);

        // when
        const response = await securityPreHandlers.checkUserIsAdminInOrganizationOrHasRolePixMaster(request, hFake);

        // then
        expect(response.source).to.equal(true);
      });

      it('should authorize access to resource when the user is authenticated and is ADMIN in Organization and is PIX_MASTER', async () => {
        // given

        // when
        const response = await securityPreHandlers.checkUserIsAdminInOrganizationOrHasRolePixMaster(request, hFake);

        // then
        expect(response.source).to.equal(true);
      });
    });

    context('Error cases', () => {

      const request = { auth: { credentials: { accessToken: 'valid.access.token' } }, params: { id: 5678 } };

      it('should forbid resource access when user was not previously authenticated', async () => {
        // given
        delete request.auth.credentials;

        // when
        const response = await securityPreHandlers.checkUserIsAdminInOrganizationOrHasRolePixMaster(request, hFake);

        // then
        expect(response.statusCode).to.equal(403);
        expect(response.isTakeOver).to.be.true;
      });

      it('should forbid resource access when user is not ADMIN in Organization not PIX_MASTER', async () => {
        // given
        checkUserIsAdminInOrganizationUseCase.execute.resolves(false);
        checkUserHasRolePixMasterUseCase.execute.resolves(false);

        // when
        const response = await securityPreHandlers.checkUserIsAdminInOrganizationOrHasRolePixMaster(request, hFake);

        // then
        expect(response.statusCode).to.equal(403);
        expect(response.isTakeOver).to.be.true;
      });

      it('should forbid resource access when an error is thrown by use case', async () => {
        // given
        checkUserIsAdminInOrganizationUseCase.execute.rejects(new Error('Some error'));

        // when
        const response = await securityPreHandlers.checkUserIsAdminInOrganizationOrHasRolePixMaster(request, hFake);

        // then
        expect(response.statusCode).to.equal(403);
        expect(response.isTakeOver).to.be.true;
      });
    });
  });

  describe('#checkUserBelongsToOrganizationManagingStudents', () => {

    let belongToOrganizationManagingStudentsStub;

    beforeEach(() => {
      belongToOrganizationManagingStudentsStub = sinon.stub(checkUserBelongsToOrganizationManagingStudentsUseCase, 'execute');
    });

    context('Successful case', () => {
      const request = {
        auth: {
          credentials: {
            accessToken: 'valid.access.token',
            userId: 1234,
          },
        },
        params: { id: 5678 },
      };

      it('should authorize access to resource when the user is authenticated, belongs to an Organization and manages students', async () => {
        // given
        belongToOrganizationManagingStudentsStub.resolves(true);

        // when
        const response = await securityPreHandlers.checkUserBelongsToOrganizationManagingStudents(request, hFake);

        // then
        expect(response.source).to.equal(true);
      });
    });

    context('Error cases', () => {
      const request = {
        auth: {
          credentials: {
            accessToken: 'valid.access.token',
            userId: 1234,
          },
        },
        params: { id: 5678 },
      };

      it('should forbid resource access when user was not previously authenticated', async () => {
        // given
        delete request.auth.credentials;

        // when
        const response = await securityPreHandlers.checkUserBelongsToOrganizationManagingStudents(request, hFake);

        // then
        expect(response.statusCode).to.equal(403);
        expect(response.isTakeOver).to.be.true;
      });

      it('should forbid resource access when user does not belong to an Organization or manage students', async () => {
        // given
        belongToOrganizationManagingStudentsStub.resolves(false);

        // when
        const response = await securityPreHandlers.checkUserBelongsToOrganizationManagingStudents(request, hFake);

        // then
        expect(response.statusCode).to.equal(403);
        expect(response.isTakeOver).to.be.true;
      });

      it('should forbid resource access when an error is thrown by use case', async () => {
        // given
        belongToOrganizationManagingStudentsStub.rejects(new Error('Some error'));

        // when
        const response = await securityPreHandlers.checkUserBelongsToOrganizationManagingStudents(request, hFake);

        // then
        expect(response.statusCode).to.equal(403);
        expect(response.isTakeOver).to.be.true;
      });
    });
  });

  describe('#checkUserBelongsToScoOrganizationAndManagesStudents', () => {

    let belongToScoOrganizationAndManageStudentsStub;

    beforeEach(() => {
      belongToScoOrganizationAndManageStudentsStub = sinon.stub(checkUserBelongsToScoOrganizationAndManagesStudentsUseCase, 'execute');
    });

    context('Successful case', () => {
      const request = {
        auth: {
          credentials: {
            accessToken: 'valid.access.token',
            userId: 1234,
          },
        },
      };

      context('when organization id is in request params', () => {

        request.params = { id: 5678 };

        it('should authorize access to resource when the user is authenticated, belongs to SCO Organization and manages students', async () => {
          // given
          belongToScoOrganizationAndManageStudentsStub.resolves(true);

          // when
          const response = await securityPreHandlers.checkUserBelongsToScoOrganizationAndManagesStudents(request, hFake);

          // then
          expect(response.source).to.equal(true);
        });
      });

      context('when organization id is in request payload', () => {

        request.payload = {
          data: {
            attributes: {
              organizationId: 5678,
            },
          },
        };

        it('should authorize access to resource when the user is authenticated, belongs to SCO Organization and manages students', async () => {
          // given
          belongToScoOrganizationAndManageStudentsStub.resolves(true);

          // when
          const response = await securityPreHandlers.checkUserBelongsToScoOrganizationAndManagesStudents(request, hFake);

          // then
          expect(response.source).to.equal(true);
        });
      });
    });

    context('Error cases', () => {
      const request = {
        auth: {
          credentials: {
            accessToken: 'valid.access.token',
            userId: 1234,
          },
        },
        params: { id: 5678 } };

      it('should forbid resource access when user was not previously authenticated', async () => {
        // given
        delete request.auth.credentials;

        // when
        const response = await securityPreHandlers.checkUserBelongsToScoOrganizationAndManagesStudents(request, hFake);

        // then
        expect(response.statusCode).to.equal(403);
        expect(response.isTakeOver).to.be.true;
      });

      it('should forbid resource access when user does not belong to SCO Organization or manage students', async () => {
        // given
        belongToScoOrganizationAndManageStudentsStub.resolves(false);

        // when
        const response = await securityPreHandlers.checkUserBelongsToScoOrganizationAndManagesStudents(request, hFake);

        // then
        expect(response.statusCode).to.equal(403);
        expect(response.isTakeOver).to.be.true;
      });

      it('should forbid resource access when an error is thrown by use case', async () => {
        // given
        belongToScoOrganizationAndManageStudentsStub.rejects(new Error('Some error'));

        // when
        const response = await securityPreHandlers.checkUserBelongsToScoOrganizationAndManagesStudents(request, hFake);

        // then
        expect(response.statusCode).to.equal(403);
        expect(response.isTakeOver).to.be.true;
      });
    });
  });

  describe('#checkUserBelongsToOrganizationOrHasRolePixMaster', () => {

    let belongsToOrganizationStub;
    let hasRolePixMasterStub;

    beforeEach(() => {
      belongsToOrganizationStub = sinon.stub(checkUserBelongsToOrganizationUseCase, 'execute');
      hasRolePixMasterStub = sinon.stub(checkUserHasRolePixMasterUseCase, 'execute');
    });

    context('Successful case', () => {
      const request = {
        auth: {
          credentials: {
            accessToken: 'valid.access.token',
            userId: 1234,
          },
        },
        params: { id: 5678 },
      };

      it('should authorize access to resource when the user is authenticated and belongs to organization', async () => {
        // given
        belongsToOrganizationStub.resolves(true);
        hasRolePixMasterStub.resolves(false);

        // when
        const response = await securityPreHandlers.checkUserBelongsToOrganizationOrHasRolePixMaster(request, hFake);

        // then
        expect(response.source).to.equal(true);
      });

      it('should authorize access to resource when the user is authenticated and is PIX_MASTER', async () => {
        // given
        belongsToOrganizationStub.resolves(false);
        hasRolePixMasterStub.resolves(true);

        // when
        const response = await securityPreHandlers.checkUserBelongsToOrganizationOrHasRolePixMaster(request, hFake);

        // then
        expect(response.source).to.equal(true);
      });

      it('should authorize access to resource when the user is authenticated and belongs to organization and is PIX_MASTER', async () => {
        // given
        belongsToOrganizationStub.resolves(true);
        hasRolePixMasterStub.resolves(true);

        // when
        const response = await securityPreHandlers.checkUserBelongsToOrganizationOrHasRolePixMaster(request, hFake);

        // then
        expect(response.source).to.equal(true);
      });
    });

    context('Error cases', () => {
      const request = {
        auth: {
          credentials: {
            accessToken: 'valid.access.token',
            userId: 1234,
          },
        },
      };

      it('should forbid resource access when user was not previously authenticated', async () => {
        // given
        delete request.auth.credentials;

        // when
        const response = await securityPreHandlers.checkUserBelongsToOrganizationOrHasRolePixMaster(request, hFake);

        // then
        expect(response.statusCode).to.equal(403);
        expect(response.isTakeOver).to.be.true;
      });

      it('should forbid resource access when user does not belong to organization or has role PIXMASTER', async () => {
        // given
        belongsToOrganizationStub.resolves(false);

        // when
        const response = await securityPreHandlers.checkUserBelongsToOrganizationOrHasRolePixMaster(request, hFake);

        // then
        expect(response.statusCode).to.equal(403);
        expect(response.isTakeOver).to.be.true;
      });

      it('should forbid resource access when an error is thrown by use case', async () => {
        // given
        belongsToOrganizationStub.rejects(new Error('Some error'));

        // when
        const response = await securityPreHandlers.checkUserBelongsToOrganizationOrHasRolePixMaster(request, hFake);

        // then
        expect(response.statusCode).to.equal(403);
        expect(response.isTakeOver).to.be.true;
      });
    });
  });

  describe('#checkIsCertificationResultsInOrgaToggleEnabled', () => {

    const ft = config.featureToggles.isCertificationResultsInOrgaEnabled;

    afterEach(() => {
      config.featureToggles.isCertificationResultsInOrgaEnabled = ft;
    });

    context('when FT_IS_CERTIFICATION_RESULTS_IN_ORGA_ENABLED is enabled', () => {

      it('it returns true', () => {
        // given
        const request = { auth: { credentials: { accessToken: 'valid.access.token', userId: 1234 } } };
        config.featureToggles.isCertificationResultsInOrgaEnabled = true;

        // when
        const response = securityPreHandlers.checkIsCertificationResultsInOrgaToggleEnabled(request, hFake);

        //then
        expect(response.source).to.equal(true);
      });
    });

    context('when FT_IS_CERTIFICATION_RESULTS_IN_ORGA_ENABLED is not enabled', () => {

      it('should forbid resource access', async () => {
        // given
        const request = { auth: { credentials: { accessToken: 'valid.access.token', userId: 1234 } } };

        // when
        const response = await securityPreHandlers.checkIsCertificationResultsInOrgaToggleEnabled(request, hFake);

        //then
        expect(response.statusCode).to.equal(403);
      });
    });
  });
});
