// Shared viewport vocabulary. Sub-ranges in CSS may tune an existing composition.
export const responsiveConditions = {
  large: '(min-width: 2200px)',
  standard: '(min-width: 1600px) and (max-width: 2199px)',
  desktop: '(min-width: 1280px) and (max-width: 1599px)',
  tablet: '(min-width: 768px) and (max-width: 1279px)',
  mobile: '(max-width: 767px)',
  small: '(max-width: 390px)',
  low: '(max-height: 850px)',
  veryLow: '(max-height: 700px)',
} as const
