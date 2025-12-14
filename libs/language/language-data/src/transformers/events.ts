type ChangeLanguageEventArgs = {
  fromLanguage: string | null
  toLanguage: string
  screen: string
}

type ChangeLanguageEventExtra = {
  from_language: string | null
  to_language: string
  screen: string
}

export const changeLanguageEvent = (args: ChangeLanguageEventArgs) => {
  const extra: ChangeLanguageEventExtra = {
    from_language: args.fromLanguage,
    to_language: args.toLanguage,
    screen: args.screen,
  }

  return {
    event: 'user.change_language',
    extra,
  }
}
