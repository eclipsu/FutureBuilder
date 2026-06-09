import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column({ unique: true })
  username: string

  @Column()
  password: string

  @Column({ type: 'enum', enum: ['Chaperone', 'Staff'] })
  role: 'Chaperone' | 'Staff'
}
