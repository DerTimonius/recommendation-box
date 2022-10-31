exports.up = async (sql) => {
  await sql`
  ALTER TABLE users
  ADD COLUMN preferences BOOLEAN DEFAULT false`;
};

exports.down = async (sql) => {
  await sql`
  ALTER TABLE users
  DROP COLUMN preferences`;
};
