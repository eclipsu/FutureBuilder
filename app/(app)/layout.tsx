import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { getRepositories } from '@/lib/db/data-source'
import TopNav from '@/components/TopNav'
import TabStripWrapper from '@/components/TabStripWrapper'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session?.user) redirect('/login')

  // Fetch chaperones for tab strip
  const { users } = await getRepositories()
  const chaperones = await users.find({
    where: { role: 'Chaperone' },
    order: { name: 'ASC' },
  })

  const userName = session.user.name ?? session.user.email ?? 'User'

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg)' }}>
      <TopNav userName={userName} />
      <TabStripWrapper chaperones={chaperones.map((c) => ({ id: c.id, name: c.name }))} />
      <main style={{ paddingTop: 100 /* 60px nav + 40px tabs */ }}>
        {children}
      </main>
    </div>
  )
}
