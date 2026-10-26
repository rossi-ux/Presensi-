import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { useTheme } from '../context/ThemeContext'
import { getChartColors } from '../utils/chartTheme'

const LABELS = { hadir: 'Hadir', izin: 'Izin', sakit: 'Sakit', alpa: 'Alpa' }
const COLORS = { hadir: '#10b981', izin: '#0ea5e9', sakit: '#f59e0b', alpa: '#ef4444' }

export default function StatusPieChart({ title, stats }) {
  const { theme } = useTheme()
  const c = getChartColors(theme)

  const data = Object.keys(LABELS).map((key) => ({
    key,
    name: LABELS[key],
    value: stats[key],
  }))
    if (stats.total === 0) {
    return (
      <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
        <h3 className="mb-2 font-semibold text-slate-700 dark:text-slate-200">{title}</h3>
        <p className="py-16 text-center text-sm text-slate-500 dark:text-slate-400">
          Belum ada data untuk ditampilkan.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
      <h3 className="mb-2 font-semibold text-slate-700 dark:text-slate-200">{title}</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={3}
              stroke="none"
            >
              {data.map((d) => (
                <Cell key={d.key} fill={COLORS[d.key]} />
              ))}
            </Pie>
            <Tooltip contentStyle={c.tooltipStyle} itemStyle={{ color: c.text }} />
            <Legend formatter={(value) => <span style={{ color: c.text }}>{value}</span>} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}