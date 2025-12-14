'use client'

import { noop } from 'lodash'
import { ReactNode, createContext, useCallback, useMemo, useState } from 'react'

import { isResponseError } from '@marketplace-web/core-api/api-client-util'

import { AuthenticityContextType } from '../types/context'
import { ItemAuthenticityModalModel } from '../types/authenticity'
import { getItemAuthenticityModal } from '../api'
import { transformItemAuthenticityModalDto } from '../transformers/authenticity'
import { useAttributesContext } from './AttributesContext'

export const AuthenticityContext = createContext<AuthenticityContextType>({
  isAuthenticityModalOpen: false,
  openAuthenticityModal: noop,
  closeAuthenticityModal: noop,
  authenticityModalContent: null,
  setAuthenticityModalContent: noop,
  requestItemAuthenticityModal: noop,
})

export const AuthenticityContextProvider = ({ children }: { children: ReactNode }) => {
  const {
    attributes: { catalogId, id: itemId },
  } = useAttributesContext()
  const [isAuthenticityModalOpen, setIsAuthenticityModalOpen] = useState(false)
  const [authenticityModalContent, setAuthenticityModalContent] =
    useState<ItemAuthenticityModalModel | null>(null)

  const openAuthenticityModal = useCallback(() => setIsAuthenticityModalOpen(true), [])
  const closeAuthenticityModal = useCallback(() => setIsAuthenticityModalOpen(false), [])

  const requestItemAuthenticityModal = useCallback(
    async ({
      force,
      modalDataOnly,
      newCatalogId,
    }: {
      force?: boolean
      modalDataOnly?: boolean
      newCatalogId?: number | null
    }) => {
      const response = await getItemAuthenticityModal({
        catalogId: newCatalogId || catalogId,
        itemId,
        force,
        modalDataOnly,
      })

      if (isResponseError(response) || !response.authenticity_modal) return

      const model = transformItemAuthenticityModalDto(response.authenticity_modal)
      setAuthenticityModalContent(model)

      if (modalDataOnly) return

      openAuthenticityModal()
    },
    [catalogId, itemId, openAuthenticityModal],
  )

  const providerValue = useMemo(
    () => ({
      isAuthenticityModalOpen,
      openAuthenticityModal,
      closeAuthenticityModal,
      authenticityModalContent,
      setAuthenticityModalContent,
      requestItemAuthenticityModal,
    }),
    [
      isAuthenticityModalOpen,
      openAuthenticityModal,
      closeAuthenticityModal,
      authenticityModalContent,
      setAuthenticityModalContent,
      requestItemAuthenticityModal,
    ],
  )

  return (
    <AuthenticityContext.Provider value={providerValue}>{children}</AuthenticityContext.Provider>
  )
}
