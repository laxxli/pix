const { SessionAlreadyFinalizedError } = require('../errors');
const SessionFinalized = require('../events/SessionFinalized');

module.exports = async function finalizeSession({
  sessionId,
  examinerGlobalComment,
  certificationReports,
  sessionRepository,
  certificationReportRepository,
  certificationIssueReportRepository,
  assessmentRepository,
  certificationAssessmentRepository,
}) {
  const isSessionAlreadyFinalized = await sessionRepository.isFinalized(sessionId);

  if (isSessionAlreadyFinalized) {
    throw new SessionAlreadyFinalizedError('Cannot finalize session more than once');
  }

  certificationReports.forEach((certifReport) => certifReport.validateForFinalization());

  for (const certificationReport of certificationReports) {
    await _autoNeutralizeChallenges({
      certificationReport,
      assessmentRepository,
      certificationIssueReportRepository,
      certificationAssessmentRepository,
    });
  }

  await certificationReportRepository.finalizeAll(certificationReports);

  const finalizedSession = await sessionRepository.finalize({
    id: sessionId,
    examinerGlobalComment,
    finalizedAt: new Date(),
  });

  return new SessionFinalized({
    sessionId,
    finalizedAt: finalizedSession.finalizedAt,
    hasExaminerGlobalComment: Boolean(examinerGlobalComment),
    certificationCenterName: finalizedSession.certificationCenter,
    sessionDate: finalizedSession.date,
    sessionTime: finalizedSession.time,
  });
};

async function _autoNeutralizeChallenges({
  certificationReport,
  certificationIssueReportRepository,
  certificationAssessmentRepository,
}) {
  const { certificationCourseId } = certificationReport;
  const certificationIssueReports = await certificationIssueReportRepository.findByCertificationCourseId(certificationCourseId);
  if (certificationIssueReports.length === 0) {
    return;
  }
  const certificationAssessment = await certificationAssessmentRepository.getByCertificationCourseId({ certificationCourseId });
  const neutralizableQuestionNumbers = certificationIssueReports
    .filter((issueReport) => issueReport.isAutoNeutralizable)
    .map((issueReport) => issueReport.questionNumber);

  neutralizableQuestionNumbers.forEach((questionNumber) => certificationAssessment.neutralizeChallengeByNumberIfKoOrSkipped(questionNumber));

  await certificationAssessmentRepository.save(certificationAssessment);
}
