'use client'

import { Image } from '@vinted/web-ui'

import { useAsset } from '@marketplace-web/shared/assets'

type Props = {
  sellerIsBusinessUser?: boolean
}

const BuyerProtectionIcon = ({ sellerIsBusinessUser }: Props) => {
  const asset = useAsset('assets/buyer-protection')
  const getImageName = sellerIsBusinessUser
    ? 'buyer-protection-pro-shield.svg'
    : 'buyer-protection-shield.svg'

  const shieldImageUrl = asset(getImageName)

  return <Image src={shieldImageUrl} size="x-large" alt="" />
}

export default BuyerProtectionIcon
