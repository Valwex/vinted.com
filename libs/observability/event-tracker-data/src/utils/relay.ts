import axios, { AxiosResponse } from 'axios'

type RelayRequest = {
  payload: any
  headers?: any
}

type RelayTransportArguments = {
  payload: any
  headers?: any
  success?: (response: AxiosResponse) => Promise<unknown> | void
  failure?: (response: AxiosResponse) => Promise<unknown> | void
}

class Relay {
  url: string

  constructor(url: string) {
    this.url = url
  }

  transport({ payload, headers, success, failure }: RelayTransportArguments) {
    this.request({ payload, headers }).then(success).catch(failure)
  }

  request({ payload, headers }: RelayRequest) {
    return axios.post(this.url, payload, { headers })
  }
}

export default Relay
