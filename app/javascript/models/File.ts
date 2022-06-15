export interface File {
  id: string
  file_type: string
  name: string
  path: string
  size: BigInteger
  icon_url?: string
  public_share_url?: string
}
