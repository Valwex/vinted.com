'use client'

import { useMemo, useState } from 'react'
import { useEventListener } from 'usehooks-ts'

import { DD_READY_EVENT } from '@marketplace-web/bot-detection/data-dome-util'

import { DataDomeContext } from './DataDomeContext'

type Props = {
  children: React.ReactNode
}

const DataDomeProvider = ({ children }: Props) => {
  const [isDataDomeScriptReady, setIsDataDomeScriptReady] = useState(false)

  useEventListener(DD_READY_EVENT, () => {
    setIsDataDomeScriptReady(true)
  })

  const contextValue = useMemo(
    () => ({
      isDataDomeScriptReady,
    }),
    [isDataDomeScriptReady],
  )

  return <DataDomeContext.Provider value={contextValue}>{children}</DataDomeContext.Provider>
}

export default DataDomeProvider
