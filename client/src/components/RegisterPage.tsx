import { register } from "../helpers/fetchHelpers";

export default function RegisterPage() {
  return (
    <>
      <h2>Register 🚀</h2>
      <form action={register}>
        <label htmlFor="username">Username</label>
        <input type="text" name="username" placeholder="Mr. Meeple" />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          placeholder="Keep it a secret 🤫"
        />
        <label htmlFor="city">City</label>
        <input type="text" name="city" placeholder="Tokyo" />
        <button type="submit">Register</button>
      </form>
    </>
  );
}
