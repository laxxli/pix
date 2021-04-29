const { Session } = require('../models/Session');

async function scheduleSession({
  certificationCenterId,
  address,
  examiner,
  room,
  date,
  time,
  description,
  referentId,
  sessionRepository,
  certificationCenterMembershipRepository,
  certificationCenterRepository,
  random,
}) {
  const hasMembership = await certificationCenterMembershipRepository.exists({ referentId, certificationCenterId });

  if (!hasMembership) {
    throw new ReferentIsNotAMemberOfCertificationCenterError();
  }

  const certificationCenter = await certificationCenterRepository.get(certificationCenterId);
  const scheduledSession = Session.schedule({
    certificationCenterId,
    certificationCenterName: certificationCenter.name,
    address,
    examiner,
    room,
    date,
    time,
    description,
  }, random.pickOneFrom);

  return sessionRepository.save(scheduledSession);
}

class ReferentIsNotAMemberOfCertificationCenterError extends Error {
  constructor() {
    super('Referent is not a member of the certification center');
  }
}

module.exports = {
  scheduleSession,
  ReferentIsNotAMemberOfCertificationCenterError,
};
