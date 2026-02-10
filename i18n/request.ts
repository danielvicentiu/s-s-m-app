import { getRequestConfig } from 'next-intl/server'
import { routing } from './routing'

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale

  // Validate that the incoming locale is valid
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale
  }

  console.log('[next-intl] Loading messages for locale:', locale)

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  }
})
