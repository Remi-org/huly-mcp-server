type LogLevel = 'debug' | 'info' | 'warn' | 'error'

const LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
}

const minLevel = LEVELS[(process.env.LOG_LEVEL as LogLevel) || 'info']

function log(level: LogLevel, message: string, data?: Record<string, unknown>) {
  if (LEVELS[level] < minLevel) return
  const entry = { ts: new Date().toISOString(), level, message, ...data }
  process.stderr.write(JSON.stringify(entry) + '\n')
}

export const logger = {
  debug: (msg: string, data?: Record<string, unknown>) => log('debug', msg, data),
  info: (msg: string, data?: Record<string, unknown>) => log('info', msg, data),
  warn: (msg: string, data?: Record<string, unknown>) => log('warn', msg, data),
  error: (msg: string, data?: Record<string, unknown>) => log('error', msg, data),
}
