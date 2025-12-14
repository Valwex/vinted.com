import { Response } from '@marketplace-web/core-api/api-client-util'

import {
  VasEntryPointModel,
  VasEntryPointDto,
  GetVasEntryPointsResp,
} from '../types/vas-entry-points'

export const transformVasEntryPoint = (dto: VasEntryPointDto): VasEntryPointModel => ({
  name: dto.name,
  title: dto.title,
  subtitle: dto.subtitle,
  badgeTitle: dto.badge_title,
  badgeSubtitle: dto.badge_subtitle,
  buttonTitle: dto.button_title,
  selectedItemId: dto.selected_item,
})

export const transformVasEntryPoints = (dtos: Array<VasEntryPointDto>): Array<VasEntryPointModel> =>
  dtos.map(transformVasEntryPoint)

export const transformVasEntryPointsResponse = (response: Response<GetVasEntryPointsResp>) =>
  transformVasEntryPoints(response.entry_points)
