// modified version of lodash 'snakeCase' function
// - doesn't change dots with underscores
// - doesn't add underscores before numbers
export const snakeCase = (field: string) =>
  field
    .replace(/[^A-Za-z0-9.]/g, '_')
    .replace(/(\d+(?=[A-Za-z])|[a-z](?=[A-Z])|[A-Z]+(?=[A-Z][a-z]))/g, '$1_')
    .replace(/__+/g, '_')
    .replace(/(^_|_$)/g, '')
    .toLowerCase()
