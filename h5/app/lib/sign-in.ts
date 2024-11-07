export async function signIn(email: string, password: string) {
  const response = await fetch(`${process.env.API_URL}/auth/sign-in`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  if (response.status >= 400) {
    return null;
  }
  return response.json();
}
