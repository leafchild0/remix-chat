import { Form } from "@remix-run/react";
import { LoginProps } from "~/interfaces";

export function Login({ actionData }: LoginProps) {
  return <main style={{ fontFamily: "Helvetica, sans-serif", lineHeight: "1.4" }}>
    <h1>Remix Chat</h1>
    <Form method="post">
      <input type="text" name="user" placeholder="Username" />
      <button type="submit">Join</button>
    </Form>
    {actionData?.error ? (
      <div style={{ color: "red" }}>{actionData.error}</div>
    ) : null}
  </main>;
}