import { createCookieSessionStorage } from '@remix-run/node'
import { SESSION_SECRET } from "~/constants";

// Pretty much all that is needed to do basic session management
// Do not use this on PROD, at least not in this way
const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    cookie: {
      name: '__user-session',
      httpOnly: true,
      expires: new Date(Date.now() + 3_600_000), // In 1 hour
      maxAge: 3_600, // 1 Hour
      path: '/',
      sameSite: 'lax',
      secrets: [SESSION_SECRET],
      secure: true,
    },
  })

export { getSession, commitSession, destroySession }