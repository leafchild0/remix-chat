import type { ChatProps } from '~/interfaces'
import { Header } from '~/components/Header'
import { LoggedUsers } from '~/components/LoggedUsers'
import { PostMessage } from '~/components/PostMessage'
import { MessagesList } from '~/components/MessagesList'

export function Chat({ loaderData, messages }: ChatProps) {
  return (
    <>
      <Header loaderData={loaderData} />
      <LoggedUsers amount={loaderData.users.length} />
      <div className="divider"></div>
      <MessagesList loaderData={loaderData} messages={messages} />
      <div className="divider"></div>
      <PostMessage />
    </>
  )
}
