const BASE_URL = 'https://dummyjson.com'
const MAX_STUDENTS = 15

// Satu fungsi pusat untuk semua request, supaya penanganan error seragam
async function fetchUsers(path) {
  let res
  try {
    res = await fetch(`${BASE_URL}${path}`)
  } catch {
    throw new Error('Tidak dapat terhubung ke server. Periksa koneksi internet Anda.')
  }

  if (!res.ok) throw new Error(`Gagal mengambil data dari server (kode ${res.status}).`)

  let data
  try {
    data = await res.json()
  } catch {
    throw new Error('Format data dari server tidak valid.')
  }

  if (!data || !Array.isArray(data.users)) {
    throw new Error('Format data dari server tidak valid.')
  }
  return data.users
}

// Ambil daftar instruktur (user dengan role "admin")
export async function getInstructors() {
  return fetchUsers('/users/filter?key=role&value=admin')
}

// Ambil daftar murid (user dengan role "user"); data yang rusak dibuang
export async function getStudents() {
  const users = await fetchUsers('/users/filter?key=role&value=user')

  return users
    .filter((u) => u && Number.isFinite(u.id) && u.firstName)
    .slice(0, MAX_STUDENTS)
    .map((u) => ({
      id: u.id,
      name: `${u.firstName} ${u.lastName ?? ''}`.trim(),
      email: u.email ?? '-',
      image: u.image ?? '',
    }))
}

// Login sederhana: cocokkan email + password dengan data instruktur
export async function loginInstructor(email, password) {
  const instructors = await getInstructors()

  const user = instructors.find(
    (u) =>
      u &&
      u.email &&
      u.email.toLowerCase() === email.trim().toLowerCase() &&
      u.password === password
  )

  if (!user) throw new Error('Email atau password salah')

  return {
    id: user.id,
    name: `${user.firstName} ${user.lastName ?? ''}`.trim(),
    email: user.email,
    image: user.image ?? '',
  }
}