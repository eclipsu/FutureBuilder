import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { User } from './entities/User'
import { Student } from './entities/Student'
import { Point } from './entities/Point'
import { Group } from './entities/Group'
import { EntityTable } from './entity-names'

const isProduction = process.env.NODE_ENV === 'production'
const useSSL = process.env.DB_SSL === 'true'

declare global {
  // eslint-disable-next-line no-var
  var _typeormDataSource: DataSource | undefined
}

function createDataSource() {
  const url = process.env.DATABASE_URL
  if (!url) {
    throw new Error('DATABASE_URL is not set. Add it to .env.local before using the database.')
  }

  return new DataSource({
    type: 'postgres',
    url,
    synchronize: !isProduction,
    logging: !isProduction,
    entities: [User, Student, Point, Group],
    ssl: useSSL ? { rejectUnauthorized: false } : false,
  })
}

function getOrCreateDataSource(): DataSource {
  if (!global._typeormDataSource) {
    global._typeormDataSource = createDataSource()
  }
  return global._typeormDataSource
}

export async function getDataSource(): Promise<DataSource> {
  const ds = getOrCreateDataSource()
  if (!ds.isInitialized) {
    await ds.initialize()
  }
  return ds
}

/** Resolve repos by table name so minified class names in Next bundles cannot break metadata. */
export async function getRepositories() {
  const ds = await getDataSource()
  return {
    users: ds.getRepository<User>(EntityTable.User),
    students: ds.getRepository<Student>(EntityTable.Student),
    points: ds.getRepository<Point>(EntityTable.Point),
    groups: ds.getRepository<Group>(EntityTable.Group),
  }
}
