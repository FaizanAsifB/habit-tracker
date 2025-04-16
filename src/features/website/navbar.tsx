import { Link } from '@tanstack/react-router'
import Logo from '../../components/logo'
import { Button } from '../../components/ui/button'

export default function Navbar() {
  return (
    <header className="bg-background py-4 shadow-md">
      <div className="container mx-auto flex items-center justify-between px-4">
        <Link to="/" className="flex items-center">
          <Logo className="h-8 w-auto" />
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:block">
          <ul className="flex space-x-6">
            <li>
              <a href="#features" className="hover:text-primary">
                Features
              </a>
            </li>
            <li>
              <a href="#how-it-works" className="hover:text-primary">
                How It Works
              </a>
            </li>
            <li>
              <a href="#pricing" className="hover:text-primary">
                Pricing
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-primary">
                About
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-primary">
                Contact
              </a>
            </li>
            <li>
              <Link to="/app/dashboard" className="hover:text-primary">
                Dashboard
              </Link>
            </li>
          </ul>
        </nav>

        {/* Buttons */}
        <nav className="hidden md:block">
          <ul className="flex items-center space-x-4">
            <li>
              <Link to="/login" className="hover:text-primary">
                Log In
              </Link>
            </li>
            <li>
              <Link to="/signup">
                <Button>Get Started</Button>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
