'use client'

import { Cell, Divider, Spacer } from '@vinted/web-ui'

import { useTranslate } from '@marketplace-web/i18n/i18n-feature'
import { SeparatedList } from '@marketplace-web/common-components/separated-list-ui'
import { urlWithParams } from '@marketplace-web/browser/url-util'
import { AccessChannel } from '@marketplace-web/help-center/help-center-faq-entry-url-data'
import { HelpCenterTransactionModel } from '@marketplace-web/help-center/help-center-transactions-data'

import HelpCenterTransactionItem from './HelpCenterTransactionItem'

type Props = {
  transactions: Array<HelpCenterTransactionModel>
  hasMoreTransactions: boolean
}

export const HC_RECENT_TRANSACTIONS_PATH = '/help/recent_transactions'
const HC_TRANSACTION_PATH = (transactionId: number) => `/help/for_transaction/${transactionId}`

const HelpCenterTransactions = ({ transactions, hasMoreTransactions }: Props) => {
  const translate = useTranslate()

  const getTransactionPath = (id: number) =>
    urlWithParams(HC_TRANSACTION_PATH(id), { access_channel: AccessChannel.HcTransaction })

  const renderTransactionItem = (transaction: HelpCenterTransactionModel) => (
    <HelpCenterTransactionItem
      key={transaction.id}
      transaction={transaction}
      cellOptions={{
        url: getTransactionPath(transaction.id),
        type: 'navigating',
        chevron: true,
        testId: 'hc-transaction-link',
      }}
    />
  )

  const renderMoreTransactions = () => {
    if (!hasMoreTransactions) return null

    return (
      <>
        <Divider />
        <Cell
          title={translate('help_center.transactions.all_recent_orders')}
          url={HC_RECENT_TRANSACTIONS_PATH}
          type="navigating"
          testId="all-recent-orders"
          chevron
        />
      </>
    )
  }

  if (!transactions.length) return null

  return (
    <>
      <Cell styling="tight">
        <SeparatedList separator={<Divider />}>
          {transactions.map(renderTransactionItem)}
        </SeparatedList>
        {renderMoreTransactions()}
      </Cell>
      <Spacer size="large" />
    </>
  )
}

export default HelpCenterTransactions
