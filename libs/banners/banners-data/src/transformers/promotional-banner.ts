import { PromotionalBannerDto, PromotionalBannerModel } from '../types/promotional-banner'

export const transformPromotionalBanner = ({
  title,
  body,
  background,
  foreground,
  actions,
  ab_test,
  position,
}: PromotionalBannerDto): PromotionalBannerModel => ({
  title: {
    text: title?.text,
    lightTheme: {
      textStyle: title?.light_theme?.text_style,
      textType: title?.light_theme?.text_type,
    },
    darkTheme: {
      textStyle: title?.dark_theme?.text_style,
      textType: title?.dark_theme?.text_type,
    },
  },
  body: {
    text: body?.text,
    lightTheme: {
      textStyle: body?.light_theme?.text_style,
      textType: body?.light_theme?.text_type,
    },
    darkTheme: {
      textStyle: body?.dark_theme?.text_style,
      textType: body?.dark_theme?.text_type,
    },
  },
  background: {
    lightTheme: {
      imageUrl: background?.light_theme?.image_url,
      color: background?.light_theme?.color,
    },
    darkTheme: {
      imageUrl: background?.dark_theme?.image_url,
      color: background?.dark_theme?.color,
    },
  },
  foreground: {
    lightTheme: {
      imageUrl: foreground?.light_theme?.image_url,
      wideImageUrl: foreground?.light_theme?.wide_image_url,
    },
    darkTheme: {
      imageUrl: foreground?.dark_theme?.image_url,
      wideImageUrl: foreground?.dark_theme?.wide_image_url,
    },
  },
  actions: {
    primary: {
      title: actions?.primary?.title,
      action: {
        type: actions?.primary?.action?.type,
        target: actions?.primary?.action?.target,
        extra: actions?.primary?.action?.extra,
      },
      lightTheme: {
        type: actions?.primary?.light_theme?.type,
        style: actions?.primary?.light_theme?.style,
        theme: actions?.primary?.light_theme?.theme,
      },
      darkTheme: {
        type: actions?.primary?.dark_theme?.type,
        style: actions?.primary?.dark_theme?.style,
        theme: actions?.primary?.dark_theme?.theme,
      },
    },
  },
  abTest: {
    name: ab_test?.name,
    id: ab_test?.id,
    group: ab_test?.group,
  },
  position: {
    first: position?.first,
  },
})
