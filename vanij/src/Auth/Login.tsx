import { useState } from "react"
import blurredImage from "../assets/blurredImage.png" 
import adyaLogo from '../assets/adyaLogo.png'
import { ArrowRight, Lock } from "lucide-react"

const Login = () => {
  const [email, setEmail] = useState("")

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Left side with background and testimonial */}
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

        {/* Testimonial section */}
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

      {/* Right side with login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          {/* Mobile logo (visible only on small screens) */}
          <div className="flex justify-center mb-8 lg:hidden">
            <img src={adyaLogo} alt="Adya Logo" className="w-16 h-16 object-contain" />
          </div>

          <div className="text-center mb-8">
            <img src={adyaLogo} alt="Adya Logo" className="w-12 h-12 mx-auto mb-4 hidden lg:block object-contain" />
            <h1 className="text-3xl font-bold mb-2">Welcome to Adya</h1>
            <p className="text-gray-500">Enter your email to sign in to your account</p>
          </div>

          <form className="space-y-6">
            <div className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-12 py-4 border rounded-[14px] bg-gray-50 text-base focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </div>
              </div>
            </div>

            <button type="submit" className="w-full py-4 bg-[#2563EB] hover:bg-blue-700 text-white rounded-[14px] flex items-center justify-center space-x-2">
              <span>Continue</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </form>

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

