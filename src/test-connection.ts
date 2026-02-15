import { HulyClient } from './huly-client.js'

async function testConnection() {
  const client = new HulyClient({
    url: process.env.HULY_URL || 'https://citadel.remi.casa',
    email: process.env.HULY_EMAIL || 'denis@goremi.co.uk',
    password: process.env.HULY_PASSWORD || '4RkrpCzGrwjwbnqfiD4BYce8CNxD',
    workspace: process.env.HULY_WORKSPACE || 'remi'
  })

  try {
    console.log('Connecting to Huly...')
    await client.connect()
    console.log('✅ Connected!')

    console.log('\nFetching projects...')
    const projects = await client.listProjects()
    console.log(`Found ${projects.length} projects:`)
    projects.forEach(p => {
      console.log(`  - ${p.identifier}: ${p.name}`)
    })

    console.log('\nFetching issues...')
    const issues = await client.listIssues()
    console.log(`Found ${issues.length} total issues`)

    if (projects.length > 0) {
      const firstProject = projects[0]
      const projectIssues = await client.listIssues({ projectId: firstProject._id })
      console.log(`Found ${projectIssues.length} issues in project ${firstProject.identifier}`)

      if (projectIssues.length > 0) {
        const issue = projectIssues[0]
        console.log(`\nFirst issue: ${issue.identifier} - ${issue.title}`)
      }
    }

    await client.disconnect()
    console.log('\n✅ Test completed successfully!')
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

testConnection()
