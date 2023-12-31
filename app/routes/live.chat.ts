import type { LoaderFunction } from '@remix-run/node'
import ChatManager from '~/chat.server'
import type { ChatMessage } from '~/interfaces'
import { chat } from '~/root'

/**
 * Pretty much logic of live chatting here, events emitting, these are streams
 * Handles different listeners for events
 */
export const loader: LoaderFunction = async ({ request }) => {
  if (!request.signal) return new Response(null, { status: 500 })
  const user = await ChatManager.getSessionUser(request)

  return new Response(
    new ReadableStream({
      start(controller) {
        const encoder = new TextEncoder()

        const handleChatMessage = ({ user, message }: ChatMessage) => {
          console.log('message', { user, message })
          controller.enqueue(encoder.encode('event: message\n'))
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ user, message })}\n\n`)
          )
        }

        const handleUserJoined = (user: string) => {
          console.log('user joined', { user })
          controller.enqueue(encoder.encode('event: user-joined\n'))
          controller.enqueue(encoder.encode(`data: ${user}\n\n`))
        }

        const handleUserLeft = (user: string) => {
          console.log('user left', { user })
          controller.enqueue(encoder.encode('event: user-left\n'))
          controller.enqueue(encoder.encode(`data: ${user}\n\n`))
        }

        let closed = false
        const close = () => {
          if (closed) return
          closed = true

          chat.removeListener('message', handleChatMessage)
          chat.removeListener('user-joined', handleUserJoined)
          chat.removeListener('user-left', handleUserLeft)
          request.signal.removeEventListener('abort', close)
          controller.close()

          ChatManager.removeUser(user)
        }

        chat.addListener('message', handleChatMessage)
        chat.addListener('user-joined', handleUserJoined)
        chat.addListener('user-left', handleUserLeft)
        request.signal.addEventListener('abort', close)

        if (request.signal.aborted) {
          close()
          return
        }

        if (!ChatManager.doesUserExist(user)) {
          ChatManager.addUser(user)
          console.log('users', ChatManager.getUsers())
        }
      },
    }),
    { headers: { 'Content-Type': 'text/event-stream' } }
  )
}
