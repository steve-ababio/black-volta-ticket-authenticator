import { AuthService } from "@/services/auth.service";
import { clearTokens, setTokens } from "@/utils/utils";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Role = "admin" | "user" | "";
type Login = {
    success:boolean,
    role:Role;
}
interface AuthContextType {
  isAuthenticated: boolean;
  role:Role,
  staffName: string | null;
  login: (email: string, password: string) => Promise<Login>;
  logout: () => void;
  isLoading:boolean
}



const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role,setRole] = useState<Role>()
  const [staffName, setStaffName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedAuth = localStorage.getItem("ticketverify_auth");
    console.log(storedAuth)
    if (storedAuth) {
      const { name } = JSON.parse(storedAuth);
      setIsAuthenticated(true);
      setStaffName(name);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<Login> => {
    const response = await AuthService.login(email,password);
    const user = response.data.user;
    const {accessToken,refreshToken} = response.data.tokens
    if (user) {
      setIsAuthenticated(true);
      setStaffName(user.firstName);
      setRole(user.role);
      setTokens(accessToken, refreshToken);
      localStorage.setItem("ticketverify_auth", JSON.stringify({ name: user.firstName,id:user.id }));
      return {success:true,role:user.role};
    }
    return {success:false,role:""};
  };

  const logout = () => {
    setIsAuthenticated(false);
    setStaffName(null);
    clearTokens();
    localStorage.removeItem("ticketverify_auth");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, staffName, login, logout,role,isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
