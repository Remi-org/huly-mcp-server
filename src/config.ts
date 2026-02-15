import { z } from 'zod'

const configSchema = z.object({
  hulyUrl: z.string().url(),
  hulyEmail: z.string().email(),
  hulyPassword: z.string().min(1),
  hulyWorkspace: z.string().min(1),
})

export type Config = z.infer<typeof configSchema>

export function loadConfig(): Config {
  const result = configSchema.safeParse({
    hulyUrl: process.env.HULY_URL,
    hulyEmail: process.env.HULY_EMAIL,
    hulyPassword: process.env.HULY_PASSWORD,
    hulyWorkspace: process.env.HULY_WORKSPACE,
  })

  if (!result.success) {
    const missing = result.error.issues
      .map((i) => `  ${i.path.join('.')}: ${i.message}`)
      .join('\n')
    throw new Error(`Invalid configuration:\n${missing}`)
  }

  return result.data
}
