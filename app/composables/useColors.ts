export const useColors = () => {
  const colors = {
    UzuTBlack: '#0E2615',
    UzuTGreen: '#3FD246',
    primary: '#3FD246',
    secondary: '#BEC8DA',
    dark: '#0E2615',
    white: '#ffffff',
  }

  const getColor = (name: keyof typeof colors) => colors[name]
  const isLight = (name: keyof typeof colors) => {
    const hex = colors[name]
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
    return luminance > 0.5
  }

  return {
    colors,
    getColor,
    isLight,
  }
}
