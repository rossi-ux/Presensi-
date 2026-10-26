import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { useTheme } from '../context/ThemeContext'
import { getChartColors } from '../utils/chartTheme'

export default function ClassBarChart({ data }) {
  const { theme } = useTheme()
  const c = getChartColors(theme)

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
      <h3 className="mb-4 font-semibold text-slate-700 dark:text-slate-200">
        Perbandingan Kehadiran Antar Kelas
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={c.grid} />
            <XAxis dataKey="name" tick={{ fill: c.text, fontSize: 12 }} stroke={c.grid} />
            <YAxis
              domain={[0, 100]}
              tickFormatter={(v) => `${v}%`}
              tick={{ fill: c.text, fontSize: 12 }}
              stroke={c.grid}
            />
            <Tooltip
              contentStyle={c.tooltipStyle}
              itemStyle={{ color: c.text }}
              labelStyle={{ color: c.text }}
              cursor={{ fill: 'rgba(99,102,241,0.08)' }}
              formatter={(v) => [`${v}%`, 'Kehadiran']}
            />
            <Bar dataKey="percent" fill="#6366f1" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}