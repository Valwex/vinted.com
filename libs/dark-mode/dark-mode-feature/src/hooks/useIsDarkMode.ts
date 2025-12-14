'use client'

import { useTheme } from '@vinted/web-ui'

const useIsDarkMode = () => useTheme().mode === 'dark'

export default useIsDarkMode
