// src/components/Footer.tsx
export default function Footer() {
    return (
      <footer className="sticky bottom-0 z-50 border-t bg-gray-200 py-6 text-sm text-gray-600">
        <div className="container mx-auto px-4 flex flex-wrap items-center gap-4">
          <a href="/privacy-policy" className="hover:underline">Privacy Policy</a>
          <span>•</span>
          <a href="/terms" className="hover:underline">Terms</a>
          <span className="ml-auto">© {new Date().getFullYear()} AccountPay</span>
        </div>
      </footer>
    );
  }
  