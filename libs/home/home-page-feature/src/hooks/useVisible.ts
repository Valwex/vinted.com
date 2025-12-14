import { useInView } from 'react-intersection-observer'

const useVisible = (onVisible: () => void) => {
  const { ref } = useInView({
    onChange: inView => {
      if (inView) onVisible()
    },
  })

  return ref
}

export default useVisible
