import path from 'node:path';
import { execaCommand } from 'execa';

export async function checkRecommendations(
  selectedMovieIds: string,
  options: string,
  preferences: boolean,
  numberOfMovies: number,
) {
  const { stdout } = await execaCommand(
    `python3 ${path.normalize(
      './scripts/python/recommend.py',
    )} ${selectedMovieIds} ${numberOfMovies} ${options} ${preferences}`,
  );
  return stdout;
}
export async function checkSearch(searchItem: string) {
  const { stdout } = await execaCommand(
    `python3 ${path.normalize('./scripts/python/search.py')} ${searchItem}`,
  );
  return stdout;
}
