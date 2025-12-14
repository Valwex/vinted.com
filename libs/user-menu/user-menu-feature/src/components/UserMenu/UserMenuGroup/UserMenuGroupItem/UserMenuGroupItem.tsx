import { compact } from 'lodash'
import { Children, ReactNode } from 'react'

type Props = {
  children: Array<ReactNode>
}

const UserMenuGroupItem = ({ children }: Props) => {
  const renderChildItem = (child: ReactNode) => <li className="nav-item">{child}</li>

  return (
    <ul className="nav nav-stacked nav-dropdown nav-detailed user-menu-group__item">
      {Children.map(compact(children), renderChildItem)}
    </ul>
  )
}

export default UserMenuGroupItem
