import { UserId } from '@database/schema'

export interface JwtPayload {
  /**
   * User's id (`schema.users.id`)
   */
  sub: UserId
}
