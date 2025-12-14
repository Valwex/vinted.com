'use client'

import {
  AriaAttributes,
  AriaRole,
  CSSProperties,
  ForwardRefExoticComponent,
  ImgHTMLAttributes,
  Ref,
  RefAttributes,
  SyntheticEvent,
  forwardRef,
  useCallback,
  useEffect,
  useRef,
} from 'react'
import classNames from 'classnames/bind'

import styles from './Image.scss'
import { getTestId } from '../../utils/testId'
import { MediaSize, MediaSizeValues } from '../types'
import { noop } from '../../utils/noop'
import { mergeRefs } from '../../utils/mutableRefs'

/* ---------- String-union sources of truth ---------- */
export const IMAGE_SCALING_VALUES = ['contain', 'cover', 'fill', 'scale-down'] as const
export const IMAGE_RATIO_VALUES = [
  'square',
  'fullscreen',
  'portrait',
  'small-portrait',
  'landscape',
  'small-landscape',
] as const
export const IMAGE_STYLING_VALUES = ['rounded', 'circle'] as const
export const IMAGE_LABEL_STYLE_VALUES = ['tight', 'narrow', 'regular', 'wide'] as const

export type ImageScaling = (typeof IMAGE_SCALING_VALUES)[number]
export type ImageRatio = (typeof IMAGE_RATIO_VALUES)[number]
export type ImageStyling = (typeof IMAGE_STYLING_VALUES)[number]
export type ImageLabelStyle = (typeof IMAGE_LABEL_STYLE_VALUES)[number]

/* ---------- Back-compat shims (public API) ---------- */
export const IMAGE_SCALING = {
  Contain: 'contain',
  Cover: 'cover',
  Fill: 'fill',
  ScaleDown: 'scale-down',
} as const satisfies Record<string, ImageScaling>

export const IMAGE_RATIO = {
  Square: 'square',
  Fullscreen: 'fullscreen',
  Portrait: 'portrait',
  SmallPortrait: 'small-portrait',
  Landscape: 'landscape',
  SmallLandscape: 'small-landscape',
} as const satisfies Record<string, ImageRatio>

export const IMAGE_STYLING = {
  Rounded: 'rounded',
  Circle: 'circle',
} as const satisfies Record<string, ImageStyling>

export const IMAGE_LABEL_STYLE = {
  Tight: 'tight',
  Narrow: 'narrow',
  Regular: 'regular',
  Wide: 'wide',
} as const satisfies Record<string, ImageLabelStyle>

export type ImageProps = {
  src?: string | null
  fallbackSrc?: string | null
  /**
   * Sets the background color on an image element.
   * Accepts any legal CSS color values (Hexadecimal, RGB, predefined names etc.).
   */
  color?: string | null
  alt?: string
  srcset?: string
  sizes?: string
  label?: string
  size?: MediaSize
  scaling?: ImageScaling
  ratio?: ImageRatio
  styling?: ImageStyling
  labelStyle?: ImageLabelStyle
  draggable?: boolean
  /**
   * Tells the browser how to load the image.
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#attr-loading mdn/img#attr-loading}
   */
  loading?: ImgHTMLAttributes<HTMLImageElement>['loading']
  /** onLoad won't fire after page refresh due to SSR */
  onLoad?: (event: SyntheticEvent<HTMLImageElement>) => void
  role?: AriaRole
  aria?: AriaAttributes
  /**
   * Adds data-testid attribute to the parent and children components.
   * When used, --img and --label suffixes applied accordingly.
   */
  testId?: string
  /**
   * Sets the reference to the img element in DOM.
   */
  forwardedRef?: Ref<HTMLImageElement>
  /** onError won't fire after page refresh due to SSR */
  onError?: (event: SyntheticEvent<HTMLImageElement>) => void
  /**
   * onFinalError will be called when both the primary image and fallback image fail to load
   */
  onFinalError?: () => void
}

const cssClasses = classNames.bind(styles)

