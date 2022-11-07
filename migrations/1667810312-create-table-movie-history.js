exports.up = async (sql) => {
  await sql`
  CREATE TABLE recommendation_history(
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id integer REFERENCES users (id) ON DELETE CASCADE,
    movie_id integer REFERENCES recommended_movie (id),
    created_at timestamp NOT NULL DEFAULT now()
  )`;
};

exports.down = async (sql) => {
  await sql`
  DROP TABLE recommendation_history`;
};
