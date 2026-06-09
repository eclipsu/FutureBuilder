import { getStudentsForTab } from '@/lib/db/queries/students'
import HeadcountGrid from '@/components/HeadcountGrid'

interface PageProps {
  searchParams: Promise<{ tab?: string }>
}

export default async function HeadcountPage({ searchParams }: PageProps) {
  const params = await searchParams
  const tab = params.tab ?? 'all'
  const students = await getStudentsForTab(tab)

  const mapped = students.map((s) => ({
    id: s.id,
    name: s.name,
    gender: s.gender,
    roomId: s.room_id,
    chaperone: s.chaperone,
    totalPoints: 0,
  }))

  return <HeadcountGrid key={tab} students={mapped} />
}
