import { type SchemaTypeDefinition } from 'sanity'
import { projectType } from './project'
import { serviceType } from './service'
import { serviceItemType } from './serviceItem'
import { testimonialType } from './testimonial'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [projectType, serviceType, serviceItemType, testimonialType],
}
