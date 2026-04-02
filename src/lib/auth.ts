export type AuthRole = "user" | "admin";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: AuthRole;
}

interface AuthResponse {
  success: boolean;
  user?: AuthUser;
  error?: string;
}

// Client-side authentication functions using API routes
export async function login(
  email: string,
  password: string,
): Promise<AuthResponse> {
  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });

    const result = (await response.json()) as AuthResponse;

    if (!response.ok) {
      return { success: false, error: result.error || "Login failed" };
    }

    return result;
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error: "Network error occurred during login" };
  }
}

export async function signup(
  name: string,
  email: string,
  password: string,
): Promise<AuthResponse> {
  try {
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
      credentials: "include",
    });

    const result = (await response.json()) as AuthResponse;

    if (!response.ok) {
      return { success: false, error: result.error || "Signup failed" };
    }

    return result;
  } catch (error) {
    console.error("Signup error:", error);
    return { success: false, error: "Network error occurred during signup" };
  }
}

export function getCurrentUser(): {
  user: AuthUser | null;
  role: AuthRole | null;
} {
  if (typeof window === "undefined") {
    return { user: null, role: null };
  }

  const userData = localStorage.getItem("currentUser");
  if (!userData) {
    return { user: null, role: null };
  }

  try {
    const user = JSON.parse(userData) as AuthUser;
    return { user, role: user.role };
  } catch {
    return { user: null, role: null };
  }
}

export async function getCurrentSessionUser(): Promise<{
  user: AuthUser | null;
  role: AuthRole | null;
}> {
  try {
    const response = await fetch("/api/auth/me", {
      method: "GET",
      credentials: "include",
      cache: "no-store",
    });

    if (!response.ok) {
      return { user: null, role: null };
    }

    const result = (await response.json()) as AuthResponse;
    if (!result.success || !result.user) {
      return { user: null, role: null };
    }

    if (typeof window !== "undefined") {
      localStorage.setItem("currentUser", JSON.stringify(result.user));
    }

    return { user: result.user, role: result.user.role };
  } catch {
    return { user: null, role: null };
  }
}

export async function logout() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("cart");
  }

  await fetch("/api/auth/logout", {
    method: "POST",
    credentials: "include",
  });
}
