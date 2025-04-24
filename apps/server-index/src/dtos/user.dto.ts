import { z } from 'zod'
import { UserSelect } from '@database/schema'
import { defineDto } from './_utils'

export const userDto = defineDto(
  z.object({
    id: z.string().uuid(),
    telegramId: z.number().int(),
  }),
  (user: UserSelect) => {
    return {
      id: user.id,
      telegramId: user.telegramId,
    }
  }
)
