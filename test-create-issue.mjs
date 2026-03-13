#!/usr/bin/env node
import { spawn } from 'node:child_process'

const s = spawn('./node_modules/.bin/tsx', ['src/index.ts'], {
  cwd: '/Users/denissellu/src/remi/huly-mcp-server',
  stdio: ['pipe', 'pipe', 'pipe']
})

let buffer = ''
let reqId = 0

function send(method, params) {
  return new Promise((resolve, reject) => {
    const id = ++reqId
    const msg = JSON.stringify({ jsonrpc: '2.0', id, method, params }) + '\n'
    const timeout = setTimeout(() => reject(new Error('TIMEOUT')), 30000)
    const handler = (d) => {
      buffer += d.toString()
      while (true) {
        const nl = buffer.indexOf('\n')
        if (nl === -1) break
        const line = buffer.slice(0, nl).replace(/\r$/, '')
        buffer = buffer.slice(nl + 1)
        if (line === '') continue
        try {
          const parsed = JSON.parse(line)
          if (parsed.id === id) {
            clearTimeout(timeout)
            s.stdout.removeListener('data', handler)
            resolve(parsed)
          }
        } catch {}
      }
    }
    s.stdout.on('data', handler)
    s.stdin.write(msg)
  })
}

s.stderr.on('data', (d) => {
  const line = d.toString().trim()
  if (line.includes('"level":"error"') || (line.includes('"level":"info"') && line.includes('Connect'))) {
    console.error('SERVER:', line.slice(0, 300))
  }
})

async function main() {
  await new Promise(r => setTimeout(r, 2000))

  const init = await send('initialize', {
    protocolVersion: '2024-11-05',
    capabilities: {},
    clientInfo: { name: 'test', version: '1.0' }
  })
  s.stdin.write(JSON.stringify({ jsonrpc: '2.0', method: 'notifications/initialized' }) + '\n')
  console.log('Initialized')

  const proj = await send('tools/call', { name: 'list_projects', arguments: {} })
  const projects = JSON.parse(proj.result.content[0].text)
  console.log('Projects:', projects.map(p => `${p.identifier}=${p.id}`))

  const projectId = projects[0].id
  console.log('Using project:', projectId)

  // Try create_issue
  const result = await send('tools/call', {
    name: 'create_issue',
    arguments: { projectId, title: 'Test MCP v7 Issue', priority: 'Low' }
  })
  console.log('create_issue result:', JSON.stringify(result.result, null, 2))

  // If issue created, clean it up
  if (result.result && !result.result.isError) {
    const data = JSON.parse(result.result.content[0].text)
    if (data.issueId) {
      const del = await send('tools/call', {
        name: 'delete_issue',
        arguments: { issueId: data.issueId }
      })
      console.log('delete_issue result:', JSON.stringify(del.result, null, 2))
    }
  }

  s.kill()
  process.exit(0)
}

main().catch(e => {
  console.error('Error:', e.message)
  s.kill()
  process.exit(1)
})
