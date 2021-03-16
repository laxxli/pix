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
}) {

  const referentMemberships = await certificationCenterMembershipRepository.find({ referentId, certificationCenterId });

  if (!referentMemberships.length) {
    throw new ReferentIsNotAMemberOfCertificationCenterError();
  }

  const scheduledSession = Session.schedule({
    certificationCenterId,
    address,
    examiner,
    room,
    date,
    time,
    description,
  });

  await sessionRepository.save(scheduledSession);
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
