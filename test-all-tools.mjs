#!/usr/bin/env node
// Systematic test of all MCP tools against remi-test workspace via stdio

import { spawn } from 'node:child_process'

const TIMEOUT_MS = 30000
let requestId = 0
let serverProcess = null
let buffer = ''

const results = { pass: [], fail: [], hang: [], skip: [] }

function nextId() { return ++requestId }

function sendRequest(method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = nextId()
    const msg = JSON.stringify({ jsonrpc: '2.0', id, method, params }) + '\n'

    const timeout = setTimeout(() => {
      reject(new Error(`TIMEOUT after ${TIMEOUT_MS}ms`))
    }, TIMEOUT_MS)

    const handler = (data) => {
      buffer += data.toString()
      // Parse newline-delimited JSON responses
      while (true) {
        const newline = buffer.indexOf('\n')
        if (newline === -1) break
        const line = buffer.slice(0, newline).replace(/\r$/, '')
        buffer = buffer.slice(newline + 1)
        if (!line) continue
        try {
          const parsed = JSON.parse(line)
          if (parsed.id === id) {
            clearTimeout(timeout)
            serverProcess.stdout.removeListener('data', handler)
            resolve(parsed)
          }
        } catch {}
      }
    }
    serverProcess.stdout.on('data', handler)
    serverProcess.stdin.write(msg)
  })
}

async function callTool(name, args = {}) {
  return sendRequest('tools/call', { name, arguments: args })
}

async function test(name, toolName, args = {}) {
  process.stdout.write(`  ${name}... `)
  try {
    const res = await callTool(toolName, args)
    if (res.error) {
      console.log(`FAIL (rpc error: ${res.error.message})`)
      results.fail.push({ name, tool: toolName, error: res.error.message })
      return { ok: false, data: null, error: res.error.message }
    }
    const content = res.result?.content?.[0]?.text
    const isError = res.result?.isError
    if (isError) {
      console.log(`FAIL (tool error: ${content?.slice(0, 120)})`)
      results.fail.push({ name, tool: toolName, error: content?.slice(0, 200) })
      return { ok: false, data: null, error: content }
    }
    let parsed = null
    try { parsed = JSON.parse(content) } catch { parsed = content }
    console.log(`PASS`)
    results.pass.push({ name, tool: toolName })
    return { ok: true, data: parsed, error: null }
  } catch (e) {
    if (e.message.includes('TIMEOUT')) {
      console.log(`HANG (${TIMEOUT_MS}ms timeout)`)
      results.hang.push({ name, tool: toolName })
      return { ok: false, data: null, error: 'TIMEOUT' }
    }
    console.log(`FAIL (exception: ${e.message})`)
    results.fail.push({ name, tool: toolName, error: e.message })
    return { ok: false, data: null, error: e.message }
  }
}

