import { redirect } from '@remix-run/node'
import { getSession } from './session.server'

export default class ChatManager {
  /**
   * Checks if a user is currently logged in, and if not, redirects to the login page.
   * If the user is logged in, returns the user's name.
   */
  static async getSessionUser(request: Request): Promise<string> {
    const session = await getSession(request.headers.get('Cookie'))
    if (!session.get('user')) throw redirect('/')
    return session.get('user')
  }

  /**
   * Adds a user to the chat.
   */
  static addUser(user: string) {
    users.set(user, undefined)
    chatEvents.emit('user-joined', user)
  }

  /**
   * Removes a user from the chat.
   */
  static removeUser(user: string)  {
    users.delete(user)
    chatEvents.emit('user-left', user)
  }

  /**
   * Checks if a user is currently logged in.
   */
  static doesUserExist(user: string) {
    return users.has(user)
  }

  /**
   * Returns a list of all users currently logged in.
   */
  static getUsers() {
    return Array.from(users.keys())
  }

  /**
   * Sends a message to the chat on behalf of a user
   */
  static sendMessage(user: string, message: string) {
    chatEvents.emit('message', { user, message })
  }

}