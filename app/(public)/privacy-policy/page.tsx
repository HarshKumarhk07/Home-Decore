export const metadata = {
  title: "Privacy Policy",
  description:
    "Learn how Homes Decorator collects, manages, and protects customer inquiry details and uploaded site images.",
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 bg-white border border-slate-100 rounded-3xl p-8 sm:p-12 shadow-sm space-y-6 text-slate-700">
        <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-primary border-b border-slate-100 pb-6">
          Privacy Policy
        </h1>
        <p className="text-sm leading-relaxed">
          At Homes Decorator, we prioritize the privacy and security of our
          visitors and clients. This privacy policy document outlines the types
          of personal information that is collected, recorded, and processed
          when you submit an inquiry form on our website.
        </p>

        <h2 className="font-serif text-xl font-bold text-primary pt-4">
          1. Information We Collect
        </h2>
        <p className="text-sm leading-relaxed">
          When you use our forms (Get Free Quote, Book Site Inspection, Contact
          Form), we may collect details including:
        </p>
        <ul className="list-style-disc list-inside space-y-2 pl-4 text-sm">
          <li>Full Name and Contact Details (phone number, email address).</li>
          <li>Physical address of your site/property.</li>
          <li>Property dimensions, photos, and project descriptions.</li>
        </ul>

        <h2 className="font-serif text-xl font-bold text-primary pt-4">
          2. How We Use Your Data
        </h2>
        <p className="text-sm leading-relaxed">
          We use your data solely for business execution purposes:
        </p>
        <ul className="list-style-disc list-inside space-y-2 pl-4 text-sm">
          <li>
            To schedule inspections and generate customized service estimates.
          </li>
          <li>To contact you regarding appointments.</li>
          <li>To compile internal lead tracking logs.</li>
        </ul>

        <h2 className="font-serif text-xl font-bold text-primary pt-4">
          3. Data Security & Storage
        </h2>
        <p className="text-sm leading-relaxed">
          Your inquiry details are stored securely inside our MongoDB cloud
          database. Site images are uploaded to Cloudinary, a secure content
          delivery network. We deploy transport-layer security (HTTPS) to secure
          all data transmissions. We do not sell or lease customer information
          to third-party marketing companies.
        </p>

        <h2 className="font-serif text-xl font-bold text-primary pt-4">
          4. Your Rights
        </h2>
        <p className="text-sm leading-relaxed">
          You have the right to request the deletion or correction of your
          personal data from our database logs by contacting us at{" "}
          <strong>homesdecorator45@gmail.com</strong>.
        </p>
      </div>
    </div>
  );
}
