import type { ActionFunction, LoaderFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { Form, useActionData } from '@remix-run/react'
import ChatManager from '~/chat.server'
import { commitSession, getSession } from '~/session.server'
import { ActionData } from "~/interfaces";
import { MAX_USERNAME_LENGTH } from "~/constants";
import { Login } from "~/components/Login";


export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get('Cookie'))
  if (session.has('user')) {
    throw redirect('/chat')
  }
  return null
}

export const action: ActionFunction = async ({ request }) => {
  const session = await getSession(request.headers.get('Cookie'))
  const formData = await request.formData()

  const user = String(formData.get('user')).slice(0, MAX_USERNAME_LENGTH)
  if (
    user.length <= 0 ||
    user.toLowerCase() === 'system' ||
    ChatManager.doesUserExist(user)
  ) {
    return json<ActionData>({
      error: 'Invalid username or user already exists',
    })
  }

  session.set('user', user)

  return redirect('/chat', {
    headers: {
      'Set-Cookie': await commitSession(session),
    },
  })
}

export default function Index() {
  const actionData = useActionData<ActionData>()

  // This should be styled better
  return (
    <Login actionData={actionData as ActionData}/>
  )
}