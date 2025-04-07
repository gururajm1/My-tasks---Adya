import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { ChevronLeft } from "lucide-react"

const PrivacyPolicy = () => {
  const navigate = useNavigate()

  const handleBack = () => {
    navigate(-1)
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Button
        onClick={handleBack}
        variant="outline"
        size="sm"
        className="mb-6 flex items-center gap-2 cursor-pointer"
      >
        <ChevronLeft className="h-4 w-4" />
        Back
      </Button>

      <div className="prose prose-slate max-w-none dark:prose-invert">
        <h1 className="text-3xl font-bold mb-8">VANIJ - Privacy Policy</h1>
        
        <p className="mb-6">
          At Adya ("we," "our," or "us"), we are committed to respecting and protecting your privacy. This Privacy Policy outlines how we collect, use, and manage your personal information, particularly in relation to our AI-driven automation services, applications, and platforms.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">1. Personal Information We Collect</h2>
        <p>
          We collect personal information ("Personal Information") that you provide to us directly or that we gather automatically when you interact with our services. This includes:
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Personal Information You Provide:</h3>
        <ul className="list-disc pl-6 mb-4">
          <li><strong>Account Information:</strong> When you create an account, we collect information such as your name, contact details, account credentials, and payment information.</li>
          <li><strong>User Content:</strong> We collect any content, feedback, or data you provide while using our services.</li>
          <li><strong>Communication Information:</strong> When you contact us, we collect your name, contact details, and the content of your communications.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-3">Personal Information We Collect Automatically:</h3>
        <ul className="list-disc pl-6 mb-6">
          <li><strong>Usage Data:</strong> We may collect details about how you interact with our AI-driven services.</li>
          <li><strong>Device Information:</strong> We gather information from the devices you use to access our services.</li>
          <li><strong>Cookies:</strong> We use cookies and similar tracking technologies.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">2. How We Use Personal Information</h2>
        <ul className="list-disc pl-6 mb-6">
          <li><strong>To Provide and Improve Our Services:</strong> This includes using the data to operate and enhance our AI-driven automation tools.</li>
          <li><strong>AI Model Training:</strong> Your data may be used to train and improve our AI models.</li>
          <li><strong>To Communicate with You:</strong> We may send you updates and notifications.</li>
          <li><strong>To Prevent Misuse:</strong> Your information helps us detect and prevent fraud.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">3. AI Model Training and Data Privacy</h2>
        <h3 className="text-xl font-semibold mt-6 mb-3">User Data for AI Development:</h3>
        <p className="mb-4">
          To provide high-quality AI-driven automation, we may use the data you provide to train and optimize our AI models. You can opt out through your account settings.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">4. Disclosure of Personal Information</h2>
        <p className="mb-4">
          We may disclose your Personal Information to service providers, partners, and for legal compliance purposes.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">5. Your Rights</h2>
        <p className="mb-4">
          You can exercise your rights by contacting us at ai@adya.ai
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">6. Security and Retention</h2>
        <p className="mb-4">
          We implement industry-standard measures to protect your personal data.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">7. International Data Transfers</h2>
        <p className="mb-4">
          Your data may be processed and stored on servers located outside your country of residence.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">8. Changes to This Policy</h2>
        <p className="mb-4">
          We may update this Privacy Policy from time to time. When we do, we will notify you by posting an updated version on our website.
        </p>
      </div>
    </div>
  )
}

export default PrivacyPolicy