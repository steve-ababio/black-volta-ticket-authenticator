import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Lock, Mail } from "lucide-react";
import { useAuth } from "@/context/authContext";
import { AxiosError } from "axios";
import { routes, STATUS_CODES } from "@/common/constants/constant";
import { ERROR_MESSAGES } from "@/common/constants/messages";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const {login} = useAuth();

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try{
        const {success,role} = await login(email, password);
        if (success && role?.toLowerCase() !== "admin") {
            toast.error(ERROR_MESSAGES.ADMIN_ONLY);
        }
    }catch(error){
        console.log("login: error",error);
        if(error instanceof AxiosError){
            if(error.status === STATUS_CODES.UNAUTHORIZED || error.status === STATUS_CODES.BAD_REQUEST){
                toast.error(ERROR_MESSAGES.INVALID_CREDENTIALS);
                return;
            }
            toast.error(ERROR_MESSAGES.NO_INTERNET)
        }
    }
    finally{
        setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-md bg-black/70 mb-3">
          <img alt="Blacvolta logo" className="aspect-[4/3] object-contain xl:h-auto xl:w-auto" width={60} height={60}  src="/assets/images/logo.png"  />
          </div>
          <p className="text-muted-foreground mt-2">
            Ticket Check-In
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-card md:border md:border-border rounded-xl p-6 py-14 shadow-sm">
          <h2 className="font-display text-xl font-semibold text-foreground mb-6">
            Sign in to your account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading} 
              className="w-full btn-primary py-3 text-sm rounded-sm disabled:opacity-50"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
