export default async function getMovieDetails(title: string, year: number) {
  const responseOMDB = await fetch(
    `http://www.omdbapi.com/?apikey=${
      process.env.OMDB_API_KEY
    }&t=${title.replace(' ', '+')}&y=${year}`,
  );
  let dataOMDB = await responseOMDB.json();
  if ('Error' in dataOMDB) {
    const responseWithoutYear = await fetch(
      `http://www.omdbapi.com/?apikey=${
        process.env.OMDB_API_KEY
      }&t=${title.replace(' ', '+')}`,
    );
    dataOMDB = await responseWithoutYear.json();
  }
  const responseTMDB = await fetch(
    `https://api.themoviedb.org/3/find/${dataOMDB.imdbID}?api_key=${process.env.TMDB_API_KEY}&language=en-US&external_source=imdb_id`,
  );
  const dataTMDB = await responseTMDB.json();
  if (dataTMDB.movie_results.length > 0) {
    return [dataTMDB.movie_results[0], dataOMDB.imdbID];
  } else if (dataTMDB.tv_results.length > 0) {
    return [dataTMDB.tv_results[0], dataOMDB.imdbID];
  }
}
