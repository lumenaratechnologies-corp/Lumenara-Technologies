const API_BASE =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/+$/, '') ||
  'http://localhost:5000'

export type UserLike = {
  picture?: string
  profilePic?: string
}

export function resolveProfileImage(user?: UserLike | null): string {
  const raw = user?.picture || user?.profilePic
  if (!raw || typeof raw !== 'string') return '/default-avatar.svg'

  const trimmed = raw.trim()
  if (!trimmed) return '/default-avatar.svg'

  if (/^(https?:)?\/\//i.test(trimmed) || trimmed.startsWith('data:') || trimmed.startsWith('blob:')) {
    return trimmed
  }

  const normalizedPath = trimmed.replace(/^\.?\/*/, '')
  return `${API_BASE}/${normalizedPath}`
}
