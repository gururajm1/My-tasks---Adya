import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { ChevronLeft } from "lucide-react"
import { useEffect, useState } from "react"

const TermsOfService = () => {
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState<string>('terms')

  const handleBack = () => {
    navigate(-1)
  }

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setActiveSection(sectionId)
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['terms', 'license', 'development']
      const viewportHeight = window.innerHeight
      let currentSection = activeSection

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          const elementCenter = rect.top + rect.height / 2
          
          if (elementCenter >= 0 && elementCenter <= viewportHeight) {
            currentSection = section
            break
          }
        }
      }

      setActiveSection(currentSection)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [activeSection])

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl relative">
      <Button
        onClick={handleBack}
        variant="outline"
        size="sm"
        className="mb-6 flex items-center gap-2 cursor-pointer"
      >
        <ChevronLeft className="h-4 w-4" />
        Back
      </Button>

      <div className="flex gap-8">
        <div className="w-48 flex-shrink-0 sticky top-8 h-fit">
          <div className="flex flex-col gap-2">
            <div
              onClick={() => scrollToSection('terms')}
              className={`cursor-pointer py-2 px-4 rounded transition-colors ${activeSection === 'terms' ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
            >
              Terms of Use
            </div>
            <div
              onClick={() => scrollToSection('license')}
              className={`cursor-pointer py-2 px-4 rounded transition-colors ${activeSection === 'license' ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
            >
              License
            </div>
            <div
              onClick={() => scrollToSection('development')}
              className={`cursor-pointer py-2 px-4 rounded transition-colors ${activeSection === 'development' ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
            >
              App Development
            </div>
          </div>
        </div>

        <div className="prose prose-slate max-w-none dark:prose-invert flex-grow">
          <div id="terms">
            <h1 className="text-3xl font-bold mb-8">TERMS OF USE ADYA</h1>
            <p className="mb-6">
              These Terms of Use constitute a legal agreement between you and Shayr Omnichannel Private Limited ("Adya," "we," or "us") regarding your use of App Studio, our intuitive application development platform that transforms text, images, and screens into functional applications and user interfaces (the "App Studio Platform"). By accessing or using the App Studio Platform, you acknowledge that you have read, understood, and agree to be bound by these Terms.
            </p>
          </div>

          <div id="license">
            <h2 className="text-2xl font-semibold mt-8 mb-4">1. LICENSE TO USE APP STUDIO</h2>
            <h3 className="text-xl font-semibold mt-6 mb-3">1.1 Grant of License</h3>
            <p className="mb-4">
              Subject to these Terms, Adya grants you a limited, non-exclusive, non-transferable license to use the App Studio Platform. For users under our Enterprise or Business Plans, this license includes commercial usage rights. For all other users, the license is limited to personal, non-commercial use.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-3">1.2 Intellectual Property Rights</h3>
            <p className="mb-4">Adya retains ownership of all aspects of the App Studio Platform, including:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>The text, visual interfaces, and interactive features</li>
              <li>Graphics, design, and compilation</li>
              <li>Computer code, products, and software</li>
              <li>All other elements and components</li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-3">1.3 Restrictions</h3>
            <p className="mb-4">You may not:</p>
            <ul className="list-disc pl-6 mb-6">
              <li>Modify, reproduce, or republish the App Studio Platform</li>
              <li>Create derivative works without authorization</li>
              <li>Reverse engineer or decompile the platform</li>
              <li>Distribute, rent, or lease your access</li>
              <li>Remove proprietary notices or labels</li>
              <li>Use the platform to create competing products</li>
            </ul>
          </div>

          <div id="development">
            <h2 className="text-2xl font-semibold mt-8 mb-4">2. APP DEVELOPMENT AND OWNERSHIP</h2>
            <h3 className="text-xl font-semibold mt-6 mb-3">2.1 Your Applications</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>You retain ownership of applications you create using App Studio</li>
              <li>You are responsible for your application's content and functionality</li>
              <li>You must ensure your applications comply with applicable laws</li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-3">2.2 Generated Code</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>You receive a license to use AI-generated code in your applications</li>
              <li>The underlying generation technology remains Adya's property</li>
              <li>You may modify and customize generated code for your needs</li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-3">2.3 Design Assets</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>You may use provided design templates and components</li>
              <li>Custom designs you create remain your property</li>
              <li>Standard design elements remain Adya's property</li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  )
}

export default TermsOfService