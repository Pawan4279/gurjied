export async function api(path: string, method = 'GET', body?: unknown) {
  const response = await fetch(`/api/${path}`, {
    method,
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  })
  const data = await response.json().catch(() => null)
  if (!response.ok || !data) throw new Error(typeof data?.detail === 'string' ? data.detail : 'Backend unavailable. Start the Python server.')
  return data
}

