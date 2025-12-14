export const getBidderTimeoutTargeting = (abTestVariant: string) => {
  if (abTestVariant === 'a') return 'bidder_timeout_2000'
  if (abTestVariant === 'b') return 'bidder_timeout_1000'

  return 'bidder_timeout_off'
}
