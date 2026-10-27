import { formatDateWithDay } from '../utils/dates'

const STATUS = {
  hadir: { label: 'Hadir', badge: 'bg-emerald-100 text-emerald-700', bar: 'bg-emerald-500' },
  izin: { label: 'Izin', badge: 'bg-sky-100 text-sky-700', bar: 'bg-sky-500' },
  sakit: { label: 'Sakit', badge: 'bg-amber-100 text-amber-700', bar: 'bg-amber-500' },
  alpa: { label: 'Alpa', badge: 'bg-red-100 text-red-700', bar: 'bg-red-500' },
}
const ORDER = ['hadir', 'izin', 'sakit', 'alpa']

function percentColor(p) {
  if (p >= 85) return 'text-emerald-600'
  if (p >= 70) return 'text-amber-600'
  return 'text-red-600'
}

function Info({ label, value }) {
  return (
    <div className="flex gap-2">
      <span className="w-20 shrink-0 text-slate-500">{label}</span>
      <span className="font-semibold">: {value}</span>
    </div>
  )
}

export default function PrintReport({ report }) {
  const { stats, percent, rows, perStudent, isStudents } = report
  const share = (n) => (stats.total ? (n / stats.total) * 100 : 0)

  const th = 'px-3 py-2 text-left font-semibold'
  const thCenter = 'px-3 py-2 text-center font-semibold'
  const td = 'px-3 py-1.5'
  const tdCenter = 'px-3 py-1.5 text-center'

  const cards = [
    { label: 'Total Catatan', value: stats.total, style: 'bg-slate-100 text-slate-700' },
    ...ORDER.map((key) => ({
      label: STATUS[key].label,
      value: stats[key],
      style: STATUS[key].badge,
    })),
    { label: 'Kehadiran', value: `${percent}%`, style: 'bg-indigo-100 text-indigo-700' },
  ]

  return (
    <div className="hidden bg-white text-[11px] leading-snug text-slate-800 print:block">
      {/* Kop laporan */}
      <header className="flex items-start justify-between rounded-xl bg-gradient-to-r from-indigo-600 to-sky-500 px-6 py-5 text-white">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-indigo-100">
            📋 Instructor Attendance
          </p>
          <h1 className="mt-1 text-2xl font-bold">{report.title}</h1>
          <p className="mt-1 text-sm text-indigo-100">Periode: {report.period}</p>
        </div>
        <div className="text-right text-xs text-indigo-100">
          <p>Dicetak pada</p>
          <p className="font-semibold text-white">{report.generatedAt}</p>
        </div>
      </header>

      {/* Info filter */}
      <section className="mt-4 grid grid-cols-2 gap-x-6 gap-y-1 rounded-xl border border-slate-200 bg-slate-50 px-5 py-3">
        <Info label="Instruktur" value={report.instructorName} />
        <Info label="Periode" value={report.period} />
        {isStudents && <Info label="Kelas" value={report.classLabel} />}
        {isStudents && <Info label="Murid" value={report.studentLabel} />}
        <Info label="Status" value={report.statusLabel} />
      </section>

      {/* Ringkasan */}
      <section className="mt-4 grid grid-cols-6 gap-2">
        {cards.map((c) => (
          <div key={c.label} className={`rounded-lg px-2 py-2.5 text-center ${c.style}`}>
            <p className="text-lg font-bold">{c.value}</p>
            <p className="text-[10px] font-medium">{c.label}</p>
          </div>
        ))}
      </section>

      {/* Persentase dan distribusi */}
      <section className="mt-3 flex items-center gap-5 rounded-xl border border-slate-200 px-5 py-3">
        <div className="text-center">
          <p className={`text-3xl font-bold ${percentColor(percent)}`}>{percent}%</p>
          <p className="text-[10px] text-slate-500">Tingkat kehadiran</p>
        </div>
        <div className="flex-1">
          <div className="flex h-3 w-full overflow-hidden rounded-full bg-slate-200">
            {ORDER.map((key) => (
              <div
                key={key}
                className={STATUS[key].bar}
                style={{ width: `${share(stats[key])}%` }}
              />
            ))}
          </div>
          <div className="mt-1.5 flex gap-4 text-[10px] text-slate-500">
            {ORDER.map((key) => (
              <span key={key} className="flex items-center gap-1">
                <span className={`inline-block h-2 w-2 rounded-full ${STATUS[key].bar}`} />
                {STATUS[key].label} {Math.round(share(stats[key]))}%
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Rekap per murid */}
      {isStudents && perStudent.length > 0 && (
        <section className="mt-5">
          <h2 className="mb-2 text-sm font-bold text-indigo-700">Rekap per Murid</h2>
          <table className="w-full border-collapse">
            <thead className="bg-indigo-600 text-white">
              <tr>
                <th className={th}>No</th>
                <th className={th}>Nama Murid</th>
                <th className={th}>Kelas</th>
                <th className={thCenter}>Hadir</th>
                <th className={thCenter}>Izin</th>
                <th className={thCenter}>Sakit</th>
                <th className={thCenter}>Alpa</th>
                <th className={thCenter}>Kehadiran</th>
              </tr>
            </thead>
            <tbody>
              {perStudent.map((s, i) => (
                <tr key={s.studentId} className="break-inside-avoid border-b border-slate-200 even:bg-slate-50">
                  <td className={td}>{i + 1}</td>
                  <td className={`${td} font-medium`}>{s.name}</td>
                  <td className={td}>{s.className}</td>
                  <td className={tdCenter}>{s.hadir}</td>
                  <td className={tdCenter}>{s.izin}</td>
                  <td className={tdCenter}>{s.sakit}</td>
                  <td className={tdCenter}>{s.alpa}</td>
                  <td className={`${tdCenter} font-bold ${percentColor(s.percent)}`}>
                    {s.percent}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {/* Rincian kehadiran */}
      <section className={`mt-5 ${isStudents ? 'break-before-page' : ''}`}>
        <h2 className="mb-2 text-sm font-bold text-indigo-700">Rincian Kehadiran</h2>
        <table className="w-full border-collapse">
          <thead className="bg-indigo-600 text-white">
            <tr>
              <th className={th}>No</th>
              <th className={th}>Tanggal</th>
              {isStudents && <th className={th}>Nama Murid</th>}
              {isStudents && <th className={th}>Kelas</th>}
              <th className={th}>Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr
                key={`${r.studentId ?? 'me'}-${r.date}`}
                className="break-inside-avoid border-b border-slate-200 even:bg-slate-50"
              >
                <td className={td}>{i + 1}</td>
                <td className={td}>{formatDateWithDay(r.date)}</td>
                {isStudents && <td className={`${td} font-medium`}>{r.studentName}</td>}
                {isStudents && <td className={td}>{r.className}</td>}
                <td className={td}>
                  <span
                    className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${STATUS[r.status].badge}`}
                  >
                    {STATUS[r.status].label}
                  </span>
                  {r.manual && <span className="ml-1.5 text-[10px] text-slate-400">Manual</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Tanda tangan */}
      <footer className="mt-8 flex break-inside-avoid items-end justify-between text-xs">
        <p className="max-w-xs text-[10px] text-slate-400">
          Dokumen ini dibuat otomatis oleh aplikasi Instructor Attendance.
        </p>
        <div className="w-52 text-center">
          <p>Mengetahui,</p>
          <p className="text-slate-500">Instruktur</p>
          <div className="h-16" />
          <p className="border-t border-slate-400 pt-1 font-semibold">{report.instructorName}</p>
        </div>
      </footer>
    </div>
  )
}