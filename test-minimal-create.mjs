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
  for (const line of d.toString().split('\n')) {
    if (line.includes('"level":')) console.error('SRV:', line.slice(0, 400))
  }
})

async function main() {
  await new Promise(r => setTimeout(r, 2000))

  await send('initialize', {
    protocolVersion: '2024-11-05',
    capabilities: {},
    clientInfo: { name: 'test', version: '1.0' }
  })
  s.stdin.write(JSON.stringify({ jsonrpc: '2.0', method: 'notifications/initialized' }) + '\n')
  console.log('Initialized')

  // Get project data
  const proj = await send('tools/call', { name: 'list_projects', arguments: {} })
  const projects = JSON.parse(proj.result.content[0].text)
  const p = projects[0]
  console.log('Project:', JSON.stringify(p, null, 2))

  // List some issues to see what fields they have
  const issues = await send('tools/call', { name: 'list_issues', arguments: { projectId: p.id } })
  const issueList = JSON.parse(issues.result.content[0].text)
  console.log('First issue:', JSON.stringify(issueList[0], null, 2))

  // Get full issue details
  if (issueList[0]) {
    const full = await send('tools/call', { name: 'get_issue', arguments: { issueId: issueList[0].id } })
    const fullIssue = JSON.parse(full.result.content[0].text)
    // Show all keys and values
    const keys = Object.keys(fullIssue).sort()
    console.log('\nIssue keys:', keys)
    for (const k of keys) {
      const v = fullIssue[k]
      console.log(`  ${k}: ${typeof v === 'object' ? JSON.stringify(v) : v}`)
    }
  }

  s.kill()
  process.exit(0)
}

main().catch(e => { console.error('Error:', e.message); s.kill(); process.exit(1) })
