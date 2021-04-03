import { readonly } from '@/utils/common'
import { _openedProjectIds } from './state'

export const openedProjectIds = readonly(_openedProjectIds)
export * from './actions'
