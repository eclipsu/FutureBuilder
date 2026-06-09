import { getDataSource } from '../data-source'

export interface StudentRow {
  id: number
  name: string
  gender: 'M' | 'F'
  room_id: number | null
  chaperone: string
}

const BASE_QUERY = `
  SELECT s.id, s.name, s.gender, s.room_id, u.name AS chaperone
  FROM students s
  INNER JOIN groups g ON g.student_id = s.id
  INNER JOIN users u ON u.id = g.user_id AND u.role = 'Chaperone'
`

export async function getStudentsForTab(tab: string): Promise<StudentRow[]> {
  const ds = await getDataSource()

  if (tab === 'girls') {
    return ds.query(
      `${BASE_QUERY} WHERE s.gender = 'F' ORDER BY u.name, s.room_id, s.name`
    )
  }

  if (tab === 'boys') {
    return ds.query(
      `${BASE_QUERY} WHERE s.gender = 'M' ORDER BY u.name, s.room_id, s.name`
    )
  }

  if (tab.startsWith('chaperone_')) {
    const chapId = parseInt(tab.replace('chaperone_', ''), 10)
    return ds.query(
      `${BASE_QUERY} WHERE u.id = $1 ORDER BY s.room_id, s.name`,
      [chapId]
    )
  }

  return ds.query(`${BASE_QUERY} ORDER BY u.name, s.room_id, s.name`)
}
