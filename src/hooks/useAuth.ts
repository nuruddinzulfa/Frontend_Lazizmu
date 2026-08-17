import { useCallback, useEffect, useState } from "react";
import { authService, type User } from "@/services/auth.service";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isLoggedIn = user !== null;

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      try {
        const currentUser =
          await authService.getCurrentUser();

        setUser(currentUser);

        localStorage.setItem(
          "user",
          JSON.stringify(currentUser)
        );
      } catch (error) {
        console.error(
          "AUTH INITIALIZATION ERROR:",
          error
        );

        localStorage.removeItem("token");
        localStorage.removeItem("user");
        sessionStorage.removeItem(
          "adminDashboard"
        );

        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = useCallback(
    async (
      email: string,
      password: string
    ) => {
      setIsLoading(true);

      try {
        const response =
          await authService.login(
            email,
            password
          );

        const loggedInUser =
          response.data.user;

        setUser(loggedInUser);

        localStorage.setItem(
          "user",
          JSON.stringify(loggedInUser)
        );

        sessionStorage.setItem(
          "adminDashboard",
          "true"
        );

        return loggedInUser;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const logout = useCallback(async () => {
    setIsLoading(true);

    try {
      await authService.logout();
    } catch (error) {
      console.error(
        "LOGOUT ERROR:",
        error
      );
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      sessionStorage.removeItem(
        "adminDashboard"
      );

      setUser(null);
      setIsLoading(false);
    }
  }, []);

  return {
    user,
    isLoggedIn,
    login,
    logout,
    isLoading,
  };
}