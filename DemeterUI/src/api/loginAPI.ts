interface LoginResponse {
  accessToken: string;
  refreshToken: string | null;
}

export async function LoginAPI(
  email: string,
  password: string
): Promise<LoginResponse> {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const loginURL = `${API_BASE_URL}/Auth/login`;

  try {
    const response = await fetch(loginURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email,
        username: "jpcanas",
        password: password,
      }),
      credentials: "include",
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage || "Login failed");
    }

    const result: LoginResponse = await response.json();
    return result;
  } catch (error: any) {
    console.error("Login failed", error.message);
    throw error;
  }
}
