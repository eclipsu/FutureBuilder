import { getDataSource } from '@/lib/db/data-source'
import { getStudentsForTab } from '@/lib/db/queries/students'
import DashboardGrid from '@/components/DashboardGrid'

interface PageProps {
  searchParams: Promise<{ tab?: string }>
}

async function getStudentsWithPoints(tab: string) {
  const ds = await getDataSource()
  const students = await getStudentsForTab(tab)

  const pointsRows = await ds.query(`
    SELECT student_id, COALESCE(SUM(points), 0)::int AS total
    FROM points
    GROUP BY student_id
  `)
  const pointsMap: Record<number, number> = {}
  for (const row of pointsRows) {
    pointsMap[row.student_id] = parseInt(row.total, 10)
  }

  return students.map((s) => ({
    id: s.id,
    name: s.name,
    gender: s.gender,
    roomId: s.room_id,
    chaperone: s.chaperone,
    totalPoints: pointsMap[s.id] ?? 0,
  }))
}

export default async function DashboardPage({ searchParams }: PageProps) {
  const params = await searchParams
  const tab = params.tab ?? 'all'
  const students = await getStudentsWithPoints(tab)

  return <DashboardGrid key={tab} initialStudents={students} />
}
