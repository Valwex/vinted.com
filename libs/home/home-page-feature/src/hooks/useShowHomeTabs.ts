import { useBreakpoint } from '@marketplace-web/breakpoints/breakpoints-feature'

const useShowHomeTabs = () => Boolean(useBreakpoint().portables)

export default useShowHomeTabs
