import { Loader as UiLoader } from '@vinted/web-ui'

type Props = {
  testId?: string
}

const Loader = ({ testId }: Props) => (
  <div data-testid={testId} className="c-input__icon">
    <UiLoader />
  </div>
)

export default Loader
