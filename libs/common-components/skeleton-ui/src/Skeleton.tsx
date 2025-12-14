import Skeleton from 'react-loading-skeleton'

const COLOR_GREYSCALE_LEVEL_5 = '#e1e6e6'
const BORDER_RADIUS_DEFAULT = 6

const SkeletonWrapper = (props: React.ComponentProps<typeof Skeleton>) => (
  <Skeleton
    baseColor={COLOR_GREYSCALE_LEVEL_5}
    borderRadius={BORDER_RADIUS_DEFAULT}
    enableAnimation
    {...props}
  />
)

export default SkeletonWrapper