async function main() {
  console.log('Starting MCP server in stdio mode...\n')
  serverProcess = spawn('npx', ['tsx', 'src/index.ts'], {
    cwd: '/Users/denissellu/src/remi/huly-mcp-server',
    env: { ...process.env, NODE_NO_WARNINGS: '1' },
    stdio: ['pipe', 'pipe', 'pipe'],
  })

  // Collect stderr for debugging
  let stderrBuf = ''
  serverProcess.stderr.on('data', (d) => { stderrBuf += d.toString() })

  // Wait for server to be ready
  await new Promise(r => setTimeout(r, 2000))

  // Initialize
  console.log('Sending initialize...')
  const initRes = await sendRequest('initialize', {
    protocolVersion: '2024-11-05',
    capabilities: {},
    clientInfo: { name: 'test-runner', version: '1.0.0' },
  })
  console.log(`Server: ${initRes.result?.serverInfo?.name} v${initRes.result?.serverInfo?.version}`)
  console.log(`Tools available: ${initRes.result?.capabilities?.tools ? 'yes' : 'no'}\n`)

  // Send initialized notification (no response expected)
  const notifMsg = JSON.stringify({ jsonrpc: '2.0', method: 'notifications/initialized' }) + '\n'
  serverProcess.stdin.write(notifMsg)
  await new Promise(r => setTimeout(r, 500))

  // List tools
  console.log('Listing tools...')
  const toolsRes = await sendRequest('tools/list', {})
  const toolNames = toolsRes.result?.tools?.map(t => t.name) || []
  console.log(`Found ${toolNames.length} tools\n`)

  // =========================================
  // MODULE 1: ISSUES & PROJECTS (15 tools)
  // =========================================
  console.log('=== ISSUES & PROJECTS ===')

  const proj = await test('list_projects', 'list_projects')
  let projectId = proj.data?.[0]?.id
  let projectIdentifier = proj.data?.[0]?.identifier

  const issues = await test('list_issues', 'list_issues', projectId ? { projectId } : {})
  let existingIssueId = issues.data?.[0]?.id

  if (existingIssueId) {
    await test('get_issue (by id)', 'get_issue', { issueId: existingIssueId })
  }
  if (issues.data?.[0]?.identifier) {
    await test('get_issue (by identifier)', 'get_issue', { issueId: issues.data[0].identifier })
  }

  await test('search_issues', 'search_issues', { query: 'test' })

  let createdIssue = null
  if (projectId) {
    const cr = await test('create_issue', 'create_issue', { projectId, title: 'MCP Test Issue', description: 'Testing all tools', priority: 'Low' })
    createdIssue = cr.data
  }

  if (createdIssue?.issueId) {
    await test('update_issue', 'update_issue', { issueId: createdIssue.issueId, title: 'MCP Test Issue (updated)' })
    await test('add_comment', 'add_comment', { issueId: createdIssue.issueId, comment: 'Test comment from MCP' })
    await test('add_issue_label', 'add_issue_label', { issueId: createdIssue.issueId, label: 'mcp-test' })
  }

  // Templates
  await test('list_issue_templates', 'list_issue_templates', projectId ? { projectId } : {})
  let createdTemplate = null
  if (projectId) {
    const tmpl = await test('create_issue_template', 'create_issue_template', { projectId, title: 'MCP Test Template' })
    createdTemplate = tmpl.data
  }
  if (createdTemplate?.templateId) {
    await test('get_issue_template', 'get_issue_template', { templateId: createdTemplate.templateId })
    await test('update_issue_template', 'update_issue_template', { templateId: createdTemplate.templateId, title: 'MCP Test Template (updated)' })
    const fromTmpl = await test('create_issue_from_template', 'create_issue_from_template', { templateId: createdTemplate.templateId })
    if (fromTmpl.data?.issueId) {
      await test('delete_issue (from template)', 'delete_issue', { issueId: fromTmpl.data.issueId })
    }
    await test('delete_issue_template', 'delete_issue_template', { templateId: createdTemplate.templateId })
  }

  if (createdIssue?.issueId) {
    await test('delete_issue', 'delete_issue', { issueId: createdIssue.issueId })
  }

  // =========================================
  // MODULE 2: ORGANIZATION (1 tool)
  // =========================================
  console.log('\n=== ORGANIZATION ===')
  await test('list_statuses', 'list_statuses', projectId ? { projectId } : {})

  // =========================================
  // MODULE 3: COMPONENTS (5 tools)
  // =========================================
  console.log('\n=== COMPONENTS ===')
  const comps = await test('list_components', 'list_components', projectId ? { projectId } : {})
  let createdComp = null
  if (projectId) {
    const cc = await test('create_component', 'create_component', { projectId, name: 'MCP Test Component' })
    createdComp = cc.data
  }
  if (createdComp?.componentId) {
    await test('get_component', 'get_component', { componentId: createdComp.componentId })
    await test('update_component', 'update_component', { componentId: createdComp.componentId, name: 'MCP Test Component (updated)' })
    await test('delete_component', 'delete_component', { componentId: createdComp.componentId })
  }

  // =========================================
  // MODULE 4: MILESTONES (5 tools)
  // =========================================
  console.log('\n=== MILESTONES ===')
  const miles = await test('list_milestones', 'list_milestones', projectId ? { projectId } : {})
  let createdMilestone = null
  if (projectId) {
    const cm = await test('create_milestone', 'create_milestone', { projectId, name: 'MCP Test Milestone' })
    createdMilestone = cm.data
  }
  if (createdMilestone?.milestoneId) {
    await test('get_milestone', 'get_milestone', { milestoneId: createdMilestone.milestoneId })
    await test('update_milestone', 'update_milestone', { milestoneId: createdMilestone.milestoneId, name: 'MCP Test Milestone (updated)' })
    await test('delete_milestone', 'delete_milestone', { milestoneId: createdMilestone.milestoneId })
  }

  // =========================================
  // MODULE 5: CARDS (6 tools)
  // =========================================
  console.log('\n=== CARDS ===')
  const cardSpaces = await test('list_card_spaces', 'list_card_spaces')
  const cardSpaceId = cardSpaces.data?.[0]?.id
  await test('list_cards', 'list_cards', cardSpaceId ? { spaceId: cardSpaceId } : {})
  // Only test create/update/delete if we have a card space
  let createdCard = null
  if (cardSpaceId) {
    const cc = await test('create_card', 'create_card', { spaceId: cardSpaceId, title: 'MCP Test Card' })
    createdCard = cc.data
  }
  if (createdCard?.cardId) {
    await test('get_card', 'get_card', { cardId: createdCard.cardId })
    await test('update_card', 'update_card', { cardId: createdCard.cardId, title: 'MCP Test Card (updated)' })
    await test('delete_card', 'delete_card', { cardId: createdCard.cardId })
  }

  // =========================================
  // MODULE 6: DOCUMENTS (6 tools)
  // =========================================
  console.log('\n=== DOCUMENTS ===')
  const teamspaces = await test('list_teamspaces', 'list_teamspaces')
  const teamspaceId = teamspaces.data?.[0]?.id
  const docs = await test('list_documents', 'list_documents', teamspaceId ? { teamspaceId } : {})
  const docId = docs.data?.[0]?.id

  if (docId) {
    await test('get_document', 'get_document', { documentId: docId })
  }

  let createdDoc = null
  if (teamspaceId) {
    const cd = await test('create_document', 'create_document', { teamspaceId, title: 'MCP Test Document', content: 'Hello from MCP test' })
    createdDoc = cd.data
  }
  if (createdDoc?.documentId) {
    await test('update_document', 'update_document', { documentId: createdDoc.documentId, title: 'MCP Test Document (updated)' })
    await test('delete_document', 'delete_document', { documentId: createdDoc.documentId })
  }

  // =========================================
  // MODULE 7: ATTACHMENTS (7 tools)
  // =========================================
  console.log('\n=== ATTACHMENTS ===')
  // Need an issue to test attachments on
  let attachTestIssue = null
  if (projectId) {
    const ai = await callTool('create_issue', { projectId, title: 'Attachment Test Issue' })
    const content = ai.result?.content?.[0]?.text
    try { attachTestIssue = JSON.parse(content) } catch {}
  }
  if (attachTestIssue?.issueId) {
    await test('list_attachments', 'list_attachments', { objectId: attachTestIssue.issueId })
    await test('add_attachment', 'add_attachment', { objectId: attachTestIssue.issueId, name: 'test.txt', type: 'text/plain', data: Buffer.from('hello').toString('base64') })
    const atts = await callTool('list_attachments', { objectId: attachTestIssue.issueId })
    let attContent
    try { attContent = JSON.parse(atts.result?.content?.[0]?.text) } catch {}
    const attId = attContent?.[0]?.id
    if (attId) {
      await test('get_attachment', 'get_attachment', { attachmentId: attId })
      await test('update_attachment', 'update_attachment', { attachmentId: attId, name: 'test-updated.txt' })
      await test('pin_attachment', 'pin_attachment', { attachmentId: attId, pinned: true })
      await test('download_attachment', 'download_attachment', { attachmentId: attId })
      await test('delete_attachment', 'delete_attachment', { attachmentId: attId })
    }
    // Cleanup
    await callTool('delete_issue', { issueId: attachTestIssue.issueId })
  } else {
    console.log('  (skipping - no project to create test issue)')
    results.skip.push({ name: 'attachments module', reason: 'no project' })
  }

  // =========================================
  // MODULE 8: COMMENTS (3 tools)
  // =========================================
  console.log('\n=== COMMENTS ===')
  // Need an issue with a comment
  let commentTestIssue = null
  if (projectId) {
    const ci = await callTool('create_issue', { projectId, title: 'Comment Test Issue' })
    try { commentTestIssue = JSON.parse(ci.result?.content?.[0]?.text) } catch {}
  }
  if (commentTestIssue?.issueId) {
    const addC = await callTool('add_comment', { issueId: commentTestIssue.issueId, comment: 'Test comment for listing' })
    await test('list_comments', 'list_comments', { objectId: commentTestIssue.issueId })

    let addCData
    try { addCData = JSON.parse(addC.result?.content?.[0]?.text) } catch {}
    if (addCData?.commentId) {
      await test('update_comment', 'update_comment', { commentId: addCData.commentId, message: 'Updated comment' })
      await test('delete_comment', 'delete_comment', { commentId: addCData.commentId })
    }
    await callTool('delete_issue', { issueId: commentTestIssue.issueId })
  }

  // =========================================
  // MODULE 9: SEARCH (1 tool)
  // =========================================
  console.log('\n=== SEARCH ===')
  await test('fulltext_search', 'fulltext_search', { query: 'test' })

  // =========================================
  // MODULE 10: CONTACTS (8 tools)
  // =========================================
  console.log('\n=== CONTACTS ===')
  const persons = await test('list_persons', 'list_persons')
  const personId = persons.data?.[0]?.id
  if (personId) {
    await test('get_person', 'get_person', { personId })
  }
  await test('list_employees', 'list_employees')
  await test('list_organizations', 'list_organizations')

  let createdPerson = null
  const cp = await test('create_person', 'create_person', { firstName: 'MCP', lastName: 'Test' })
  createdPerson = cp.data
  if (createdPerson?.personId) {
    await test('update_person', 'update_person', { personId: createdPerson.personId, firstName: 'MCPUpdated' })
    await test('delete_person', 'delete_person', { personId: createdPerson.personId })
  }

  const co = await test('create_organization', 'create_organization', { name: 'MCP Test Org' })

  // =========================================
  // MODULE 11: STORAGE (1 tool)
  // =========================================
  console.log('\n=== STORAGE ===')
  await test('upload_file', 'upload_file', { name: 'test.txt', type: 'text/plain', data: Buffer.from('hello world').toString('base64') })

  // =========================================
  // MODULE 12: CHANNELS (11 tools)
  // =========================================
  console.log('\n=== CHANNELS ===')
  const chans = await test('list_channels', 'list_channels')
  const chanId = chans.data?.[0]?.id

  let createdChan = null
  const cc = await test('create_channel', 'create_channel', { name: 'mcp-test-channel', description: 'Testing MCP' })
  createdChan = cc.data
  if (createdChan?.channelId) {
    await test('get_channel', 'get_channel', { channelId: createdChan.channelId })
    await test('update_channel', 'update_channel', { channelId: createdChan.channelId, name: 'mcp-test-channel-updated' })
    const sendMsg = await test('send_channel_message', 'send_channel_message', { channelId: createdChan.channelId, message: 'Hello from MCP test' })
    await test('list_channel_messages', 'list_channel_messages', { channelId: createdChan.channelId })

    if (sendMsg.data?.messageId) {
      await test('list_thread_replies', 'list_thread_replies', { messageId: sendMsg.data.messageId })
      await test('add_thread_reply', 'add_thread_reply', { messageId: sendMsg.data.messageId, message: 'Thread reply from MCP' })
      // Get thread replies to find one to delete
      const replies = await callTool('list_thread_replies', { messageId: sendMsg.data.messageId })
      let repliesData
      try { repliesData = JSON.parse(replies.result?.content?.[0]?.text) } catch {}
      if (repliesData?.[0]?.id) {
        await test('delete_thread_reply', 'delete_thread_reply', { replyId: repliesData[0].id })
      }
    }
    await test('delete_channel', 'delete_channel', { channelId: createdChan.channelId })
  }

  await test('list_direct_messages', 'list_direct_messages')

  // =========================================
  // MODULE 13: TIME TRACKING (8 tools)
  // =========================================
  console.log('\n=== TIME TRACKING ===')
  let timeTestIssue = null
  if (projectId) {
    const ti = await callTool('create_issue', { projectId, title: 'Time Tracking Test Issue' })
    try { timeTestIssue = JSON.parse(ti.result?.content?.[0]?.text) } catch {}
  }
  if (timeTestIssue?.issueId) {
    await test('log_time', 'log_time', { issueId: timeTestIssue.issueId, hours: 1, description: 'MCP test time log' })
    await test('get_time_report', 'get_time_report', { issueId: timeTestIssue.issueId })
    await test('list_time_spend_reports', 'list_time_spend_reports', {})
    await test('get_detailed_time_report', 'get_detailed_time_report', {})
    await test('list_work_slots', 'list_work_slots', {})
    await test('create_work_slot', 'create_work_slot', { date: '2026-03-06', hours: 2 })
    await test('start_timer', 'start_timer', {})
    await test('stop_timer', 'stop_timer', { startedAt: new Date(Date.now() - 60000).toISOString() })
    await callTool('delete_issue', { issueId: timeTestIssue.issueId })
  }

  // =========================================
  // MODULE 14: CALENDAR (8 tools)
  // =========================================
  console.log('\n=== CALENDAR ===')
  const events = await test('list_events', 'list_events', {})
  let createdEvent = null
  const ce = await test('create_event', 'create_event', {
    title: 'MCP Test Event',
    date: new Date().toISOString(),
    dueDate: new Date(Date.now() + 3600000).toISOString(),
  })
  createdEvent = ce.data
  if (createdEvent?.eventId) {
    await test('get_event', 'get_event', { eventId: createdEvent.eventId })
    await test('update_event', 'update_event', { eventId: createdEvent.eventId, title: 'MCP Test Event (updated)' })
    await test('delete_event', 'delete_event', { eventId: createdEvent.eventId })
  }
  await test('list_recurring_events', 'list_recurring_events', {})
  await test('create_recurring_event', 'create_recurring_event', {
    title: 'MCP Recurring Test',
    date: new Date().toISOString(),
    dueDate: new Date(Date.now() + 3600000).toISOString(),
    rules: [{ freq: 'WEEKLY', count: 4 }],
  })
  await test('list_event_instances', 'list_event_instances', {})

  // =========================================
  // MODULE 15: ACTIVITY (8 tools)
  // =========================================
  console.log('\n=== ACTIVITY ===')
  let activityTestIssue = null
  if (projectId) {
    const ai = await callTool('create_issue', { projectId, title: 'Activity Test Issue' })
    try { activityTestIssue = JSON.parse(ai.result?.content?.[0]?.text) } catch {}
  }
  if (activityTestIssue?.issueId) {
    await test('list_activity', 'list_activity', { objectId: activityTestIssue.issueId })
    await test('list_reactions', 'list_reactions', { messageId: activityTestIssue.issueId })
    await test('list_saved_messages', 'list_saved_messages', {})
    await test('list_mentions', 'list_mentions', {})

    // Try reaction (need a message first)
    const addC = await callTool('add_comment', { issueId: activityTestIssue.issueId, comment: 'For reaction test' })
    let addCData
    try { addCData = JSON.parse(addC.result?.content?.[0]?.text) } catch {}
    if (addCData?.commentId) {
      const rx = await test('add_reaction', 'add_reaction', { messageId: addCData.commentId, emoji: '👍' })
      if (rx.data?.reactionId) {
        await test('remove_reaction', 'remove_reaction', { reactionId: rx.data.reactionId })
      }
      const sv = await test('save_message', 'save_message', { messageId: addCData.commentId })
      if (sv.data?.savedId) {
        await test('unsave_message', 'unsave_message', { savedId: sv.data.savedId })
      }
    }
    await callTool('delete_issue', { issueId: activityTestIssue.issueId })
  }

  // =========================================
  // MODULE 16: NOTIFICATIONS (13 tools)
  // =========================================
  console.log('\n=== NOTIFICATIONS ===')
  const notifs = await test('list_notifications', 'list_notifications', {})
  const notifId = notifs.data?.[0]?.id
  if (notifId) {
    await test('get_notification', 'get_notification', { notificationId: notifId })
    await test('mark_notification_read', 'mark_notification_read', { notificationId: notifId })
    await test('archive_notification', 'archive_notification', { notificationId: notifId })
  }
  await test('mark_all_notifications_read', 'mark_all_notifications_read', {})
  await test('archive_all_notifications', 'archive_all_notifications', {})
  await test('get_unread_notification_count', 'get_unread_notification_count', {})
  await test('list_notification_contexts', 'list_notification_contexts', {})
  await test('list_notification_settings', 'list_notification_settings', {})

  // Skip delete_notification and pin/update since they need specific IDs
  if (notifId) {
    await test('get_notification_context', 'get_notification_context', { contextId: notifId })
    await test('pin_notification_context', 'pin_notification_context', { contextId: notifId, pinned: true })
    await test('update_notification_provider_setting', 'update_notification_provider_setting', { settingId: 'test', enabled: true })
    await test('delete_notification', 'delete_notification', { notificationId: notifId })
  }

  // =========================================
  // MODULE 17: WORKSPACE (10 tools)
  // =========================================
  console.log('\n=== WORKSPACE ===')
  await test('list_workspace_members', 'list_workspace_members', {})
  await test('get_workspace_info', 'get_workspace_info', {})
  await test('list_workspaces', 'list_workspaces', {})
  await test('get_user_profile', 'get_user_profile', {})
  await test('get_regions', 'get_regions', {})

  // Skip dangerous workspace operations
  console.log('  update_member_role... SKIP (dangerous)')
  results.skip.push({ name: 'update_member_role', reason: 'dangerous' })
  console.log('  create_workspace... SKIP (dangerous)')
  results.skip.push({ name: 'create_workspace', reason: 'dangerous' })
  console.log('  delete_workspace... SKIP (dangerous)')
  results.skip.push({ name: 'delete_workspace', reason: 'dangerous' })
  console.log('  update_user_profile... SKIP (dangerous)')
  results.skip.push({ name: 'update_user_profile', reason: 'dangerous' })
  console.log('  update_guest_settings... SKIP (dangerous)')
  results.skip.push({ name: 'update_guest_settings', reason: 'dangerous' })

  // =========================================
  // SUMMARY
  // =========================================
  console.log('\n' + '='.repeat(60))
  console.log('RESULTS SUMMARY')
  console.log('='.repeat(60))
  console.log(`PASS:  ${results.pass.length}`)
  console.log(`FAIL:  ${results.fail.length}`)
  console.log(`HANG:  ${results.hang.length}`)
  console.log(`SKIP:  ${results.skip.length}`)
  console.log(`TOTAL: ${results.pass.length + results.fail.length + results.hang.length + results.skip.length}`)

  if (results.fail.length > 0) {
    console.log('\n--- FAILURES ---')
    for (const f of results.fail) {
      console.log(`  ${f.name} (${f.tool}): ${f.error?.slice(0, 150)}`)
    }
  }
  if (results.hang.length > 0) {
    console.log('\n--- HANGS ---')
    for (const h of results.hang) {
      console.log(`  ${h.name} (${h.tool})`)
    }
  }
  if (results.skip.length > 0) {
    console.log('\n--- SKIPPED ---')
    for (const s of results.skip) {
      console.log(`  ${s.name}: ${s.reason}`)
    }
  }

  // Print stderr if there were issues
  if (results.fail.length > 0 || results.hang.length > 0) {
    console.log('\n--- LAST 50 LINES OF SERVER STDERR ---')
    const lines = stderrBuf.split('\n')
    console.log(lines.slice(-50).join('\n'))
  }

  serverProcess.kill('SIGTERM')
  process.exit(0)
}

main().catch(e => {
  console.error('Test runner error:', e)
  if (serverProcess) serverProcess.kill('SIGTERM')
  process.exit(1)
})
