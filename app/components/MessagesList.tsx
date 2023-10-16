import type { ChatProps } from '~/interfaces'

export const MessagesList = ({ loaderData, messages }: ChatProps) => {
  return (
    <div className="p-3 text-base-content">
      {messages.map(({ user, message }, index) => (
        <div
          key={index}
          className={`chat chat-${user === loaderData.user ? 'start' : 'end'}`}
        >
          <div className="chat-header">{user}</div>
          <div
            className={`chat-bubble text-slate-100 ${
              user === loaderData.user ? 'bg-info' : 'bg-accent'
            }`}
          >
            {message}
          </div>
        </div>
      ))}
    </div>
  )
}
