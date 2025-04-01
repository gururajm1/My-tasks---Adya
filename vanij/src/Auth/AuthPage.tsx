"use client"

import { useState } from "react"
import { ArrowLeft, ArrowRight, Eye, EyeOff, Lock, MessageSquare } from "lucide-react"

const AuthPage = () => {
  const [authMethod, setAuthMethod] = useState<"password" | "otp">("password")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const email = "d***r@adya.ai"

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Left side with background and testimonial */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative"
        style={{
          backgroundImage: "url('/images/blurredImage.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Logo in top left */}
        <div>
          <img src="/images/adyaLogo.png" alt="Adya Logo" className="w-16 h-16" />
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

      {/* Right side with auth form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          {/* Back button */}
          <div className="mb-8">
            <button className="flex items-center text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </button>
          </div>

          <div className="bg-white rounded-xl p-8 border border-gray-100">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold mb-2">Sign in to your account</h1>
              <p className="text-gray-500">Choose your preferred sign in method</p>
            </div>

            {/* Auth method tabs */}
            <div className="flex mb-8 bg-gray-100 rounded-lg p-1">
              <button
                className={`flex-1 py-2 px-4 rounded-lg flex justify-center items-center ${
                  authMethod === "password" ? "bg-white shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setAuthMethod("password")}
              >
                <Lock className="h-4 w-4 mr-2" />
                Password
              </button>
              <button
                className={`flex-1 py-2 px-4 rounded-lg flex justify-center items-center ${
                  authMethod === "otp" ? "bg-white shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setAuthMethod("otp")}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                OTP
              </button>
            </div>

            {/* Password form */}
            {authMethod === "password" && (
              <div className="space-y-6">
                <div className="text-center">
                  <p className="text-gray-600 mb-1">Enter your account password</p>
                  <p className="text-gray-600 font-medium">{email}</p>
                </div>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-10 py-6 pl-10"
                  />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                <div className="text-right">
                  <a href="#" className="text-sm text-gray-600 hover:text-blue-600">
                    Forgot Password?
                  </a>
                </div>

                <button type="submit" className="w-full py-6 bg-blue-500 hover:bg-blue-600 text-white">
                  Sign in
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            )}

            {/* OTP form */}
            {authMethod === "otp" && (
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-gray-600">
                    Click below to receive a verification code
                    <br />
                    on {email}
                  </p>
                </div>

                <div className="flex justify-center">
                  <button variant="outline" className="border-gray-200 hover:bg-gray-50">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Request OTP
                  </button>
                </div>

                <button type="submit" className="w-full py-6 bg-blue-500 hover:bg-blue-600 text-white">
                  Verify Code
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </div>
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
                <div className="w-4 h-4 mr-1 rounded-full border border-current flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
                </div>
                Privacy Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthPage

