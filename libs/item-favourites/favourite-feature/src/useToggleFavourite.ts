'use client'

import { useEffect, useState } from 'react'
import { useIsMounted } from 'usehooks-ts'

import { useAuthModal } from '@marketplace-web/auth-flow/auth-modal-context-feature'
import { useSession } from '@marketplace-web/shared/session-data'
import { useDebounce } from '@marketplace-web/shared/ui-helpers'

import { toggleUserFavourite } from '@marketplace-web/item-favourites/favourite-data'

const TOGGLE_DEBOUNCE_DELAY = 250

type Props = {
  entityId: number
  isFavourite: boolean
  count?: number
}

const useToggleFavourite = ({
  entityId,
  isFavourite: initialIsFavourite,
  count: initialCount = 0,
}: Props) => {
  const isMounted = useIsMounted()
  const isLoggedIn = !!useSession().user
  const [isFavourite, setIsFavourite] = useState(initialIsFavourite)
  const favouriteCount = initialCount + Number(isFavourite) - Number(initialIsFavourite)
  const [hasFavouritedChanged, setHasFavouritedChanged] = useState(false)
  const { openAuthModal } = useAuthModal()

  useEffect(() => {
    setIsFavourite(initialIsFavourite)
  }, [initialIsFavourite])

  function signIn() {
    openAuthModal()
  }

  async function toggle(options?: { onSuccess?: (newValue: boolean) => void }) {
    const response = await toggleUserFavourite({ entityId })

    if ('errors' in response) return
    if (!isMounted()) return

    setIsFavourite(prevState => {
      const newState = !prevState

      // We pass `newState` instead of `isFavourite` because `isFavourite` can be outdated:
      // https://github.com/vinted/core/pull/80544#issuecomment-1742588674
      // TODO: Disable favouriting an item while the request is in progress.
      // Move this outside of `setIsFavourite` and use `isFavourite` instead of `newState`.
      options?.onSuccess?.(newState)

      return newState
    })

    setHasFavouritedChanged(true)
  }

  const debouncedToggle = useDebounce(toggle, TOGGLE_DEBOUNCE_DELAY)

  return {
    isFavourite,
    favouriteCount,
    toggleFavourite: isLoggedIn ? debouncedToggle : signIn,
    hasFavouritedChanged,
  }
}

export default useToggleFavourite
