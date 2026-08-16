import {useCallback, useState} from 'react'
import {Box, Button, Card, Dialog, Flex, Heading, Inline, Spinner, Stack, Text, useToast} from '@sanity/ui'
import {PublishIcon} from '@sanity/icons'
import {useClient, type SanityDocument} from 'sanity'

import {apiVersion} from '../env'

const DRAFTS_QUERY = '*[_id in path("drafts.**")]'

// Same two-mutation pattern Studio's own "Publish" button performs on a
// single document — write the draft's content to its published _id, then
// remove the draft. Each document is its own transaction so one bad
// document can't block the rest from publishing.
function publishDraft(client: ReturnType<typeof useClient>, draft: SanityDocument) {
  const publishedId = draft._id.replace(/^drafts\./, '')
  return client
    .transaction()
    .createOrReplace({...draft, _id: publishedId})
    .delete(draft._id)
    .commit()
}

type DialogState =
  | {status: 'checking'}
  | {status: 'confirm'; count: number}
  | {status: 'publishing'; total: number}
  | {status: 'error'; message: string}

export default function PublishAllChanges() {
  const client = useClient({apiVersion})
  const toast = useToast()
  const [dialog, setDialog] = useState<DialogState | null>(null)

  const openDialog = useCallback(async () => {
    setDialog({status: 'checking'})
    try {
      const drafts = await client.fetch<SanityDocument[]>(DRAFTS_QUERY)
      setDialog({status: 'confirm', count: drafts.length})
    } catch (err) {
      setDialog({
        status: 'error',
        message: err instanceof Error ? err.message : 'Could not check for drafts.',
      })
    }
  }, [client])

  const closeDialog = useCallback(() => setDialog(null), [])

  const handlePublishAll = useCallback(async () => {
    // Re-fetch fresh content at the moment of publishing, in case anything
    // changed while the confirmation dialog was open.
    const drafts = await client.fetch<SanityDocument[]>(DRAFTS_QUERY)
    setDialog({status: 'publishing', total: drafts.length})

    const results = await Promise.allSettled(drafts.map((draft) => publishDraft(client, draft)))
    const succeeded = results.filter((r) => r.status === 'fulfilled').length
    const failed = results.filter((r): r is PromiseRejectedResult => r.status === 'rejected')

    setDialog(null)

    if (failed.length === 0) {
      toast.push({
        status: 'success',
        title: succeeded === 0 ? 'Nothing to publish' : `Published ${succeeded} document${succeeded === 1 ? '' : 's'}`,
      })
      return
    }

    failed.forEach((f) => console.error('Publish All Changes — failed to publish a document:', f.reason))
    toast.push({
      status: succeeded === 0 ? 'error' : 'warning',
      title: `Published ${succeeded} of ${results.length} document${results.length === 1 ? '' : 's'}`,
      description: `${failed.length} failed — see the browser console for details.`,
    })
  }, [client, toast])

  const isBusy = dialog?.status === 'checking' || dialog?.status === 'publishing'

  return (
    <Box padding={4}>
      <Stack space={4} style={{maxWidth: 480}}>
        <Heading size={2}>Publish All Changes</Heading>
        <Text muted size={1}>
          Publishes every document that currently has unpublished draft changes in one go —
          the same as opening each one and clicking Publish, just batched. Documents that are
          already published with no pending draft are left untouched.
        </Text>
        <Inline>
          <Button
            text="Publish All Changes"
            tone="positive"
            icon={PublishIcon}
            loading={dialog?.status === 'checking'}
            disabled={isBusy}
            onClick={openDialog}
          />
        </Inline>
      </Stack>

      {dialog?.status === 'confirm' && (
        <Dialog
          id="publish-all-confirm"
          header="Publish all changes?"
          onClose={closeDialog}
          zOffset={1000}
          footer={
            <Flex padding={3} justify="flex-end" gap={2}>
              <Button text="Cancel" mode="ghost" onClick={closeDialog} />
              <Button
                text="Publish All"
                tone="positive"
                disabled={dialog.count === 0}
                onClick={handlePublishAll}
              />
            </Flex>
          }
        >
          <Box padding={4}>
            <Text size={2}>
              {dialog.count === 0
                ? 'There are no documents with draft changes right now.'
                : `This will publish ${dialog.count} document${dialog.count === 1 ? '' : 's'} with pending draft changes. Already-published documents with no draft changes will not be modified.`}
            </Text>
          </Box>
        </Dialog>
      )}

      {dialog?.status === 'publishing' && (
        <Dialog id="publish-all-progress" header="Publishing…" onClose={() => {}} zOffset={1000}>
          <Box padding={4}>
            <Flex align="center" gap={3}>
              <Spinner muted />
              <Text size={2}>
                Publishing {dialog.total} document{dialog.total === 1 ? '' : 's'}…
              </Text>
            </Flex>
          </Box>
        </Dialog>
      )}

      {dialog?.status === 'error' && (
        <Dialog id="publish-all-error" header="Couldn't check for drafts" onClose={closeDialog} zOffset={1000}>
          <Box padding={4}>
            <Card tone="critical" padding={3} radius={2} border>
              <Text size={2}>{dialog.message}</Text>
            </Card>
          </Box>
        </Dialog>
      )}
    </Box>
  )
}
