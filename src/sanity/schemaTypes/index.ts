import { type SchemaTypeDefinition } from 'sanity'
import { projectType } from './project'
import { serviceType } from './service'
import { serviceItemType } from './serviceItem'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [projectType, serviceType, serviceItemType],
}