const ImageBase = ({
  color,
  src,
  fallbackSrc,
  ratio,
  scaling,
  size,
  styling,
  labelStyle,
  testId,
  label,
  loading,
  role,
  srcset,
  alt,
  draggable,
  onLoad,
  sizes,
  forwardedRef,
  aria,
  onError = noop,
  onFinalError = noop,
}: ImageProps) => {
  const ref = useRef<HTMLImageElement>(null)
  const hasTriedFallback = useRef(false)
  const hasCalledFinalError = useRef(false)

  const isScaled = [ratio, scaling, size].some(Boolean)
  const imageStyle: CSSProperties = color ? { backgroundColor: color } : {}
  const imageClass = cssClasses('image', size, scaling, ratio, styling, {
    [`label-${labelStyle || ''}`]: labelStyle,
    scaled: isScaled,
    cover: (size || ratio) && !scaling,
    ratio,
  })

  useEffect(() => {
    if (!ref.current) return

    const { complete, naturalHeight } = ref.current
    const errorLoadingImgBeforeHydration = complete && naturalHeight === 0

    if (errorLoadingImgBeforeHydration) {
      if (fallbackSrc && !hasTriedFallback.current) {
        hasTriedFallback.current = true
        // Clear srcset when falling back to ensure the fallback src is used
        // This is necessary because when srcset is provided, the browser tries to load
        // from srcset URLs first, and onError events will have the failed srcset URL
        // in target.currentSrc, not the fallback src
        ref.current.srcset = ''
        ref.current.src = fallbackSrc
      } else if (!hasCalledFinalError.current) {
        hasCalledFinalError.current = true
        onFinalError()
      }
    }
  }, [fallbackSrc, onFinalError])

  // Reset hasTriedFallback when fallbackSrc changes
  useEffect(() => {
    hasTriedFallback.current = false
    hasCalledFinalError.current = false
  }, [fallbackSrc])

  const handleError = useCallback(
    (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
      onError(event)

      const target = event.target as HTMLImageElement

      if (fallbackSrc && !hasTriedFallback.current) {
        hasTriedFallback.current = true
        // Clear srcset when falling back to ensure the fallback src is used
        // This is necessary because when srcset is provided, the browser tries to load
        // from srcset URLs first, and onError events will have the failed srcset URL
        // in target.currentSrc, not the fallback src
        target.srcset = ''
        target.src = fallbackSrc
      } else if (!hasCalledFinalError.current) {
        hasCalledFinalError.current = true
        onFinalError()
      }
    },
    [fallbackSrc, onError, onFinalError],
  )

  const imageSrc = src || fallbackSrc

  return (
    <div className={imageClass} style={imageStyle} data-testid={testId}>
      {imageSrc ? (
        <img
          role={role}
          src={imageSrc}
          srcSet={srcset}
          alt={alt || ''}
          className={styles.content}
          draggable={draggable}
          onLoad={onLoad}
          onError={handleError}
          data-testid={getTestId(testId, 'img')}
          sizes={sizes}
          loading={loading}
          ref={mergeRefs(forwardedRef, ref)}
          {...aria}
        />
      ) : null}
      {label ? (
        <div className={styles.label} data-testid={getTestId(testId, 'label')}>
          {label}
        </div>
      ) : null}
    </div>
  )
}

/** The public component type: a React component value that also has deprecated statics */
export type RefComponent = ForwardRefExoticComponent<
  ImageProps & RefAttributes<HTMLImageElement>
> & {
  Size: typeof MediaSizeValues
  /**
   * @deprecated Use string literals instead: 'contain', 'cover', 'fill', 'scale-down'
   */
  Scaling: typeof IMAGE_SCALING
  /**
   * @deprecated Use string literals instead: 'square', 'fullscreen', 'portrait', 'small-portrait', 'landscape', 'small-landscape'
   */
  Ratio: typeof IMAGE_RATIO
  /**
   * @deprecated Use string literals instead: 'rounded', 'circle'
   */
  Styling: typeof IMAGE_STYLING
  /**
   * @deprecated Use string literals instead: 'tight', 'narrow', 'regular', 'wide'
   */
  LabelStyle: typeof IMAGE_LABEL_STYLE
}

// BUG: default exports do not auto-generate storybook ArgsTable
// https://github.com/storybookjs/storybook/issues/9511
// remove export when resolved
const ImageWithForwardedRefBase = forwardRef<HTMLImageElement, ImageProps>((props, ref) => (
  <ImageBase forwardedRef={ref} {...props} />
))

ImageWithForwardedRefBase.displayName = ImageBase.name

/** Exported component: arrow fn + statics, deprecations intact, docgen-friendly */
export const ImageWithForwardedRef: RefComponent = Object.assign(ImageWithForwardedRefBase, {
  Size: MediaSizeValues,
  /**
   * @deprecated Use string literals instead: 'contain', 'cover', 'fill', 'scale-down'
   */
  Scaling: IMAGE_SCALING,
  /**
   * @deprecated Use string literals instead: 'square', 'fullscreen', 'portrait', 'small-portrait', 'landscape', 'small-landscape'
   */
  Ratio: IMAGE_RATIO,
  /**
   * @deprecated Use string literals instead: 'rounded', 'circle'
   */
  Styling: IMAGE_STYLING,
  /**
   * @deprecated Use string literals instead: 'tight', 'narrow', 'regular', 'wide'
   */
  LabelStyle: IMAGE_LABEL_STYLE,
})

export default ImageWithForwardedRef
