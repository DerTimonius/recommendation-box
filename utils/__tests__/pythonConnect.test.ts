import { checkRecommendations, checkSearch } from '../connect_to_python';

test(
  'check recommendation function',
  async () => {
    let selectedMovieIds = '123 456 789';
    let options = 'both';
    let preferences = true;
    const count = 3;
    expect(
      typeof (await checkRecommendations(
        selectedMovieIds,
        options,
        preferences,
        count,
      )),
    ).toEqual('string');
    selectedMovieIds += ' 1234';
    options = 'movie';
    preferences = false;
    expect(
      typeof (await checkRecommendations(
        selectedMovieIds,
        options,
        preferences,
        count,
      )),
    ).toEqual('string');
    options = 'tv';
    expect(
      typeof (await checkRecommendations(
        selectedMovieIds,
        options,
        preferences,
        count,
      )),
    ).toEqual('string');
  },
  60 * 1000,
);

test(
  'check search function',
  async () => {
    let input = 'The Boys';
    expect(typeof (await checkSearch(input))).toEqual('string');
    input = 'Stranger Things';
    expect(typeof (await checkSearch(input))).toEqual('string');

    input = 'The OA';
    expect(typeof (await checkSearch(input))).toEqual('string');
  },
  20 * 1000,
);
