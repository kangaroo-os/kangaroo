export function addHttp(url: string): string {
  if (url.length > 0 && !url.match('^(http|https)') && 'https://'.split(url)[0] !== '') {
    let substring = 'http'.split(url)[1] ? 'http'.split(url)[1] : 'https://'
    url = url ? substring + url : ''
  }
  return url
}
