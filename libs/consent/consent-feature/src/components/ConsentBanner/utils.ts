import { Hostname } from '@marketplace-web/vinted-context/construct-headers-util'
import { isInternalHostname, normalizeHost } from '@marketplace-web/browser/url-util'

import { OneTrust } from '../../types/one-trust'
import { consentKeyByHostname } from '../../constants'

export function getConsentKey(hostname: string) {
  const normalizedHostname = normalizeHost(hostname)

  if (isInternalHostname(normalizedHostname)) return consentKeyByHostname[normalizedHostname]

  return consentKeyByHostname[Hostname.FrSandbox]
}

export function initOneTrust(isUserPresent: boolean, anonId?: string) {
  // TODO: Add unit tests
  if (isUserPresent || !anonId || !!window.OneTrust) return

  window.OneTrust = { dataSubjectParams: { id: anonId, isAnonymous: true } } as OneTrust
}

function hideConsentBanner() {
  const consentBanner = document.getElementById('onetrust-consent-sdk')

  if (consentBanner) {
    consentBanner.style.display = 'none'
  }
}

function overridePolicyLink() {
  const policyLink = document.querySelector('#onetrust-policy-text > a')

  if (policyLink && policyLink instanceof HTMLAnchorElement) {
    policyLink.href = `//${window.location.hostname}/cookie-policy`
  }
}

function sendConsentReceipt(dataSubjectId) {
  if (!window.OneTrust) throw new Error('OneTrust is not initialized')

  window.OneTrust.setDataSubjectId(dataSubjectId)

  const consentReceiptData = window.OneTrust.GetDomainData().ConsentIntegrationData
  consentReceiptData.consentPayload.identifier = dataSubjectId
  consentReceiptData.consentPayload.isAnonymous = false

  const beacon = new XMLHttpRequest()
  beacon.open('POST', consentReceiptData.consentApi, true)
  beacon.setRequestHeader('Content-Type', 'application/json')
  beacon.send(JSON.stringify(consentReceiptData.consentPayload))
}

function getCookie(name) {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)

  if (parts.length >= 2) return parts.pop()?.split(';').shift()

  return undefined
}

/*
 * This adds last consent id and last consent
 * date to the cookie preference center
 *
 * Script provided by OneTrust
 */
function onBannerLoaded() {
  if (typeof window.Optanon?.getDataSubjectId !== 'function') return

  const consentId = window.Optanon.getDataSubjectId()
  const preferenceCenterDescription = document.getElementById('ot-pc-desc')
  const consentIdExists = preferenceCenterDescription?.innerHTML.indexOf(consentId) !== -1
  const cookieOptanonAlertBoxClosedDate = getCookie('OptanonAlertBoxClosed')

  if (consentIdExists) {
    window.removeEventListener('bannerLoaded', onBannerLoaded, false)

    return
  }

  if (!cookieOptanonAlertBoxClosedDate) return

  const lastConsentTime = new Date(cookieOptanonAlertBoxClosedDate)
  let consentIdTitle = ''
  let consentDateTitle = ''

  switch (document.documentElement.lang) {
    case 'es':
      consentIdTitle = 'ID de su consentimiento'
      consentDateTitle = 'Fecha del consentimiento'
      break
    case 'fr':
      consentIdTitle = 'Identifiant du consentement'
      consentDateTitle = 'Date du consentement'
      break
    default:
      consentIdTitle = 'Consent ID'
      consentDateTitle = 'Consent Date'
      break
  }

  preferenceCenterDescription.innerHTML +=
    '</br></br>' +
    `<b>${consentIdTitle}: </b>${consentId}</br>` +
    `<b>${consentDateTitle}: </b>${lastConsentTime.toString()}`
}

export function initConsentBanner(configs) {
  const { userId } = configs

  const { hideConsent } = configs

  window.OptanonWrapper = function wrap() {
    if (hideConsent) hideConsentBanner()

    /*
     * This event will be used in 'pc_consent_info' partial,
     * as well as in `useIsConsentGroupEnabled` to update
     * consent values when they are changed
     */
    window.dispatchEvent(new Event('bannerLoaded'))

    overridePolicyLink()

    if (userId) {
      const consentId = window.OneTrust?.getDataSubjectId()

      if (getCookie('OptanonAlertBoxClosed') && consentId !== userId) {
        sendConsentReceipt(userId)
      }
    }
  }

  window.addEventListener('bannerLoaded', onBannerLoaded)
}
