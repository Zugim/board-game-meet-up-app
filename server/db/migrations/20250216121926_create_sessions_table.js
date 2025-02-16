/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("session", function (table) {
    table.string("sid").notNullable().primary();
    table.json("sess").notNullable();
    table.timestamp("expire", { precision: 6 }).notNullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("sessions");
};
