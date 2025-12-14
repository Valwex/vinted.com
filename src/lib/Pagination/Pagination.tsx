'use client'

import { MouseEvent, ReactNode, AriaAttributes } from 'react'
import classNames from 'classnames/bind'

import { HorizontalDots16 } from '@vinted/monochrome-icons'

import { noop } from '../../utils/noop'

import { getTestId } from '../../utils/testId'

import styles from './Pagination.scss'
import Icon from '../Icon'

/* ---------- String-union sources of truth ---------- */
export const PAGINATION_STYLING_VALUES = ['narrow', 'parent'] as const

export type PaginationStyling = (typeof PAGINATION_STYLING_VALUES)[number]

/* ---------- Back-compat shim (deprecated) ---------- */
export const PAGINATION_STYLING = {
  Narrow: 'narrow',
  Parent: 'parent',
} as const satisfies Record<string, PaginationStyling>

type WrapItemsToAnchorParams = {
  page: number
  perPageOption?: number
  className: string
  internalTestId?: string
  hidePageNumber?: boolean
  aria: AriaAttributes
  callback?: (event: MouseEvent) => void
}

type AriaConfig = {
  paginationLabel?: string
  nextPageLabel?: string
  prevPageLabel?: string
  pagesLabel?: string
  perPageOptionsLabel?: string
}

export type PaginationProps = {
  currentPage?: number
  /**
   * Controls how many pages are visible to left and right of the current page.
   */
  preservedDistance?: number
  isLastPageAlwaysShown?: boolean
  styling?: PaginationStyling
  pageCount?: number
  perPageOptions?: Array<number>
  /**
   * Controls which per page option is selected.
   * `perPageOptions` has to be defined for this property to take effect.
   * It should refer to the item index in `perPageOptions` array.
   */
  activePerPageOptionIndex?: number
  /**
   * Adds data-testid attribute to parent and children components.
   * When used, --next-page, --prev-page, --page and --per-page-option suffixes applied accordingly.
   */
  testId?: string
  /**
   * Aria attributes configuration.
   */
  ariaAttributes?: AriaConfig
  /**
   * Wraps each page button in a custom URL.
   */
  urlBuilder?: (page: number, perPageOption?: number) => string
  onPageClick?: (page: number, event: MouseEvent) => void
  onPrevClick?: (page: number, event: MouseEvent) => void
  onNextClick?: (page: number, event: MouseEvent) => void
  onPerPageClick?: (optionIndex: number, event: MouseEvent) => void
}

const MINIMUM_PAGES_UNTIL_ELLIPSIS = 3
const FIRST_PAGE = 1

const cssClasses = classNames.bind(styles)

