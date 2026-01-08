import { z } from 'zod'

export const weatherSchema = z.object({
  temp: z.number(),
  condition: z.string(),
  humidity: z.number(),
  city: z.string(),
})
