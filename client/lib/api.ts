// API utility functions

export const getApiUrl = (endpoint: string): string => {
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
  // Remove leading slash from endpoint if present, we'll add it
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
  // Ensure backendUrl doesn't end with slash
  const cleanBackendUrl = backendUrl.endsWith('/') ? backendUrl.slice(0, -1) : backendUrl
  return `${cleanBackendUrl}${cleanEndpoint}`
}


