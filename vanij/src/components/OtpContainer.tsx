import { REGEXP_ONLY_DIGITS } from "input-otp";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

interface OtpContainerProps {
  handleOtpChange: (value: string) => void
  otpValue: string
  title?: string
  description?: string
  email?: string
  showResendButton?: boolean
  canResendOtp?: boolean
  resendTimer?: number
  handleResendOtp?: () => void
  handleVerifyOtp?: () => void
  loading?: boolean
  error?: string
  showVerifyButton?: boolean
  verifyButtonText?: string
}

const OtpContainer = ({
  handleOtpChange, 
  otpValue, 
  title = "",
  description = "",
  email,
  showResendButton = false,
  canResendOtp = true,
  resendTimer = 0,
  handleResendOtp,
  handleVerifyOtp,
  loading = false,
  error,
  showVerifyButton = false,
  verifyButtonText = "Verify & Continue"
}: OtpContainerProps) => {
  return (
  <div className="space-y-6">
    {/* Header Section */}
    {(title || description || email) && (
      <div className="text-center space-y-2">
        {title && <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>}
        {description && (
          <p className="text-[15px] text-muted-foreground">
            {description}
          </p>
        )}
        {email && (
          <p className="text-sm text-center text-gray-600">
            {email}
          </p>
        )}
      </div>
    )}
    
    {/* OTP Input Section */}
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
    
    {/* Error Message */}
    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
    
    {/* Resend Button */}
    {showResendButton && handleResendOtp && (
      <div className="flex justify-between">
        <button  
          type="button"
          className="h-9 px-3 rounded-md text-gray-500 bg-transparent hover:bg-[#f4f4f5] hover:text-black text-sm cursor-pointer"
          onClick={handleResendOtp}
          disabled={!canResendOtp}>
            {canResendOtp ? 'Resend Code' : `Resend in ${resendTimer}s`}
        </button>
      </div>
    )}
    
    {/* Verify Button */}
    {showVerifyButton && handleVerifyOtp && (
      <Button 
        type="button"
        disabled={otpValue.length !== 6 || loading}
        className={`${otpValue.length === 6 ? "bg-blue-700 hover:bg-[#2563EB]" : "bg-[#7CB9F8]"}`}
        onClick={handleVerifyOtp}
      >
        <span>{loading ? 'Verifying...' : verifyButtonText}</span>
        {!loading && <ArrowRight className="h-5 w-5" />}
      </Button>
    )}
  </div>
  )
}

export default OtpContainer