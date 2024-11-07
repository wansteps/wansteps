import { Authenticator } from "remix-auth";
import { FormStrategy } from "remix-auth-form";
import { signIn } from "~/lib/sign-in";
import { sessionStorage } from "~/services/session.server";

// Create an instance of the authenticator, pass a generic with what
// strategies will return and will store in the session
export const authenticator = new Authenticator<User>(sessionStorage);

authenticator.use(
  new FormStrategy(async ({ form }) => {
    const email = form.get("email");
    const password = form.get("password");
    return await signIn(email, password);
  }),
  "user-pass"
);
