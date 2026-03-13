import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const envPath = resolve(__dirname, '..', '.env')
const lines = readFileSync(envPath, 'utf-8').split('\n')
for (const line of lines) {
  const trimmed = line.trim()
  if (!trimmed || trimmed.startsWith('#')) continue
  const eq = trimmed.indexOf('=')
  if (eq === -1) continue
  const key = trimmed.slice(0, eq).trim()
  const val = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, '')
  if (!process.env[key]) process.env[key] = val
}

import { getWorkspaceToken } from '@hcengineering/api-client'
import { generateId } from '@hcengineering/core'

async function main() {
  const { endpoint, token, workspaceId } = await getWorkspaceToken(
    process.env.HULY_URL!,
    {
      email: process.env.HULY_EMAIL!,
      password: process.env.HULY_PASSWORD!,
      workspace: process.env.HULY_WORKSPACE!,
    }
  )
  const httpEndpoint = endpoint.replace('ws', 'http')
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  }

  // Get full account info
  const accountRes = await fetch(`${httpEndpoint}/api/v1/account/${workspaceId}`, { headers })
  const account = await accountRes.json()
  console.log('Account:', JSON.stringify(account, null, 2))

  // Test: first do a simple title update via REST tx to see what a working tx looks like
  const docId = '69a97d8ed7528e0ce4ce6484' // Testing Stripe Payments
  const QA_SPACE = '69a97c7d83c96e560cdc285b'

  // Try updating title first (known to work via MCP)
  const titleTx = {
    _id: generateId(),
    _class: 'core:class:TxUpdateDoc',
    space: 'core:space:Tx',
    objectId: docId,
    objectClass: 'document:class:Document',
    objectSpace: QA_SPACE,
    operations: { title: 'Testing Stripe Payments [test]' },
    modifiedOn: Date.now(),
    modifiedBy: account.primarySocialId || account._id,
  }

  console.log('\n=== Test 1: Update title via raw tx ===')
  const txUrl = `${httpEndpoint}/api/v1/tx/${workspaceId}`
  const r1 = await fetch(txUrl, { method: 'POST', headers, body: JSON.stringify(titleTx) })
  const r1text = await r1.text()
  console.log(`Status: ${r1.status}, Result: ${r1text.slice(0, 300)}`)

  // Check if title changed via REST find-all
  const findUrl = `${httpEndpoint}/api/v1/find-all/${workspaceId}?class=document:class:Document&query=${encodeURIComponent(JSON.stringify({ _id: docId }))}`
  const findRes = await fetch(findUrl, { headers })
  const findText = await findRes.text()
  console.log(`\nFind result: ${findText.slice(0, 500)}`)

  // Restore title
  const restoreTx = {
    _id: generateId(),
    _class: 'core:class:TxUpdateDoc',
    space: 'core:space:Tx',
    objectId: docId,
    objectClass: 'document:class:Document',
    objectSpace: QA_SPACE,
    operations: { title: 'Testing Stripe Payments' },
    modifiedOn: Date.now(),
    modifiedBy: account.primarySocialId || account._id,
  }
  await fetch(txUrl, { method: 'POST', headers, body: JSON.stringify(restoreTx) })
  console.log('\nTitle restored.')

  // Now try space update
  console.log('\n=== Test 2: Update space via raw tx ===')
  const PRODUCT_SPACE = '686bc95d4c040fa98a4c9e09'
  const spaceTx = {
    _id: generateId(),
    _class: 'core:class:TxUpdateDoc',
    space: 'core:space:Tx',
    objectId: docId,
    objectClass: 'document:class:Document',
    objectSpace: QA_SPACE,
    operations: { space: PRODUCT_SPACE },
    modifiedOn: Date.now(),
    modifiedBy: account.primarySocialId || account._id,
  }
  const r2 = await fetch(txUrl, { method: 'POST', headers, body: JSON.stringify(spaceTx) })
  const r2text = await r2.text()
  console.log(`Status: ${r2.status}, Result: ${r2text.slice(0, 300)}`)

  // Check where the doc is now
  const findAfter = await fetch(findUrl, { headers })
  const findAfterText = await findAfter.text()
  console.log(`\nDoc after space update: ${findAfterText.slice(0, 500)}`)

  // Also check via find in product space
  const productFind = `${httpEndpoint}/api/v1/find-all/${workspaceId}?class=document:class:Document&query=${encodeURIComponent(JSON.stringify({ space: PRODUCT_SPACE }))}`
  const pRes = await fetch(productFind, { headers })
  const pJson = await pRes.json()
  console.log(`\nDocs in Product space: ${(pJson as any).value?.length ?? pJson.length ?? 'unknown'}`)
}

main().catch((e) => {
  console.error('Error:', e)
  process.exit(1)
})
