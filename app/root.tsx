import type { MetaFunction } from '@remix-run/node'
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react'
import { LRUCache } from "lru-cache";
import { EventEmitter } from "node:events";

declare global {
  let users: LRUCache<string, {}>;
  let chatEvents: EventEmitter;
}

// @ts-ignore
global.users = global.users ||
  new LRUCache({
    max: 100,
    ttl: 3_600_000,
  })
// @ts-ignore
global.chatEvents = global.chatEvents || new EventEmitter()

export const chat = chatEvents

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'Remix Chat App',
  viewport: 'width=device-width,initial-scale=1',
})

export default function App() {
  return (
    <html lang="en">
    <head>
      <Meta />
      <Links />
    </head>
    <body>
    <Outlet />
    <ScrollRestoration />
    <Scripts />
    <LiveReload />
    </body>
    </html>
  )
}