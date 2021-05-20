const CertificationScoringCompleted = require('../../../../lib/domain/events/CertificationScoringCompleted');

const buildCertificationScoringCompletedEvent = function({
  certificationCourseId = 123,
  userId = 456,
  reproducibilityRate = 55,
  isValidated = true,
} = {}) {
  return new CertificationScoringCompleted({
    certificationCourseId,
    userId,
    reproducibilityRate,
    isValidated,
  });
};

module.exports = buildCertificationScoringCompletedEvent;
