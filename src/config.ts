import { z } from 'zod'

const configSchema = z.object({
  hulyUrl: z.string().url(),
  hulyWorkspace: z.string().min(1),
})

export type Config = z.infer<typeof configSchema>

export function loadConfig(): Config {
  const result = configSchema.safeParse({
    hulyUrl: process.env.HULY_URL,
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
