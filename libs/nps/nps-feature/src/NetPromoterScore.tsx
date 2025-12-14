'use client'

import { ChangeEvent, MouseEvent, useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import {
  Button,
  Cell,
  Container,
  Divider,
  InputTextArea,
  Radio,
  Spacer,
  Text,
} from '@vinted/web-ui'
import { X16 } from '@vinted/monochrome-icons'

import { Banner } from '@marketplace-web/common-components/banner-ui'

import { useBreakpoint } from '@marketplace-web/breakpoints/breakpoints-feature'
import { useTracking } from '@marketplace-web/observability/event-tracker-data'
import { useTranslate } from '@marketplace-web/i18n/i18n-feature'
import { useSession } from '@marketplace-web/shared/session-data'
import { setBannerAsSeen } from '@marketplace-web/banners/banners-data'
import { BannerType } from '@marketplace-web/banners/banners-feature'
import { clickEvent, viewEvent } from '@marketplace-web/nps/nps-data'

import { deleteNpsSurvey, sendNpsSurveyResponse } from './api'

const NetPromoterScore = () => {
  const [selectedRating, setSelectedRating] = useState<number | null>(null)
  const [showSurvey, setShowSurvey] = useState(true)
  const [showCommentBox, setShowCommentBox] = useState(false)
  const [comment, setComment] = useState<string | null>(null)

  const { track } = useTracking()
  const translate = useTranslate()
  const { user } = useSession()
  const breakpoints = useBreakpoint()

  useEffect(() => {
    setBannerAsSeen({ type: BannerType.Nps })
    track(viewEvent({ target: 'nps_survey' }))
  }, [track])

  const handleRatingSelect = (newRating: number) => (event: MouseEvent<HTMLInputElement>) => {
    event.stopPropagation()
    setSelectedRating(newRating)
    setShowCommentBox(true)
  }

  const handleCommentInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setComment(event.target.value)
  }

  const submitResponse = (target: Parameters<typeof clickEvent>[0]['target']) => () => {
    if (!user) return

    const userId = user.id

    track(clickEvent({ target }))
    setShowSurvey(false)

    if (target === 'nps_survey_dismiss') {
      deleteNpsSurvey({ userId })

      return
    }

    if (selectedRating === null) return

    sendNpsSurveyResponse({
      score: selectedRating,
      incomplete: false,
      comment,
      userId,
    })
  }

  function renderCommentBox() {
    return (
      <>
        <Divider />
        <InputTextArea
          name="netPromoterScore"
          placeholder={translate('net_promoter_score.open_question')}
          onChange={handleCommentInputChange}
        />
        <Cell
          body={
            <Button
              onClick={submitResponse('nps_survey_send')}
              styling="filled"
              text={<FormattedMessage id="net_promoter_score.submit" />}
            />
          }
        />
      </>
    )
  }

  function renderRatings() {
    const npsScale = 11
    const ratings = Array.from(Array(npsScale).keys())

    return (
      <Container styling="narrow">
        <div className="nps-survey__ratings">
          {ratings.map(rating => (
            <Radio
              name={`rating-${rating.toString()}`}
              checked={rating === selectedRating}
              onClick={handleRatingSelect(rating)}
              text={rating.toString()}
              textPosition="bottom"
              key={rating}
              onChange={() => undefined}
            />
          ))}
        </div>
        <Spacer />
        <div className="u-flexbox u-justify-content-between">
          {/* The inputs with id="0" and id="10" are within `Radio` component */}
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label htmlFor="0">
            <Text
              text={
                <FormattedMessage id="net_promoter_score.score_explanation.unlikely_to_recommend" />
              }
              type="caption"
              as="span"
            />
          </label>
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label htmlFor="10">
            <Text
              text={
                <FormattedMessage id="net_promoter_score.score_explanation.likely_to_recommend" />
              }
              type="caption"
              as="span"
            />
          </label>
        </div>
      </Container>
    )
  }

  const closeButton = (
    <Button
      iconName={X16}
      inline
      size="medium"
      inverse
      onClick={submitResponse('nps_survey_dismiss')}
    />
  )

  return (
    showSurvey && (
      <Banner isPhone={breakpoints.phones}>
        <div className="u-phones-only">{closeButton}</div>
        <Cell
          prefix={breakpoints.tabletsUp ? closeButton : null}
          body={
            <Text
              as="h2"
              text={<FormattedMessage id="net_promoter_score.question" />}
              type="title"
              alignment="center"
              width="parent"
            />
          }
        />
        <div className="nps-survey">
          {renderRatings()}
          <Spacer orientation="vertical" />
          {showCommentBox && renderCommentBox()}
        </div>
      </Banner>
    )
  )
}

export default NetPromoterScore
