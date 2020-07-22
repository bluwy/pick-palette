import { assert, array } from 'superstruct'
import { ProjectStruct } from '/@/utils/validation-structs'
import { _projects } from './state'

// Run state validation in development
if (process.env.NODE_ENV !== 'production') {
  _projects.subscribe((state) => {
    assert(state, array(ProjectStruct))
  })
}
