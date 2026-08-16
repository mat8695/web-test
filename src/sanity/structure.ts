import type {StructureResolver} from 'sanity/structure'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      // Singleton: one fixed document, not a creatable list.
      S.listItem()
        .title('Pre-Brief Questions')
        .id('preBriefSettings')
        .child(
          S.document().schemaType('preBriefSettings').documentId('preBriefSettings')
        ),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) => item.getId() !== 'preBriefSettings'
      ),
    ])
