import { ContentLoader } from '@marketplace-web/common-components/content-loader-ui'

const HomeLoader = () => {
  return (
    <ContentLoader size="large" styling={ContentLoader.Styling.Tight} testId="homepage-loader" />
  )
}

export default HomeLoader
