export const ENV = {
  WEATHER_API_KEY: process.env.NEXT_PUBLIC_WEATHER_API_KEY || '',
  API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || '',
} as const
