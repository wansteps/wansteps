import { authenticator } from "~/services/auth.server";
import { LoaderFunctionArgs } from "@remix-run/node";

export async function loader({ request }: LoaderFunctionArgs) {
  return await authenticator.logout(request, {
    redirectTo: "/sign-in"
});
}