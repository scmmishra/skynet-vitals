/**
 * API wrapper to fetch from skynet client
 *
 * @param  {string} path
 * @param  {RequestInit} config
 * @returns Promise
 */
async function http<T>(path: string, config: RequestInit): Promise<T> {
  const requestPath = path;
  const request = new Request(requestPath, {
    ...config,
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
  });
  const response = await fetch(request);

  if (!response.ok) {
    throw new Error(`${response.status}: ${response.statusText}`);
  }

  // error if there is no body, return empty array
  return response.json().catch(() => ({}));
}

/**
 * GET method around the skynet client
 *
 * @param  {string} path
 * @param  {RequestInit} config?
 * @returns Promise
 */
export async function post<T>(path: string, config?: RequestInit): Promise<T> {
  const init = { method: "POST", ...config };
  return await http<T>(path, init);
}
