export function renameFileValidations(name: string): string | null {
  if (!name) {
    return 'Name is required'
  }
  if (name.length > 255) {
    return 'Name must be less than 255 characters'
  }
  if (name.match(/"|\.\.|\//)) {
    return 'Invalid name'
  } else {
    return null
  }
}
