export interface ChatMessage {
  user: string
  message: string
}

export interface ActionData {
  error?: string
}

export interface LoaderData {
  user: string
  users: string[]
}