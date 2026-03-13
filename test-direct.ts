import { connect, ConnectOptions, NodeWebSocketFactory } from '@hcengineering/api-client'
import { allHandlers } from './src/tools'

const TIMEOUT = 10000

const creds = {
  url: process.env.HULY_URL!,
  workspace: process.env.HULY_WORKSPACE!,
  email: process.env.HULY_EMAIL!,
  password: process.env.HULY_PASSWORD!,
}

const results: { pass: string[]; fail: { name: string; err: string }[]; hang: string[]; skip: string[] } = {
  pass: [], fail: [], hang: [], skip: [],
}

async function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error('TIMEOUT')), ms)),
  ])
}

async function run(name: string, fn: () => Promise<any>): Promise<any> {
  process.stdout.write(`  ${name}... `)
  try {
    const result = await withTimeout(fn(), TIMEOUT)
    console.log('PASS')
    results.pass.push(name)
    return result
  } catch (e: any) {
    if (e.message === 'TIMEOUT') {
      console.log('HANG')
      results.hang.push(name)
    } else {
      console.log(`FAIL: ${e.message?.slice(0, 120)}`)
      results.fail.push({ name, err: e.message?.slice(0, 200) })
    }
    return null
  }
}

async function main() {
  console.log(`Connecting to ${creds.url} workspace=${creds.workspace}...`)
  const options: ConnectOptions = {
    email: creds.email,
    password: creds.password,
    workspace: creds.workspace,
    socketFactory: NodeWebSocketFactory,
    connectionTimeout: 30000,
  }
  const client = await connect(creds.url, options)
  console.log('Connected!\n')

  const h = allHandlers

  // === ISSUES & PROJECTS ===
  console.log('=== ISSUES & PROJECTS ===')
  const projects = await run('list_projects', () => h.list_projects(client, {}))
  const pid = projects?.[0]?.id
  const pident = projects?.[0]?.identifier

  const issues = await run('list_issues', () => h.list_issues(client, pid ? { projectId: pid } : {}))
  const iid = issues?.[0]?.id

  if (iid) await run('get_issue (by id)', () => h.get_issue(client, { issueId: iid }))
  if (issues?.[0]?.identifier) await run('get_issue (by ident)', () => h.get_issue(client, { issueId: issues[0].identifier }))

  await run('search_issues', () => h.search_issues(client, { query: 'test' }))

  let ci: any = null
  if (pid) {
    ci = await run('create_issue', () => h.create_issue(client, { projectId: pid, title: 'MCP Test Issue', description: 'test', priority: 'Low' }))
  }
  if (ci?.issueId) {
    await run('update_issue', () => h.update_issue(client, { issueId: ci.issueId, title: 'MCP Test (updated)' }))
    await run('add_comment', () => h.add_comment(client, { issueId: ci.issueId, comment: 'test comment' }))
    await run('add_issue_label', () => h.add_issue_label(client, { issueId: ci.issueId, label: 'mcp-test' }))
    await run('delete_issue', () => h.delete_issue(client, { issueId: ci.issueId }))
  }

  // Templates
  await run('list_issue_templates', () => h.list_issue_templates(client, {}))
  let tmpl: any = null
  if (pid) {
    tmpl = await run('create_issue_template', () => h.create_issue_template(client, { projectId: pid, title: 'MCP Test Template' }))
  }
  if (tmpl?.templateId) {
    await run('get_issue_template', () => h.get_issue_template(client, { templateId: tmpl.templateId }))
    await run('update_issue_template', () => h.update_issue_template(client, { templateId: tmpl.templateId, title: 'Updated' }))
    const fromTmpl: any = await run('create_issue_from_template', () => h.create_issue_from_template(client, { templateId: tmpl.templateId }))
    if (fromTmpl?.issueId) await run('delete_issue (tmpl)', () => h.delete_issue(client, { issueId: fromTmpl.issueId }))
    await run('delete_issue_template', () => h.delete_issue_template(client, { templateId: tmpl.templateId }))
  }

  // === ORGANIZATION ===
  console.log('\n=== ORGANIZATION ===')
  await run('list_statuses', () => h.list_statuses(client, pid ? { projectId: pid } : {}))

  // === COMPONENTS ===
  console.log('\n=== COMPONENTS ===')
  await run('list_components', () => h.list_components(client, {}))
  let comp: any = null
  if (pid) {
    comp = await run('create_component', () => h.create_component(client, { projectId: pid, name: 'MCP Test Comp' }))
  }
  if (comp?.componentId) {
    await run('get_component', () => h.get_component(client, { componentId: comp.componentId }))
    await run('update_component', () => h.update_component(client, { componentId: comp.componentId, name: 'Updated' }))
    await run('delete_component', () => h.delete_component(client, { componentId: comp.componentId }))
  }

  // === MILESTONES ===
  console.log('\n=== MILESTONES ===')
  await run('list_milestones', () => h.list_milestones(client, {}))
  let ms: any = null
  if (pid) {
    ms = await run('create_milestone', () => h.create_milestone(client, { projectId: pid, name: 'MCP Test MS' }))
  }
  if (ms?.milestoneId) {
    await run('get_milestone', () => h.get_milestone(client, { milestoneId: ms.milestoneId }))
    await run('update_milestone', () => h.update_milestone(client, { milestoneId: ms.milestoneId, name: 'Updated' }))
    await run('delete_milestone', () => h.delete_milestone(client, { milestoneId: ms.milestoneId }))
  }

  // === CARDS ===
  console.log('\n=== CARDS ===')
  const cardSpaces = await run('list_card_spaces', () => h.list_card_spaces(client, {}))
  const csid = cardSpaces?.[0]?.id
  await run('list_cards', () => h.list_cards(client, {}))
  let card: any = null
  if (csid) {
    card = await run('create_card', () => h.create_card(client, { spaceId: csid, title: 'MCP Test Card' }))
  }
  if (card?.cardId) {
    await run('get_card', () => h.get_card(client, { cardId: card.cardId }))
    await run('update_card', () => h.update_card(client, { cardId: card.cardId, title: 'Updated' }))
    await run('delete_card', () => h.delete_card(client, { cardId: card.cardId }))
  }

  // === DOCUMENTS ===
  console.log('\n=== DOCUMENTS ===')
  const tspaces = await run('list_teamspaces', () => h.list_teamspaces(client, {}))
  const tsid = tspaces?.[0]?.id
  const docs = await run('list_documents', () => h.list_documents(client, {}))
  if (docs?.[0]?.id) await run('get_document', () => h.get_document(client, { documentId: docs[0].id }))
  let doc: any = null
  if (tsid) {
    doc = await run('create_document', () => h.create_document(client, { teamspaceId: tsid, title: 'MCP Test Doc', content: 'Hello' }))
  }
  if (doc?.documentId) {
    await run('update_document', () => h.update_document(client, { documentId: doc.documentId, title: 'Updated' }))
    await run('delete_document', () => h.delete_document(client, { documentId: doc.documentId }))
  }

  // === ATTACHMENTS ===
  console.log('\n=== ATTACHMENTS ===')
  let attIssue: any = null
  if (pid) {
    attIssue = await run('create_issue (attach test)', () => h.create_issue(client, { projectId: pid, title: 'Attach test' }))
  }
  if (attIssue?.issueId) {
    await run('list_attachments', () => h.list_attachments(client, { objectId: attIssue.issueId }))
    const att: any = await run('add_attachment', () => h.add_attachment(client, { objectId: attIssue.issueId, name: 'test.txt', type: 'text/plain', data: Buffer.from('hello').toString('base64') }))
    if (att?.attachmentId) {
      await run('get_attachment', () => h.get_attachment(client, { attachmentId: att.attachmentId }))
      await run('update_attachment', () => h.update_attachment(client, { attachmentId: att.attachmentId, name: 'updated.txt' }))
      await run('pin_attachment', () => h.pin_attachment(client, { attachmentId: att.attachmentId, pinned: true }))
      await run('download_attachment', () => h.download_attachment(client, { attachmentId: att.attachmentId }))
      await run('delete_attachment', () => h.delete_attachment(client, { attachmentId: att.attachmentId }))
    }
    await run('delete_issue (attach cleanup)', () => h.delete_issue(client, { issueId: attIssue.issueId }))
  }

  // === COMMENTS ===
  console.log('\n=== COMMENTS ===')
  let cmtIssue: any = null
  if (pid) {
    cmtIssue = await run('create_issue (comment test)', () => h.create_issue(client, { projectId: pid, title: 'Comment test' }))
  }
  if (cmtIssue?.issueId) {
    const cmt: any = await run('add_comment (for list)', () => h.add_comment(client, { issueId: cmtIssue.issueId, comment: 'test' }))
    await run('list_comments', () => h.list_comments(client, { objectId: cmtIssue.issueId }))
    if (cmt?.commentId) {
      await run('update_comment', () => h.update_comment(client, { commentId: cmt.commentId, message: 'updated' }))
      await run('delete_comment', () => h.delete_comment(client, { commentId: cmt.commentId }))
    }
    await run('delete_issue (comment cleanup)', () => h.delete_issue(client, { issueId: cmtIssue.issueId }))
  }

  // === SEARCH ===
  console.log('\n=== SEARCH ===')
  await run('fulltext_search', () => h.fulltext_search(client, { query: 'test' }))

  // === CONTACTS ===
  console.log('\n=== CONTACTS ===')
  await run('list_persons', () => h.list_persons(client, {}))
  await run('list_employees', () => h.list_employees(client, {}))
  await run('list_organizations', () => h.list_organizations(client, {}))
  const persons = await run('list_persons (for get)', () => h.list_persons(client, {}))
  if (persons?.[0]?.id) await run('get_person', () => h.get_person(client, { personId: persons[0].id }))
  const cp2: any = await run('create_person', () => h.create_person(client, { firstName: 'MCP', lastName: 'Test' }))
  if (cp2?.personId) {
    await run('update_person', () => h.update_person(client, { personId: cp2.personId, firstName: 'Updated' }))
    await run('delete_person', () => h.delete_person(client, { personId: cp2.personId }))
  }
  await run('create_organization', () => h.create_organization(client, { name: 'MCP Test Org' }))

  // === STORAGE ===
  console.log('\n=== STORAGE ===')
  await run('upload_file', () => h.upload_file(client, { name: 'test.txt', type: 'text/plain', data: Buffer.from('hello').toString('base64') }))

  // === CHANNELS ===
  console.log('\n=== CHANNELS ===')
  const chans = await run('list_channels', () => h.list_channels(client, {}))
  let chan: any = null
  chan = await run('create_channel', () => h.create_channel(client, { name: 'mcp-test-chan', description: 'test' }))
  if (chan?.channelId) {
    await run('get_channel', () => h.get_channel(client, { channelId: chan.channelId }))
    await run('update_channel', () => h.update_channel(client, { channelId: chan.channelId, name: 'updated' }))
    const msg: any = await run('send_channel_message', () => h.send_channel_message(client, { channelId: chan.channelId, message: 'hello' }))
    await run('list_channel_messages', () => h.list_channel_messages(client, { channelId: chan.channelId }))
    if (msg?.messageId) {
      await run('list_thread_replies', () => h.list_thread_replies(client, { messageId: msg.messageId }))
      const reply: any = await run('add_thread_reply', () => h.add_thread_reply(client, { messageId: msg.messageId, message: 'reply' }))
      if (reply?.replyId) await run('delete_thread_reply', () => h.delete_thread_reply(client, { replyId: reply.replyId }))
    }
    await run('delete_channel', () => h.delete_channel(client, { channelId: chan.channelId }))
  }
  await run('list_direct_messages', () => h.list_direct_messages(client, {}))

  // === TIME TRACKING ===
  console.log('\n=== TIME TRACKING ===')
  let ttIssue: any = null
  if (pid) {
    ttIssue = await run('create_issue (time test)', () => h.create_issue(client, { projectId: pid, title: 'Time test' }))
  }
  if (ttIssue?.issueId) {
    await run('log_time', () => h.log_time(client, { issueId: ttIssue.issueId, hours: 1, description: 'test' }))
    await run('get_time_report', () => h.get_time_report(client, { issueId: ttIssue.issueId }))
    await run('delete_issue (time cleanup)', () => h.delete_issue(client, { issueId: ttIssue.issueId }))
  }
  await run('list_time_spend_reports', () => h.list_time_spend_reports(client, {}))
  await run('get_detailed_time_report', () => h.get_detailed_time_report(client, {}))
  await run('list_work_slots', () => h.list_work_slots(client, {}))
  await run('create_work_slot', () => h.create_work_slot(client, { date: '2026-03-06', hours: 2 }))
  await run('start_timer', () => h.start_timer(client, {}))
  await run('stop_timer', () => h.stop_timer(client, { startedAt: new Date(Date.now() - 60000).toISOString() }))

  // === CALENDAR ===
  console.log('\n=== CALENDAR ===')
  await run('list_events', () => h.list_events(client, {}))
  const evt: any = await run('create_event', () => h.create_event(client, { title: 'MCP Test', date: new Date().toISOString(), dueDate: new Date(Date.now() + 3600000).toISOString() }))
  if (evt?.eventId) {
    await run('get_event', () => h.get_event(client, { eventId: evt.eventId }))
    await run('update_event', () => h.update_event(client, { eventId: evt.eventId, title: 'Updated' }))
    await run('delete_event', () => h.delete_event(client, { eventId: evt.eventId }))
  }
  await run('list_recurring_events', () => h.list_recurring_events(client, {}))
  await run('create_recurring_event', () => h.create_recurring_event(client, { title: 'Recurring Test', date: new Date().toISOString(), dueDate: new Date(Date.now() + 3600000).toISOString(), rules: [{ freq: 'WEEKLY', count: 4 }] }))
  await run('list_event_instances', () => h.list_event_instances(client, {}))

  // === ACTIVITY ===
  console.log('\n=== ACTIVITY ===')
  let actIssue: any = null
  if (pid) {
    actIssue = await run('create_issue (activity test)', () => h.create_issue(client, { projectId: pid, title: 'Activity test' }))
  }
  if (actIssue?.issueId) {
    await run('list_activity', () => h.list_activity(client, { objectId: actIssue.issueId }))
    const actCmt: any = await run('add_comment (activity)', () => h.add_comment(client, { issueId: actIssue.issueId, comment: 'for reactions' }))
    if (actCmt?.commentId) {
      await run('list_reactions', () => h.list_reactions(client, { messageId: actCmt.commentId }))
      const rx: any = await run('add_reaction', () => h.add_reaction(client, { messageId: actCmt.commentId, emoji: '👍' }))
      if (rx?.reactionId) await run('remove_reaction', () => h.remove_reaction(client, { reactionId: rx.reactionId }))
      const sv: any = await run('save_message', () => h.save_message(client, { messageId: actCmt.commentId }))
      if (sv?.savedId) await run('unsave_message', () => h.unsave_message(client, { savedId: sv.savedId }))
    }
    await run('list_saved_messages', () => h.list_saved_messages(client, {}))
    await run('list_mentions', () => h.list_mentions(client, {}))
    await run('delete_issue (activity cleanup)', () => h.delete_issue(client, { issueId: actIssue.issueId }))
  }

  // === NOTIFICATIONS ===
  console.log('\n=== NOTIFICATIONS ===')
  const notifs = await run('list_notifications', () => h.list_notifications(client, {}))
  if (notifs?.[0]?.id) {
    await run('get_notification', () => h.get_notification(client, { notificationId: notifs[0].id }))
    await run('mark_notification_read', () => h.mark_notification_read(client, { notificationId: notifs[0].id }))
    await run('archive_notification', () => h.archive_notification(client, { notificationId: notifs[0].id }))
  }
  await run('mark_all_notifications_read', () => h.mark_all_notifications_read(client, {}))
  await run('archive_all_notifications', () => h.archive_all_notifications(client, {}))
  await run('get_unread_notification_count', () => h.get_unread_notification_count(client, {}))
  await run('list_notification_contexts', () => h.list_notification_contexts(client, {}))
  await run('list_notification_settings', () => h.list_notification_settings(client, {}))
  // Skip delete_notification, pin, update_provider - need valid IDs

  // === WORKSPACE ===
  console.log('\n=== WORKSPACE ===')
  await run('list_workspace_members', () => h.list_workspace_members(client, {}))
  await run('get_workspace_info', () => h.get_workspace_info(client, {}))
  await run('list_workspaces', () => h.list_workspaces(client, {}))
  await run('get_user_profile', () => h.get_user_profile(client, {}))
  await run('get_regions', () => h.get_regions(client, {}))
  // Skip: update_member_role, create_workspace, delete_workspace, update_user_profile, update_guest_settings

  // === SUMMARY ===
  console.log('\n' + '='.repeat(60))
  console.log('RESULTS')
  console.log('='.repeat(60))
  console.log(`PASS: ${results.pass.length}`)
  console.log(`FAIL: ${results.fail.length}`)
  console.log(`HANG: ${results.hang.length}`)
  console.log(`SKIP: ${results.skip.length}`)
  console.log(`TOTAL TESTED: ${results.pass.length + results.fail.length + results.hang.length}`)

  if (results.fail.length > 0) {
    console.log('\n--- FAILURES ---')
    for (const f of results.fail) console.log(`  ${f.name}: ${f.err}`)
  }
  if (results.hang.length > 0) {
    console.log('\n--- HANGS ---')
    for (const h of results.hang) console.log(`  ${h}`)
  }

  console.log('\nDone. Closing client...')
  try { await client.close() } catch {}
  process.exit(0)
}

main().catch(e => { console.error('FATAL:', e); process.exit(1) })
