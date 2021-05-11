const dependencies = {
  answerRepository: require('../../infrastructure/repositories/answer-repository'),
  assessmentRepository: require('../../infrastructure/repositories/assessment-repository'),
  assessmentResultRepository: require('../../infrastructure/repositories/assessment-result-repository'),
  authenticationCache: require('../../infrastructure/caches/authentication-cache'),
  authenticationMethodRepository: require('../../infrastructure/repositories/authentication-method-repository'),
  authenticationService: require('../../domain/services/authentication-service'),
  badgeAcquisitionRepository: require('../../infrastructure/repositories/badge-acquisition-repository'),
  badgeCriteriaService: require('../../domain/services/badge-criteria-service'),
  badgeRepository: require('../../infrastructure/repositories/badge-repository'),
  campaignAnalysisRepository: require('../../infrastructure/repositories/campaign-analysis-repository'),
  campaignAssessmentParticipationRepository: require('../../infrastructure/repositories/campaign-assessment-participation-repository'),
  campaignAssessmentParticipationResultRepository: require('../../infrastructure/repositories/campaign-assessment-participation-result-repository'),
  campaignAssessmentParticipationSummaryRepository: require('../../infrastructure/repositories/campaign-assessment-participation-summary-repository'),
  campaignCollectiveResultRepository: require('../../infrastructure/repositories/campaign-collective-result-repository'),
  campaignManagementRepository: require('../../infrastructure/repositories/campaign-management-repository'),
  campaignParticipationInfoRepository: require('../../infrastructure/repositories/campaign-participation-info-repository'),
  campaignParticipationOverviewRepository: require('../../infrastructure/repositories/campaign-participation-overview-repository'),
  campaignParticipationRepository: require('../../infrastructure/repositories/campaign-participation-repository'),
  campaignParticipationResultRepository: require('../../infrastructure/repositories/campaign-participation-result-repository'),
  campaignProfilesCollectionParticipationSummaryRepository: require('../../infrastructure/repositories/campaign-profiles-collection-participation-summary-repository'),
  campaignProfileRepository: require('../../infrastructure/repositories/campaign-profile-repository'),
  campaignReportRepository: require('../../infrastructure/repositories/campaign-report-repository'),
  campaignRepository: require('../../infrastructure/repositories/campaign-repository'),
  campaignToJoinRepository: require('../../infrastructure/repositories/campaign-to-join-repository'),
  campaignCsvExportService: require('../../domain/services/campaign-csv-export-service'),
  certificationAssessmentRepository: require('../../infrastructure/repositories/certification-assessment-repository'),
  certificationAttestationPdf: require('../../infrastructure/utils/pdf/certification-attestation-pdf'),
  certificationBadgesService: require('../../domain/services/certification-badges-service'),
  certificationCandidateRepository: require('../../infrastructure/repositories/certification-candidate-repository'),
  certificationCandidatesOdsService: require('../../domain/services/certification-candidates-ods-service'),
  certificationCenterMembershipRepository: require('../../infrastructure/repositories/certification-center-membership-repository'),
  certificationCenterRepository: require('../../infrastructure/repositories/certification-center-repository'),
  certificationChallengeRepository: require('../../infrastructure/repositories/certification-challenge-repository'),
  certificationChallengesService: require('../../domain/services/certification-challenges-service'),
  certificationCourseRepository: require('../../infrastructure/repositories/certification-course-repository'),
  certificationIssueReportRepository: require('../../infrastructure/repositories/certification-issue-report-repository'),
  certificationLsRepository: require('../../infrastructure/repositories/certification-livret-scolaire-repository'),
  certificationOfficerRepository: require('../../infrastructure/repositories/certification-officer-repository'),
  certificationPointOfContactRepository: require('../../infrastructure/repositories/certification-point-of-contact-repository'),
  certificationReportRepository: require('../../infrastructure/repositories/certification-report-repository'),
  certificationRepository: require('../../infrastructure/repositories/certification-repository'),
  certificationService: require('../../domain/services/certification-service'),
  challengeRepository: require('../../infrastructure/repositories/challenge-repository'),
  cleaCertificationResultRepository: require('../../infrastructure/repositories/clea-certification-result-repository'),
  cleaCertificationStatusRepository: require('../../infrastructure/repositories/clea-certification-status-repository'),
  competenceEvaluationRepository: require('../../infrastructure/repositories/competence-evaluation-repository'),
  competenceMarkRepository: require('../../infrastructure/repositories/competence-mark-repository'),
  competenceRepository: require('../../infrastructure/repositories/competence-repository'),
  competenceTreeRepository: require('../../infrastructure/repositories/competence-tree-repository'),
  correctionRepository: require('../../infrastructure/repositories/correction-repository'),
  courseRepository: require('../../infrastructure/repositories/course-repository'),
  divisionRepository: require('../../infrastructure/repositories/division-repository'),
  encryptionService: require('../../domain/services/encryption-service'),
  generalCertificationInformationRepository: require('../../infrastructure/repositories/general-certification-information-repository'),
  getCompetenceLevel: require('../../domain/services/get-competence-level'),
  getCertificationResultByCertifCourse: require('../../domain/services/certification-service').getCertificationResultByCertifCourse,
  finalizedSessionRepository: require('../../infrastructure/repositories/finalized-session-repository'),
  higherSchoolingRegistrationRepository: require('../../infrastructure/repositories/higher-schooling-registration-repository'),
  improvementService: require('../../domain/services/improvement-service'),
  juryCertificationSummaryRepository: require('../../infrastructure/repositories/jury-certification-summary-repository'),
  jurySessionRepository: require('../../infrastructure/repositories/jury-session-repository'),
  knowledgeElementRepository: require('../../infrastructure/repositories/knowledge-element-repository'),
  mailService: require('../../domain/services/mail-service'),
  membershipRepository: require('../../infrastructure/repositories/membership-repository'),
  obfuscationService: require('../../domain/services/obfuscation-service'),
  organizationService: require('../../domain/services/organization-service'),
  organizationRepository: require('../../infrastructure/repositories/organization-repository'),
  organizationInvitationRepository: require('../../infrastructure/repositories/organization-invitation-repository'),
  participantResultRepository: require('../../infrastructure/repositories/participant-result-repository'),
  partnerCertificationScoringRepository: require('../../infrastructure/repositories/partner-certification-scoring-repository'),
  passwordGenerator: require('../../domain/services/password-generator'),
  pickChallengeService: require('../services/pick-challenge-service'),
  pixPlusDroitMaitreCertificationResultRepository: require('../../infrastructure/repositories/pix-plus-droit-maitre-certification-result-repository'),
  pixPlusDroitExpertCertificationResultRepository: require('../../infrastructure/repositories/pix-plus-droit-expert-certification-result-repository'),
  placementProfileService: require('../../domain/services/placement-profile-service'),
  poleEmploiSendingRepository: require('../../infrastructure/repositories/pole-emploi-sending-repository'),
  prescriberRepository: require('../../infrastructure/repositories/prescriber-repository'),
  privateCertificateRepository: require('../../infrastructure/repositories/private-certificate-repository'),
  resetPasswordService: require('../../domain/services/reset-password-service'),
  resetPasswordDemandRepository: require('../../infrastructure/repositories/reset-password-demands-repository'),
  resultCompetenceTreeService: require('../services/result-competence-tree-service'),
  schoolingRegistrationRepository: require('../../infrastructure/repositories/schooling-registration-repository'),
  schoolingRegistrationsXmlService: require('../../domain/services/schooling-registrations-xml-service'),
  scoCertificationCandidateRepository: require('../../infrastructure/repositories/sco-certification-candidate-repository'),
  scorecardService: require('../../domain/services/scorecard-service'),
  scoringCertificationService: require('../../domain/services/scoring/scoring-certification-service'),
  sessionAuthorizationService: require('../../domain/services/session-authorization-service'),
  sessionPublicationService: require('../../domain/services/session-publication-service'),
  sessionRepository: require('../../infrastructure/repositories/session-repository'),
  settings: require('../../config'),
  shareableCertificateRepository: require('../../infrastructure/repositories/shareable-certificate-repository'),
  skillRepository: require('../../infrastructure/repositories/skill-repository'),
  stageRepository: require('../../infrastructure/repositories/stage-repository'),
  studentRepository: require('../../infrastructure/repositories/student-repository'),
  targetProfileRepository: require('../../infrastructure/repositories/target-profile-repository'),
  targetProfileShareRepository: require('../../infrastructure/repositories/target-profile-share-repository'),
  targetProfileWithLearningContentRepository: require('../../infrastructure/repositories/target-profile-with-learning-content-repository'),
  tokenService: require('../../domain/services/token-service'),
  tubeRepository: require('../../infrastructure/repositories/tube-repository'),
  tutorialEvaluationRepository: require('../../infrastructure/repositories/tutorial-evaluation-repository'),
  tutorialRepository: require('../../infrastructure/repositories/tutorial-repository'),
  userOrgaSettingsRepository: require('../../infrastructure/repositories/user-orga-settings-repository'),
  userReconciliationService: require('../services/user-reconciliation-service'),
  userRepository: require('../../infrastructure/repositories/user-repository'),
  userService: require('../../domain/services/user-service'),
  userTutorialRepository: require('../../infrastructure/repositories/user-tutorial-repository'),
  verifyCertificateCodeService: require('../../domain/services/verify-certificate-code-service'),
};

