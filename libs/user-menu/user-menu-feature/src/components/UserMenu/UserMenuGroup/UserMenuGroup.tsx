import { ReactNode } from 'react'

import UserMenuGroupItem from './UserMenuGroupItem'
import UserMenuGroupAction from './UserMenuGroupAction'

type Props = {
  children: ReactNode
}

const UserMenuGroup = ({ children }: Props) => <div className="user-menu-group">{children}</div>

UserMenuGroup.Item = UserMenuGroupItem
UserMenuGroup.Action = UserMenuGroupAction

export default UserMenuGroup
