export function truncateText(text: string, maxLength: number): String {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + '...'
  }
  return text
}