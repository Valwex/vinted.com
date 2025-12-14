import { useContext } from 'react'

import { FeatureSwitchesContext } from '../components/FeatureSwitchesProvider'

const useFeatureSwitch = (feature: string): boolean => {
  const featureSwitches = useContext(FeatureSwitchesContext)

  if (!featureSwitches) throw new Error('featureSwitches context is not set')

  return !!featureSwitches[feature]
}

export default useFeatureSwitch
