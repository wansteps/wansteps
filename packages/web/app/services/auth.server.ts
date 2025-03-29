import { Authenticator, AuthorizationError } from "remix-auth";
import { FormStrategy } from "remix-auth-form";
import { sessionStorage } from "~/services/session.server";

// Create an instance of the authenticator, pass a generic with what
// strategies will return and will store in the session
export const authenticator = new Authenticator<User>(sessionStorage);

authenticator.use(
  new FormStrategy(async ({ form }) => {
    const { email, password } = Object.fromEntries(form);
    const response = await fetch(`${process.env.API_URL}/auth/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    if (response.status >= 400) {
      throw new AuthorizationError(JSON.stringify(await response.json()));
    }
    return response.json();
  }),
  "user-pass"
);
