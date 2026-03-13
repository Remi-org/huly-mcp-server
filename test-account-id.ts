import { connect, NodeWebSocketFactory } from '@hcengineering/api-client'

async function main() {
  const url = process.env.HULY_URL!
  const client = await connect(url, {
    email: process.env.HULY_EMAIL!,
    password: process.env.HULY_PASSWORD!,
    workspace: process.env.HULY_WORKSPACE!,
    socketFactory: NodeWebSocketFactory,
    connectionTimeout: 30000,
  })
  const account = client.getAccount()
  console.log('ACCOUNT:', JSON.stringify(account, null, 2))

  // Try to access internal connection
  const conn = (client as any).connection
  if (conn) {
    console.log('Connection account:', conn.account)
  }

  await client.close()
}

main().catch(e => {
  console.error('ERROR:', e.message)
  process.exit(1)
})
