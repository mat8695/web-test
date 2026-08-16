import { type SchemaTypeDefinition } from 'sanity'
import { leadType } from './lead'
import { preBriefType } from './preBrief'
import { preBriefAnswerType } from './preBriefAnswer'
import { preBriefQuestionType } from './preBriefQuestion'
import { preBriefSettingsType } from './preBriefSettings'
import { projectType } from './project'
import { serviceType } from './service'
import { serviceItemType } from './serviceItem'
import { testimonialType } from './testimonial'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    projectType,
    serviceType,
    serviceItemType,
    testimonialType,
    leadType,
    preBriefType,
    preBriefAnswerType,
    preBriefQuestionType,
    preBriefSettingsType,
  ],
}
