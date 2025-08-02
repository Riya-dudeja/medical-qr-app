import { useState, useContext } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import Label from "../components/Label";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Heart } from "lucide-react";
import api from '../services/api.js';

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const { setUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post("/api/auth/register", { name, email, phone, password });
            localStorage.setItem("token", res.data.token);
            setUser(res.data.user);
            navigate("/dashboard");
        } catch (error) {
            console.error(error.response?.data?.message || "Registration failed");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-6 pl-13 pr-15">
                    {/* MediQR Branding Header */}
                    <div className="text-center mb-5.5">
                        <div className="flex justify-center items-center space-x-2 mb-4">
                            <div className="bg-blue-600 p-2 rounded-full">
                                <Heart className="w-6 h-6 text-white" />
                            </div>
                            <h1 className="text-xl font-bold text-blue-600">MediQR</h1>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Create an Account</h2>
                        <p className="text-gray-600">Join MediQR to get started</p>
                    </div>

                    <form className="space-y-3" onSubmit={handleRegister}>
                        <div>
                            <Label htmlFor="fullname" className="block text-[17px] font-medium text-gray-700 mb-2">Full Name</Label>
                            <Input 
                                id="fullname" 
                                type="text" 
                                placeholder="Enter your full name" 
                                required 
                                value={name} 
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-3 py-3 border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            />
                        </div>
                        <div>
                            <Label htmlFor="email" className="block text-[17px] font-medium text-gray-700 mb-2">Email</Label>
                            <Input 
                                id="email" 
                                type="email"
                                placeholder="Enter your email" 
                                required 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-3 py-3 border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            />
                        </div>
                        <div>
                            <Label htmlFor="phone" className="block text-[17px] font-medium text-gray-700 mb-2">Phone Number</Label>
                            <Input 
                                id="phone" 
                                type="tel" 
                                placeholder="Enter your phone number" 
                                required 
                                value={phone} 
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full px-3 py-3 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            />
                        </div>
                        <div>
                            <Label htmlFor="password" className="block text-[17px] font-medium text-gray-700 mb-2">Password</Label>
                            <Input 
                                id="password" 
                                type="password" 
                                placeholder="Create a password" 
                                required 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-3 py-3 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            />
                        </div>
                        <Button 
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors mt-2"
                        >
                            Create Account
                        </Button>
                    </form>
                    
                    <p className="text-center mt-3 text-gray-600">
                        Already have an account? <span className="text-blue-600 hover:text-blue-700 font-semibold cursor-pointer" onClick={() => navigate('/')}>Sign in</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;

