export function getChartColors(theme) {
  const isDark = theme === 'dark'
  const grid = isDark ? '#334155' : '#e2e8f0'
  const text = isDark ? '#cbd5e1' : '#475569'

  return {
    grid,
    text,
    tooltipStyle: {
      backgroundColor: isDark ? '#1e293b' : '#ffffff',
      border: `1px solid ${grid}`,
      borderRadius: 8,
      color: text,
    },
  }
}