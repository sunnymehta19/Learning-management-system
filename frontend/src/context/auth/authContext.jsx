import { Skeleton } from "@/components/ui/skeleton";
import { initialSignInFormData, initialSignUpFormData } from "@/config";
import { checkAuthService, loginService, registerService } from "@/services";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [signInFormData, setSignInFormData] = useState(initialSignInFormData);
  const [signUpFormData, setSignUpFormData] = useState(initialSignUpFormData);
  const [auth, setAuth] = useState({
    authenticate: false,
    user: null,
  });
  const [loading, setLoading] = useState(true);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const navigate = useNavigate();

  async function handleRegisterUser(event) {
    event.preventDefault();
    setIsSigningUp(true);

    try {
      const data = await registerService(signUpFormData);

      if (data.success) {
        toast.success("Account created successfully. Please sign in.");
        setSignUpFormData(initialSignUpFormData);
      } else {
        toast.error(data.message || "Registration failed");
      }

      setIsSigningUp(false);
      return data;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      setIsSigningUp(false);
      return null;
    }
  }

  async function handleLoginUser(event) {
    event.preventDefault();
    setIsSigningIn(true);

    try {
      const data = await loginService(signInFormData);

      if (data.success) {
        sessionStorage.setItem(
          "accessToken",
          JSON.stringify(data.data.accessToken)
        );

        setAuth({
          authenticate: true,
          user: data.data.user,
        });

        toast.success("Login successful");
        setSignInFormData(initialSignInFormData);
        setIsSigningIn(false);
        navigate("/");
      } else {
        setAuth({
          authenticate: false,
          user: null,
        });

        toast.error(data.message || "Invalid email or password");
        setIsSigningIn(false);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      setIsSigningIn(false);
    }
  }

  //check auth user
  async function checkAuthUser() {
    try {
      const data = await checkAuthService();
      if (data.success) {
        setAuth({
          authenticate: true,
          user: data.data.user,
        });
        setLoading(false);
      } else {
        setAuth({
          authenticate: false,
          user: null,
        });
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      if (!error?.response?.data?.success) {
        setAuth({
          authenticate: false,
          user: null,
        });
        setLoading(false);
      }
    }
  }

  function resetCredentials() {
    setAuth({
      authenticate: false,
      user: null,
    });
  }

  useEffect(() => {
    checkAuthUser();
  }, []);



  return (
    <AuthContext.Provider
      value={{
        signInFormData,
        setSignInFormData,
        signUpFormData,
        setSignUpFormData,
        handleRegisterUser,
        handleLoginUser,
        auth,
        resetCredentials,
        isSigningIn,
        isSigningUp,
      }}
    >
      {loading ? <Skeleton /> : children}
    </AuthContext.Provider>
  );
}