import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Sparkles, Eye, EyeOff, LogIn, Phone } from "lucide-react";
import BASE_URL from "../config/Config";


const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [focusedField, setFocusedField] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    if (token && isLoggedIn === "true") {
      navigate("/");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!mobile.trim() || !password.trim()) {
      setError("Please enter both mobile number and password.");
      setLoading(false);
      return;
    }

    // Validate 10-digit mobile number
    const isMobileValid = /^[0-9]{10}$/.test(mobile);
    if (!isMobileValid) {
      setError("Please enter a valid 10-digit mobile number.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          mobile: mobile,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok && data.status === true) {
        // Store user data in localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userRole", data.role);
        localStorage.setItem("userId", data.user.id);
        localStorage.setItem("userName", data.user.name);
        localStorage.setItem("userMobile", data.user.mobile);
        localStorage.setItem("userData", JSON.stringify(data.user));

        setSuccess(data.message || "Login successful! Redirecting...");

        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        setError(data.message || "Login failed. Please check your credentials.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !loading) {
      handleLogin(e);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#0A0F1E]">
      
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#00AEED]/20 via-[#0A0F1E] to-[#00D4FF]/10"></div>
      
      {/* Animated Grid Pattern - Hidden on mobile */}
      <div className="absolute inset-0 opacity-20 sm:opacity-30 hidden sm:block">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(0, 174, 237, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 174, 237, 0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      {/* Floating Gradient Orbs - Hidden on mobile */}
      <div className="hidden sm:block absolute top-0 -left-40 w-64 h-64 sm:w-96 sm:h-96 bg-[#00AEED] rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="hidden sm:block absolute bottom-0 -right-40 w-64 h-64 sm:w-96 sm:h-96 bg-[#00D4FF] rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse animation-delay-2000"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] sm:w-[800px] sm:h-[800px] bg-[#00AEED]/20 rounded-full blur-3xl opacity-20 animate-ping-slow"></div>

      {/* Animated Circles - Hidden on mobile */}
      <div className="hidden sm:block absolute top-20 left-20 w-64 h-64 border border-[#00AEED]/20 rounded-full animate-spin-slow"></div>
      <div className="hidden lg:block absolute bottom-20 right-20 w-96 h-96 border border-[#00D4FF]/20 rounded-full animate-spin-slow animation-delay-3000"></div>
      <div className="hidden md:block absolute top-1/2 left-1/4 w-48 h-48 border border-[#00AEED]/30 rounded-full animate-spin-slow animation-delay-1000"></div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6">
        
        {/* Desktop View - Both Sections */}
        <div className="hidden lg:flex flex-row items-center justify-center gap-20 min-h-screen">
          
          {/* Left Side - Brand Section (Desktop only) */}
          <div className="w-1/2 text-left">
            <div className="relative mb-8">
              <div className="absolute inset-0 flex justify-start">
                <div className="w-32 h-32 bg-[#00AEED]/20 rounded-full blur-2xl animate-pulse"></div>
              </div>
              
              <div className="relative inline-block">
                <div className="flex items-center gap-3 justify-start mb-6">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#00AEED] to-[#00D4FF] animate-gradient"></div>
                    <Sparkles className="w-7 h-7 text-white relative z-10 animate-pulse" />
                  </div>
                  <img 
                    src="src/assets/images/softcrowd-logo.png" 
                    className="h-12 w-auto" 
                    alt="SoftCrowd" 
                  />
                </div>
              </div>
            </div>

            <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-white via-[#00AEED] to-white bg-clip-text text-transparent">
              Welcome Back
            </h1>
            <p className="text-xl text-gray-400 max-w-xl leading-relaxed mb-8">
              Your journey to seamless enterprise management starts here
            </p>

            {/* Stats */}
            <div className="flex justify-start gap-8 mt-8">
              <div className="text-center">
                <p className="text-2xl font-bold text-white">10K+</p>
                <p className="text-xs text-gray-500">Active Users</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-white">500+</p>
                <p className="text-xs text-gray-500">Enterprises</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-white">99.9%</p>
                <p className="text-xs text-gray-500">Uptime</p>
              </div>
            </div>
          </div>

          {/* Right Side - Login Card (Desktop) */}
          <div className="w-1/3 max-w-md">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#00AEED] to-[#00D4FF] rounded-2xl blur-xl opacity-30 animate-pulse"></div>
              
              <div className="relative bg-[#111827]/80 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-2xl">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-white mb-2">Sign In</h2>
                  <p className="text-gray-400 text-sm">Enter your mobile number and password</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300 block">Mobile Number</label>
                    <div className={`relative transition-all duration-300 ${focusedField === 'mobile' ? 'transform scale-[1.02]' : ''}`}>
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 transition-colors" style={{ color: focusedField === 'mobile' ? '#00AEED' : '#6B7280' }} />
                      </div>
                      <input
                        type="tel"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        onKeyPress={handleKeyPress}
                        onFocus={() => setFocusedField('mobile')}
                        onBlur={() => setFocusedField(null)}
                        disabled={loading}
                        maxLength={10}
                        className="w-full pl-10 pr-3 py-3 rounded-xl bg-[#1F2937] border transition-all duration-300 focus:outline-none focus:ring-2 text-white placeholder-gray-500"
                        style={{ 
                          borderColor: focusedField === 'mobile' ? '#00AEED' : '#374151',
                          boxShadow: focusedField === 'mobile' ? '0 0 0 4px rgba(0, 174, 237, 0.1)' : 'none'
                        }}
                        placeholder="9876543210"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300 block">Password</label>
                    <div className={`relative transition-all duration-300 ${focusedField === 'password' ? 'transform scale-[1.02]' : ''}`}>
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 transition-colors" style={{ color: focusedField === 'password' ? '#00AEED' : '#6B7280' }} />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyPress={handleKeyPress}
                        onFocus={() => setFocusedField('password')}
                        onBlur={() => setFocusedField(null)}
                        disabled={loading}
                        className="w-full pl-10 pr-10 py-3 rounded-xl bg-[#1F2937] border transition-all duration-300 focus:outline-none focus:ring-2 text-white placeholder-gray-500"
                        style={{ 
                          borderColor: focusedField === 'password' ? '#00AEED' : '#374151',
                          boxShadow: focusedField === 'password' ? '0 0 0 4px rgba(0, 174, 237, 0.1)' : 'none'
                        }}
                        placeholder="••••••••"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center hover:scale-110 transition-transform"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-500 hover:text-[#00AEED] transition-colors" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-500 hover:text-[#00AEED] transition-colors" />
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#00AEED] to-[#00D4FF] group-hover:scale-105 transition-transform"></div>
                    <span className="relative z-10 flex items-center gap-2 text-white">
                      {loading ? (
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        <>
                          Sign In
                          <LogIn className="w-4 h-4" />
                        </>
                      )}
                    </span>
                  </button>
                </form>

                <div className="mt-6 pt-4 border-t border-gray-800">
                  <p className="text-center text-xs text-gray-500">
                    Design and Developed by Softcrowd Technologies
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile/Tablet View - Only Form Section */}
        <div className="lg:hidden flex items-center justify-center min-h-screen py-0">
          <div className="w-full max-w-md mx-auto">
            <div className="text-center mb-4">
              <div className="flex items-center justify-center mb-2">
                <img 
                  src="src/assets/images/softcrowd-logo.png" 
                  className="h-10 w-auto" 
                  alt="SoftCrowd" 
                />
              </div>
              <h2 className="text-lg font-bold text-white">Welcome Back</h2>
              <p className="text-gray-400 text-xs mt-0.5">Sign in with your mobile number</p>
            </div>

            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#00AEED] to-[#00D4FF] rounded-xl blur-lg opacity-30"></div>
              
              <div className="relative bg-[#111827]/80 backdrop-blur-xl rounded-xl p-5 border border-white/10 shadow-2xl">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-gray-300 block">Mobile Number</label>
                    <div className={`relative transition-all duration-300 ${focusedField === 'mobile' ? 'transform scale-[1.01]' : ''}`}>
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-4 w-4 transition-colors" style={{ color: focusedField === 'mobile' ? '#00AEED' : '#6B7280' }} />
                      </div>
                      <input
                        type="tel"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        onKeyPress={handleKeyPress}
                        onFocus={() => setFocusedField('mobile')}
                        onBlur={() => setFocusedField(null)}
                        disabled={loading}
                        maxLength={10}
                        className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#1F2937] border transition-all duration-300 focus:outline-none focus:ring-2 text-white placeholder-gray-500 text-sm"
                        style={{ 
                          borderColor: focusedField === 'mobile' ? '#00AEED' : '#374151',
                          boxShadow: focusedField === 'mobile' ? '0 0 0 4px rgba(0, 174, 237, 0.1)' : 'none'
                        }}
                        placeholder="9876543210"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-gray-300 block">Password</label>
                    <div className={`relative transition-all duration-300 ${focusedField === 'password' ? 'transform scale-[1.01]' : ''}`}>
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-4 w-4 transition-colors" style={{ color: focusedField === 'password' ? '#00AEED' : '#6B7280' }} />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyPress={handleKeyPress}
                        onFocus={() => setFocusedField('password')}
                        onBlur={() => setFocusedField(null)}
                        disabled={loading}
                        className="w-full pl-9 pr-9 py-2 rounded-lg bg-[#1F2937] border transition-all duration-300 focus:outline-none focus:ring-2 text-white placeholder-gray-500 text-sm"
                        style={{ 
                          borderColor: focusedField === 'password' ? '#00AEED' : '#374151',
                          boxShadow: focusedField === 'password' ? '0 0 0 4px rgba(0, 174, 237, 0.1)' : 'none'
                        }}
                        placeholder="••••••••"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center hover:scale-110 transition-transform"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-500 hover:text-[#00AEED] transition-colors" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-500 hover:text-[#00AEED] transition-colors" />
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed relative overflow-hidden group mt-2"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#00AEED] to-[#00D4FF] group-hover:scale-105 transition-transform"></div>
                    <span className="relative z-10 flex items-center gap-2 text-white text-sm">
                      {loading ? (
                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        <>
                          Sign In
                          <LogIn className="w-3.5 h-3.5" />
                        </>
                      )}
                    </span>
                  </button>
                </form>

                {/* Demo Credentials - Mobile */}
                <div className="mt-4 pt-3 border-t border-gray-800">
                  <p className="text-center text-[10px] text-gray-500 mt-1">
                    Design and Developed by Softcrowd Technologies
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Error/Success Toast */}
      {(error || success) && (
        <div className={`fixed top-2 sm:top-4 right-2 sm:right-4 z-50 p-3 sm:p-4 rounded-xl shadow-2xl backdrop-blur-xl border ${error ? 'bg-red-500/90 border-red-400' : 'bg-green-500/90 border-green-400'} text-white animate-slide-in-right max-w-[90%] sm:max-w-full`}>
          <div className="flex items-center gap-2 text-xs sm:text-sm">
            {error ? (
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            <span className="break-words">{error || success}</span>
          </div>
        </div>
      )}

      {/* Animation Styles */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        .animate-pulse {
          animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes ping-slow {
          0% { transform: scale(0.8); opacity: 0.3; }
          50% { transform: scale(1.2); opacity: 0.1; }
          100% { transform: scale(0.8); opacity: 0.3; }
        }
        .animate-ping-slow {
          animation: ping-slow 6s ease-in-out infinite;
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        @keyframes gradient {
          0% { transform: translateX(-100%) rotate(45deg); }
          100% { transform: translateX(100%) rotate(45deg); }
        }
        .animate-gradient {
          animation: gradient 3s ease-in-out infinite;
        }
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-3000 {
          animation-delay: 3s;
        }
      `}</style>
    </div>
  );
};

export default Login;