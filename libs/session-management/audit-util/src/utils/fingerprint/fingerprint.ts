import Fingerprint2 from 'fingerprintjs2'

const getFingerprint = async () => {
  const options = {
    excludes: {
      hasLiedOs: true,
      hasLiedBrowser: true,
      sessionStorage: true,
      hasLiedLanguages: true,
      fontsFlash: true,
      enumerateDevices: true,
    },
  }

  const components = await Fingerprint2.getPromise(options)

  return Fingerprint2.x64hash128(components.map(({ value }) => value).join(''), 0)
}

export { getFingerprint }
