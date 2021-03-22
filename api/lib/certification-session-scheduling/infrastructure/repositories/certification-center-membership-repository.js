const { knex } = require('../../../../db/knex-database-connection');
const CertificationCenterMembership = require('../../domain/models/CertificationCenterMembership');

async function find({
  referentId,
  certificationCenterId,
}) {
  const certificationCenterMemberships = await knex('certification-center-memberships')
    .select('userId', 'certificationCenterId')
    .where('certificationCenterId', certificationCenterId)
    .where('userId', referentId);

  return certificationCenterMemberships.map(_toDomain);
}

function _toDomain(certificationCenterMembershipDTO) {
  return new CertificationCenterMembership({
    userId: certificationCenterMembershipDTO.userId,
    certificationCenterId: certificationCenterMembershipDTO.certificationCenterId,
  });
}

module.exports = {
  find,
};
