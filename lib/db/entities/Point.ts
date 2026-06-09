import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm'

@Entity('points')
export class Point {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  student_id: number

  @Column({ type: 'int' })
  points: number

  @Column()
  points_by_id: number

  @CreateDateColumn()
  created_at: Date
}
