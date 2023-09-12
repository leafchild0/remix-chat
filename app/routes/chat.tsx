import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import ChatManager from "~/chat.server";
import { destroySession, getSession } from "~/session.server";
import { ChatMessage, LoaderData } from "~/interfaces";
import { MAX_MESSAGE_LENGTH } from "~/constants";
import { Chat as MainChat } from "../components/Chat";

export const loader: LoaderFunction = async ({ request }) => {
  const user = await ChatManager.getSessionUser(request)
  return json<LoaderData>({ user, users: ChatManager.getUsers() })
}

export const action: ActionFunction = async ({ request }) => {
  const user = await ChatManager.getSessionUser(request)
  const formData = await request.formData()
  const action = String(formData.get('_action'))

  if (action === 'logout') {
    const session = await getSession(request.headers.get('Cookie'))
    return redirect('/', {
      headers: { 'Set-Cookie': await destroySession(session) },
    })
  }

  if (action === 'send-message') {
    const message = String(formData.get('message')).slice(0, MAX_MESSAGE_LENGTH)
    if (message.length > 0) {
      ChatManager.sendMessage(user, message)
    }
  }

  return null
}

export default function Chat() {
  const loaderData = useLoaderData<LoaderData>()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [users, setUsers] = useState<Set<string>>(
    () => new Set(loaderData.users)
  )

  useEffect(() => {
    const eventSource = new EventSource('/live/chat')

    eventSource.addEventListener('message', event => {
      const data = JSON.parse(event.data)
      setMessages(messages => [
        ...messages,
        { user: data.user, message: data.message },
      ])
    })

    eventSource.addEventListener('user-joined', event => {
      const user = event.data

      setUsers(users => new Set([...users, user]))
      setMessages(messages => [
        ...messages,
        { user: 'System', message: `"${user}" joined the chat` },
      ])
    })

    eventSource.addEventListener('user-left', event => {
      const user = event.data

      setUsers(users => new Set([...users].filter(u => u !== user)))
      setMessages(messages => [
        ...messages,
        { user: 'System', message: `"${user}" left the chat` },
      ])
    })

    return () => eventSource.close()
  }, [])

  return <MainChat
    loaderData={loaderData}
    messages={messages}
  />
}