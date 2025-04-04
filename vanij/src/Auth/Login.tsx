import { useState, useEffect } from "react"
import blurredImage from "../assets/blurredImage.png" 
import adyaLogo from '../assets/adyaLogo.png'
import { ArrowRight, Lock, Eye, EyeOff, Mail } from "lucide-react"
import { useDispatch } from 'react-redux'
import { verifyUserPassword, verifyUserEmail, validateEmail as validateEmailAction, setEmail, resendUserOtp, verifyUserOtp, validateOtp as validateOtpAction, setOtp } from '../store/slices/authSlice'
import { useNavigate } from 'react-router-dom'
import { verifyEmail } from '../services/api'
import type { AppDispatch } from '../store'
import { REGEXP_ONLY_DIGITS } from "input-otp"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { Button } from "@/components/ui/button"

const Login = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const [authMethod, setAuthMethod] = useState<'password' | 'otp' | ''>('')
  const [showCode, setShowCode] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [validLoginPassword, setValidLoginPassword] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [emailVerified, setEmailVerified] = useState(false)
  const [emailError, setEmailError] = useState('')
  const [error, setError] = useState('')
  const [otp, sendOtp] = useState(false)
  const [showOtpInput, setShowOtpInput] = useState(false)
  const [otpValue, setOtpValue] = useState('')
  const [showOtp, setShowOtp] = useState(false)
  const [canResendOtp, setCanResendOtp] = useState(true)
  const [resendTimer, setResendTimer] = useState(0)
  const [isAtOtpPage, setIsAtOtpPage] = useState(false)
  const [isForgotPassword, setIsForgotPassword] = useState(false)

  useEffect(() => {
  }, [authMethod])
  
  const validateEmail = (email: string) => {
   // const gmailRegex =
    return email
  }

  const handleSendOtp = async () => {
    setShowOtpInput(true)
    setCanResendOtp(false)
    setResendTimer(59)
    sendOtp(true)
    setError('')
    
    try {
      const response = await dispatch(resendUserOtp(email))
      if (response.meta.requestStatus === 'fulfilled') {
        console.log('OTP sent successfully')
        if (response.payload?.data?.otp) {
          setShowOtp(true)
          console.log('OTP for testing:', response.payload.data.otp)
        }
      } else {
        setError('Failed to send OTP. Please try again.')
      }
    } catch (error: any) {
      console.error('Failed to send OTP:', error)
      setError('Failed to send OTP. Please try again.')
    }
    
    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          setCanResendOtp(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const handleOtpChange = (value: string) => {
    setOtpValue(value)
    if (value.length === 6) {
      dispatch(validateOtpAction(value))
      dispatch(setOtp(value))
      console.log('OTP complete:', value)
    }
  }

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = event.target.value;
    setPassword(newPassword); 

    if (newPassword.length >= 8) {
      setValidLoginPassword(true); 
    } else {
      setValidLoginPassword(false); 
    }
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    setAuthMethod('password')
    console.log('handleEmailSubmit called');
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
    dispatch(validateEmailAction(email))
    setEmailVerified(true)
    dispatch({ 
      type: 'auth/setEmail', 
      payload: email 
    })
    localStorage.setItem('userEmail', email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const emailResponse = await dispatch(verifyUserEmail(email));
      if (emailResponse.meta.requestStatus !== 'fulfilled' || !emailResponse.payload.data.is_email_verified) {
        setError('Email is not verified. Please try again.');
        setLoading(false);
        return;
      }

      if (authMethod === 'password') {
        const loginData = {
          id: import.meta.env.VITE_USER_ID ? Number(import.meta.env.VITE_USER_ID) : 0,
          password: password
        };
        
        const response = await dispatch(verifyUserPassword(loginData));
        if (response.meta.requestStatus === 'fulfilled' && response.payload.meta.status) {
          localStorage.setItem('token', response.payload.data.token);
          localStorage.setItem('userEmail', email);
          dispatch({ 
            type: 'auth/setEmail', 
            payload: email 
          });
          window.dispatchEvent(new Event('authChange'));
          await new Promise(resolve => setTimeout(resolve, 100));
          navigate('/dashboard', { replace: true });
        } else {
          setError('Invalid password. Please try again.');
          localStorage.removeItem('token');
        }
      } else if (authMethod === 'otp') {
        if (!otpValue || otpValue.length !== 6) {
          setError('Please enter a valid 6-digit OTP.');
          setLoading(false);
          return;
        }
        
        const otpData = {
          id: 3145,
          otp: otpValue
        };
        
        const response = await dispatch(verifyUserOtp(otpData));
        if (response.meta.requestStatus === 'fulfilled' && response.payload.meta.status) {
          localStorage.setItem('token', response.payload.data.token);
          localStorage.setItem('userEmail', email);
          dispatch({ 
            type: 'auth/setEmail', 
            payload: email 
          });
          window.dispatchEvent(new Event('authChange'));
          await new Promise(resolve => setTimeout(resolve, 100));
          navigate('/dashboard', { replace: true });
        } else {
          setError('Invalid OTP. Please try again.');
          localStorage.removeItem('token');
        }
      }
    } catch (error: any) {
      console.error('Login failed:', error);
      setError(error.message || 'Login failed. Please try again.');
      localStorage.removeItem('token');
      window.dispatchEvent(new Event('authChange'));
    } finally {
      setLoading(false);
    }
  };
  const handleBackToEmail = () => {
    setEmailVerified(false)
    setEmailError('')
  }

  const handleForgotPassword = () => {
    setIsForgotPassword(true)
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
          <img src={adyaLogo} alt="Adya Logo" className="h-10 object-contain" />
        </div>

        <div className="relative z-20 mt-auto max-w-xl space-y-8">
          <div className="space-y-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="h-1 w-12 bg-gray-400 rounded-full"></div>
                <p className="text-sm font-medium text-gray-700">TRUSTED BY TEAMS</p>
              </div>
              <p className="text-2xl font-light leading-relaxed text-gray-900">
                "Adya brings the best of AI technology and research, empowering enterprises to scale without vendor lock-in, while retaining sovereignty over their AI."
              </p>
            </div>
            <footer className="text-sm">
              <div className="font-medium text-gray-900">Shayak Mazumder</div>
              <div className="text-gray-600">Founder, Adya</div>
            </footer>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md mx-auto space-y-8 px-4">
        <div className=" border-1 border-gray-300 p-7 rounded-4xl">
          <div className="flex justify-center lg:hidden">
            
            {authMethod === 'password' || authMethod === 'otp' ? '' : <img src={adyaLogo} alt="Adya Logo" className="h-16 object-contain" />}
          </div>

          <div className="text-center space-y-2">
          {authMethod === 'password' || authMethod === 'otp' ? '' : <img src={adyaLogo} alt="Adya Logo" className="h-16 mx-auto hidden lg:block object-contain" />}
            
          {!isForgotPassword && (
          <div>
            <h1 className="text-3xl font-semibold tracking-tight pb-4">
              {authMethod === 'otp' || authMethod === 'password' 
                ? "Sign in to your account" 
                : "Welcome to Adya"}
            </h1>

            <p className="text-[15px] text-muted-foreground pb-4">
              {emailVerified ? "Choose your preferred sign in method" : "Enter your email to sign in to your account"}
            </p>
          </div>
          )}
        </div>

          {emailVerified && !isForgotPassword && (
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

          {isForgotPassword ? (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h1 className="text-3xl font-semibold tracking-tight">Reset Password</h1>
                <p className="text-[15px] text-muted-foreground">
                  We'll send a verification code to
                </p>
                <p className="text-[15px] font-medium">
                  {email}
                </p>
                <p className="text-[15px] text-muted-foreground mt-4">
                  Use this code to verify your identity and set a new password
                </p>
              </div>
              
              <Button 
                type="button"
                className="w-full py-7 px-9 bg-blue-600 hover:bg-blue-800 text-white rounded-[14px] flex items-center justify-center space-x-2 cursor-pointer"
                onClick={handleSendOtp}
              >
                <span>Send Verification Code</span>
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
          ) : emailVerified ? (
            <form className="space-y-6" onSubmit={handleSubmit}>
          
            {authMethod === 'password' ? (
              <>
                <div className="space-y-4">
                  <p className="text-sm text-center text-gray-600">Enter your account password </p>
                  <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'} 
                    placeholder="Enter your password"
                    value={password}
                    onChange={handlePasswordChange}
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
                  <div className={`${error ? 'flex justify-between' : 'flex justify-end'}`}>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <button 
                      type="button" 
                      onClick={handleForgotPassword}
                      className="text-sm text-blue-600 hover:text-blue-800 bg-transparent border-none cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-6">
              {!isAtOtpPage ?
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-gray-600">
                    {showOtpInput ? 'Enter the verification code sent to' : 'Click below to receive a verification code'}
                    <br />
                    {email}
                  </p>
                  <br/>
                  <Button 
                    type="button"
                    className="py-7 px-5 rounded-md text-black hover:bg-[#f4f4f5] hover:text-black text-sm cursor-pointer bg-white"
                    onClick={() => {
                      setIsAtOtpPage(true);
                      handleSendOtp();
                    }}                    
                  >Request OTP</Button>
                </div>
                : 
                <div className="p-2 text-center">
                  <p className="text-gray-600">
                    {showOtpInput ? 'Enter the verification code sent to' : 'Click below to receive a verification code'}
                    <br />
                    {email}
                  </p>
                </div>
              }

                {showOtpInput && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center space-y-2">
                      <InputOTP
                        value={otpValue}
                        onChange={handleOtpChange}
                        maxLength={6}
                        pattern={REGEXP_ONLY_DIGITS}
                      >
                        <InputOTPGroup className="gap-2">
                          <InputOTPSlot index={0} className="rounded-md border-gray-200 p-6 rounded-2xl bg-white"/>
                          <InputOTPSlot index={1} className="rounded-md border-gray-200 p-6 rounded-2xl bg-white" />
                          <InputOTPSlot index={2} className="rounded-md border-gray-200 p-6 rounded-2xl bg-white" />
                          <InputOTPSlot index={3} className="rounded-md border-gray-200 p-6 rounded-2xl bg-white" />
                          <InputOTPSlot index={4} className="rounded-md border-gray-200 p-6 rounded-2xl bg-white" />
                          <InputOTPSlot index={5} className="rounded-md border-gray-200 p-6 rounded-2xl bg-white" />
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                  </div>
                )}
              {isAtOtpPage ? 
                <div className="flex justify-between">
                  {/* <button 
                    type="button" 
                    className={`border border-gray-200 py-2 px-4 rounded-md flex items-center gap-2 ${canResendOtp ? 'hover:bg-gray-50 cursor-pointer' : 'opacity-50 cursor-not-allowed'}`}
                    onClick={handleSendOtp}
                    disabled={!canResendOtp}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                    {canResendOtp ? 'Request OTP' : `Resend in ${resendTimer}s`}
                  </button> */}

                  <Button  
                    type="button"
                    className="h-9 px-3 rounded-md text-gray-500 bg-transparent hover:bg-[#f4f4f5] hover:text-black text-sm cursor-pointer"
                    onClick={handleSendOtp}
                    disabled={!canResendOtp}>
                      {canResendOtp ? 'Resend Code' : `Resend in ${resendTimer}s`}
                  </Button>
                  {/* <Button
                    type="button"
                    className="h-9 px-3 rounded-md text-gray-500 bg-transparent hover:bg-[#f4f4f5] hover:text-black text-sm cursor-pointer"
                    onClick={() => setShowCode(!showCode)}
                  >
                    {showCode ? 'Show Code' : 'Hide Code'}
                </Button> */}

                </div>
                : ''
              }
              </div>
            )}

          <button 
            type="submit" 
            disabled={loading || (authMethod === 'password' && !validLoginPassword) || (authMethod === 'otp' && otpValue.length !== 6)}
            className={`w-full py-4 text-white rounded-[14px] flex items-center justify-center space-x-2 ${
              (authMethod === 'password' && validLoginPassword) || (authMethod === 'otp' && otpValue.length === 6) 
              ? "bg-blue-700 hover:bg-[#2563EB] cursor-pointer" 
              : "bg-[#7CB9F8]"
            }`}
          >
            <span>
              {authMethod === 'password'
                ? loading
                  ? 'Signing in...'
                  : 'Sign in'
                : authMethod === 'otp'
                ? loading
                  ? 'Verifying...'
                  : 'Verify code'
                : 'Sign in'}
            </span>
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
                className="w-full py-4 bg-blue-700 hover:bg-[#2563EB] text-white rounded-[14px] flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            </form>
          )}
        </div>
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