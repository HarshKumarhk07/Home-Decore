import { jsPDF } from "jspdf";

export function generateQuotationPDF(lead: any) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // Color Palette
  const primaryColor = [30, 64, 175]; // Royal Blue (#1E40AF)
  const accentColor = [212, 175, 55]; // Gold (#D4AF37)
  const textColor = [31, 41, 55]; // Dark Gray
  const borderLight = [226, 232, 240];

  // Page Margins
  const margin = 20;
  let y = 20;

  // 1. BRAND HEADER
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text("Homes", margin, y);

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(100);
  doc.text("WATERPROOFING & FLOORING SPECIALISTS", margin, y + 5);

  // Office details (Right Aligned)
  doc.setFontSize(9);
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.text("Sector 62, Noida, UP, India", 210 - margin, y, { align: "right" });
  doc.text("Phone: +91 99999 99999", 210 - margin, y + 5, { align: "right" });
  doc.text("Email: billing@homedecorater.in", 210 - margin, y + 10, { align: "right" });

  y += 20;

  // Header Divider Line
  doc.setDrawColor(accentColor[0], accentColor[1], accentColor[2]);
  doc.setLineWidth(1);
  doc.line(margin, y, 210 - margin, y);

  y += 12;

  // 2. DOCUMENT TITLE
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text("SERVICE QUOTATION", margin, y);

  // Quote Metadata (Right Aligned)
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.text(`Quote Date: ${new Date().toLocaleDateString("en-IN")}`, 210 - margin, y, { align: "right" });
  doc.text(`Lead Reference: ${lead.leadId}`, 210 - margin, y + 5, { align: "right" });

  y += 15;

  // 3. CUSTOMER DETAILS
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(11);
  doc.text("Quotation Prepared For:", margin, y);
  
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Customer Name : ${lead.customerName}`, margin, y + 6);
  doc.text(`Phone Number  : ${lead.phone}`, margin, y + 12);
  doc.text(`Email Address : ${lead.email}`, margin, y + 18);
  doc.text(`Site Address  : ${lead.address}`, margin, y + 24);

  // Scope parameters
  doc.text(`Property Type : ${lead.propertyType || "Residential"}`, 120, y + 6);
  doc.text(`Covered Area  : ${lead.area ? `${lead.area} Sq Ft` : "N/A"}`, 120, y + 12);
  doc.text(`Service Class : ${lead.service}`, 120, y + 18);

  y += 38;

  // Details Divider
  doc.setDrawColor(borderLight[0], borderLight[1], borderLight[2]);
  doc.setLineWidth(0.5);
  doc.line(margin, y, 210 - margin, y);

  y += 10;

  // 4. BILLING ESTIMATES TABLE
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text("Scope of Estimates & Billing Breakdown", margin, y);

  y += 8;

  // Table Headers
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(margin, y, 210 - (margin * 2), 8, "F");
  
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text("S.No", margin + 4, y + 5.5);
  doc.text("Description of Service / Material Works", margin + 18, y + 5.5);
  doc.text("Total Cost (INR)", 210 - margin - 5, y + 5.5, { align: "right" });

  y += 8;

  // Calculations
  const baseBudget = lead.budget || 50000;
  const baseRate = Math.round(baseBudget * 0.85); // 85% base
  const consumableRate = Math.round(baseBudget * 0.15); // 15% brand chemicals
  const subTotal = baseRate + consumableRate;
  const gstTax = Math.round(subTotal * 0.18); // 18% GST
  const grandTotal = subTotal + gstTax;

  const rows = [
    {
      desc: `Professional ${lead.service} Service Application Fee`,
      cost: `INR ${baseRate.toLocaleString("en-IN")}`,
    },
    {
      desc: `Brand-Certified Chemical Consumables & Primers`,
      cost: `INR ${consumableRate.toLocaleString("en-IN")}`,
    },
  ];

  doc.setFont("Helvetica", "normal");
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);

  rows.forEach((row, index) => {
    // Row background stripes
    if (index % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(margin, y, 210 - (margin * 2), 10, "F");
    }
    
    // Draw cells
    doc.text((index + 1).toString(), margin + 5, y + 6.5);
    doc.text(row.desc, margin + 18, y + 6.5);
    doc.text(row.cost, 210 - margin - 5, y + 6.5, { align: "right" });
    
    y += 10;
  });

  // Table Bottom line
  doc.setDrawColor(borderLight[0], borderLight[1], borderLight[2]);
  doc.line(margin, y, 210 - margin, y);

  y += 6;

  // Summary figures (Right aligned)
  doc.setFontSize(9);
  doc.text("Sub Total:", 150, y, { align: "right" });
  doc.text(`INR ${subTotal.toLocaleString("en-IN")}`, 210 - margin - 5, y, { align: "right" });

  doc.text("GST (18%):", 150, y + 5, { align: "right" });
  doc.text(`INR ${gstTax.toLocaleString("en-IN")}`, 210 - margin - 5, y + 5, { align: "right" });

  // Grand Total banner
  y += 10;
  doc.setFillColor(248, 250, 252);
  doc.rect(110, y - 5, 210 - margin - 110, 8, "F");
  doc.setFont("Helvetica", "bold");
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text("Grand Total:", 150, y, { align: "right" });
  doc.text(`INR ${grandTotal.toLocaleString("en-IN")}`, 210 - margin - 5, y, { align: "right" });

  y += 15;

  // 5. WARRANTY AND TERMS
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(10);
  doc.text("Terms & Warranty Guidelines:", margin, y);

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(120);
  doc.text("- Waterproofing includes up to 10 Years stamped structural adhesion warranty.", margin, y + 5);
  doc.text("- Quote is based on site area dimensions provided; final billing complies with actual sq ft measures.", margin, y + 9);
  doc.text("- Quotation is valid for 30 days from date of issuance. Taxes are charged at standard government slabs.", margin, y + 13);

  y += 30;

  // 6. QR CODE AND SIGNATURE
  // Mock QR Code drawing using simple shapes
  doc.setDrawColor(textColor[0], textColor[1], textColor[2]);
  doc.setLineWidth(0.5);
  doc.rect(margin, y, 20, 20);
  doc.setFillColor(textColor[0], textColor[1], textColor[2]);
  doc.rect(margin + 2, y + 2, 6, 6, "F");
  doc.rect(margin + 12, y + 2, 6, 6, "F");
  doc.rect(margin + 2, y + 12, 6, 6, "F");
  doc.rect(margin + 10, y + 10, 3, 3, "F");
  doc.rect(margin + 14, y + 14, 4, 4, "F");
  doc.setFontSize(7);
  doc.text("Scan to Verify", margin, y + 24);

  // Signature Block (Right Aligned)
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.text("For Homes", 210 - margin, y + 2, { align: "right" });
  doc.setFont("Courier", "italic");
  doc.text("Authorized Signatory", 210 - margin, y + 12, { align: "right" });
  doc.setDrawColor(180);
  doc.setLineWidth(0.5);
  doc.line(150, y + 15, 210 - margin, y + 15);
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(8);
  doc.text("Quality Engineering Dept", 210 - margin, y + 19, { align: "right" });

  // Save the document
  doc.save(`Quotation_${lead.leadId}_${lead.customerName.replace(/\s+/g, "_")}.pdf`);
}
