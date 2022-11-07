exports.up = async (sql) => {
  await sql`
  CREATE TABLE recommended_movie(
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    title varchar(75) NOT NULL,
    release_year integer,
    director varchar(150),
    movie_data_id integer,
    description varchar(1000),
    type varchar(10) NOT NULL,
    poster varchar(100),
    rating float,
    tmdb_id integer,
    media varchar(10)
  )`;
};

exports.down = async (sql) => {
  await sql`
  DROP TABLE recommended_movie`;
};
