import { readonly } from '/@/utils/common'
import { _projects } from './state'

export const projects = readonly(_projects)
export * from './actions'
