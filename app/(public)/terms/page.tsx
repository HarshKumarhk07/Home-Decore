export const metadata = {
  title: "Terms & Conditions | Home Decorater",
  description: "Read the service terms, inspection parameters, and structural warranty conditions of Home Decorater.",
};

export default function TermsPage() {
  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 bg-white border border-slate-100 rounded-3xl p-8 sm:p-12 shadow-sm space-y-6 text-slate-700">
        <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-primary border-b border-slate-100 pb-6">
          Terms & Conditions
        </h1>
        <p className="text-sm leading-relaxed">
          Welcome to Home Decorater. By requesting a service quotation or booking a site moisture inspection, you agree to comply with and be bound by the following terms and conditions.
        </p>

        <h2 className="font-serif text-xl font-bold text-primary pt-4">1. Scope of Site Inspections</h2>
        <p className="text-sm leading-relaxed">
          Free site inspections are offered for diagnostic and measurement evaluation. The property owner must authorize our personnel to access the building and terraces. Our engineers are not responsible for pre-existing structural issues found during moisture scans.
        </p>

        <h2 className="font-serif text-xl font-bold text-primary pt-4">2. Quotation Validity</h2>
        <p className="text-sm leading-relaxed">
          All generated quotations remain valid for 30 calendar days from the date of issuance. Post 30 days, rates may fluctuate depending on brand chemical procurement costs and steel/cement market rates.
        </p>

        <h2 className="font-serif text-xl font-bold text-primary pt-4">3. Written Warranty Terms</h2>
        <p className="text-sm leading-relaxed">
          Waterproofing and flooring warranties are subject to the specific chemical systems selected. Stamped warranty certificates are only issued post full clearance of outstanding invoices. Warranties do not cover damage caused by earthquakes, structural modifications by other contractors, or accidental pipe bursts.
        </p>

        <h2 className="font-serif text-xl font-bold text-primary pt-4">4. Client Obligations</h2>
        <p className="text-sm leading-relaxed">
          The client must arrange necessary water and power outlets on site during project execution. The client is requested to secure fragile or valuable personal assets before our installation or flooring squads begin operations.
        </p>
      </div>
    </div>
  );
}
