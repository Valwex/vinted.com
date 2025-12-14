import { HelpCenterTransactionModel } from '../types/help-center-transaction'
import { RecentTransactionsResp } from '../types/recent-transaction'
import { GetTransactionResp, TransactionDto } from '../types/transaction'
import { findThumbnail } from '../utils/photo'
import { TransactionSide } from '../constants/transaction'
import { transformCurrencyAmountDtoOrString } from './currency-amount'

export const transformHelpCenterHomeTransaction = (
  transaction: TransactionDto,
): HelpCenterTransactionModel => {
  const item = transaction.order.items.find(({ id }) => id === transaction.item_id)
  const oppositeUser =
    transaction.user_side === TransactionSide.Seller ? transaction.buyer : transaction.seller

  return {
    id: transaction.id,
    price: transformCurrencyAmountDtoOrString(transaction.offer.price, transaction.offer.currency),
    statusTitle: transaction.status_title,
    statusUpdatedAt: transaction.status_updated_at,
    shipmentStatusTitle: transaction?.shipment?.status_title,
    shipmentStatusUpdatedAt: transaction?.shipment?.status_updated_at,
    itemTitle: transaction.item_title,
    itemPhoto: item?.photos[0]?.url,
    itemPath: item?.url,
    bundleCount: transaction.items_count > 1 ? transaction.items_count : null,
    oppositeUserUsername: oppositeUser?.login,
    oppositeUserPhoto: findThumbnail(oppositeUser?.photo),
    oppositeUserPath: oppositeUser?.id ? `/member/${oppositeUser.id}` : undefined,
  }
}

export const transformHelpCenterTransactionResponse = ({ transaction }: GetTransactionResp) =>
  transformHelpCenterHomeTransaction(transaction)

export const transformHelpCenterTransactionsResponse = (
  response: RecentTransactionsResp,
): { transactions: Array<HelpCenterTransactionModel>; totalCount: number } => ({
  transactions: response.recent_transactions.map(transformHelpCenterHomeTransaction),
  totalCount: response.total_count,
})
