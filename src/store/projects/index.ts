import { readonly } from '/@/utils/common'
import { _projects } from './state'
import './effects'

export const projects = readonly(_projects)
export * from './actions'
