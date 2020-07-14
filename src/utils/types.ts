import { StructType } from 'superstruct'
import { ColorStruct, ProjectStruct } from './validation-structs'

export type Color = StructType<typeof ColorStruct>
export type Project = StructType<typeof ProjectStruct>
