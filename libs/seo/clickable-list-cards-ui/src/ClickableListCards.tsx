import { Bubble, Card, Cell, Stack, Spacer, Text } from '@vinted/web-ui'

type Props = {
  cards: Array<{
    title: string
    elements: Array<{ title: string; url: string }>
  }>
}

const ClickableItemList = (props: Props['cards'][number]) => {
  return (
    <Card>
      <article className="u-ui-padding-horizontal-x2-large u-ui-padding-vertical-x-large">
        <Text as="h2" text={props.title} type="heading" />
        <Spacer size="large" />
        <Stack gap="regular" as="ul" wrap>
          {props.elements.map(element => (
            <li key={element.title} className="clickable-list-card__item">
              <Bubble styling="tight">
                <Cell url={element.url} type="navigating" styling="narrow">
                  <Text type="subtitle" theme="amplified" bold text={element.title} as="span" />
                </Cell>
              </Bubble>
            </li>
          ))}
        </Stack>
      </article>
    </Card>
  )
}

const ClickableListCards = (props: Props) => {
  return (
    <div className="clickable-list-cards">
      {props.cards.map(element => (
        <ClickableItemList key={element.title} {...element} />
      ))}
    </div>
  )
}

export default ClickableListCards