const PaginationBase = ({
  currentPage = FIRST_PAGE,
  preservedDistance = 2,
  isLastPageAlwaysShown = false,
  styling,
  pageCount,
  perPageOptions,
  activePerPageOptionIndex,
  testId,
  ariaAttributes,
  urlBuilder,
  onPageClick = noop,
  onPrevClick = noop,
  onNextClick = noop,
  onPerPageClick = noop,
}: PaginationProps) => {
  const handlePageClick = (page: number) => (event: MouseEvent) => {
    onPageClick(page, event)
  }

  const handlePrevClick = (event: MouseEvent) => {
    const prevPage = currentPage - 1
    if (prevPage >= FIRST_PAGE) onPrevClick(prevPage, event)
  }

  const handleNextClick = (event: MouseEvent) => {
    const nextPage = currentPage + 1
    if (!pageCount || (nextPage <= pageCount && pageCount !== 0)) onNextClick(nextPage, event)
  }

  const handlePerPageOptionClick = (optionIndex: number) => (event: MouseEvent) => {
    onPerPageClick(optionIndex, event)
  }

  const wrapItem = ({
    page,
    perPageOption,
    className,
    internalTestId,
    hidePageNumber,
    aria,
    callback,
  }: WrapItemsToAnchorParams) => {
    const item = hidePageNumber ? null : perPageOption || page
    const itemProps = {
      className,
      onClick: callback,
    }
    const ItemComponent = urlBuilder ? 'a' : 'button'

    return (
      <li key={perPageOption || page} {...itemProps}>
        <ItemComponent
          data-testid={internalTestId}
          {...aria}
          {...(urlBuilder && { href: urlBuilder(page, perPageOption) })}
        >
          {item}
        </ItemComponent>
      </li>
    )
  }

  const renderEllipsis = (placement: number) => (
    <li
      key={placement > currentPage ? 'followingEllipsis' : 'precedingEllipsis'}
      className={styles.ellipsis}
    >
      <Icon name={HorizontalDots16} color="greyscale-level-2" />
    </li>
  )

  const renderPageItem = (page: number, isActive = false) => {
    const navItemClass = cssClasses(styles.item, { 'is-active': isActive })
    const ariaLabel = ariaAttributes?.pagesLabel?.length
      ? `${ariaAttributes.pagesLabel.toString()} ${page.toString()}`
      : undefined

    return wrapItem({
      page,
      className: navItemClass,
      internalTestId: getTestId(testId, `page-${page}`),
      aria: {
        'aria-label': ariaLabel,
        'aria-current': isActive,
      },
      callback: handlePageClick(page),
    })
  }

  const renderDirectionPage = (direction: 'prev' | 'next') => {
    const isPrev = direction === 'prev'
    const isDisabled = isPrev
      ? currentPage <= FIRST_PAGE
      : (pageCount && currentPage >= pageCount) || pageCount === 0

    const pageClass = cssClasses(isPrev ? styles.prev : styles.next, {
      'is-disabled': isDisabled,
    })

    const page = isPrev ? currentPage - 1 : currentPage + 1

    return wrapItem({
      page,
      className: pageClass,
      internalTestId: getTestId(testId, `${direction}-page`),
      callback: isPrev ? handlePrevClick : handleNextClick,
      aria: {
        'aria-label': isPrev ? ariaAttributes?.prevPageLabel : ariaAttributes?.nextPageLabel,
        'aria-disabled': isDisabled,
      },
      hidePageNumber: true,
    })
  }

  const renderPageItems = () => {
    const pageItems: Array<ReactNode> = []
    const lowerBound = Math.max(FIRST_PAGE, currentPage - preservedDistance)
    const upperBound = Math.min(
      pageCount || Number.MAX_SAFE_INTEGER,
      currentPage + preservedDistance,
    )

    const shouldRenderLastPage = pageCount && (isLastPageAlwaysShown || upperBound + 1 >= pageCount)

    // Add first page and preceding ellipsis if necessary
    if (lowerBound > FIRST_PAGE) {
      pageItems.push(renderPageItem(FIRST_PAGE))
      if (lowerBound - MINIMUM_PAGES_UNTIL_ELLIPSIS > FIRST_PAGE + 1) {
        pageItems.push(renderEllipsis(FIRST_PAGE + 1))
      }
    }

    // Add preceding ellipsis if necessary
    if (lowerBound > MINIMUM_PAGES_UNTIL_ELLIPSIS && !pageItems[1]) {
      pageItems.splice(1, 0, renderEllipsis(currentPage - preservedDistance))
    }

    const finalLowerBand = lowerBound === MINIMUM_PAGES_UNTIL_ELLIPSIS ? lowerBound - 1 : lowerBound

    // Add pages within the range
    for (let page = finalLowerBand; page <= upperBound; page += 1) {
      const isActive = page === currentPage

      pageItems.push(renderPageItem(page, isActive))
    }

    // Add succeeding ellipsis if necessary
    if (shouldRenderLastPage || pageCount === 0) {
      const pagesAfterUpperBound = (pageCount || 0) - upperBound

      if (pagesAfterUpperBound >= MINIMUM_PAGES_UNTIL_ELLIPSIS) {
        pageItems.push(renderEllipsis(upperBound + 1))
      }

      // Add last page if pageCount is valid and there are enough pages after upperBound
      if (
        pageCount &&
        currentPage !== pageCount &&
        pageCount !== 0 &&
        pagesAfterUpperBound >= MINIMUM_PAGES_UNTIL_ELLIPSIS - 1
      ) {
        if (pageCount - upperBound === 2) {
          pageItems.push(renderPageItem(pageCount - 1))
        }

        pageItems.push(renderPageItem(pageCount))
      }
    }

    // Add number if it's near the end
    if (pageCount && pageCount - currentPage - preservedDistance === 1 && shouldRenderLastPage) {
      pageItems.push(renderPageItem(pageCount))
    }

    // Add succeeding ellipsis if last page is not shown
    if (!shouldRenderLastPage && pageCount) {
      pageItems.push(renderEllipsis(upperBound + 1))
    }

    // Add succeeding ellipsis if pageCount is 0 and there are more pages after upperBound
    if (!pageCount && upperBound + preservedDistance > currentPage) {
      pageItems.push(renderEllipsis(upperBound))
    }

    return pageItems
  }

  const renderPerPageOptions = () => {
    if (!perPageOptions) return null

    return perPageOptions.map((perPageOption: number, index) => {
      const isActive: boolean = activePerPageOptionIndex === index
      const perPageOptionClass = cssClasses('option-item', {
        'is-active': isActive,
      })

      const ariaLabel = ariaAttributes?.perPageOptionsLabel?.length
        ? `${perPageOption} ${ariaAttributes.perPageOptionsLabel}`
        : undefined

      return wrapItem({
        page: FIRST_PAGE,
        perPageOption,
        className: perPageOptionClass,
        aria: {
          'aria-label': ariaLabel,
          'aria-current': isActive,
        },
        callback: handlePerPageOptionClick(index),
        internalTestId: getTestId(testId, `per-page-option-${perPageOption}`),
      })
    })
  }

  const paginationClass = cssClasses(styles.pagination, styling)

  return (
    <nav data-testid={testId} aria-label={ariaAttributes?.paginationLabel}>
      <ul className={paginationClass}>
        {renderDirectionPage('prev')}
        {renderPageItems()}
        {renderDirectionPage('next')}
        {!styling && <ul className={styles['option-items-container']}>{renderPerPageOptions()}</ul>}
      </ul>
    </nav>
  )
}

/** The public component type: a React component value that also has deprecated statics */
export type PaginationComponent = typeof PaginationBase & {
  /**
   * @deprecated Use string literals instead: 'narrow', 'parent'
   */
  Styling: typeof PAGINATION_STYLING
}

/** Exported component: arrow fn + statics, deprecations intact, docgen-friendly */
export const Pagination: PaginationComponent = Object.assign(PaginationBase, {
  /**
   * @deprecated Use string literals instead: 'narrow', 'parent'
   */
  Styling: PAGINATION_STYLING,
})

export default Pagination
