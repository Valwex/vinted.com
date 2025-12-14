// TODO export this constant from web-ui
export const idFromName = (name: string) => name.replace(/\]/g, '').replace(/[^-a-zA-Z0-9:.]/g, '_')
