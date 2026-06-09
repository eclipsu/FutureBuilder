'use client'

import { useEffect, useState } from 'react'
import StudentCard from './StudentCard'
import PointsSheet from './PointsSheet'

interface Student {
  id: number
  name: string
  gender: 'M' | 'F'
  roomId: number | null
  chaperone: string
  totalPoints: number
}

interface DashboardGridProps {
  initialStudents: Student[]
}

export default function DashboardGrid({ initialStudents }: DashboardGridProps) {
  const [students, setStudents] = useState<Student[]>(initialStudents)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)

  useEffect(() => {
    setStudents(initialStudents)
    setSelectedStudent(null)
  }, [initialStudents])

  function handlePointsAwarded(studentId: number, delta: number) {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === studentId ? { ...s, totalPoints: s.totalPoints + delta } : s
      )
    )
  }

  if (students.length === 0) {
    return (
      <div style={{
        padding: '64px 16px',
        textAlign: 'center',
        color: 'var(--color-text-muted)',
        fontSize: 14,
      }}>
        No students in this group
      </div>
    )
  }

  return (
    <>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 8,
        padding: '12px 16px 32px',
      }}>
        {students.map((student) => (
          <StudentCard
            key={student.id}
            id={student.id}
            name={student.name}
            roomId={student.roomId}
            chaperone={student.chaperone}
            showChaperone
            totalPoints={student.totalPoints}
            onClick={() => setSelectedStudent(student)}
          />
        ))}
      </div>

      {selectedStudent && (
        <PointsSheet
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
          onPointsAwarded={handlePointsAwarded}
        />
      )}
    </>
  )
}
