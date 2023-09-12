import { Form, useNavigation } from "@remix-run/react";
import { ChatProps } from "~/interfaces";
import { useEffect, useRef } from "react";


export function Chat({ loaderData, messages }: ChatProps) {

  const formRef = useRef<HTMLFormElement>(null)
  const navigation = useNavigation()

  useEffect(() => {
    if (navigation.state === 'submitting') {
      formRef.current?.reset()
    }
  }, [navigation.state])

  return <main style={{ fontFamily: 'Helvetica, sans-serif', lineHeight: '1.4' }}>
    <header style={{ marginBlock: '1rem' }}>
      <h1 style={{ marginBlock: '0' }}>Remix Chat</h1>
      <Form method="post">
        <button
          type="submit"
          name="_action"
          value="logout"
          title={`${loaderData.user}, log out`}
        >
          Logout
        </button>
      </Form>
    </header>
    <section>
      <div>
        Logged in as <strong>{loaderData.user}</strong>
      </div>
      <div title={`Users: ${[...users].join(', ')}`}>
        <strong>{users.size}</strong> Logged in users
      </div>
    </section>
    <section>
      <ul>
        {messages.map(({ user, message }, index) => (
          <li key={index}>
            <strong>{user}: </strong>
            {message}
          </li>
        ))}
      </ul>
      <Form ref={formRef} method="post" replace>
        <input type="text" name="message" />
        <button type="submit" name="_action" value="send-message">
          Send
        </button>
      </Form>
    </section>
  </main>

}