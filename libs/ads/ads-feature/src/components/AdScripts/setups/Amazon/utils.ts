// TODO: add unit tests

import { noop } from 'lodash'

import { APSTAG_PUB_ID } from '../../../../constants'

export function pushToAmazonQueue(name, args) {
  // eslint-disable-next-line no-underscore-dangle
  window.apstag._Q.push([name, args])
}

export function setupAmazonPublisherAudienceServiceScript() {
  window.apstag = {
    ...window.apstag,
    dpa(...rest) {
      pushToAmazonQueue('di', rest)
    },
    rpa(...rest) {
      pushToAmazonQueue('ri', rest)
    },
    upa(...rest) {
      pushToAmazonQueue('ui', rest)
    },
  }
}

export function setupApsServiceScript(isAmazonPublisherAudienceEnabled: boolean) {
  if (window.apstag) return

  window.apstag = {
    init(...rest) {
      pushToAmazonQueue('i', rest)
    },
    fetchBids(...rest) {
      pushToAmazonQueue('f', rest)
    },
    targetingKeys() {
      return []
    },
    setDisplayBids() {
      noop()
    },
    _Q: [],
  }

  if (isAmazonPublisherAudienceEnabled) {
    setupAmazonPublisherAudienceServiceScript()
  }
}

export function initApsServices() {
  window.apstag.init({
    pubID: APSTAG_PUB_ID,
    adServer: 'googletag',
    deals: true,
  })
}
