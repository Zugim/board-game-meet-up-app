import { login } from "../helpers/fetchHelpers";

export default function LoginPage() {
  return (
    <>
      <h2>Please Login 🙏</h2>
      <form action={login}>
        <label htmlFor="username">Username</label>
        <input type="text" name="username" placeholder="Mr. Meeple" />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          placeholder="Keep it a secret 🤫"
        />
        <button type="submit">Login</button>
      </form>
    </>
  );
}
