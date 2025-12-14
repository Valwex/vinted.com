export const WEB_VITALS_TRESHOLDS = {
  // taken from https://github.com/GoogleChrome/lighthouse/blob/1a6fd1665a4082789596f0b3642e3afbf8b414eb/core/audits/metrics/largest-contentful-paint.js#L38-L65
  largest_contentful_paint: {
    desktop: { p10: 2500, median: 4000 },
    mobile: { p10: 1200, median: 2400 },
  },
  // taken from https://github.com/GoogleChrome/lighthouse/blob/1a6fd1665a4082789596f0b3642e3afbf8b414eb/core/audits/metrics/cumulative-layout-shift.js#L40-L48
  cumulative_layout_shift: {
    desktop: { p10: 0.1, median: 0.25 },
    mobile: { p10: 0.1, median: 0.25 },
  },
  // taken from https://github.com/GoogleChrome/lighthouse/blob/1a6fd1665a4082789596f0b3642e3afbf8b414eb/core/audits/metrics/first-contentful-paint.js#L37-L56
  first_contentful_paint: {
    desktop: { p10: 934, median: 1600 },
    mobile: { p10: 1800, median: 3000 },
  },
  // taken from https://github.com/GoogleChrome/lighthouse/blob/1a6fd1665a4082789596f0b3642e3afbf8b414eb/core/audits/metrics/interaction-to-next-paint.js#L41-L50
  interaction_to_next_paint: {
    desktop: { p10: 200, median: 500 },
    mobile: { p10: 200, median: 500 },
  },
}

export const SCORE_BUCKETS = [
  0.01, 0.05, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 0.95, 0.99, 1.0,
]

export const DEFAULT_DURATION_BUCKETS = [
  0.25, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 15, 20,
]

export const INP_BUCKETS = [
  0.005, 0.01, 0.025, 0.05, 0.1, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.6, 0.75, 1, 2, 5,
]

export const CLS_BUCKETS = [
  0.001, 0.01, 0.05, 0.1, 0.125, 0.15, 0.175, 0.2, 0.225, 0.25, 0.3, 0.35, 0.4, 0.5, 0.75, 1, 5,
]
