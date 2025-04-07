import { useState, useEffect } from "react"
import blurredImage from "../assets/blurredImage.png" 
import adyaLogo from '../assets/adyaLogo.png'
import OtpContainer from "@/components/OtpContainer"
import { ArrowRight, ArrowLeft, Lock, Eye, EyeOff, Mail } from "lucide-react"
import { useDispatch } from 'react-redux'
import { verifyUserPassword, verifyUserEmail, validateEmail as validateEmailAction, setEmail, resendUserOtp, verifyUserOtp, validateOtp as validateOtpAction, setOtp, changeUserPassword } from '../store/slices/authSlice'
import { useNavigate } from 'react-router-dom'
import { verifyEmail } from '../services/api'
import type { AppDispatch } from '../store'
import { Button } from "@/components/ui/button"
import TogglePasswordOtp from "@/components/TogglePasswordOtp"

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
  const [isAtForgotPasswordOtpPage, setIsAtForgotPasswordOtpPage] = useState(false)
  const [isPasswordResetPage, setIsPasswordResetPage] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    uppercase: false,
    number: false
  })

  useEffect(() => {
    // Check if user is already authenticated
    const token = localStorage.getItem('token')
    if (token) {
      navigate('/dashboard', { replace: true })
    }
  }, [])
  
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

  const validatePasswordRequirements = (password: string) => {
    const hasLength = password.length >= 8
    const hasUppercase = /[A-Z]/.test(password)
    const hasNumber = /[0-9]/.test(password)
    
    setPasswordRequirements({
      length: hasLength,
      uppercase: hasUppercase,
      number: hasNumber
    })
    
    return hasLength && hasUppercase && hasNumber
  }

  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value
    setNewPassword(password)
    validatePasswordRequirements(password)
  }

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value)
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
          // Set the error message directly from the rejected action
          setError(response.payload || 'Invalid OTP. Please try again.');
          console.log('OTP verification failed:', response.payload);
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
  
  const handleBackButton = () => {
    // Clear all error states
    setEmailError('');
    setError('');
    setPasswordError('');
  
    if (isPasswordResetPage) {
      setIsPasswordResetPage(false);
      setIsAtForgotPasswordOtpPage(true);
    } else if (isAtForgotPasswordOtpPage) {
      setIsAtForgotPasswordOtpPage(false);
      setShowOtpInput(false);
      setIsForgotPassword(true);
    } else if (isForgotPassword) {
      setIsForgotPassword(false);
      setAuthMethod('password');
    } else if (isAtOtpPage) {
      setIsAtOtpPage(false);
      setShowOtpInput(false);
    } else if (authMethod === 'password' || authMethod === 'otp') {
      setAuthMethod('');
      setEmailVerified(false);
    }
  };

  const handleForgotPassword = () => {
    setIsForgotPassword(true)
    //setAuthMethod('otp')
  }

  
  const handleUpdatePassword = async () => {
    // Client-side validation first
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    
    if (!validatePasswordRequirements(newPassword)) {
      setPasswordError('Password does not meet requirements');
      return;
    }
    
    setLoading(true);
    setPasswordError('');
    
    try {
      // Use the parameter name expected by the Redux action (confirmPassword)
      const passwordData = {
        id: import.meta.env.VITE_USER_ID ? Number(import.meta.env.VITE_USER_ID) : 3145,
        password: newPassword,
        confirmPassword: confirmPassword
      };
      
      console.log('Updating password with data:', passwordData);
      
      const response = await dispatch(changeUserPassword(passwordData));
      console.log('Password update response:', response);
      
      if (response.meta.requestStatus === 'fulfilled' && response.payload.meta.status) {
        // Password updated successfully
        localStorage.setItem('token', response.payload.data.token);
        window.dispatchEvent(new Event('authChange'));
        await new Promise(resolve => setTimeout(resolve, 100));
        navigate('/dashboard', { replace: true });
      } else {
        const errorMessage = response.payload?.meta?.message || 
                            response.payload?.error?.name || 
                            'Failed to update password. Please try again.';
        setPasswordError(errorMessage);
      }
    } catch (error: any) {
      console.error('Password update failed:', error);
      const errorMessage = error.response?.data?.meta?.message || 
                           error.response?.data?.error?.name ||
                           error.message || 
                           'Failed to update password. Please try again.';
      setPasswordError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
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
              <p className="text-2xl leading-relaxed text-gray-900 font-light">
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
          {/* Back Button - Show on all pages except Welcome page */}
          {(authMethod === 'password' || authMethod === 'otp' || isForgotPassword || isAtForgotPasswordOtpPage || isPasswordResetPage || isAtOtpPage) && (
            <button 
              type="button" 
              onClick={handleBackButton}
              className="flex items-center gap-2 px-4 py-2 rounded-md bg-transparent hover:bg-[#f4f4f5] transition-colors cursor-pointer"
            >
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>
          )}
        <div className={`${(authMethod === 'otp' || authMethod === 'password') ? 'border-1 border-gray-300 p-7 rounded-4xl' : ''}`}>
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
              {!isForgotPassword ? emailVerified ? "Choose your preferred sign in method" : "Enter your email to sign in to your account" : '' }
              {/* {emailVerified ? "Choose your preferred sign in method" : "Enter your email to sign in to your account"} */}
            </p>
          </div>
          )}
        </div>

          {emailVerified && !isForgotPassword || emailVerified && !isAtForgotPasswordOtpPage && !isForgotPassword ? (
            <TogglePasswordOtp
            setAuthMethod={setAuthMethod}
            authMethod={authMethod}
            password={"password"}
            clearErrors={() => {
              setEmailError('');
              setError('');
              setPasswordError('');
            }}
          />
          ) : ""}

          {isForgotPassword ? (
            <div className="space-y-6">
              {!showOtpInput ? (
                <>
                  <div className="text-center space-y-2">
                    <h1 className="text-3xl font-semibold tracking-tight">Reset Password</h1>
                    <p className="text-[15px] text-muted-foreground">
                      We'll send a verification code to
                    </p>
                    <p className="text-sm text-center text-gray-600">
                      {email}
                    </p>
                    <p className="text-[15px] text-muted-foreground mt-4">
                      Use this code to verify your identity and set a new password
                    </p>
                  </div>
                  
                  <Button 
                    type="button"
                    className=" hover:bg-blue-800"
                    onClick={() => {
                      setIsAtForgotPasswordOtpPage(true);
                      handleSendOtp();
                    }}
                  >
                    <span>Send Verification Code</span>
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </>
              ) : isPasswordResetPage ? (
                <div className="space-y-6">
                  <div className="text-center space-y-2">
                    <h1 className="text-3xl font-semibold tracking-tight">Change Password</h1>
                    <p className="text-[15px] text-muted-foreground">
                      Enter your new password
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        placeholder="Enter new password"
                        value={newPassword}
                        onChange={handleNewPasswordChange}
                        className="w-full px-12 py-4 border rounded-[14px] bg-gray-50 text-base focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <Lock size={20} />
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
                      >
                        {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                    
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={handleConfirmPasswordChange}
                        className="w-full px-12 py-4 border rounded-[14px] bg-gray-50 text-base focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <Lock size={20} />
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
                      >
                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-gray-600">Password must:</p>
                      <div className="flex items-center gap-2">
                        <div className={`h-5 w-5 rounded-full flex items-center justify-center ${passwordRequirements.length ? 'bg-green-500 text-white' : 'border border-gray-300'}`}>
                          {passwordRequirements.length && (
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          )}
                        </div>
                        <span className="text-sm text-gray-600">Be at least 8 characters long</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`h-5 w-5 rounded-full flex items-center justify-center ${passwordRequirements.uppercase ? 'bg-green-500 text-white' : 'border border-gray-300'}`}>
                          {passwordRequirements.uppercase && (
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          )}
                        </div>
                        <span className="text-sm text-gray-600">Contain at least one uppercase letter</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`h-5 w-5 rounded-full flex items-center justify-center ${passwordRequirements.number ? 'bg-green-500 text-white' : 'border border-gray-300'}`}>
                          {passwordRequirements.number && (
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          )}
                        </div>
                        <span className="text-sm text-gray-600">Contain at least one number</span>
                      </div>
                    </div>
                    
                    {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
                  </div>
                  
                  <Button 
                    type="button"
                    disabled={!passwordRequirements.length || !passwordRequirements.uppercase || !passwordRequirements.number || !confirmPassword || newPassword !== confirmPassword || loading}
                    className={`${passwordRequirements.length && passwordRequirements.uppercase && passwordRequirements.number && confirmPassword && newPassword === confirmPassword ? "bg-blue-500 hover:bg-blue-600" : "bg-[#7CB9F8]"}`}
                    onClick={handleUpdatePassword}
                  >
                    <span>{loading ? 'Updating...' : 'Update Password'}</span>
                    {!loading && <ArrowRight className="h-5 w-5" />}
                  </Button>
                </div>
              ) : (
                <>
                  {isAtForgotPasswordOtpPage && (
                    <div className="text-center space-y-2">
                      <h1 className="text-3xl font-semibold tracking-tight"></h1>
                      <p className="text-[15px] text-muted-foreground"></p>
                      <p className="text-[15px] font-medium"></p>
                    </div>
                  )}
                  
                  <OtpContainer 
                    otpValue={otpValue}
                    handleOtpChange={handleOtpChange}
                    title="Verification"
                    description="Enter the verification code sent to"
                    email={email}
                    showResendButton={isAtForgotPasswordOtpPage}
                    canResendOtp={canResendOtp}
                    resendTimer={resendTimer}
                    handleResendOtp={handleSendOtp}
                    showVerifyButton={true}
                    verifyButtonText="Verify & Continue"
                    loading={loading}
                    error={error}
                    handleVerifyOtp={async () => {
                      console.log('Verifying OTP for password reset:', otpValue);
                      setLoading(true);
                      setError('');
                      
                      try {
                        const otpData = {
                          id: 3145,
                          otp: otpValue
                        };
                        
                        const response = await dispatch(verifyUserOtp(otpData));
                        if (response.meta.requestStatus === 'fulfilled' && response.payload.meta.status) {
                          setIsPasswordResetPage(true);
                          setIsAtForgotPasswordOtpPage(false);
                        } else {
                          // Handle OTP error with attempts remaining or blocked until time
                          console.log('OTP verification failed response:', response.payload);
                          
                          // Check for error message in different possible locations in the response
                          if (response.payload?.error?.message?.number_of_attempts_remaining !== undefined) {
                            const attemptsRemaining = response.payload.error.message.number_of_attempts_remaining;
                            if (attemptsRemaining > 0) {
                              setError(`Invalid OTP. ${attemptsRemaining} attempts left`);
                            } else if (response.payload.error.message.blocked_until) {
                              const blockedUntil = new Date(response.payload.error.message.blocked_until);
                              const formattedDate = blockedUntil.toLocaleString();
                              setError(`Invalid OTP. Try again after ${formattedDate}`);
                            } else {
                              setError('Invalid OTP. Please try again.');
                            }
                          } else if (response.payload?.data?.number_of_attempts_remaining !== undefined) {
                            // Alternative location for attempts remaining
                            const attemptsRemaining = response.payload.data.number_of_attempts_remaining;
                            if (attemptsRemaining > 0) {
                              setError(`Invalid OTP. ${attemptsRemaining} attempts left`);
                            } else if (response.payload.data.blocked_until) {
                              const blockedUntil = new Date(response.payload.data.blocked_until);
                              const formattedDate = blockedUntil.toLocaleString();
                              setError(`Invalid OTP. Try again after ${formattedDate}`);
                            } else {
                              setError('Invalid OTP. Please try again.');
                            }
                          } else if (response.payload?.meta?.message) {
                            // Check if the error message contains attempts information
                            const message = response.payload.meta.message;
                            if (typeof message === 'string' && message.includes('attempts')) {
                              setError(message);
                            } else {
                              setError('Invalid OTP. Please try again.');
                            }
                          } else {
                            setError('Invalid OTP. Please try again.');
                          }
                        }
                      } catch (error: any) {
                        console.error('OTP verification failed:', error);
                        setError(error.message || 'OTP verification failed. Please try again.');
                      } finally {
                        setLoading(false);
                      }
                    }}
                  />
                </>
              )}
            </div>
          ) : emailVerified ? (
            <form className="space-y-6" onSubmit={handleSubmit}>
          
            {authMethod === 'password' ? (
              <>
                <div className="space-y-4">
                  <div>
                  <p className="text-sm text-center text-gray-600">Enter your account password </p>
                  <p className="text-sm text-center text-gray-600">{email}</p>
                  </div>
                  
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
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
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
              {!isAtOtpPage ? (
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-sm text-center text-gray-600">
                    {showOtpInput ? 'Enter the verification code sent to' : 'Click below to receive a verification code'}
                    <br />
                    {email}
                  </p>
                  <br/>
                  <button 
                    type="button"
                    className="py-5 px-6 rounded-xl text-black hover:bg-[#f4f4f5] hover:text-black text-sm cursor-pointer bg-white"
                    onClick={() => {
                      setIsAtOtpPage(true);
                      handleSendOtp();
                    }}                    
                  >Request OTP</button>
                </div>
              ) : (
                <div className="p-2 text-center">
                  <p className="text-gray-600">
                    {showOtpInput ? 'Enter the verification code sent to' : 'Click below to receive a verification code'}
                    <br />
                    {email}
                  </p>
                </div>
              )}

                {showOtpInput && (
                  <OtpContainer 
                    otpValue={otpValue}
                    handleOtpChange={handleOtpChange}
                    title={""}
                    description={""}
                    email={""}
                    showResendButton={isAtOtpPage}
                    canResendOtp={canResendOtp}
                    resendTimer={resendTimer}
                    handleResendOtp={handleSendOtp}
                    error={error}
                  />
                )}
              </div>
            )}

          <Button 
            type="submit" 
            disabled={loading || (authMethod === 'password' && !validLoginPassword) || (authMethod === 'otp' && otpValue.length !== 6)}
            className={`${
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
          </Button>
          
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
              
              {/* <button 
                type="submit"            
                className="w-full py-4 bg-blue-700 hover:bg-[#2563EB] text-white rounded-[14px] flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>Continue</span>
                
              </button> */}
              <Button type="submit"   >
                  Continue
              <ArrowRight className="h-5 w-5" />
              </Button>
            </form>
          )}
        </div>
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>By continuing, you agree to our</p>
            <div className="flex justify-center items-center mt-2 space-x-4">
              <a href="/terms" className="flex items-center text-gray-700">
                <Lock className="h-4 w-4 mr-1" />
                Terms of Service
              </a>
              <span className="text-gray-300">|</span>
              <a href="/privacypolicy" className="flex items-center text-gray-700">
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