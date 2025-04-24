import { defineDto } from '@dtos/_utils'
import { z } from 'zod'

// It is literally telegram's WebAppInitData
export const loginRequestSchema = z.object({
  initData: z.string(),
})

export const loginResponseDto = defineDto(
  z.object({
    token: z.string(),
  }),
  (token: string) => ({
    token,
  })
)
