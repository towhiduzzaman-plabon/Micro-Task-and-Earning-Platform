export function getApiUrl(path: string): string {
  // Use the public base URL when set (for production), otherwise default to relative paths
  const base = process.env.NEXT_PUBLIC_BASE_URL || ''
  if (!path.startsWith('/')) path = `/${path}`
  return `${base}${path}`
}
