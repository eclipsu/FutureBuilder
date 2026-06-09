import 'reflect-metadata'
import { DataSource } from 'typeorm'
import bcrypt from 'bcryptjs'
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

import { User } from '../lib/db/entities/User'
import { Student } from '../lib/db/entities/Student'
import { Point } from '../lib/db/entities/Point'
import { Group } from '../lib/db/entities/Group'

const ds = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  synchronize: true,
  ssl: true,
  entities: [User, Student, Point, Group],
  logging: false,
})

async function main() {
  await ds.initialize()

  await ds.query('DELETE FROM points')
  await ds.query('DELETE FROM groups')
  await ds.query('DELETE FROM students')
  await ds.query('DELETE FROM users')

  const userRepo = ds.getRepository(User)

  const carlos  = userRepo.create({ name: 'Carlos Sterling', username: 'carlos',  password: await bcrypt.hash('carlos123',  12), role: 'Staff' })
  const kemmit  = userRepo.create({ name: 'Kemmit Spears',   username: 'kemmit',  password: await bcrypt.hash('kemmit123',  12), role: 'Staff' })
  const sylvia  = userRepo.create({ name: 'Sylvia Sullivan',  username: 'sylvia',  password: await bcrypt.hash('sylvia123',  12), role: 'Staff' })
  const emre    = userRepo.create({ name: 'Emre',             username: 'emre',    password: await bcrypt.hash('emre123',    12), role: 'Staff' })
  await userRepo.save([carlos, kemmit, sylvia, emre])

  const chapNikita     = userRepo.create({ name: 'Nikita Bhattarai',  username: 'nikita',     password: await bcrypt.hash('nikita123',     12), role: 'Chaperone' })
  const chapSparsha    = userRepo.create({ name: 'Sparsha KC',        username: 'sparsha',    password: await bcrypt.hash('sparsha123',    12), role: 'Chaperone' })
  const chapDeekshanta = userRepo.create({ name: 'Deekshanta Paudel', username: 'deekshanta', password: await bcrypt.hash('deekshanta123', 12), role: 'Chaperone' })
  const chapRajeev     = userRepo.create({ name: 'Rajeev Shrestha',   username: 'rajeev',     password: await bcrypt.hash('rajeev123',     12), role: 'Chaperone' })
  const chapSanskar    = userRepo.create({ name: 'Sanskar Lamsal',    username: 'sanskar',    password: await bcrypt.hash('sanskar123',    12), role: 'Chaperone' })
  await userRepo.save([chapNikita, chapSparsha, chapDeekshanta, chapRajeev, chapSanskar])

  const studentRepo = ds.getRepository(Student)
  const students = studentRepo.create([
    { name: 'Kimora Johnson',            gender: 'F', room_id: 504 },
    { name: 'Chloe Gassaway',            gender: 'F', room_id: 504 },
    { name: 'Cyeja South',               gender: 'F', room_id: 506 },
    { name: 'Baleigh Duncan',            gender: 'F', room_id: 506 },
    { name: 'Cieonna Sutton',            gender: 'F', room_id: 508 },
    { name: 'Xiomara Payton',            gender: 'F', room_id: 508 },
    { name: 'Taylor Gray',               gender: 'F', room_id: 510 },
    { name: 'Raimee Rosamond',           gender: 'F', room_id: 510 },
    { name: 'Amelia Stewart',            gender: 'F', room_id: 512 },
    { name: 'Hayleigh Coleman',          gender: 'F', room_id: 512 },
    { name: 'Rebeca Bautista-Henrandez', gender: 'F', room_id: 514 },
    { name: 'Ana Pascual-Pedro',         gender: 'F', room_id: 514 },
    { name: 'Reilly Bayley',             gender: 'F', room_id: 516 },
    { name: 'Zoey Venable',              gender: 'F', room_id: 516 },
    { name: 'Heath Allen Niemet',        gender: 'M', room_id: 402 },
    { name: 'Isaiah Newsome II',         gender: 'M', room_id: 404 },
    { name: 'Parker Woodard',            gender: 'M', room_id: 406 },
    { name: "Za'Kory Taylor",            gender: 'M', room_id: 406 },
    { name: 'Christopher Sanchez',       gender: 'M', room_id: 408 },
    { name: 'Marco De La Cruz',          gender: 'M', room_id: 408 },
    { name: 'Bayley Cole',               gender: 'M', room_id: 410 },
    { name: 'Wylie Leggett',             gender: 'M', room_id: 410 },
    { name: 'Jesse Skinner',             gender: 'M', room_id: 412 },
    { name: 'Maximus Bondurant',         gender: 'M', room_id: 412 },
    { name: 'Sam Guidry',                gender: 'M', room_id: 414 },
    { name: 'Mateo Arellano',            gender: 'M', room_id: 414 },
    { name: 'Hunter Dixon',              gender: 'M', room_id: 416 },
    { name: 'Spencer Smith',             gender: 'M', room_id: 416 },
    { name: 'Owen Sims',                 gender: 'M', room_id: 418 },
    { name: 'Caleb Amaya-Embrey',        gender: 'M', room_id: 418 },
    { name: 'Hugh Addison',              gender: 'M', room_id: 422 },
    { name: 'Jacob Hinton',              gender: 'M', room_id: 422 },
    { name: 'Charles CJ Bingham',        gender: 'M', room_id: 424 },
    { name: 'Josh Hinton',               gender: 'M', room_id: 424 },
  ])
  await studentRepo.save(students)

  const groupRepo = ds.getRepository(Group)
  const groups: Array<{ user_id: number; student_id: number }> = []

  const roomMap: Record<number, number> = {
    504: chapNikita.id,     506: chapNikita.id,
    508: chapNikita.id,     510: chapNikita.id,
    512: chapSparsha.id,    514: chapSparsha.id,    516: chapSparsha.id,
    402: chapDeekshanta.id, 404: chapDeekshanta.id,
    406: chapDeekshanta.id, 408: chapDeekshanta.id,
    410: chapRajeev.id,     412: chapRajeev.id,
    414: chapRajeev.id,     416: chapRajeev.id,
    418: chapSanskar.id,    422: chapSanskar.id,    424: chapSanskar.id,
  }

  for (const s of students) {
    if (roomMap[s.room_id]) groups.push({ user_id: roomMap[s.room_id], student_id: s.id })
  }
  await groupRepo.save(groupRepo.create(groups))

  const pointRepo = ds.getRepository(Point)
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)


  console.log('✓ Seed complete — Future Builders Camp')
  console.log('\nStaff:      carlos / carlos123')
  console.log('            kemmit / kemmit123')
  console.log('            sylvia / sylvia123')
  console.log('            emre   / emre123')
  console.log('\nChaperones: nikita     / nikita123')
  console.log('            sparsha    / sparsha123')
  console.log('            deekshanta / deekshanta123')
  console.log('            rajeev     / rajeev123')
  console.log('            sanskar    / sanskar123')

  await ds.destroy()
}

main().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})