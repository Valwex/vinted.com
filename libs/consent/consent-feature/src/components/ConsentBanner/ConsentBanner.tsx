'use client'

import Script from 'next/script'
import { useEffect, useState } from 'react'

import { logError } from '@marketplace-web/observability/logging-util'

import { getConsentKey, initConsentBanner, initOneTrust } from './utils'
import { isStringTruthy } from '../../utils'

function initCookieListModifications() {
  // Define target node that will be filled
  // by OneTrust eventually with the cookie list
  const targetNode = document.getElementById('ot-sdk-cookie-policy')

  // Don't do anything if the targetNode is not found
  if (!targetNode) return

  // We had to recognise the first-party this way because the list that comes from OneTrust
  // is already translated internally and we don't have any control over it
  const firstPartyNames = [
    'First Party', // EN
    'Pirmoji šalis', // LT
    'Vlastní', // CZ
    'Oprindelig hjemmeside', // DA
    'Erstanbieter', // DE
    'Πρώτο Μέρος', // EL
    'Propia', // ES
    'Esimene osapool', // ET
    'Ensimmäinen osapuoli', // FI
    'Cookies internes', // FR
    'Prva stranka', // HL
    'Első fél', // HU
    'Prima parte', // IT
    'Pirmā ballīte', // LV
    'Direct', // NL
    'Próprio', // PT
    'Pierwsza strona', // PL
    'Primare', // RO
    'Prvá strana', // SK
    'Prva stranka', // SL
    '1:a part', // SV
  ]

  const observer = new MutationObserver(() => {
    // Disconnect the observer after the first mutation
    observer.disconnect()

    // Find the first table in the targetNode
    // Which will always be Strictly Necessary
    // Cookies table
    const tables = targetNode.querySelectorAll('table')

    // If there's no table, do nothing
    if (!tables || tables.length === 0) return

    tables.forEach(table => {
      // Replace all links in with their innerHTML
      table.querySelectorAll('a').forEach(link => link.replaceWith(link.innerHTML))

      // Remove any other cookies than 'First Party'
      const tbody = table.querySelector('tbody')!
      const rows = tbody.querySelectorAll('tr')

      rows.forEach(row => {
        const fourthCell = row.cells[3]
        if (!fourthCell) return

        const span = fourthCell.querySelector('span.ot-cookies-type-td-content')

        if (span) {
          const cookieType = span.innerHTML
          if (!firstPartyNames.includes(cookieType)) {
            row.remove()
          }
        }
      })
    })
  })

  observer.observe(targetNode, { childList: true })
}

function getHideConsent() {
  const { searchParams } = new URL(document.location.href)

  return isStringTruthy(searchParams.get('hide_consent'))
}

type Props = {
  host: string
  anonId?: string
  isWebview?: boolean
  userId?: string
}

// TODO: Add unit tests for this component
const ConsentBanner = ({ host, anonId, isWebview, userId }: Props) => {
  const [show, setShow] = useState(true)

  useEffect(() => {
    try {
      // TODO: After websplit, move it all to `./utils`
      initConsentBanner?.({ userId, hideConsent: getHideConsent() })
    } catch (error) {
      logError(error)
    }
  }, [userId])

  useEffect(() => {
    initOneTrust(!!userId, anonId)
    initCookieListModifications()
  }, [userId, anonId])

  useEffect(() => {
    // profile page with admin functionality renders main content in an iframe
    // which сauses the consent banner to be rendered twice
    setShow(!window.frameElement)
  }, [show])

  if (!show || isWebview) return null

  return (
    <>
      {/* TODO: Separate into separate components */}
      <Script
        strategy="beforeInteractive"
        data-testid="tcfapi-stub"
        src="https://cdn.cookielaw.org/consent/tcf.stub.js"
      />
      <Script
        strategy="beforeInteractive"
        data-testid="ot-sdk-stub"
        data-document-language="true"
        data-domain-script={getConsentKey(host)}
        src="https://cdn.cookielaw.org/scripttemplates/otSDKStub.js"
      />
    </>
  )
}

export default ConsentBanner
