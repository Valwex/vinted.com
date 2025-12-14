import { Cell, Loader } from '@vinted/web-ui'

type Props = {
  styling?: React.ComponentProps<typeof Cell>['styling']
  size?: React.ComponentProps<typeof Loader>['size']
  testId?: string
  theme?: React.ComponentProps<typeof Cell>['theme']
}

const ContentLoader = ({ styling, size, testId, theme }: Props) => (
  <Cell styling={styling} theme={theme}>
    <div className="u-flexbox u-justify-content-center" data-testid={testId}>
      <Loader size={size} />
    </div>
  </Cell>
)

ContentLoader.Styling = Cell.Styling
ContentLoader.Size = Loader.Size

export default ContentLoader
