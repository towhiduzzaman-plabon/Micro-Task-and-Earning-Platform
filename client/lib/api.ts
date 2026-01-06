export function getApiUrl(path: string): string {
  // Base URL for API calls. Use NEXT_PUBLIC_BASE_URL if provided (set in env for production),
  // otherwise use a relative path so client-side fetches work in development and production.
  const base = process.env.NEXT_PUBLIC_BASE_URL || ''
  if (!path.startsWith('/')) path = `/${path}`
  return `${base}${path}`
}
