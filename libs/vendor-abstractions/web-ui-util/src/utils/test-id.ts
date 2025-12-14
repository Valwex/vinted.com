// TODO export this util from web-ui
export const getTestId = (testId: string | undefined, suffix: string) => {
  if (!testId) return undefined
  if (!suffix) return testId

  return testId.concat(`--${suffix}`)
}
