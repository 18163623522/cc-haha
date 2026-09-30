import { DEFAULT_VOICE_PREFERENCES, type VoiceLanguage, type VoicePreferences } from './types.js'

export const VOICE_LANGUAGES: readonly VoiceLanguage[] = ['auto', 'zh', 'en', 'ja', 'ko', 'yue']

const MAX_PROVIDER_ID_LENGTH = 80

export function isVoiceLanguage(value: unknown): value is VoiceLanguage {
  return typeof value === 'string' && (VOICE_LANGUAGES as readonly string[]).includes(value)
}

/**
 * Lenient read-side normalization for the `voiceInput` section of
 * desktop-ui.json. Unknown fields are kept so a newer build's data survives a
 * round trip through an older one.
 */
export function normalizeVoicePreferences(value: unknown): VoicePreferences {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return { ...DEFAULT_VOICE_PREFERENCES }
  }
  const record = value as Record<string, unknown>
  const providerId = typeof record.providerId === 'string' ? record.providerId.trim() : ''
  return {
    ...record,
    enabled: typeof record.enabled === 'boolean' ? record.enabled : DEFAULT_VOICE_PREFERENCES.enabled,
    providerId: providerId.length > 0 && providerId.length <= MAX_PROVIDER_ID_LENGTH
      ? providerId
      : DEFAULT_VOICE_PREFERENCES.providerId,
    language: isVoiceLanguage(record.language) ? record.language : DEFAULT_VOICE_PREFERENCES.language,
  }
}
