import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getRepositories } from '@/lib/db/data-source'
import { MoreThanOrEqual } from 'typeorm'

export async function GET() {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { points: pointRepo } = await getRepositories()

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const count = await pointRepo.count({
    where: {
      points_by_id: parseInt(session.user.id, 10),
      created_at: MoreThanOrEqual(today),
    },
  })

  return NextResponse.json({ remaining: Math.max(0, 3 - count) })
}
