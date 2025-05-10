import type { ServerIndexUser } from '~/models/server-index-user.model'
import type { HttpApi } from '../types'

export const serverIndexAuth = (api: HttpApi) => ({
  iam: api.defineJsonEndpoint<void, ServerIndexUser>({
    method: 'GET',
    url: '/auth/iam',
    output: 'naive',
  }),
  login: api.defineJsonEndpoint<{ initData: string }, { token: string }>({
    method: 'POST',
    url: '/auth/login',
    body: 'input',
    output: 'naive',
    requireAuthentication: false,
  }),
})
