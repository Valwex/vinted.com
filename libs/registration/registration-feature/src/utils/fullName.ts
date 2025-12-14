// backend uses same regexp
export const fullNameRegex =
  /^\s*[a-zA-Z\u00C0-\u1FFF\u2C00-\uD7FF\-.,'`‘’]+(\s+[a-zA-Z\u00C0-\u1FFF\u2C00-\uD7FF\-.,'`‘’]+)+\s*$/i

export const isFullNameValid = (fullName: string): boolean => fullNameRegex.test(fullName)
