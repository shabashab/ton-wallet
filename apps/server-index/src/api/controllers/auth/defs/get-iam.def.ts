import { defineDto } from '@dtos/_utils'

import { userDto } from 'src/dtos/user.dto'
import { UserSelect } from '@database/schema'

export const iamResponseDto = defineDto(userDto.schema, (user: UserSelect) => {
  return userDto(user)
})
