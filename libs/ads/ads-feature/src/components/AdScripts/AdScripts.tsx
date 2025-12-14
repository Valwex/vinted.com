'use client'

import { useFeatureSwitch } from '@marketplace-web/feature-flags/feature-switches-data'

import Google from './setups/Google'
import Pubstack from './setups/Pubstack'
import Amazon from './setups/Amazon'
import Prebid from './setups/Prebid'
import Yieldbird from './setups/Yieldbird'
import Confiant from './setups/Confiant'

const AdScripts = () => {
  const isYieldBirdScriptEnabled = useFeatureSwitch('web_ads_yieldbird_script')
  const isProgrammaticAdsEnabled = useFeatureSwitch('web_ads_programmatic')

  return (
    isProgrammaticAdsEnabled && (
      <>
        <Google />
        <Pubstack />
        <Amazon />
        <Prebid />
        {isYieldBirdScriptEnabled && <Yieldbird />}
        <Confiant />
      </>
    )
  )
}

export default AdScripts
