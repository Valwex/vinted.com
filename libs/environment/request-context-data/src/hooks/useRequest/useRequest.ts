'use client'

import { useContext } from 'react'

import RequestContext from '../../containers/RequestContext'

const useRequest = () => useContext(RequestContext)

export default useRequest
