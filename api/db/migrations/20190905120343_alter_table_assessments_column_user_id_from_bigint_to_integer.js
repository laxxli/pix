const TABLE_NAME = 'assessments';

exports.up = (knex) => {
  return knex.schema.alterTable(TABLE_NAME, (table) => {
    table.integer('userId').unsigned().alter();
  });
};

exports.down = (knex) => {
  return knex.schema.alterTable(TABLE_NAME, (table) => {
    table.bigInteger('userId').alter();
  });
};
