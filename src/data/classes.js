export const CLASSES = [
  { id: 'web-a', name: 'Web Development A', short: 'Web A', schedule: 'Senin & Rabu' },
  { id: 'uiux-b', name: 'UI/UX Design B', short: 'UI/UX B', schedule: 'Selasa & Kamis' },
  { id: 'data-c', name: 'Data Analysis C', short: 'Data C', schedule: 'Jumat' },
]

// Bagi murid ke kelas secara bergiliran (murid 1 -> kelas 1, murid 2 -> kelas 2, dst.)
export function assignClasses(students) {
  return students.map((s, i) => ({
    ...s,
    classId: CLASSES[i % CLASSES.length].id,
  }))
}

export function getClassName(classId) {
  return CLASSES.find((c) => c.id === classId)?.name ?? '-'
}