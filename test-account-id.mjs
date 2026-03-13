#!/usr/bin/env node
import { spawn } from 'node:child_process'

const s = spawn('./node_modules/.bin/tsx', ['-e', `
import { connect, NodeWebSocketFactory } from '@hcengineering/api-client'
const url = process.env.HULY_URL
const client = await connect(url, {
  email: process.env.HULY_EMAIL,
  password: process.env.HULY_PASSWORD,
  workspace: process.env.HULY_WORKSPACE,
  socketFactory: NodeWebSocketFactory,
  connectionTimeout: 30000,
})
const account = client.getAccount()
console.log('ACCOUNT:', JSON.stringify(account))
// Also check the connection's internal account
const conn = client.connection
if (conn?.getAccount) {
  console.log('CONN_ACCOUNT:', JSON.stringify(await conn.getAccount()))
}
await client.close()
process.exit(0)
`], {
  cwd: '/Users/denissellu/src/remi/huly-mcp-server',
  stdio: ['pipe', 'pipe', 'pipe']
})

let out = '', err = ''
s.stdout.on('data', d => { out += d.toString(); process.stdout.write(d) })
s.stderr.on('data', d => { err += d.toString() })

s.on('close', () => {
  if (err) {
    const lines = err.split('\n').filter(l => !l.includes('no document found') && l.trim())
    console.error('\nSTDERR:', lines.slice(-5).join('\n'))
  }
})
