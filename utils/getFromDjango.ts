export async function searchFromDjango(title: string) {
  const response = await fetch('https://django-api.fly.dev/api/movie/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      searchItem: title,
    }),
  });
  const data = JSON.parse(await response.json());
  return data;
}

export async function recommendFromDjango(
  movieList: number[],
  options: string,
  preferences: boolean,
  movieCount: number,
) {
  const response = await fetch(
    'https://django-api.fly.dev/api/movie/recommend',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        movieList: movieList,
        options: options,
        preferences: preferences,
        movieCount: movieCount,
      }),
    },
  );
  const data = JSON.parse(await response.json());
  return data;
}
