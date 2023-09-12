export const LoggedUsers = (props: {amount: number}) => {
  return <>
    <div className="stats shadow">
      <div className="stat">
        <div className="stat-title">Logged users</div>
        <div className="stat-value">{props.amount}</div>
      </div>
    </div>
  </>
}