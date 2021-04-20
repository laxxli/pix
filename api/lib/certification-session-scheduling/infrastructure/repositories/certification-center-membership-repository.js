const { knex } = require('../../../../db/knex-database-connection');

async function exists({
  referentId,
  certificationCenterId,
}) {
  const { count } = await knex('certification-center-memberships')
    .count()
    .where('certificationCenterId', certificationCenterId)
    .where('userId', referentId)
    .first();

  return count > 0;
}

module.exports = {
  exists,
};
