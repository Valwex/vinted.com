import { KeyboardEvent } from 'react'

import { KeyboardKey } from '../constants/keyboard'
import { TagName } from '../constants/html'

type Options = {
  keys: string | Array<KeyboardKey>
}

// TODO export this util from web-ui
export const onA11yKeyDown = (event: KeyboardEvent, options: Options, callback?: () => void) => {
  const { keys } = options

  if (keys.includes(event.key as KeyboardKey)) {
    const { tagName } = <HTMLElement>event.target

    if (
      tagName !== TagName.Input &&
      tagName !== TagName.Textarea &&
      tagName !== TagName.Button &&
      tagName !== TagName.Anchor
    ) {
      event.preventDefault()
    }

    if (callback) return callback()

    return event.target.dispatchEvent(new Event('click', { bubbles: true }))
  }

  return false
}
