import React from "react";

const PrivacyPolicy: React.FC = () => {
  return (
    <main className="px-6 py-10 md:px-8">
      <article className="prose prose-blue max-w-3xl mx-auto">
        <header className="not-prose mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
          <p className="text-sm text-gray-500 mt-1">Last updated: {new Date().toLocaleDateString()}</p>
        </header>

        <p>
          At <strong>AccountPay</strong>, we value your privacy. This Privacy Policy explains what
          information we collect, how we use it, and the choices you have regarding your data when
          you use our application.
        </p>

        <h2 className="text-xl font-semibold">1. Information We Collect</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong>Personal Information:</strong> If you create an account or interact with our app,
            we may collect information such as your name, email address, or profile details.
          </li>
          <li>
            <strong>Usage Data:</strong> We automatically collect data about your device, browser
            type, IP address, and the pages you visit.
          </li>
          <li>
            <strong>Cookies:</strong> We use cookies and similar technologies to enhance your
            experience, analyze usage, and deliver personalized ads.
          </li>
        </ul>

        <h2 className="text-xl font-semibold">2. How We Use Your Information</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>To provide and improve our services.</li>
          <li>To personalize your user experience.</li>
          <li>To show relevant advertisements (e.g., Google AdSense).</li>
          <li>To ensure security and prevent fraudulent activity.</li>
        </ul>

        <h2 className="text-xl font-semibold">3. Third-Party Services</h2>
        <p>
          We may use third-party services, such as Google AdSense, that collect, monitor, and analyze
          information to provide advertisements. These third parties may use cookies to serve ads
          based on your previous interactions with our app or other websites.
        </p>
        <p>
          You can opt out of personalized advertising by visiting{" "}
          <a
            href="https://www.google.com/settings/ads/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline hover:no-underline"
          >
            Google Ads Settings
          </a>
          .
        </p>

        <h2 className="text-xl font-semibold">4. Your Privacy Choices</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            You can disable cookies in your browser settings, but some features of our app may not
            function properly.
          </li>
          <li>You can request access, correction, or deletion of your personal data by contacting us.</li>
        </ul>

        <h2 className="text-xl font-semibold">5. Data Security</h2>
        <p>
          We take reasonable measures to protect your data, but no method of transmission over the
          internet is 100% secure. We cannot guarantee absolute security.
        </p>

        <h2 className="text-xl font-semibold">6. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. Changes will be posted on this page
          with the updated date.
        </p>

        <h2 className="text-xl font-semibold">7. Contact Us</h2>
        <p>
          If you have questions about this Privacy Policy, please contact us at{" "}
          <a href="mailto:therealinfiniteapps@gmail.com" className="text-blue-600 underline hover:no-underline">
            info@accountpay.com
          </a>
          .
        </p>
      </article>
    </main>
  );
};

export default PrivacyPolicy;
