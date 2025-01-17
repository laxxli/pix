const { expect, sinon, HttpTestServer } = require('../../test-helper');
const DomainErrors = require('../../../lib/domain/errors');

describe('Integration | API | Controller Error', () => {

  let server;
  const routeHandler = sinon.stub();

  const routeUrl = '/test_route';
  const request = { method: 'GET', url: routeUrl };

  function responseDetail(response) {
    const payload = JSON.parse(response.payload);
    return payload.errors[0].detail;
  }

  function responseTitle(response) {
    const payload = JSON.parse(response.payload);
    return payload.errors[0].title;
  }

  before(async () => {
    const moduleUnderTest = {
      name: 'test-route',
      register: async function(server) {
        server.route([{
          method: 'GET',
          path: routeUrl,
          handler: routeHandler,
          config: {
            auth: false,
          },
        }]);
      },
    };
    server = new HttpTestServer();
    await server.register(moduleUnderTest);
  });

  context('412 Precondition Failed', () => {
    const PRECONDITION_FAILED = 412;

    it('responds Precondition Failed when a AlreadyExistingEntityError occurs', async () => {
      routeHandler.throws(new DomainErrors.AlreadyExistingEntityError());
      const response = await server.requestObject(request);

      expect(response.statusCode).to.equal(PRECONDITION_FAILED);
      expect(responseDetail(response)).to.equal('L’entité existe déjà.');
    });

    it('responds Precondition Failed when a AlreadyRatedAssessmentError error occurs', async () => {
      routeHandler.throws(new DomainErrors.AlreadyRatedAssessmentError());
      const response = await server.requestObject(request);

      expect(response.statusCode).to.equal(PRECONDITION_FAILED);
      expect(responseDetail(response)).to.equal('Assessment is already rated.');
    });

    it('responds Precondition Failed when a CompetenceResetError error occurs', async () => {
      routeHandler.throws(new DomainErrors.CompetenceResetError(2));
      const response = await server.requestObject(request);

      expect(response.statusCode).to.equal(PRECONDITION_FAILED);
      expect(responseDetail(response)).to.equal('Il reste 2 jours avant de pouvoir réinitiliser la compétence.');
    });

    it('responds Precondition Failed when a AlreadyExistingMembershipError error occurs', async () => {
      routeHandler.throws(new DomainErrors.AlreadyExistingMembershipError('Le membership existe déjà.'));
      const response = await server.requestObject(request);

      expect(response.statusCode).to.equal(PRECONDITION_FAILED);
      expect(responseDetail(response)).to.equal('Le membership existe déjà.');
    });

    it('responds Precondition Failed when a AlreadyExistingOrganizationInvitationError error occurs', async () => {
      routeHandler.throws(new DomainErrors.AlreadyExistingOrganizationInvitationError('L\'invitation de l\'organisation existe déjà.'));
      const response = await server.requestObject(request);

      expect(response.statusCode).to.equal(PRECONDITION_FAILED);
      expect(responseDetail(response)).to.equal('L\'invitation de l\'organisation existe déjà.');
    });

    it('responds Precondition Failed when a AlreadySharedCampaignParticipationError error occurs', async () => {
      routeHandler.throws(new DomainErrors.AlreadySharedCampaignParticipationError('Ces résultats de campagne ont déjà été partagés.'));
      const response = await server.requestObject(request);

      expect(response.statusCode).to.equal(PRECONDITION_FAILED);
      expect(responseDetail(response)).to.equal('Ces résultats de campagne ont déjà été partagés.');
    });

    it('responds Precondition Failed when a AlreadyExistingCampaignParticipationError error occurs', async () => {
      routeHandler.throws(new DomainErrors.AlreadyExistingCampaignParticipationError());
      const response = await server.requestObject(request);

      expect(response.statusCode).to.equal(PRECONDITION_FAILED);
    });

    it('responds Precondition Failed when a CsvImportError error occurs', async () => {
      routeHandler.throws(new DomainErrors.CsvImportError());
      const response = await server.requestObject(request);

      expect(response.statusCode).to.equal(PRECONDITION_FAILED);
    });

    it('responds Precondition Failed when a SiecleXmlImportError error occurs', async () => {
      routeHandler.throws(new DomainErrors.SiecleXmlImportError());
      const response = await server.requestObject(request);

      expect(response.statusCode).to.equal(PRECONDITION_FAILED);
    });

    it('responds Precondition Failed when a TargetProfileInvalidError error occurs', async () => {
      routeHandler.throws(new DomainErrors.TargetProfileInvalidError());
      const response = await server.requestObject(request);

      expect(response.statusCode).to.equal(PRECONDITION_FAILED);
    });

    it('responds Precondition Failed when a NoStagesForCampaign error occurs', async () => {
      routeHandler.throws(new DomainErrors.NoStagesForCampaign());
      const response = await server.requestObject(request);

      expect(response.statusCode).to.equal(PRECONDITION_FAILED);
    });

    it('responds Precondition Failed when a SessionNotAccessible error occurs', async () => {
      routeHandler.throws(new DomainErrors.SessionNotAccessible());
      const response = await server.requestObject(request);

      expect(response.statusCode).to.equal(PRECONDITION_FAILED);
    });
  });

  context('404 Not Found', () => {
    const NOT_FOUND_ERROR = 404;

    it('responds Not Found when a DomainError.NotFoundError error occurs', async () => {
      routeHandler.throws(new DomainErrors.NotFoundError('Entity Not Found'));
      const response = await server.requestObject(request);

      expect(response.statusCode).to.equal(NOT_FOUND_ERROR);
      expect(responseDetail(response)).to.equal('Entity Not Found');
    });

    it('responds Not Found when a CampaignCodeError error occurs', async () => {
      routeHandler.throws(new DomainErrors.CampaignCodeError('Campaign Code Error'));
      const response = await server.requestObject(request);

      expect(response.statusCode).to.equal(NOT_FOUND_ERROR);
      expect(responseDetail(response)).to.equal('Campaign Code Error');
    });

    it('responds Not Found when a CertificationCandidateByPersonalInfoNotFoundError error occurs', async () => {
      routeHandler.throws(new DomainErrors.CertificationCandidateByPersonalInfoNotFoundError());
      const response = await server.requestObject(request);

      expect(response.statusCode).to.equal(NOT_FOUND_ERROR);
      expect(responseDetail(response)).to.equal('Aucun candidat de certification ne correspond aux informations d\'identité fournies.');
    });

    it('responds Not Found when a UserNotFoundError error occurs', async () => {
      routeHandler.throws(new DomainErrors.UserNotFoundError('Ce compte est introuvable.'));
      const response = await server.requestObject(request);

      expect(response.statusCode).to.equal(NOT_FOUND_ERROR);
      expect(responseDetail(response)).to.equal('Ce compte est introuvable.');
    });

    it('responds Not Found when a PasswordResetDemandNotFoundError error occurs', async () => {
      routeHandler.throws(new DomainErrors.PasswordResetDemandNotFoundError('La demande de réinitialisation de mot de passe n\'existe pas.'));
      const response = await server.requestObject(request);

      expect(response.statusCode).to.equal(NOT_FOUND_ERROR);
      expect(responseDetail(response)).to.equal('La demande de réinitialisation de mot de passe n\'existe pas.');
    });

    it('responds Not Found when a NoCertificationResultForDivision error occurs', async () => {
      routeHandler.throws(new DomainErrors.NoCertificationResultForDivision());
      const response = await server.requestObject(request);

      expect(response.statusCode).to.equal(NOT_FOUND_ERROR);
      expect(responseDetail(response)).to.equal('Aucun résultat de certification pour cette classe.');
    });

    it('responds Not Found when a ChallengeToBeNeutralizedNotFoundError error occurs', async () => {
      routeHandler.throws(new DomainErrors.ChallengeToBeNeutralizedNotFoundError());
      const response = await server.requestObject(request);

      expect(response.statusCode).to.equal(NOT_FOUND_ERROR);
      expect(responseDetail(response)).to.equal('La question à neutraliser n\'a pas été posée lors du test de certification');
    });

    it('responds Not Found when a ChallengeToBeDeneutralizedNotFoundError error occurs', async () => {
      routeHandler.throws(new DomainErrors.ChallengeToBeDeneutralizedNotFoundError());
      const response = await server.requestObject(request);

      expect(response.statusCode).to.equal(NOT_FOUND_ERROR);
      expect(responseDetail(response)).to.equal('La question à dé-neutraliser n\'a pas été posée lors du test de certification');
    });
  });

  context('409 Conflict', () => {
    const CONFLICT_ERROR = 409;

    it('responds Conflict when a CertificationCandidateByPersonalInfoTooManyMatchesError error occurs', async () => {
      routeHandler.throws(new DomainErrors.CertificationCandidateByPersonalInfoTooManyMatchesError());
      const response = await server.requestObject(request);

      expect(response.statusCode).to.equal(CONFLICT_ERROR);
      expect(responseDetail(response)).to.equal('Plus d\'un candidat de certification correspondent aux informations d\'identité fournies.');
    });

    it('responds Conflict when a ChallengeAlreadyAnsweredError error occurs', async () => {
      routeHandler.throws(new DomainErrors.ChallengeAlreadyAnsweredError());
      const response = await server.requestObject(request);

      expect(response.statusCode).to.equal(CONFLICT_ERROR);
      expect(responseDetail(response)).to.equal('This challenge has already been answered.');
    });

    it('responds Conflict when a AssessmentNotCompletedError error occurs', async () => {
      routeHandler.throws(new DomainErrors.AssessmentNotCompletedError('Cette évaluation n\'est pas terminée.'));
      const response = await server.requestObject(request);

      expect(response.statusCode).to.equal(CONFLICT_ERROR);
      expect(responseDetail(response)).to.equal('Cette évaluation n\'est pas terminée.');
    });

    it('responds Conflict when a SchoolingRegistrationAlreadyLinkedToUserError error occurs', async () => {
      routeHandler.throws(new DomainErrors.SchoolingRegistrationAlreadyLinkedToUserError('L\'élève est déjà rattaché à un compte utilisateur.'));
      const response = await server.requestObject(request);

      expect(response.statusCode).to.equal(CONFLICT_ERROR);
      expect(responseDetail(response)).to.equal('L\'élève est déjà rattaché à un compte utilisateur.');
    });

    it('responds Conflict when a SameNationalStudentIdInOrganizationError error occurs', async () => {
      routeHandler.throws(new DomainErrors.SameNationalStudentIdInOrganizationError('(ABC123)'));
      const response = await server.requestObject(request);

      expect(response.statusCode).to.equal(CONFLICT_ERROR);
      expect(responseDetail(response)).to.equal('The INE ABC123 is already in use for this organization.');
    });

    it('responds Conflict when a SameNationalApprenticeIdInOrganizationError error occurs', async () => {
      routeHandler.throws(new DomainErrors.SameNationalApprenticeIdInOrganizationError('(ABC123)'));
      const response = await server.requestObject(request);

      expect(response.statusCode).to.equal(CONFLICT_ERROR);
      expect(responseDetail(response)).to.equal('The INA ABC123 is already in use for this organization.');
    });
  });

  context('403 Forbidden', () => {
    const FORBIDDEN_ERROR = 403;

    it('responds Forbidden when a UserNotAuthorizedToAccessEntityError error occurs', async () => {
      routeHandler.throws(new DomainErrors.UserNotAuthorizedToAccessEntityError());
      const response = await server.requestObject(request);

      expect(response.statusCode).to.equal(FORBIDDEN_ERROR);
      expect(responseDetail(response)).to.equal('Utilisateur non autorisé à accéder à la ressource');
    });

    it('responds Forbidden when a UserNotAuthorizedToUpdateResourceError error occurs', async () => {
      routeHandler.throws(new DomainErrors.UserNotAuthorizedToUpdateResourceError('Utilisateur non autorisé à mettre à jour à la ressource'));
      const response = await server.requestObject(request);

      expect(response.statusCode).to.equal(FORBIDDEN_ERROR);
      expect(responseDetail(response)).to.equal('Utilisateur non autorisé à mettre à jour à la ressource');
    });

    it('responds Forbidden when a UserNotAuthorizedToCreateCampaignError error occurs', async () => {
      routeHandler.throws(new DomainErrors.UserNotAuthorizedToCreateCampaignError('Utilisateur non autorisé à créer une campagne'));
      const response = await server.requestObject(request);

      expect(response.statusCode).to.equal(FORBIDDEN_ERROR);
      expect(responseDetail(response)).to.equal('Utilisateur non autorisé à créer une campagne');
    });

    it('responds Forbidden when a UserNotAuthorizedToGetCertificationCoursesError error occurs', async () => {
      routeHandler.throws(new DomainErrors.UserNotAuthorizedToGetCertificationCoursesError('Cet utilisateur n\'est pas autorisé à récupérer ces certification courses.'));
      const response = await server.requestObject(request);

      expect(response.statusCode).to.equal(FORBIDDEN_ERROR);
      expect(responseDetail(response)).to.equal('Cet utilisateur n\'est pas autorisé à récupérer ces certification courses.');
    });

    it('responds Forbidden when a CertificationCandidateAlreadyLinkedToUserError error occurs', async () => {
      routeHandler.throws(new DomainErrors.CertificationCandidateAlreadyLinkedToUserError());
      const response = await server.requestObject(request);

      expect(response.statusCode).to.equal(FORBIDDEN_ERROR);
      expect(responseDetail(response)).to.equal('Le candidat de certification est déjà lié à un utilisateur.');
    });

    it('responds Forbidden when a CertificationCandidateForbiddenDeletionError error occurs', async () => {
      routeHandler.throws(new DomainErrors.CertificationCandidateForbiddenDeletionError());
      const response = await server.requestObject(request);

      expect(response.statusCode).to.equal(FORBIDDEN_ERROR);
      expect(responseDetail(response)).to.equal('Il est interdit de supprimer un candidat de certification déjà lié à un utilisateur.');
    });

    it('responds Forbidden when a ForbiddenAccess error occurs', async () => {
      routeHandler.throws(new DomainErrors.ForbiddenAccess('Accès non autorisé.'));
      const response = await server.requestObject(request);

      expect(response.statusCode).to.equal(FORBIDDEN_ERROR);
      expect(responseDetail(response)).to.equal('Accès non autorisé.');
    });

    it('responds Forbidden when a UserAlreadyLinkedToCandidateInSessionError error occurs', async () => {
      routeHandler.throws(new DomainErrors.UserAlreadyLinkedToCandidateInSessionError());
      const response = await server.requestObject(request);

      expect(response.statusCode).to.equal(FORBIDDEN_ERROR);
      expect(responseDetail(response)).to.equal('L\'utilisateur est déjà lié à un candidat dans cette session.');
    });

    it('responds Forbidden when a UserNotAuthorizedToCertifyError error occurs', async () => {
      routeHandler.throws(new DomainErrors.UserNotAuthorizedToCertifyError());
      const response = await server.requestObject(request);

      expect(response.statusCode).to.equal(FORBIDDEN_ERROR);
      expect(responseDetail(response)).to.equal('The user cannot be certified.');
    });

    it('responds Forbidden when a UserNotAuthorizedToGetCampaignResultsError error occurs', async () => {
      routeHandler.throws(new DomainErrors.UserNotAuthorizedToGetCampaignResultsError('Cet utilisateur n\'est pas autorisé à récupérer les résultats de la campagne.'));
      const response = await server.requestObject(request);

      expect(response.statusCode).to.equal(FORBIDDEN_ERROR);
      expect(responseDetail(response)).to.equal('Cet utilisateur n\'est pas autorisé à récupérer les résultats de la campagne.');
    });

    it('responds Forbidden when a UserNotAuthorizedToUpdatePasswordError error occurs', async () => {
      routeHandler.throws(new DomainErrors.UserNotAuthorizedToUpdatePasswordError('Cet utilisateur n\'est pas autorisé à récupérer les résultats de la campagne.'));
      const response = await server.requestObject(request);

      expect(response.statusCode).to.equal(FORBIDDEN_ERROR);
      expect(responseDetail(response)).to.equal('Cet utilisateur n\'est pas autorisé à récupérer les résultats de la campagne.');
    });

    it('responds Forbidden when a UserNotAuthorizedToCreateResourceError error occurs', async () => {
      routeHandler.throws(new DomainErrors.UserNotAuthorizedToCreateResourceError('Cet utilisateur n\'est pas autorisé à créer la ressource.'));
      const response = await server.requestObject(request);

      expect(response.statusCode).to.equal(FORBIDDEN_ERROR);
      expect(responseDetail(response)).to.equal('Cet utilisateur n\'est pas autorisé à créer la ressource.');
    });

    it('responds Forbidden when a ImproveCompetenceEvaluationForbiddenError error occurs', async () => {
      routeHandler.throws(new DomainErrors.ImproveCompetenceEvaluationForbiddenError());
      const response = await server.requestObject(request);

      expect(response.statusCode).to.equal(FORBIDDEN_ERROR);
      expect(responseDetail(response)).to.equal('Le niveau maximum est déjà atteint pour cette compétence.');
      expect(responseTitle(response)).to.equal('ImproveCompetenceEvaluationForbidden');
    });

    it('responds Forbidden when a ApplicationScopeNotAllowedError error occurs', async () => {
      routeHandler.throws(new DomainErrors.ApplicationScopeNotAllowedError());
      const response = await server.requestObject(request);

      expect(response.statusCode).to.equal(FORBIDDEN_ERROR);
      expect(responseDetail(response)).to.equal('The scope is not allowed.');
      expect(responseTitle(response)).to.equal('Forbidden');
    });
  });

  context('400 Bad Request', () => {
    const BAD_REQUEST_ERROR = 400;

    it('responds Bad Request when a CertificationCandidatePersonalInfoFieldMissingError error occurs', async () => {
      routeHandler.throws(new DomainErrors.CertificationCandidatePersonalInfoFieldMissingError());
      const response = await server.requestObject(request);

      expect(response.statusCode).to.equal(BAD_REQUEST_ERROR);
      expect(responseDetail(response)).to.equal('Un ou plusieurs champs d\'informations d\'identité sont manquants.');
    });

    it('responds Bad Request when a CertificationCandidatePersonalInfoWrongFormat error occurs', async () => {
      routeHandler.throws(new DomainErrors.CertificationCandidatePersonalInfoWrongFormat());
      const response = await server.requestObject(request);

      expect(response.statusCode).to.equal(BAD_REQUEST_ERROR);
      expect(responseDetail(response)).to.equal('Un ou plusieurs champs d\'informations d\'identité sont au mauvais format.');
    });

    it('responds Bad Request when a CertificationCenterMembershipCreationError error occurs', async () => {
      routeHandler.throws(new DomainErrors.CertificationCenterMembershipCreationError());
      const response = await server.requestObject(request);

      expect(response.statusCode).to.equal(BAD_REQUEST_ERROR);
      expect(responseDetail(response)).to.equal('Le membre ou le centre de certification n\'existe pas.');
    });

    it('responds Bad Request when a InvalidCertificationReportForFinalization error occurs', async () => {
      routeHandler.throws(new DomainErrors.InvalidCertificationReportForFinalization('Echec lors de la validation du certification course'));
      const response = await server.requestObject(request);

      expect(response.statusCode).to.equal(BAD_REQUEST_ERROR);
      expect(responseDetail(response)).to.equal('Echec lors de la validation du certification course');
    });

    it('responds Bad Request when a MembershipCreationError error occurs', async () => {
      routeHandler.throws(new DomainErrors.MembershipCreationError('Erreur lors de la création du membership à une organisation.'));
      const response = await server.requestObject(request);

      expect(response.statusCode).to.equal(BAD_REQUEST_ERROR);
      expect(responseDetail(response)).to.equal('Erreur lors de la création du membership à une organisation.');
    });

    it('responds Bad Request when a MembershipUpdateError error occurs', async () => {
      routeHandler.throws(new DomainErrors.MembershipUpdateError('Erreur lors de la mise à jour du membership à une organisation.'));
      const response = await server.requestObject(request);

      expect(response.statusCode).to.equal(BAD_REQUEST_ERROR);
      expect(responseDetail(response)).to.equal('Erreur lors de la mise à jour du membership à une organisation.');
    });

    it('responds Bad Request when a SchoolingRegistrationsCouldNotBeSavedError error occurs', async () => {
      routeHandler.throws(new DomainErrors.SchoolingRegistrationsCouldNotBeSavedError());
      const response = await server.requestObject(request);

      expect(response.statusCode).to.equal(BAD_REQUEST_ERROR);
      expect(responseDetail(response)).to.equal('An error occurred during process');
    });

    it('responds Bad Request when a WrongDateFormatError error occurs', async () => {
      routeHandler.throws(new DomainErrors.WrongDateFormatError('Format de date invalide.'));
      const response = await server.requestObject(request);

      expect(response.statusCode).to.equal(BAD_REQUEST_ERROR);
      expect(responseDetail(response)).to.equal('Format de date invalide.');
    });

    it('responds Bad Request when a SessionAlreadyFinalizedError error occurs', async () => {
      routeHandler.throws(new DomainErrors.SessionAlreadyFinalizedError('Erreur, tentatives de finalisation multiples de la session.'));
      const response = await server.requestObject(request);

      expect(response.statusCode).to.equal(BAD_REQUEST_ERROR);
      expect(responseDetail(response)).to.equal('Erreur, tentatives de finalisation multiples de la session.');
    });

    it('responds Bad Request when a SessionAlreadyPublishedError error occurs', async () => {
      routeHandler.throws(new DomainErrors.SessionAlreadyPublishedError());
      const response = await server.requestObject(request);

      expect(response.statusCode).to.equal(BAD_REQUEST_ERROR);
      expect(responseDetail(response)).to.equal('La session est déjà publiée.');
    });

    it('responds Bad Request when a UserOrgaSettingsCreationError error occurs', async () => {
      routeHandler.throws(new DomainErrors.UserOrgaSettingsCreationError('Erreur lors de la création des paramètres utilisateur relatifs à Pix Orga.'));
      const response = await server.requestObject(request);

      expect(response.statusCode).to.equal(BAD_REQUEST_ERROR);
      expect(responseDetail(response)).to.equal('Erreur lors de la création des paramètres utilisateur relatifs à Pix Orga.');
    });
  });

  context('422 Unprocessable Entity', () => {
    const UNPROCESSABLE_ENTITY_ERROR = 422;

    it('responds Unprocessable Entity when a ObjectValidationError error occurs', async () => {
      routeHandler.throws(new DomainErrors.ObjectValidationError('Erreur, objet non valide.'));
      const response = await server.requestObject(request);

      expect(response.statusCode).to.equal(UNPROCESSABLE_ENTITY_ERROR);
      expect(responseDetail(response)).to.equal('Erreur, objet non valide.');

    });

    it('responds Unprocessable Entity when a FileValidationError error occurs', async () => {
      routeHandler.throws(new DomainErrors.FileValidationError('Erreur, fichier non valide.'));
      const response = await server.requestObject(request);

      expect(response.statusCode).to.equal(UNPROCESSABLE_ENTITY_ERROR);
      expect(responseDetail(response)).to.equal('An error occurred, file is invalid');
    });

    it('responds Unprocessable Entity when a UserNotMemberOfOrganizationError error occurs', async () => {
      routeHandler.throws(new DomainErrors.UserNotMemberOfOrganizationError('L\'utilisateur n\'est pas membre de l\'organisation.'));
      const response = await server.requestObject(request);

      expect(response.statusCode).to.equal(UNPROCESSABLE_ENTITY_ERROR);
      expect(responseDetail(response)).to.equal('L\'utilisateur n\'est pas membre de l\'organisation.');
    });

    it('responds Unprocessable Entity with invalid data attribute', async () => {
      // given
      const invalidAttributes = [{
        attribute: 'firstname',
        message: 'Le prénom n’est pas renseigné.',
      }];
      routeHandler.throws(new DomainErrors.EntityValidationError({ invalidAttributes }));

      // when
      const response = await server.requestObject(request);

      // then
      expect(response.statusCode).to.equal(UNPROCESSABLE_ENTITY_ERROR);

      const payload = JSON.parse(response.payload);
      expect(payload.errors).to.have.lengthOf(1);

      const unprocessableErrorOnFirstname = payload.errors[0];
      expect(unprocessableErrorOnFirstname.status).to.equal('422');
      expect(unprocessableErrorOnFirstname.source.pointer).to.equal('/data/attributes/firstname');
      expect(unprocessableErrorOnFirstname.title).to.equal('Invalid data attribute "firstname"');
      expect(unprocessableErrorOnFirstname.detail).to.equal('Le prénom n’est pas renseigné.');
    });

    it('responds Unprocessable Entity with invalid relationships if name ends with Id', async () => {
      // given
      const invalidAttributes = [{
        attribute: 'targetProfileId',
        message: 'Le profile cible n’est pas renseigné.',
      }];
      routeHandler.throws(new DomainErrors.EntityValidationError({ invalidAttributes }));

      // when
      const response = await server.requestObject(request);

      // then
      expect(response.statusCode).to.equal(UNPROCESSABLE_ENTITY_ERROR);

      const payload = JSON.parse(response.payload);
      expect(payload.errors).to.have.lengthOf(1);

      const unprocessableErrorOnFirstname = payload.errors[0];
      expect(unprocessableErrorOnFirstname.status).to.equal('422');
      expect(unprocessableErrorOnFirstname.source.pointer).to.equal('/data/relationships/target-profile');
      expect(unprocessableErrorOnFirstname.title).to.equal('Invalid relationship "targetProfile"');
      expect(unprocessableErrorOnFirstname.detail).to.equal('Le profile cible n’est pas renseigné.');
    });

    it('responds Unprocessable Entity with invalid data attribute, if attribute is undefined', async () => {
      // given
      const invalidAttributes = [{
        attribute: undefined,
        message: 'Vous devez renseigner une adresse e-mail et/ou un identifiant.',
      }];
      routeHandler.throws(new DomainErrors.EntityValidationError({ invalidAttributes }));

      // when
      const response = await server.requestObject(request);

      // then
      expect(response.statusCode).to.equal(UNPROCESSABLE_ENTITY_ERROR);

      const payload = JSON.parse(response.payload);
      expect(payload.errors).to.have.lengthOf(1);

      const unprocessableErrorOnFirstname = payload.errors[0];
      expect(unprocessableErrorOnFirstname.status).to.equal('422');
      expect(unprocessableErrorOnFirstname.source).to.be.undefined;
      expect(unprocessableErrorOnFirstname.title).to.equal('Invalid data attributes');
      expect(unprocessableErrorOnFirstname.detail).to.equal('Vous devez renseigner une adresse e-mail et/ou un identifiant.');
    });

    it('should create a new JSONAPI unprocessable with multiple invalid attributes', async () => {
      // given
      const invalidAttributes = [{
        attribute: 'firstname',
        message: 'Le prénom n’est pas renseigné.',
      }, {
        attribute: 'lastname',
        message: 'Le nom n’est pas renseigné.',
      }, {
        attribute: 'targetProfileId',
        message: 'Le profile cible n’est pas renseigné.',
      }];
      routeHandler.throws(new DomainErrors.EntityValidationError({ invalidAttributes }));

      // when
      const response = await server.requestObject(request);

      // then
      expect(response.statusCode).to.equal(UNPROCESSABLE_ENTITY_ERROR);

      const payload = JSON.parse(response.payload);
      expect(payload.errors).to.have.lengthOf(3);
    });

    it('responds UnprocessableEntity when a CertificationCandidatesImportError occurs', async () => {
      routeHandler.throws(new DomainErrors.CertificationCandidatesImportError());
      const response = await server.requestObject(request);

      expect(response.statusCode).to.equal(UNPROCESSABLE_ENTITY_ERROR);
    });
  });

  context('should respond 401 Unauthorized', () => {
    const UNAUTHORIZED_ERROR = 401;

    it('responds Unauthorized when a MissingOrInvalidCredentialsError error occurs', async () => {
      routeHandler.throws(new DomainErrors.MissingOrInvalidCredentialsError());
      const response = await server.requestObject(request);

      expect(response.statusCode).to.equal(UNAUTHORIZED_ERROR);
      expect(responseDetail(response)).to.equal('L\'adresse e-mail et/ou le mot de passe saisis sont incorrects.');
    });

    it('responds Unauthorized when a InvalidTemporaryKeyError error occurs', async () => {
      routeHandler.throws(new DomainErrors.InvalidTemporaryKeyError('Demande de réinitialisation invalide.'));
      const response = await server.requestObject(request);

      expect(response.statusCode).to.equal(UNAUTHORIZED_ERROR);
      expect(responseDetail(response)).to.equal('Demande de réinitialisation invalide.');
    });

    it('responds Unauthorized when a InvalidResultRecipientTokenError error occurs', async () => {
      routeHandler.throws(new DomainErrors.InvalidResultRecipientTokenError());
      const response = await server.requestObject(request);

      expect(response.statusCode).to.equal(UNAUTHORIZED_ERROR);
      expect(responseDetail(response)).to.equal('Le token de récupération des résultats de la session de certification est invalide.');
    });

    it('responds Unauthorized when a UserShouldChangePasswordError error occurs', async () => {
      routeHandler.throws(new DomainErrors.UserShouldChangePasswordError('Erreur, vous devez changer votre mot de passe.'));
      const response = await server.requestObject(request);

      expect(response.statusCode).to.equal(UNAUTHORIZED_ERROR);
      expect(responseDetail(response)).to.equal('Erreur, vous devez changer votre mot de passe.');
    });

    it('when a UserShouldChangePasswordError error is thrown', async () => {
      const expectedMessage = 'L\'utilisateur n\'a pas de compte Pix';
      routeHandler.throws(new DomainErrors.UserAccountNotFoundForPoleEmploiError(expectedMessage));
      const response = await server.requestObject(request);

      expect(response.statusCode).to.equal(UNAUTHORIZED_ERROR);
      expect(responseDetail(response)).to.equal(expectedMessage);
    });

    it('responds Unauthorized when a UserCantBeCreatedError error occurs', async () => {
      routeHandler.throws(new DomainErrors.UserCantBeCreatedError('L\'utilisateur ne peut pas être créé'));
      const response = await server.requestObject(request);

      expect(response.statusCode).to.equal(UNAUTHORIZED_ERROR);
      expect(responseDetail(response)).to.equal('L\'utilisateur ne peut pas être créé');
    });

    it('responds Unauthorized when a ApplicationWithInvalidClientSecretError error occurs', async () => {
      routeHandler.throws(new DomainErrors.ApplicationWithInvalidClientSecretError());
      const response = await server.requestObject(request);

      expect(response.statusCode).to.equal(UNAUTHORIZED_ERROR);
      expect(responseDetail(response)).to.equal('The client secret is invalid.');
    });

    it('responds Unauthorized when a ApplicationWithInvalidClientIdError error occurs', async () => {
      routeHandler.throws(new DomainErrors.ApplicationWithInvalidClientIdError());
      const response = await server.requestObject(request);

      expect(response.statusCode).to.equal(UNAUTHORIZED_ERROR);
      expect(responseDetail(response)).to.equal('The client ID is invalid.');
    });
  });

  context('500 Internal Server Error', () => {

    const INTERNAL_SERVER_ERROR = 500;

    it('responds Internal Server Error error when another error occurs', async () => {
      routeHandler.throws(new Error('Unexpected Error'));
      // when
      const response = await server.requestObject(request);

      // then
      const payload = JSON.parse(response.payload);
      expect(response.statusCode).to.equal(INTERNAL_SERVER_ERROR);
      expect(payload.message).to.equal('An internal server error occurred');
    });
  });

  context('503 Service Unavailable Error', () => {
    const SERVICE_UNAVAILABLE_ERROR = 503;
    it('responds ServiceUnavailable when a SendingEmailToResultRecipientError error occurs', async () => {
      routeHandler.throws(new DomainErrors.SendingEmailToResultRecipientError(['toto@pix.fr', 'titi@pix.fr']));
      const response = await server.requestObject(request);

      expect(response.statusCode).to.equal(SERVICE_UNAVAILABLE_ERROR);
      expect(responseDetail(response)).to.equal('Échec lors de l\'envoi des résultats au(x) destinataire(s) : toto@pix.fr, titi@pix.fr');
    });
  });
});
