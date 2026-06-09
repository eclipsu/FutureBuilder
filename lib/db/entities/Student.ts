import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity('students')
export class Student {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column({ type: 'enum', enum: ['M', 'F'] })
  gender: 'M' | 'F'

  @Column({ nullable: true })
  room_id: number
}
