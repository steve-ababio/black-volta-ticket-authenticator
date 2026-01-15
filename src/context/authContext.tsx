import { AuthService } from "@/services/auth.service";
import { clearTokens, setTokens } from "@/utils/utils";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

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
    const initAuth = async () => {
      try {
        const storedAuth = localStorage.getItem("ticketverify_auth");
        const refreshToken = localStorage.getItem("refreshToken");
        const role = JSON.parse(localStorage.getItem("auth-role") as string);
  
        if (storedAuth && role && refreshToken) {
          const response = await AuthService.getToken(refreshToken);
          if (response.success) {
            const { accessToken, refreshToken: newRefreshToken } = response.data;
            const { name } = JSON.parse(storedAuth);
  
            setIsAuthenticated(true);
            setStaffName(name);
            setRole(role);
            setTokens(accessToken, newRefreshToken);
          } else {
            setIsAuthenticated(false);
          }
        }
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false); // ✅ ONLY here
      }
    };
    initAuth();
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
      localStorage.setItem("auth-role", JSON.stringify(user.role ));
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
