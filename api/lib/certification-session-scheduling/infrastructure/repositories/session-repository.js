const { knex } = require('../../../../db/knex-database-connection');

async function save(session) {
  await knex('sessions')
    .insert(session);
}

module.exports = {
  save,
};
