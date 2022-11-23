export async function searchFromDjango(title: string) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30 * 1000);
  const response = await fetch('https://django-api.fly.dev/api/movie/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      searchItem: title,
    }),
    signal: controller.signal,
  });
  clearTimeout(timeoutId);
  const data = JSON.parse(await response.json());
  return data;
}

export async function recommendFromDjango(
  movieList: number[],
  options: string,
  preferences: boolean,
  movieCount: number,
) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60 * 1000);
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
      signal: controller.signal,
    },
  );
  clearTimeout(timeoutId);
  const data = JSON.parse(await response.json());
  return data;
}
