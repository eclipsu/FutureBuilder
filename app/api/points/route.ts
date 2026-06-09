import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getRepositories } from '@/lib/db/data-source'
import { MoreThanOrEqual } from 'typeorm'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { student_id, points } = body

  if (!student_id || points === undefined) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const validPoints = [-5, -2, -1, 1, 2, 5]
  if (!validPoints.includes(points)) {
    return NextResponse.json({ error: 'Invalid point value' }, { status: 400 })
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

  if (count >= 3) {
    return NextResponse.json({ error: 'Daily limit reached', remaining: 0 }, { status: 403 })
  }

  const point = pointRepo.create({
    student_id,
    points,
    points_by_id: parseInt(session.user.id, 10),
  })
  await pointRepo.save(point)

  return NextResponse.json({ success: true, remaining: 3 - (count + 1) })
}
