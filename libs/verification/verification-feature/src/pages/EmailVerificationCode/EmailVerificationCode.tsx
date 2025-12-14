import { DataDomeProvider } from '@marketplace-web/bot-detection/data-dome-feature'

import EmailVerificationCodeProvider from './EmailVerificationCodeProvider'
import Content from './Content'

const EmailVerificationCode = () => (
  <DataDomeProvider>
    <EmailVerificationCodeProvider>
      <Content />
    </EmailVerificationCodeProvider>
  </DataDomeProvider>
)

export default EmailVerificationCode
