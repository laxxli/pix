const { CampaignCodeError, NotFoundError } = require('../../domain/errors');

module.exports = async function linkUserToOrganizationStudentData({
  campaignCode,
  user: { id: userId, firstName, lastName, birthdate },
  campaignRepository,
  studentRepository,
  userReconciliationService,
}) {
  const campaign = await campaignRepository.getByCode(campaignCode);
  if (!campaign || !campaign.organizationId) {
    throw new CampaignCodeError();
  }
  const students = await studentRepository.findNotLinkedYetByOrganizationIdAndUserBirthdate({
    organizationId: campaign.organizationId,
    birthdate,
  });

  if (students.length === 0) {
    throw new NotFoundError('There were no students matching');
  }

  const studentId = userReconciliationService.findMatchingCandidateIdForGivenUser(students, { firstName, lastName });

  if (!studentId) {
    throw new NotFoundError('There were not exactly one student match for this user and organization');
  }

  return studentRepository.associateUserAndStudent({ userId, studentId });
};