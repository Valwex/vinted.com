type ZipCodeScreenViewEventArgs = {
  screen: string
}

type ZipCodeScreenViewEventExtra = {
  screen: string
}
export const zipCodeScreenViewEvent = (args: ZipCodeScreenViewEventArgs) => {
  const { screen } = args

  const extra: ZipCodeScreenViewEventExtra = {
    screen,
  }

  return {
    event: 'zip_collection.view',
    extra,
  }
}

type ZipCodeScreenClickEventArgs = {
  screen: string
  target: string
}

type ZipCodeScreenClickEventExtra = {
  screen: string
  target: string
}

export const zipCodeScreenClickEvent = (args: ZipCodeScreenClickEventArgs) => {
  const { screen, target } = args

  const extra: ZipCodeScreenClickEventExtra = {
    screen,
    target,
  }

  return {
    event: 'zip_collection.click',
    extra,
  }
}

type ZipCodeScreenSuccessEventArgs = {
  screen: string
  screenLocation?: string
}

type ZipCodeScreenSuccessEventExtra = {
  screen: string
  screen_location?: string
}

export const zipCodeScreenSuccessEvent = (args: ZipCodeScreenSuccessEventArgs) => {
  const { screen, screenLocation } = args

  const extra: ZipCodeScreenSuccessEventExtra = {
    screen,
  }

  if (screenLocation) extra.screen_location = screenLocation

  return {
    event: 'zip_collection.success',
    extra,
  }
}
