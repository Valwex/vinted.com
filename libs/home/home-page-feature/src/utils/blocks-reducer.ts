import { ResponseError } from '@marketplace-web/core-api/api-client-util'
import { HomepageBlocksModel } from '@marketplace-web/home/home-page-data'

export type Action =
  | {
      type: 'loading'
    }
  | {
      type: 'error'
      payload: ResponseError
    }
  | {
      type: 'success'
      payload: HomepageBlocksModel
    }
  | {
      type: 'more-blocks-loading'
    }
  | {
      type: 'more-blocks-success'
      payload: HomepageBlocksModel
    }
  | {
      type: 'more-blocks-failure'
    }

export type State = {
  blocks: HomepageBlocksModel | null
  isLoading: boolean
  error: ResponseError | null
}

export const blocksReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'loading':
      return {
        blocks: null,
        isLoading: true,
        error: null,
      }
    case 'error':
      return {
        blocks: null,
        isLoading: false,
        error: action.payload,
      }
    case 'success':
      return {
        blocks: action.payload,
        isLoading: false,
        error: null,
      }
    case 'more-blocks-loading':
      return {
        ...state,
        isLoading: true,
      }
    case 'more-blocks-success':
      return {
        blocks: {
          blocks: [...(state.blocks?.blocks ?? []), ...action.payload.blocks],
          showLoadMoreButton: action.payload.showLoadMoreButton,
          nextPageToken: action.payload.nextPageToken,
        },
        isLoading: false,
        error: null,
      }
    case 'more-blocks-failure':
      return {
        ...state,
        blocks: {
          blocks: state.blocks?.blocks ?? [],
          showLoadMoreButton: false,
          nextPageToken: null,
        },
        isLoading: false,
      }
    default:
      return state
  }
}
