import { useState, useContext, useEffect } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import Label from "../components/Label";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { jwtDecode } from "jwt-decode";
import { Eye, EyeOff, Loader, CheckSquare, Square, LogIn, Heart } from "lucide-react";
import { toast } from "react-hot-toast";
import { useGoogleOneTapLogin, GoogleLogin } from '@react-oauth/google';
import api from '../services/api.js';

const Login = () => {
    const [email, setEmail] = useState(localStorage.getItem("rememberedEmail") || "");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(localStorage.getItem("rememberMe") === "true");
    const { user, setUser } = useContext(AuthContext);
    const navigate = useNavigate();

    // Redirect if already logged in
    useEffect(() => {
        if (user) {
            navigate("/dashboard", { replace: true });
        }
    }, [user, navigate]);

    // Google One Tap Login
    useGoogleOneTapLogin({
        onSuccess: credentialResponse => {
            console.log("🔵 One Tap Success:", credentialResponse);
            handleGoogleSuccess(credentialResponse);
        },
        onError: () => {
            console.log("❌ One Tap Login Failed");
        },
        disabled: !!user, // Disable if user is already logged in
        cancel_on_tap_outside: true,
        auto_select: false,
    });

    const handleGoogleSuccess = async (credentialResponse) => {
        console.log("🔵 Google Login Success:", credentialResponse);
        
        if (!credentialResponse?.credential) {
            console.error("❌ No credential received from Google");
            setError("Google login failed. No credential received.");
            toast.error("Google login failed. Please try again.");
            return;
        }

        setLoading(true);
        setError("");
        
        try {
            console.log("🔵 Sending credential to server...");
            const res = await api.post("/api/auth/google-login", {
                token: credentialResponse.credential,
            });

            console.log("✅ Server Response:", res.data);

            if (!res.data.token) {
                throw new Error("No token received from server");
            }

            localStorage.setItem("token", res.data.token);
            const decodedUser = jwtDecode(res.data.token);
            setUser(decodedUser);

            console.log("✅ User logged in:", decodedUser);
            toast.success("Successfully logged in with Google!");
            navigate("/dashboard", { replace: true });
        } catch (error) {
            console.error("❌ Google login failed:", error);
            const errorMessage = error.response?.data?.message || error.message || "Google login failed";
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleError = () => {
        console.log("❌ Google Login Error");
        setError("Google login failed. Please try again.");
        toast.error("Google login failed. Please try again.");
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            console.log("Attempting login with email:", email);
            const res = await api.post("/api/auth/login", { email, password });
            console.log("Login response:", res.data);
            if (!res.data.token) throw new Error("No token received");

            localStorage.setItem("token", res.data.token);
            setUser(jwtDecode(res.data.token));

            if (rememberMe) {
                localStorage.setItem("rememberMe", "true");
                localStorage.setItem("rememberedEmail", email);
            } else {
                localStorage.removeItem("rememberMe");
                localStorage.removeItem("rememberedEmail");
            }

            toast.success("Successfully logged in!");
            navigate("/dashboard", { replace: true });
        } catch (error) {
            console.error("Login error details:", error.response?.data || error.message);
            const message = error.response?.data?.message || "Invalid credentials. Please try again.";
            setError(message);
            toast.error(message);
            console.error("Login failed:", message || error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className=" bg-white/80 backdrop-blur-lg rounded-3xl shadow-lg border border-blue-100/50 p-8">
                    {/* MediQR Branding Header */}
                    <div className="text-center mb-5">
                        <div className="flex justify-center items-center space-x-2 mb-4">
                            <div className="bg-blue-600 p-2 rounded-full">
                                <Heart className="w-6 h-6 text-white" />
                            </div>
                            <h1 className="text-xl font-bold text-blue-600">MediQR</h1>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back!</h2>
                        <p className="text-gray-600">Sign in to your MediQR account</p>
                    </div>

            <form className="space-y-3.5" onSubmit={handleLogin}>
                {/* Email Input */}
                <div>
                    <Label htmlFor="email" className="text-md font-medium text-gray-700 mb-2 block">Email</Label>
                    <Input 
                        id="email" 
                        type="email" 
                        placeholder="Enter your email" 
                        required 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-3 border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                </div>

                {/* Password Input with Visibility Toggle */}
                <div>
                    <Label htmlFor="password" className="text-md font-medium text-gray-700 mb-2 block">Password</Label>
                    <div className="relative">
                        <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-3 pr-10 border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between ">
                    <div className="flex items-center space-x-2">
                        <button type="button" onClick={() => setRememberMe(!rememberMe)} className="text-blue-600">
                            {rememberMe ? <CheckSquare size={16} /> : <Square size={16} />}
                        </button>
                        <span className="text-gray-600">Remember me</span>
                    </div>
                    <span
                        className="text-blue-600 hover:text-blue-700 cursor-pointer font-semibold"
                        onClick={() => navigate("/forgot-password")}
                    >
                        Forgot password?
                    </span>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-4">
                        <p className="text-red-600 text-sm">{error}</p>
                    </div>
                )}

                {/* Login Button */}
                <Button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center mt-2"
                >
                    {loading ? (
                        <>
                            <Loader className="animate-spin mr-2" size={18} />
                            Signing in...
                        </>
                    ) : (
                        <>
                            <LogIn className="mr-2" size={18} />
                            Sign In
                        </>
                    )}
                </Button>
            </form>

            {/* Divider */}
            <div className="my-4">
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full"></div>
                    </div>
                    <div className="relative flex justify-center">
                        <span className=" px-2 text-gray-500 font-medium">Or continue with</span>
                    </div>
                </div>
            </div>



            {/* Google Login */}
            <div className="flex justify-center w-full rounded-3xl">
                <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                    theme="outline"
                    size="large"
                    text="signin_with"
                    width="100%"
                    useOneTap={false}
                    context="signin"
                    auto_select={false}
                />
            </div>
            <p className="text-center font-medium mt-3 text-gray-500 text-sm">
                One Tap may appear automatically for returning users
            </p>

            {/* Register Link */}
            <p className="text-center mt-6 text-gray-600">
                Don't have an account? <span className="text-blue-600 hover:text-blue-700 font-semibold cursor-pointer" onClick={() => navigate("/register")}>Register now</span>
            </p>
                </div>
            </div>
        </div>
    );
};

export default Login;