'use client'

import { Button, Cell, Image, Spacer, Text } from '@vinted/web-ui'
import classNames from 'classnames'
import { InView } from 'react-intersection-observer'

import { useBreakpoint } from '@marketplace-web/breakpoints/breakpoints-feature'
import { BannerLayoutModel } from '@marketplace-web/banners/banners-data'

type Props = {
  banner: BannerLayoutModel
  type: 'wide' | 'narrow'
  onClick: () => void
  onView: (inView: boolean) => void
}

type TextTheme = React.ComponentProps<typeof Text>['theme']

const themeMap = {
  light: 'inverse',
  dark: 'amplified',
}

const HomepageBanner = ({ banner, type, onClick, onView }: Props) => {
  const breakpoints = useBreakpoint()
  const { title, icon, cta, background, textTheme, description, foreground } = banner

  const isPhones = breakpoints.phones
  const device = isPhones ? 'mobile' : 'tablet'
  const breakpoint = breakpoints.wide ? 'desktop' : device

  return (
    <InView
      className={classNames('block-banner__container', {
        'block-banner__container--narrow': type === 'narrow',
      })}
      onChange={onView}
    >
      <Image
        scaling="cover"
        src={background.url}
        color={background.dominantColor}
        alt=""
        loading="lazy"
      />
      {foreground && (
        <div className={`block-banner__foreground block-banner__foreground--${type}-${breakpoint}`}>
          <Image scaling="fill" src={foreground.url} alt="" />
        </div>
      )}
      <div className="block-banner__info">
        <Cell
          styling="tight"
          theme="transparent"
          url={cta.url}
          aria={{
            'aria-label': cta.accessibilityLabel || '',
          }}
          onClick={onClick}
          testId="homepage-banner-cta"
        >
          <div className="block-banner__info-content">
            <div className={`block-banner__header-${type}-${breakpoint}`}>
              <Cell
                theme="transparent"
                prefix={icon?.url && <Image src={icon.url} size="regular" alt="" />}
                body={
                  title && (
                    <div
                      className={classNames('block-banner__title', {
                        'block-banner__title--phones': isPhones,
                      })}
                    >
                      <Text
                        text={title}
                        width="parent"
                        type={isPhones ? 'subtitle' : undefined}
                        as="h2"
                        theme={themeMap[textTheme] as TextTheme}
                      />
                    </div>
                  )
                }
                styling="tight"
              />
              {(icon || title) && <Spacer />}
              <div
                className={classNames('block-banner__description', {
                  'block-banner__description--phones': isPhones,
                })}
              >
                <Text
                  text={description}
                  type={isPhones ? 'title' : 'heading'}
                  width="parent"
                  as="p"
                  theme={themeMap[textTheme] as TextTheme}
                  tabIndex={0}
                />
              </div>
            </div>
            <div className="block-banner__cta">
              <Button
                text={cta.title}
                theme={cta.theme}
                inverse={cta.inverse}
                size={isPhones ? 'small' : 'medium'}
                inline
                styling="filled"
                truncated
              />
            </div>
          </div>
        </Cell>
      </div>
    </InView>
  )
}

export default HomepageBanner
