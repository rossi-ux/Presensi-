import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { useTheme } from '../context/ThemeContext'
import { getChartColors } from '../utils/chartTheme'

export default function TrendChart({ data }) {
  const { theme } = useTheme()
  const c = getChartColors(theme)
    if (!data || data.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
        <h3 className="mb-4 font-semibold text-slate-700 dark:text-slate-200">
          Tren Kehadiran Murid per Hari
        </h3>
        <p className="py-16 text-center text-sm text-slate-500 dark:text-slate-400">
          Belum ada data untuk ditampilkan.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
      <h3 className="mb-4 font-semibold text-slate-700 dark:text-slate-200">
        Tren Kehadiran Murid per Hari
      </h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={c.grid} />
            <XAxis dataKey="label" tick={{ fill: c.text, fontSize: 12 }} stroke={c.grid} />
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
              formatter={(v) => [`${v}%`, 'Kehadiran']}
            />
            <Area
              type="monotone"
              dataKey="percent"
              stroke="#6366f1"
              strokeWidth={2}
              fill="#6366f1"
              fillOpacity={0.15}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}