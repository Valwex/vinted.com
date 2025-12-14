'use client'

import {
  ComponentProps,
  ComponentType,
  AriaAttributes,
  AriaRole,
  useState,
  useEffect,
  useRef,
} from 'react'
import Lottie from 'react-lottie-player'
import classNames from 'classnames/bind'

import { getTestId } from '../../utils/testId'

import Image from '../Image'

import styles from './Animation.scss'
import { MediaSize, MediaSizeValues } from '../types'

export type AnimationProps = {
  /**
   * JSON object which is used for animation.
   * Either `animationData` or `animationUrl` has to be set.
   * `animationData` takes precedence over `animationUrl` if both parameters are set.
   */
  animationData?: object
  /**
   * URL to a hosted JSON object.
   * Either `animationData` or `animationUrl` has to be set.
   * `animationData` takes precedence over `animationUrl` if both parameters are set.
   */
  animationUrl?: string
  /**
   * Size of the animation container.<br/>
   *   XSmall - unit(3)<br/>
   *   Small - unit(4)<br/>
   *   Regular - unit(6)<br/>
   *   Medium - unit(8)<br/>
   *   Large - unit(12)<br/>
   *   XLarge - unit(16)<br/>
   *   X2Large - unit(24)<br/>
   *   X3Large - unit(32)<br/>
   *   X4Large - unit(48)<br/>
   */
  size?: MediaSize
  /**
   * URL to a fallback image that is displayed when animation JSON is loading or couldn't be loaded.
   */
  fallbackImageSrc?: string
  /**
   * Controls scaling of the fallback image.
   */
  fallbackImageScale?: ComponentProps<typeof Image>['scaling']
  /**
   * Alternative text for accessibility.
   */
  alt?: string
  play?: boolean
  loop?: boolean
  role?: AriaRole
  aria?: AriaAttributes
  /**
   * Adds data-testid atribute to parent and children components.
   * When used, --animation or --fallback-image suffix is applied accordingly.
   */
  testId?: string
}

const cssClasses = classNames.bind(styles)

const AnimationBase = ({
  size,
  fallbackImageSrc,
  fallbackImageScale,
  alt,
  role = 'presentation',
  aria,
  testId,
  play = true,
  loop = true,
  animationUrl,
  animationData: initialAnimationData,
}: AnimationProps) => {
  const [animationData, setAnimationData] = useState<object | null>(initialAnimationData || null)
  const [loadError, setLoadError] = useState(false)
  const isComponentMounted = useRef<boolean>(true)

  useEffect(() => {
    return () => {
      isComponentMounted.current = false
    }
  }, [])

  useEffect(() => {
    const fetchAnimation = async (): Promise<object | null> => {
      if (!animationUrl) return null

      try {
        const response = await fetch(animationUrl)

        if (!response.ok) return null

        return await response.json()
      } catch (error) {
        return null
      }
    }
    const loadAnimationFromUrl = async () => {
      const animationFromUrl = await fetchAnimation()

      if (!isComponentMounted.current) return

      if (animationFromUrl) {
        setAnimationData(animationFromUrl)
      } else {
        setLoadError(true)
      }
    }

    if (initialAnimationData) {
      setAnimationData(initialAnimationData)
    } else if (animationUrl) {
      loadAnimationFromUrl()
    }
  }, [initialAnimationData, animationUrl])

  const className = cssClasses('animation', size)

  return (
    <div className={className} data-testid={testId}>
      {loadError || !animationData ? (
        <Image
          src={fallbackImageSrc}
          alt={alt || ''}
          size={size}
          scaling={fallbackImageScale}
          testId={getTestId(testId, 'fallback-image')}
        />
      ) : (
        <Lottie
          className={cssClasses('content')}
          title={alt}
          role={role}
          play={play}
          loop={loop}
          aria-label={aria?.['aria-label']}
          animationData={animationData}
          data-testid={getTestId(testId, 'animation')}
        />
      )}
    </div>
  )
}

/** The public component type: a React component value that also has deprecated statics */
export type AnimationComponent = ComponentType<AnimationProps> & {
  Size: typeof MediaSizeValues
  ImageScaling: typeof Image.Scaling
}

/** Exported component: arrow fn + statics, deprecations intact, docgen-friendly */
export const Animation: AnimationComponent = Object.assign(AnimationBase, {
  Size: MediaSizeValues,
  ImageScaling: Image.Scaling,
})

export default Animation
