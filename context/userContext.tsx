import { createContext, useContext, useEffect, useState } from "react";
import { API } from "../api";
import * as SecureStore from "expo-secure-store";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
interface UserContextType {
  user: any;
  setUser: (user: any) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  formData: {
    name: string;
    email: string;
    password: string;
  };
  setFormData: (formData: any) => void;
  handleInputChange: (e: React.FormEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  data: {
    id: number;
    name: string;
    label: string;
    placeholder: string;
    value: string;
  }[];
}
type AuthStackParamList = {
  setupprofile: undefined;
};

type NavigationProp = NativeStackNavigationProp<AuthStackParamList>;

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const navigate = useNavigation<NavigationProp>();
  const [user, setUser] = useState<any>(null);
  const [isLogin, setIsLogin] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const data = [
    {
      id: 1,
      name: "name",
      label: "Username",
      placeholder: "Enter your username",
      value: formData.name,
    },
    {
      id: 2,
      name: "email",
      label: "Email",
      placeholder: "Enter your email",
      value: formData.email,
    },
    {
      id: 3,
      name: "password",
      label: "Password",
      placeholder: "Enter your password",
      value: formData.password,
    },
  ];

  const LoginData = [
    {
      id: 1,
      name: "email",
      label: "Email",
      placeholder: "Enter your email",
      value: loginForm.email,
    },
    {
      id: 2,
      name: "password",
      label: "Password",
      placeholder: "Enter your password",
      value: loginForm.password,
    },
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      formData.name === "" ||
      formData.email === "" ||
      formData.password === ""
    ) {
      alert("Please fill in all fields");
      return;
    }
    setIsLoading(true);
    try {
      const res = await API.post("/auth/register", formData);
      console.log(res.data);
      alert(res.data.message);
      setIsLogin(true);
    } catch (error: any) {
      console.log(error);
      alert(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loginForm.email === "" || loginForm.password === "") {
      alert("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      const res = await API.post("/auth/login", loginForm);
      console.log(res.data);
      alert(res.data.message);
      updateUser(res.data.data);
      navigate.navigate("setupprofile");
    } catch (error: any) {
      console.log(error);
      alert(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async (idToken: string) => {
    try {
      const res = await API.post("/auth/google-auth", { idToken });
      console.log(res.data);
      alert(res.data.message);
      updateUser(res.data.data);
    } catch (error) {
      console.log(error);
      alert("Failed to authenticate with Google");
    }
  };

  const handleUpdateProfile = async (userId: string, formData: FormData) => {
    setIsLoading(true);
    try {
      const res = await API.put(`/user/${userId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(res.data);
      updateUser(res.data.data);
      return res.data;
    } catch (error) {
      console.log(error);
      throw error;
      alert("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await API.post("/auth/logout");
      setUser(null);
      setIsAuthenticated(false);
      await SecureStore.deleteItemAsync("user");
      navigate.reset({
        index: 0,
        routes: [{ name: "intro" } as any],
      });
      alert("Logged out successfully");
    } catch (error) {
      console.log("Error logging out:", error);
      alert("Failed to log out");
    }
  };

  useEffect(() => {
    const loadUser = async () => {
      try {
        const savedUser = await SecureStore.getItemAsync("user");
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.log("Error loading user:", error);
      }
    };
    loadUser();
  }, []);

  const updateUser = async (data: any) => {
    try {
      await SecureStore.setItemAsync("user", JSON.stringify(data));
      setUser(data);
    } catch (error) {
      console.log("Error saving user:", error);
    }
  };

  useEffect(() => {
    const saveUser = async () => {
      if (user) {
        await SecureStore.setItemAsync("user", JSON.stringify(user));
      }
    };
    saveUser();
  }, [user]);

  const value = {
    user,
    setUser,
    isAuthenticated,
    setIsAuthenticated,
    data,
    formData,
    setFormData,
    handleSubmit,
    loginForm,
    setLoginForm,
    LoginData,
    handleLogin,
    isLogin,
    setIsLogin,
    handleGoogleAuth,
    handleUpdateProfile,
    navigate,
    handleLogout,
    isLoading,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserContext;

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserContextProvider");
  }
  return context;
};
