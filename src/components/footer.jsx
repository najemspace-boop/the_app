import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="w-full px-4">
      <div className="max-w-7xl mx-auto my-8 glass-card p-4 md:p-5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Left */}
          <div className="text-sm text-gray-700/80 dark:text-gray-200/80">
            © {new Date().getFullYear()} PropertyHub. All rights reserved.
          </div>

          {/* Center */}
          <nav className="flex items-center gap-4 text-sm">
            <Link to="/about" className="hover:underline">About</Link>
            <Link to="/contact" className="hover:underline">Contact</Link>
            <Link to="/terms" className="hover:underline">Terms</Link>
            <Link to="/privacy" className="hover:underline">Privacy</Link>
          </nav>

          {/* Right */}
          <div className="flex items-center gap-3">
            <a href="https://x.com" target="_blank" rel="noreferrer" className="text-sm hover:underline">X</a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-sm hover:underline">Instagram</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
