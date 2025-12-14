import {
  anonIdInterceptor,
  ApiClient,
  csrfTokenInterceptor,
  errorInterceptor,
  localeInterceptor,
} from '@marketplace-web/core-api/api-client-util'
import { api } from '@marketplace-web/core-api/core-api-client-util'
import { tokenRefreshInterceptor } from '@marketplace-web/session-management/session-management-interceptor-util'

import {
  CreatePhotoResp,
  GetPhotosArgs,
  GetPhotosResp,
  UploadImageResp,
} from '../types/media-upload'

export const getPhotos = ({ type, photoEntryId, tempUuid }: GetPhotosArgs) =>
  api.get<GetPhotosResp>('/photos', {
    params: { type, photo_entry_id: photoEntryId, temp_uuid: tempUuid },
  })

export const createPhoto = (photo: FormData) => api.post<CreatePhotoResp>('/photos', photo)

const imagesApiClient = new ApiClient(
  {
    baseURL: '/web/api/images',
  },
  [
    csrfTokenInterceptor,
    errorInterceptor,
    tokenRefreshInterceptor,
    localeInterceptor,
    anonIdInterceptor,
  ],
)

export const uploadToImagesService = (file: File) => {
  const formData = new FormData()
  formData.append('stream', file)

  return imagesApiClient.post<UploadImageResp>('/images', formData)
}
