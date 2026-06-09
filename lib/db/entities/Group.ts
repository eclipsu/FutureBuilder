import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity('groups')
export class Group {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  user_id: number

  @Column()
  student_id: number
}
