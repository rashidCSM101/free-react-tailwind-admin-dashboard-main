import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import Button from "../ui/button/Button";
// import { useAuth } from "../../context/AuthContext"; // Not needed anymore
import { useLoginMutation } from "../../store/api/authApi"; // RTK Query login hook
import { useAppDispatch, useAppSelector } from "../../store/hooks"; // Redux hooks
import { setCredentials } from "../../store/slices/authSlice"; // Redux action

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [username, setUsername] = useState(""); // Changed from email to username to match backend
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  // RTK Query login mutation
  const [loginUser, { isLoading }] = useLoginMutation();
  
  // Get auth state from Redux
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true }); // Agar user already login hai to dashboard pe redirect
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    console.log("🔐 Login attempt:", { username, password });
    
    // Basic validation
    if (!username || !password) {
      setError("Username and password are required");
      return;
    }
    
    try {
      // Test backend connection first
      console.log("🌐 Testing backend connection...");
      
      // RTK Query se login API call
      const result = await loginUser({ username, password }).unwrap();
      console.log("✅ Login successful:", result);
      
      // Store credentials in Redux store
      dispatch(setCredentials({
        user: result.user,
        token: result.access_token
      }));
      
      console.log("🚀 Navigating to dashboard...");
      navigate("/", { replace: true });
    } catch (err: any) {
      console.error("❌ Login failed:", err);
      
      // Better error handling
      if (err?.status === 'FETCH_ERROR') {
        setError("Cannot connect to server. Make sure backend is running on port 8002.");
      } else if (err?.status === 401) {
        setError("Invalid username or password");
      } else {
        setError(err?.data?.detail || err?.message || "Login failed. Please try again.");
      }
    }
  };


  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign In
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your email and password to sign in!
            </p>
          </div>
          <div>
            <form onSubmit={onSubmit}>
              <div className="space-y-6">
                {error && (
                  <div className="p-3 text-sm text-red-700 bg-red-100 border border-red-200 rounded-lg dark:bg-red-500/10 dark:text-red-300 dark:border-red-800">
                    {error}
                  </div>
                )}
                <div>
                  <Label>
                    Username <span className="text-error-500">*</span>{" "}
                  </Label>
                  <Input placeholder="Enter your username" value={username} onChange={(e: any) => setUsername(e.target.value)} />
                </div>
                <div>
                  <Label>
                    Password <span className="text-error-500">*</span>{" "}
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e: any) => setPassword(e.target.value)}
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      )}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox checked={isChecked} onChange={setIsChecked} />
                    <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                      Keep me logged in
                    </span>
                  </div>
                  <Link
                    to="/reset-password"
                    className="text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-brand-400 dark:hover:text-brand-300"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div>
                  <Button type="submit" className="w-full" size="sm" disabled={isLoading}>
                    {isLoading ? "Signing In..." : "Sign In"}
                  </Button>
                </div>
              </div>
            </form>
            
            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Don&apos;t have an account? {""}
                <Link
                  to="/signup"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
