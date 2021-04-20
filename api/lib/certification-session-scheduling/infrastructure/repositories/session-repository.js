const { knex } = require('../../../../db/knex-database-connection');

async function save(session) {
  const sessionToSave = {
    ...session,
    certificationCenter: session.certificationCenterName,
  };
  delete sessionToSave.certificationCenterName;
  await knex('sessions')
    .insert(sessionToSave);
}

module.exports = {
  save,
};
