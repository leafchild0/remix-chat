import { Form, useNavigation } from '@remix-run/react'
import { useEffect, useRef } from 'react'

export const PostMessage = () => {
  const formRef = useRef<HTMLFormElement>(null)
  const navigation = useNavigation()

  useEffect(() => {
    if (navigation.state === 'submitting') {
      formRef.current?.reset()
    }
  }, [navigation.state])

  return (
    <div className="w-full flex max-w-xl m-auto mt-10">
      <Form
        ref={formRef}
        method="post"
        replace
        className="w-full flex max-w-xl"
      >
        <input
          type="text"
          name="message"
          className="input input-bordered mr-6 flex-1"
        />
        <button
          type="submit"
          name="_action"
          value="send-message"
          className="btn btn-primary "
        >
          Send
        </button>
      </Form>
    </div>
  )
}
