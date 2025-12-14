export const initAppleId = (clientId: string) => {
  window.AppleID.auth.init({
    clientId,
    scope: 'name email',
    redirectURI: window.location.origin,
    state: 'init',
    usePopup: true,
  })
}
