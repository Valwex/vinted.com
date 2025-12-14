'use client'

import { useContext, useEffect } from 'react'

import BrazeContext from '../containers/BrazeProvider/BrazeContext'

function useBrazeControlCardImpressionLogging(ids: ReadonlyArray<string>) {
  const { logCardImpression } = useContext(BrazeContext)

  useEffect(() => {
    ids.forEach(id => logCardImpression(id))

    // we should not log an impression if the parent component decides to update
    // the reference of `ids`. So this small "hack" will ensure that we are protected
    // from random re-renders.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(ids)])
}

export default useBrazeControlCardImpressionLogging