const { injectDependencies } = require('../../infrastructure/utils/dependency-injection');

module.exports = injectDependencies({
  acceptOrganizationInvitation: require('./accept-organization-invitation'),
  acceptPixLastTermsOfService: require('./accept-pix-last-terms-of-service'),
  acceptPixCertifTermsOfService: require('./accept-pix-certif-terms-of-service'),
  acceptPixOrgaTermsOfService: require('./accept-pix-orga-terms-of-service'),
  addCertificationCandidateToSession: require('./add-certification-candidate-to-session'),
  addGarAuthenticationMethodToUser: require('./add-gar-authentication-method-to-user'),
  addTutorialEvaluation: require('./add-tutorial-evaluation'),
  addTutorialToUser: require('./add-tutorial-to-user'),
  anonymizeUser: require('./anonymize-user'),
  attachTargetProfilesToOrganization: require('./attach-target-profiles-to-organization'),
  attachOrganizationsToTargetProfile: require('./attach-organizations-to-target-profile'),
  archiveCampaign: require('./archive-campaign'),
  outdateTargetProfile: require('./outdate-target-profile'),
  assignCertificationOfficerToJurySession: require('./assign-certification-officer-to-jury-session'),
  authenticateAnonymousUser: require('./authenticate-anonymous-user'),
  authenticatePoleEmploiUser: require('./authenticate-pole-emploi-user'),
  authenticateUser: require('./authenticate-user'),
  authenticateExternalUser: require('./authenticate-external-user'),
  authenticateApplicationLivretScolaire: require('./authenticate-application-livret-scolaire'),
  beginCampaignParticipationImprovement: require('./begin-campaign-participation-improvement'),
  completeAssessment: require('./complete-assessment'),
  computeCampaignAnalysis: require('./compute-campaign-analysis'),
  computeCampaignCollectiveResult: require('./compute-campaign-collective-result'),
  computeCampaignParticipationAnalysis: require('./compute-campaign-participation-analysis'),
  correctAnswerThenUpdateAssessment: require('./correct-answer-then-update-assessment'),
  changeUserLang: require('./change-user-lang'),
  createAndReconcileUserToSchoolingRegistration: require('./create-and-reconcile-user-to-schooling-registration'),
  createCampaign: require('./create-campaign'),
  createCertificationCenterMembership: require('./create-certification-center-membership'),
  createCertificationCenterMembershipByEmail: require('./create-certification-center-membership-by-email'),
  createLcmsRelease: require('./create-lcms-release'),
  createMembership: require('./create-membership'),
  createOrUpdateUserOrgaSettings: require('./create-or-update-user-orga-settings'),
  createOrganization: require('./create-organization'),
  createOrganizationInvitations: require('./create-organization-invitations'),
  createPasswordResetDemand: require('./create-password-reset-demand'),
  createProOrganizations: require('./create-pro-organizations-with-tags'),
  createSession: require('./create-session'),
  createStage: require('./create-stage'),
  createTargetProfile: require('./create-target-profile'),
  createUser: require('./create-user'),
  createUserAndReconcileToSchoolingRegistrationFromExternalUser: require('./create-user-and-reconcile-to-schooling-registration-from-external-user'),
  createUserFromPoleEmploi: require('./create-user-from-pole-emploi'),
  deleteCertificationIssueReport: require('./delete-certification-issue-report'),
  deleteUnlinkedCertificationCandidate: require('./delete-unlinked-certification-candidate'),
  disableMembership: require('./disable-membership'),
  dissociateUserFromSchoolingRegistration: require('./dissociate-user-from-schooling-registration'),
  dissociateSchoolingRegistrations: require('./dissociate-schooling-registrations'),
  enrollStudentsToSession: require('./enroll-students-to-session'),
  finalizeSession: require('./finalize-session'),
  findAnswerByAssessment: require('./find-answer-by-assessment'),
  findAnswerByChallengeAndAssessment: require('./find-answer-by-challenge-and-assessment'),
  findAssociationBetweenUserAndSchoolingRegistration: require('./find-association-between-user-and-schooling-registration'),
  findCampaignAssessments: require('./find-campaign-assessments'),
  findCampaignParticipationsRelatedToAssessment: require('./find-campaign-participations-related-to-assessment'),
  findCampaignProfilesCollectionParticipationSummaries: require('./find-campaign-profiles-collection-participation-summaries'),
  findCertificationCenterMembershipsByCertificationCenter: require('./find-certification-center-memberships-by-certification-center'),
  findCompetenceEvaluationsByAssessment: require('./find-competence-evaluations-by-assessment'),
  findLatestOngoingUserCampaignParticipations: require('./find-latest-ongoing-user-campaign-participations'),
  findDivisionsByCertificationCenter: require('./find-divisions-by-certification-center'),
  findDivisionsByOrganization: require('./find-divisions-by-organization'),
  findFinalizedSessionsToPublish: require('./find-finalized-sessions-to-publish'),
  findFinalizedSessionsWithRequiredAction: require('./find-finalized-sessions-with-required-action'),
  findPaginatedCampaignAssessmentParticipationSummaries: require('./find-paginated-campaign-assessment-participation-summaries'),
  findPaginatedCampaignManagements: require('./find-paginated-campaign-managements'),
  findPaginatedFilteredCertificationCenters: require('./find-paginated-filtered-certification-centers'),
  findPaginatedFilteredOrganizationCampaigns: require('./find-paginated-filtered-organization-campaigns'),
  findPaginatedFilteredOrganizationMemberships: require('./find-paginated-filtered-organization-memberships'),
  findPaginatedFilteredOrganizations: require('./find-paginated-filtered-organizations'),
  findPaginatedFilteredSchoolingRegistrations: require('./find-paginated-filtered-schooling-registrations'),
  findPaginatedFilteredTargetProfiles: require('./find-paginated-filtered-target-profiles'),
  findPaginatedFilteredTargetProfileOrganizations: require('./find-paginated-filtered-target-profile-organizations'),
  findPaginatedFilteredUsers: require('./find-paginated-filtered-users'),
  findPendingOrganizationInvitations: require('./find-pending-organization-invitations'),
  findSessionsForCertificationCenter: require('./find-sessions-for-certification-center'),
  findStudentsForEnrollment: require('./find-students-for-enrollment'),
  findTargetProfileBadges: require('./find-target-profile-badges'),
  findTargetProfileStages: require('./find-target-profile-stages'),
  findTutorials: require('./find-tutorials'),
  findUserCampaignParticipationOverviews: require('./find-user-campaign-participation-overviews'),
  findUserPrivateCertificates: require('./find-user-private-certificates'),
  findUserTutorials: require('./find-user-tutorials'),
  flagSessionResultsAsSentToPrescriber: require('./flag-session-results-as-sent-to-prescriber'),
  generateUsername: require('./generate-username'),
  generateUsernameWithTemporaryPassword: require('./generate-username-with-temporary-password'),
  getAnswer: require('./get-answer'),
  getAssessment: require('./get-assessment'),
  getAttendanceSheet: require('./get-attendance-sheet'),
  getBadgeDetails: require('./get-badge-details'),
  getCampaign: require('./get-campaign'),
  getCampaignByCode: require('./get-campaign-by-code'),
  getCampaignAssessmentParticipation: require('./get-campaign-assessment-participation'),
  getCampaignAssessmentParticipationResult: require('./get-campaign-assessment-participation-result'),
  getCampaignParticipation: require('./get-campaign-participation'),
  getCampaignProfile: require('./get-campaign-profile'),
  getCertificationAttestation: require('./certificate/get-certification-attestation'),
  getCertificationCandidate: require('./get-certification-candidate'),
  getCertificationCenter: require('./get-certification-center'),
  getCertificationCourse: require('./get-certification-course'),
  getCertificationDetails: require('./get-certification-details'),
  getCertificationResultInformation: require('./get-certification-result-information'),
  getCertificationsResultsForLS: require('./certificate/get-certifications-results-for-ls'),
  getCertificationPointOfContact: require('./get-certification-point-of-contact'),
  getCorrectionForAnswer: require('./get-correction-for-answer'),
  getCurrentUser: require('./get-current-user'),
  getExternalAuthenticationRedirectionUrl: require('./get-external-authentication-redirection-url'),
  getJurySession: require('./get-jury-session'),
  getNextChallengeForCampaignAssessment: require('./get-next-challenge-for-campaign-assessment'),
  getNextChallengeForCertification: require('./get-next-challenge-for-certification'),
  getNextChallengeForCompetenceEvaluation: require('./get-next-challenge-for-competence-evaluation'),
  getNextChallengeForDemo: require('./get-next-challenge-for-demo'),
  getNextChallengeForPreview: require('./get-next-challenge-for-preview'),
  getOrganizationDetails: require('./get-organization-details'),
  getOrganizationInvitation: require('./get-organization-invitation'),
  getParticipantResult: require('./get-participant-result'),
  getParticipantsDivision: require('./get-participants-division'),
  getPrescriber: require('./get-prescriber'),
  getPrivateCertificate: require('./certificate/get-private-certificate'),
  getProgression: require('./get-progression'),
  getScoCertificationResultsByDivision: require('./get-sco-certification-results-by-division'),
  getSchoolingRegistrationsCsvTemplate: require('./get-schooling-registrations-csv-template'),
  getScorecard: require('./get-scorecard'),
  getSession: require('./get-session'),
  getSessionCertificationCandidates: require('./get-session-certification-candidates'),
  getSessionCertificationReports: require('./get-session-certification-reports'),
  getSessionResults: require('./get-session-results'),
  getSessionResultsByResultRecipientEmail: require('./get-session-results-by-result-recipient-email'),
  getSessionWithCandidates: require('./get-session-with-candidates'),
  getShareableCertificate: require('./certificate/get-shareable-certificate'),
  getStageDetails: require('./get-stage-details'),
  getTargetProfileDetails: require('./get-target-profile-details'),
  getUserByResetPasswordDemand: require('./get-user-by-reset-password-demand'),
  getUserCampaignParticipationToCampaign: require('./get-user-campaign-participation-to-campaign'),
  getUserDetailsForAdmin: require('./get-user-details-for-admin'),
  getUserProfile: require('./get-user-profile'),
  getUserProfileSharedForCampaign: require('./get-user-profile-shared-for-campaign'),
  getUserWithMemberships: require('./get-user-with-memberships'),
  importCertificationCandidatesFromAttendanceSheet: require('./import-certification-candidates-from-attendance-sheet'),
  importHigherSchoolingRegistrations: require('./import-higher-schooling-registrations'),
  importSchoolingRegistrationsFromSIECLEFormat: require('./import-schooling-registrations-from-siecle'),
  improveCompetenceEvaluation: require('./improve-competence-evaluation'),
  isUserCertifiable: require('./is-user-certifiable'),
  linkUserToSessionCertificationCandidate: require('./link-user-to-session-certification-candidate').linkUserToSessionCertificationCandidate,
  reconcileHigherSchoolingRegistration: require('./reconcile-higher-schooling-registration'),
  reconcileSchoolingRegistration: require('./reconcile-schooling-registration'),
  reconcileUserToOrganization: require('./reconcile-user-to-organization'),
  rememberUserHasSeenAssessmentInstructions: require('./remember-user-has-seen-assessment-instructions'),
  rememberUserHasSeenNewDashboardInfo: require('./remember-user-has-seen-new-dashboard-info'),
  removeAuthenticationMethod: require('./remove-authentication-method'),
  resetScorecard: require('./reset-scorecard'),
  retrieveLastOrCreateCertificationCourse: require('./retrieve-last-or-create-certification-course'),
  saveCertificationCenter: require('./save-certification-center'),
  saveCertificationIssueReport: require('./save-certification-issue-report'),
  sendScoInvitation: require('./send-sco-invitation'),
  shareCampaignResult: require('./share-campaign-result'),
  startCampaignParticipation: require('./start-campaign-participation'),
  startOrResumeCompetenceEvaluation: require('./start-or-resume-competence-evaluation'),
  startWritingCampaignAssessmentResultsToStream: require('./start-writing-campaign-assessment-results-to-stream'),
  startWritingCampaignProfilesCollectionResultsToStream: require('./start-writing-campaign-profiles-collection-results-to-stream'),
  unarchiveCampaign: require('./unarchive-campaign'),
  updateCampaign: require('./update-campaign'),
  updateExpiredPassword: require('./update-expired-password'),
  updateMembership: require('./update-membership'),
  updateOrganizationInformation: require('./update-organization-information'),
  publishSession: require('./publish-session'),
  unpublishSession: require('./unpublish-session'),
  neutralizeChallenge: require('./neutralize-challenge'),
  deneutralizeChallenge: require('./deneutralize-challenge'),
  publishSessionsInBatch: require('./publish-sessions-in-batch'),
  updateSchoolingRegistrationDependentUserPassword: require('./update-schooling-registration-dependent-user-password'),
  updateSession: require('./update-session'),
  updateStage: require('./update-stage'),
  updateStudentNumber: require('./update-student-number'),
  updateTargetProfileName: require('./update-target-profile-name'),
  updateUserDetailsForAdministration: require('./update-user-details-for-administration'),
  updateUserEmail: require('./update-user-email'),
  updateUserPassword: require('./update-user-password'),
}, dependencies);
