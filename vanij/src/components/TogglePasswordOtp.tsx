import { Lock } from "lucide-react"

interface TogglePasswordOtpProps {
  setAuthMethod: (method: 'password' | 'otp') => void;
  authMethod: 'password' | 'otp' | '';
  password: string;
}

const TogglePasswordOtp = ({setAuthMethod, authMethod, password}: TogglePasswordOtpProps) => {
  return (
         <div>
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
        </div>
  )
}

export default TogglePasswordOtp