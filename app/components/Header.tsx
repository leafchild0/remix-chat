import { Form } from "@remix-run/react";
import { LoaderData } from "~/interfaces";

export const Header = (props: {loaderData: LoaderData}) => {
  return <div className="navbar bg-primary text-primary-content mb-6">
    <div className="flex-1">
      <a className="btn btn-ghost normal-case text-xl">Remix Chat</a>
    </div>
    <div className="flex-none">
      <span className="mr-3"> Logged in as {props.loaderData.user}</span>
      <Form method="post">
        <button
          className="btn btn-outline btn-error normal-case"
          type="submit"
          name="_action"
          value="logout"
        >
          Logout
        </button>
      </Form>
    </div>
  </div>
}