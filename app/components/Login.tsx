import { Form } from '@remix-run/react'
import type { LoginProps } from '~/interfaces'

export function Login({ actionData }: LoginProps) {
  return (
    <>
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">Hello there</h1>
            <p className="py-6">
              This is simple chat using Remix. Click below to join
            </p>
            <Form method="post" className="space-y-4">
              <input
                type="text"
                name="user"
                placeholder="Username"
                className="w-full input input-bordered"
              />
              <button type="submit" className="btn btn-primary">
                Join
              </button>
            </Form>
            {actionData?.error ? (
              <div style={{ color: 'red' }}>{actionData.error}</div>
            ) : null}
          </div>
        </div>
      </div>
    </>
  )
}
