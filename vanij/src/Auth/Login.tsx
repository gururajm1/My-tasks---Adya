import { useState, useEffect } from "react"
import blurredImage from "../assets/blurredImage.png" 
import adyaLogo from '../assets/adyaLogo.png'
import { ArrowRight, Lock, Eye, EyeOff, Mail } from "lucide-react"
import { useDispatch } from 'react-redux'
import { verifyUserPassword } from '../store/slices/authslice'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [authMethod, setAuthMethod] = useState<'password' | 'otp'>('password')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [emailVerified, setEmailVerified] = useState(false)
  const [emailError, setEmailError] = useState('')
  const [error, setError] = useState('')
  
  const validateEmail = (email: string) => {
    const gmailRegex = /@gmail\.com$/i
    return gmailRegex.test(email)
  }

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) {
      setEmailError('Email is required')
      return
    }
    
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid @gmail.com address')
      return
    }
    
    setEmailError('')
    setEmailVerified(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const loginData = {
        id: 3145,
        password: password,
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb21wYW55X2lkIjoyMDA0LCJlbWFpbCI6Im1vbmEwNjU0N0BnbWFpbC5jb20iLCJleHAiOjE3MzcwMjQ0MTcsImlkIjoyMDI2LCJtb2JpbGVfbnVtYmVyIjoiODc3ODg2NDM0NSIsInJvbGVzIjp7ImNvZGUiOiJURUFNX01FTUJFUiIsIm5hbWUiOiJURUFNX01FTUJFUiJ9fQ.FAFb8DgXAxo14-AdJS_KEl2fmjmSpTPTHUENRQiMrQk'
      };
      
      const response = await dispatch(verifyUserPassword(loginData));
      if (response.payload && !response.error) {
        localStorage.setItem('token', loginData.token);
        
        window.dispatchEvent(new Event('authChange'));
        
        await new Promise(resolve => setTimeout(resolve, 100));
        
        navigate('/dashboard', { replace: true });
      } else {
        setError('Invalid password. Please try again.');
      }
    } catch (error: any) {
      console.error('Login failed:', error);
      setError(error.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  const handleBackToEmail = () => {
    setEmailVerified(false)
    setEmailError('')
  }

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* background */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative"
        style={{
          backgroundImage: `url(${blurredImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Logo in top left */}
        <div>
          <img src={adyaLogo} alt="Adya Logo" className="w-16 h-16 object-contain" />
        </div>

        {/* Caption section */}
        <div className="mb-12">
          <div className="h-px w-12 bg-gray-400 mb-6"></div>
          <p className="uppercase text-sm font-medium mb-4 text-gray-800">TRUSTED BY TEAMS</p>
          <blockquote className="text-2xl font-medium text-gray-900 mb-6">
            "Adya brings the best of AI technology and research, empowering enterprises to scale without vendor lock-in,
            while retaining sovereignty over their AI."
          </blockquote>
          <div>
            <p className="font-medium text-gray-900">Shayak Mazumder</p>
            <p className="text-gray-700">Founder, Adya</p>
          </div>
        </div>
      </div>

      {/* login content */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 ">
        <div className="max-w-md w-full  border-1 border-gray-200 p-10 rounded-4xl">
          {/* Mobile logo (visible only on small screens) */}
          <div className="flex justify-center mb-8 lg:hidden">
            <img src={adyaLogo} alt="Adya Logo" className="w-16 h-16 object-contain" />
          </div>

          <div className="text-center mb-8">
            <img src={adyaLogo} alt="Adya Logo" className="w-12 h-12 mx-auto mb-4 hidden lg:block object-contain" />
            <h1 className="text-3xl font-bold mb-2">Sign in to your account</h1>
            {emailVerified ? (
              <div className="flex items-center justify-center gap-2">
                <p className="text-gray-500">Choose your preferred sign in method</p>
              </div>
            ) : (
              <p className="text-gray-500">Enter your email to continue</p>
            )}
          </div>

          {emailVerified && (
            <div className="flex gap-2 p-1 bg-gray-100 rounded-lg mb-6">
              <button
                type="button"
                className={`flex-1 py-2 px-4 rounded-md flex items-center justify-center gap-2 ${authMethod === 'password' ? 'bg-white shadow-sm' : ''}`}
                onClick={() => setAuthMethod('password')}
              >
                <Lock size={16} />
                <span>Password</span>
              </button>
              <button
                type="button"
                className={`flex-1 py-2 px-4 rounded-md flex items-center justify-center gap-2 ${authMethod === 'otp' ? 'bg-white shadow-sm' : ''}`}
                onClick={() => setAuthMethod('otp')}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 7L2 7" />
                  <path d="M17 7V4C17 3.46957 16.7893 2.96086 16.4142 2.58579C16.0391 2.21071 15.5304 2 15 2H9C8.46957 2 7.96086 2.21071 7.58579 2.58579C7.21071 2.96086 7 3.46957 7 4V7" />
                  <path d="M12 12L12 19" />
                </svg>
                <span>OTP</span>
              </button>
            </div>
          )}

          {emailVerified ? (
            <form className="space-y-6" onSubmit={handleSubmit}>
          
            {authMethod === 'password' ? (
              <>
                <div className="space-y-4">
                  <p className="text-sm text-center text-gray-600">Enter your account password</p>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-12 py-4 border rounded-[14px] bg-gray-50 text-base focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <Lock size={20} />
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  <div className="flex justify-end">
                    <a href="#" className="text-sm text-blue-600 hover:text-blue-800">Forgot Password?</a>
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-gray-600">
                    Click below to receive a verification code
                    <br />
                    {email}
                  </p>
                </div>

                <div className="flex justify-center">
                  <button 
                    type="button" 
                    className="border border-gray-200 hover:bg-gray-50 py-2 px-4 rounded-md flex items-center gap-2"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                    Request OTP
                  </button>
                </div>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 bg-[#7CB9F8] hover:bg-blue-400 text-white rounded-[14px] flex items-center justify-center space-x-2"
            >
              <span>{loading ? 'Signing in...' : 'Sign in'}</span>
              {!loading && <ArrowRight className="h-5 w-5" />}
            </button>
          </form>
          ) : (
            <form className="space-y-6" onSubmit={handleEmailSubmit}>
              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="email"
                    placeholder="name@gmail.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (emailError) setEmailError('')
                    }}
                    className={`w-full px-12 py-4 border rounded-[14px] bg-gray-50 text-base focus:outline-none focus:ring-1 focus:ring-blue-500 ${emailError ? 'border-red-500' : ''}`}
                  />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Mail size={20} />
                  </div>
                </div>
                {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
              </div>
              
              <button 
                type="submit" 
                className="w-full py-4 bg-[#2563EB] hover:bg-blue-700 text-white rounded-[14px] flex items-center justify-center space-x-2"
              >
                <span>Continue</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            </form>
          )}

          <div className="mt-8 text-center text-sm text-gray-500">
            <p>By continuing, you agree to our</p>
            <div className="flex justify-center items-center mt-2 space-x-4">
              <a href="#" className="flex items-center text-gray-700">
                <Lock className="h-4 w-4 mr-1" />
                Terms of Service
              </a>
              <span className="text-gray-300">|</span>
              <a href="#" className="flex items-center text-gray-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-1"
                >
                  <circle cx="12" cy="12" r="10" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                Privacy Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
