import { z } from 'zod'

import { defineDto } from '@dtos/_utils'

export const SuccessfulOperationDto = defineDto(
  z.object({
    status: z.string().openapi({
      example: 'successful',
    }),
  }),
  () => {
    return {
      status: 'successful',
    }
  }
)
