import { BannerLayoutDto, BannerLayoutModel } from '../types/banner-layout'
import { ALLOWED_TEXT_THEMES, ALLOWED_BUTTON_THEMES } from '../constants'

export const transformBannersBlockElements = (
  banners: Array<BannerLayoutDto>,
): Array<BannerLayoutModel> => {
  if (!banners) return []

  return banners
    .filter(
      banner =>
        ALLOWED_TEXT_THEMES.includes(banner.text_theme) &&
        ALLOWED_BUTTON_THEMES.includes(banner.cta.theme),
    )
    .map((banner): BannerLayoutModel => {
      return {
        id: banner.id,
        title: banner.title,
        description: banner.description,
        contentSource: banner.content_source,
        background: {
          url: banner.background.url,
          dominantColor: banner.background.dominant_color,
        },
        foreground: banner.foreground ? { url: banner.foreground.url } : null,
        textTheme: banner.text_theme,
        icon: banner.icon ? { url: banner.icon.url } : null,
        cta: {
          url: banner.cta.url,
          accessibilityLabel: banner.cta.accessibility_label,
          title: banner.cta.title,
          theme: banner.cta.theme,
          inverse: banner.cta.inverse,
        },
      }
    })
}
