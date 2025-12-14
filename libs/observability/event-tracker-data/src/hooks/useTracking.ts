import { useContext, useMemo } from 'react'

import TrackingContext from '../context/TrackingContext'

function useTracking() {
  const trackerProps = useContext(TrackingContext)

  if (!trackerProps) throw new Error('Missing tracking provider')

  return useMemo(() => ({ track: trackerProps.tracker.track }), [trackerProps.tracker.track])
}

export default useTracking
