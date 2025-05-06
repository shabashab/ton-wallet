import type { NetworkType } from '~/models/network-type.model'

export interface SavedSettings {
  version: 1
  currentNetwork: NetworkType
}
