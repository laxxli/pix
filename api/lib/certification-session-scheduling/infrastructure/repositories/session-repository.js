const { knex } = require('../../../../db/knex-database-connection');
const { Session } = require('../../domain/models/Session');

async function get(id) {
  try {
    const session = await knex('sessions')
      .select(
        'id',
        'certificationCenterId',
        'address',
        'room',
        'accessCode',
        'examiner',
        'date',
        'time',
        'description',
      )
      .select({
        'certificationCenterName': 'certificationCenter',
      })
      .where({ id }).first();
    session.time = session.time.substr(0, 5);
    return new Session(session);
  } catch (err) {
    throw new Error('La session n\'existe pas ou son accès est restreint');
  }
}

async function save(session) {
  const sessionToSave = {
    ...session,
    certificationCenter: session.certificationCenterName,
  };
  delete sessionToSave.certificationCenterName;
  const returning = await knex('sessions')
    .insert(sessionToSave)
    .returning('id');
  return returning[0];
}

module.exports = {
  get,
  save,
};
