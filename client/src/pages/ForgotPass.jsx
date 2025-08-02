import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart } from 'lucide-react';
import { toast } from "react-hot-toast";
import api from '../services/api.js';
import Input from "../components/Input";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isGoogleUser, setIsGoogleUser] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage("");
    setError("");
    setIsGoogleUser(false);
    setLoading(true);

    try {
      const res = await api.post("/api/users/forgot-password", { email });
      setMessage(res.data.message);
      toast.success("Reset link sent! Check your email.");
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Something went wrong";
      setError(errorMessage);
      if (err.response?.data?.isGoogleUser) {
        setIsGoogleUser(true);
        toast.info("This email is linked to a Google account. Please sign in with Google.");
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className=" bg-white/80 backdrop-blur-lg  rounded-xl shadow-lg border border-blue-100/50  p-8">
          {/* Simple Header with MediQR branding */}
          <div className="text-center mb-8">
            <div className="flex justify-center items-center space-x-2 mb-4">
              <div className="bg-blue-600 p-2 rounded-full">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-blue-600">MediQR</h1>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Forgot Password?</h2>
            <p className="text-gray-600">Enter your email to receive a reset link</p>
          </div>

          {!message ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              
              {error && (
                <div className={`mb-4 p-3 rounded-lg text-sm ${isGoogleUser ? 'bg-blue-50 border border-blue-200' : 'bg-red-50 border border-red-200'}`}>
                  {isGoogleUser ? (
                    <div className="space-y-2">
                      <p className="text-blue-700 font-medium">Google Account Detected</p>
                      <p className="text-blue-600">{error}</p>
                      <button
                        onClick={() => navigate('/')}
                        className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Sign in with Google
                      </button>
                    </div>
                  ) : (
                    <p className="text-red-700">{error}</p>
                  )}
                </div>
              )}
              
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
          ) : (
            // Success State
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Check Your Email!</h3>
                <p className="text-gray-600 text-sm mb-4">{message}</p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-left">
                  <p className="text-blue-800 text-sm font-medium mb-2">Next steps:</p>
                  <ul className="text-blue-700 text-sm space-y-1">
                    <li>• Check your inbox (and spam folder)</li>
                    <li>• Click the reset link in the email</li>
                    <li>• Link expires in 30 minutes</li>
                  </ul>
                </div>
              </div>
              <button
                onClick={() => {
                  setMessage("");
                  setEmail("");
                }}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Send another email
              </button>
            </div>
          )}

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/')}
              className="text-blue-600 hover:text-blue-700 text-sm"
            >
              ← Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;