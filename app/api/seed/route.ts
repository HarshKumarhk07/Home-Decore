import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/mongodb";
import Admin from "@/models/Admin";
import WebsiteSettings from "@/models/WebsiteSettings";
import Project from "@/models/Project";
import Gallery from "@/models/Gallery";
import Testimonial from "@/models/Testimonial";
import FAQ from "@/models/FAQ";
import BlogPost from "@/models/BlogPost";
import Lead from "@/models/Lead";
import ServiceCategory from "@/models/ServiceCategory";
import { fallbackGallery } from "@/lib/fallbackData";

export const dynamic = "force-dynamic";

export async function GET() {
  // Only allow seeding in development mode or if a secret token is provided
  if (
    process.env.NODE_ENV === "production" &&
    process.env.SEED_SECRET !== "decorater-seed-123"
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectToDatabase();

    // 1. Seed Admin Users
    await Admin.deleteMany({});
    const hashedPassword = await bcrypt.hash("admin123", 10);
    const hashedPin = await bcrypt.hash("1234", 10);

    const superAdmin = await Admin.create({
      username: "Super Admin",
      email: "admin@homedecorater.in",
      password: hashedPassword,
      securityPin: hashedPin,
      role: "super_admin",
    });

    // 2. Seed Website Settings
    await WebsiteSettings.deleteMany({});
    await WebsiteSettings.create({
      companyName: "Homesdecorator",
      logoUrl: "",
      phoneNumber: "+91 7743040191",
      whatsappNumber: "917743040191",
      email: "homesdecorator45@gmail.com",
      address: "Plot 42, Sector 62, Noida, UP, India - 201301",
      businessHours: "Mon - Sat: 9:00 AM - 6:30 PM",
      googleMapsEmbed:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.562013854124!2d77.3672600762145!3d28.612912484839818!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce544aaaaaaab%3A0x6b4c1069ffeaab23!2sSector%2062%2C%20Noida%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
      socialLinks: {
        facebook: "https://facebook.com/homedecorater",
        instagram: "https://instagram.com/homedecorater",
        twitter: "https://twitter.com/homedecorater",
        linkedin: "https://linkedin.com/company/homedecorater",
      },
      seoMetadata: {
        title:
          "Homesdecorator | Waterproofing, Wooden Flooring, PVC Specialists",
        description:
          "Premium waterproofing, flooring, and PVC wall panel cladding solutions with up to 10 years warranty. Serving residential and commercial clients.",
        keywords:
          "waterproofing, wooden flooring, pvc cladding, spc flooring, moisture testing, wall paneling",
      },
      waterproofingSubcategories: [
        "Roof & Slab Waterproofing",
        "Terrace Waterproofing",
        "Bathroom Seepage Waterproofing",
        "Basement & Retaining Wall Grouting",
        "Underground & Overhead Water Tanks",
      ],
      flooringSubcategories: [
        "SPC Click-Lock Flooring",
        "Premium Laminate Flooring",
        "Engineered Wood Flooring",
        "Luxury Vinyl Flooring (LVP)",
      ],
      pvcSubcategories: [
        "SPC Click-Lock Flooring",
        "Luxury Vinyl Planks (LVP) / Tiles (LVT)",
        "Roll & Sheet PVC Flooring",
        "Anti-Static (ESD) PVC Flooring",
        "PVC Wall Panels & Cladding",
      ],
    });

    // 2.5 Seed Service Categories
    await ServiceCategory.deleteMany({});
    await ServiceCategory.insertMany([
      {
        name: "Waterproofing",
        slug: "waterproofing",
        image: "/waterproofing.jpg",
        description:
          "Complete structural protection against dampness, wall seepage, bathroom leaks, and terrace flooding. We use advanced polyurethane, chemical grouting, and waterproofing membranes.",
        features: [
          "Roof & Terrace Waterproofing",
          "Basement Pressure Grouting",
          "Bathroom Seepage Treatment",
          "Underground Water Tank Sealant",
          "External Wall Dampness Coating",
        ],
        subcategories: [
          {
            name: "Roof & Slab Waterproofing",
            desc: "Provides structural sealing of slab surfaces. We scrape away old coatings, grout structural joints, and install elastic elastomeric overlays that expand and contract with temperature changes.",
            image: "/roof and slab waterproofing.jpg",
          },
          {
            name: "Terrace Waterproofing",
            desc: "Exposed terraces suffer severe thermal expansion and rain beating. We apply heavy-duty multi-layer liquid polyurethane membranes with embedded fiberglass mesh to absorb structural stresses.",
            image: "/Terrace Waterproofing.jpg",
          },
          {
            name: "Bathroom Seepage Waterproofing",
            desc: "Fixes dampness and pipe-joint leaks behind tiled bathroom walls. We apply cementitious waterproofing compounds underneath tiled floors, avoiding floor breaking using advanced grouting methods.",
            image: "/waterproofing.jpg",
          },
          {
            name: "Basement & Retaining Wall Grouting",
            desc: "Stops positive and negative side groundwater penetration. We inject low-viscosity PU resins and chemical grouts under high pressure to fill internal voids, voids, and micro-cracks in walls.",
            image: "/Basement & Retaining Wall Grouting.jpg",
          },
          {
            name: "Underground & Overhead Water Tanks",
            desc: "Seals water tanks from the inside using non-toxic food-grade epoxy coatings. Prevents contamination, structural corrosion, and outward leakage.",
            image: "/Underground & Overhead Water Tanks.jpg",
          },
        ],
      },
      {
        name: "Wooden Flooring",
        slug: "wooden-flooring",
        image: "/wooden flooring.jpg",
        description:
          "Premium wood installations using European click-lock technologies. Highly stable, scratch-resistant, and elegant floor options tailored to residential homes and retail interiors.",
        features: [
          "Heavy-duty SPC Flooring",
          "Premium Laminate Wood Flooring",
          "Luxury Vinyl Planks (LVP)",
          "Veneered Engineered Wood Flooring",
          "Premium Underlayment & Skirting",
        ],
        subcategories: [
          {
            name: "SPC Click-Lock Flooring",
            desc: "Stone Plastic Composite (SPC) flooring is 100% waterproof, fire-resistant, and highly dent-resistant. Its click-lock installation system requires no glue, making it ideal for high-humidity areas like kitchens, washrooms, and commercial spaces.",
            thickness: "5mm to 6.5mm",
            warranty: "15 Years wear warranty",
            image: "/SPC Click-Lock Flooring.jpg",
          },
          {
            name: "Premium Laminate Flooring",
            desc: "Made of high-density fiberboard (HDF) with a wear protection layer. Provides the authentic look and feel of real hardwood planks at a fraction of the cost. Scratch-resistant, making it perfect for bedrooms and living rooms.",
            thickness: "8mm to 12mm",
            warranty: "10 Years residential warranty",
            image: "/wooden flooring.jpg",
          },
          {
            name: "Engineered Wood Flooring",
            desc: "Combines real hardwood veneer as the top layer with multiple plywood core layers beneath. It can be sanded and polished over time, offering unmatched organic timber aesthetics and high structural value to premium homes.",
            thickness: "14mm to 15mm",
            warranty: "25 Years structural warranty",
            image: "/Engineered Wood Flooring.jpeg",
          },
          {
            name: "Luxury Vinyl Flooring (LVP)",
            desc: "Flexible, budget-friendly vinyl flooring that mimics wood grains and textures. LVP provides soft underfoot cushioning, sound dampening properties, and excellent durability for retail outlets and office layouts.",
            thickness: "2mm to 3mm",
            warranty: "7 Years wear warranty",
            image: "/wooden flooring.jpg",
          },
        ],
      },
      {
        name: "PVC (Polyvinyl Chloride)",
        slug: "pvc",
        image: "/PVC (Polyvinyl Chloride).jpg",
        description:
          "Premium Polyvinyl Chloride (PVC) installations including stone plastic composite (SPC) flooring and interlocking wall cladding. Highly resistant, water-resistant, and zero maintenance.",
        features: [
          "SPC Click-Lock Flooring",
          "Luxury Vinyl Planks (LVP)",
          "Roll & Sheet PVC Flooring",
          "Anti-Static ESD Flooring",
          "PVC Wall Panels & Cladding",
        ],
        subcategories: [
          {
            name: "SPC Click-Lock Flooring",
            desc: "Stone Plastic Composite (SPC) flooring is 100% waterproof, fire-resistant, and click-lock installed. Perfect for bathrooms, kitchens, and offices.",
            specification: "5mm to 6.5mm Stone-Polymer Base",
            image: "/SPC Click-Lock Flooring.jpg",
          },
          {
            name: "Luxury Vinyl Planks (LVP) / Tiles (LVT)",
            desc: "Resilient, quiet, scratchproof flooring mimicking natural wood or stone textures, with soft underfoot feel.",
            specification: "3mm to 4.5mm Dryback/Click Vinyl",
            image: "/PVC (Polyvinyl Chloride).jpg",
          },
          {
            name: "Roll & Sheet PVC Flooring",
            desc: "Seamless sheet flooring ideal for hospitals, schools, and laboratories requiring high hygiene, anti-microbial coatings, and joint welding.",
            specification: "2.0mm Commercial Anti-Bacterial",
            image: "/Roll & Sheet PVC Flooring.jpg",
          },
          {
            name: "Anti-Static (ESD) PVC Flooring",
            desc: "Specialized conductive flooring designed to prevent electrostatic discharge in server rooms, laboratories, and electronics factories.",
            specification: "2mm ESD Tile/Sheet with Copper Grid",
            image: "/Anti-Static (ESD) PVC Flooring.jpg",
          },
          {
            name: "PVC Wall Panels & Cladding",
            desc: "Water-resistant, termite-proof decorative panels for moisture-prone interior walls and ceilings.",
            specification: "Interlocking Hollow-Core/Solid PVC Sheets",
            image: "/PVC Wall Panels & Cladding.jpg",
          },
        ],
      },
    ]);

    // 3. Seed Projects
    await Project.deleteMany({});
    await Project.create([
      {
        title: "Luxury Villa PVC Cladding & SPC Flooring",
        slug: "luxury-villa-pvc-cladding-spc-flooring",
        category: "pvc",
        location: "DLF Phase 5, Gurugram",
        completionDate: new Date("2026-04-12"),
        areaCovered: "4,200 Sq Ft",
        materialsUsed: [
          "Premium PVC Wall Panels",
          "Anti-Microbial SPC Planks",
          "Silicon Sealants",
        ],
        duration: "25 Days",
        warranty: "5 Years Coating Warranty",
        clientName: "Rajesh Singhal",
        images: ["/PVC (Polyvinyl Chloride).jpg"],
        beforeAfter: {
          before:
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800",
          after: "/PVC (Polyvinyl Chloride).jpg",
        },
        description:
          "Complete installation of water-resistant Polyvinyl Chloride (PVC) wall paneling and stone plastic composite (SPC) flooring for a luxury villa.",
        isFeatured: true,
      },
      {
        title: "Commercial Terrace Waterproofing System",
        slug: "commercial-terrace-waterproofing-system",
        category: "waterproofing",
        location: "Okhla Phase III, New Delhi",
        completionDate: new Date("2026-05-20"),
        areaCovered: "12,500 Sq Ft",
        materialsUsed: [
          "Dr. Fixit Fastflex",
          "Polyurethane Membrane",
          "Fiberglass Mesh",
        ],
        duration: "14 Days",
        warranty: "10 Years Waterproofing Warranty",
        clientName: "TechSpace IT Solutions",
        images: ["/waterproofing.jpg"],
        beforeAfter: {
          before:
            "https://images.unsplash.com/photo-1595841696660-1d8c03793e46?auto=format&fit=crop&q=80&w=800",
          after: "/waterproofing.jpg",
        },
        description:
          "Heavy-duty multi-layer membrane terrace waterproofing designed to solve massive structural seepage and dampness, preventing any leakage in executive server rooms.",
        isFeatured: true,
      },
      {
        title: "German SPC Herringbone Wooden Flooring",
        slug: "german-spc-herringbone-wooden-flooring",
        category: "wooden-flooring",
        location: "Golf Links, New Delhi",
        completionDate: new Date("2026-06-05"),
        areaCovered: "2,100 Sq Ft",
        materialsUsed: [
          "German SPC Click-Lock Planks",
          "IXPE Underlayment",
          "Gold T-Trims",
        ],
        duration: "6 Days",
        warranty: "15 Years Wear Warranty",
        clientName: "Meenakshi Kapur",
        images: ["/wooden flooring.jpg"],
        beforeAfter: {
          before:
            "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&q=80&w=800",
          after: "/wooden flooring.jpg",
        },
        description:
          "Premium installation of water-resistant Stone Plastic Composite (SPC) flooring laid out in a classic herringbone layout, creating a timeless visual look with high durability.",
        isFeatured: true,
      },
    ]);

    // 4. Seed Gallery
    await Gallery.deleteMany({});
    await Gallery.create(fallbackGallery as any);

    // 5. Seed Testimonials
    await Testimonial.deleteMany({});

    // 6. Seed FAQs
    await FAQ.deleteMany({});
    await FAQ.create([
      {
        question: "How long does your waterproofing treatment last?",
        answer:
          "We offer professional warranties ranging from 5 to 10 years depending on the service level selected, which covers cracking, seepage, and peeling of waterproofing membranes.",
        category: "waterproofing",
      },
      {
        question: "What is the difference between SPC and Laminate flooring?",
        answer:
          "SPC (Stone Plastic Composite) is 100% waterproof and highly stable, making it ideal for kitchens and areas with high moisture. Laminate is made of high-density wood fibers, giving a more authentic wood feel but is sensitive to excessive water.",
        category: "wooden-flooring",
      },
      {
        question: "Is PVC flooring suitable for hot temperatures?",
        answer:
          "Yes, our high-grade PVC (Polyvinyl Chloride) panels and SPC floorings are UV-stabilized and thermal-resistant, meaning they do not warp or expand under normal Indian summer temperatures.",
        category: "pvc",
      },
      {
        question: "Do you charge for a site inspection?",
        answer:
          "No, site inspections for evaluation, moisture testing, and quotation generation are completely free of charge. You can book an inspection from the website directly.",
        category: "general",
      },
    ]);

    // 7. Seed Blog Posts
    await BlogPost.deleteMany({});
    await BlogPost.create([
      {
        title: "Top 5 Seepage Causes in Indian Homes & How to Fix Them",
        slug: "top-5-seepage-causes-indian-homes",
        coverImage: "/waterproofing.jpg",
        excerpt:
          "Seepage and dampness ruin your home's aesthetics and structural integrity. Learn about the primary causes and long-term scientific solutions.",
        content: `### Understanding Seepage in Residential Properties

Seepage is a common problem in many structures. It can cause serious damage to concrete, peel off expensive coatings, and trigger respiratory health issues due to mold growth.

#### 1. Poor Exterior Plastering
Water can enter through hairline cracks in exterior walls. Applying a weatherproof silicon paint or dynamic exterior elastomeric paint creates a strong seal.

#### 2. Damaged Sanitary Pipes
Leaking drainage pipes in bathrooms or kitchens are responsible for vertical wall dampness. Repairing joint failures or replacing PVC lines is crucial.

#### 3. Inadequate Terrace Waterproofing
Terraces accumulate water during heavy monsoons. Without proper slope alignment and high-quality membranes, water penetrates into the top floor roof.

### Scientific Solutions
Instead of simple surface remedies, opt for:
- **PU Membrane Waterproofing**: Flexible polymer coatings.
- **Pressure Injection Grouting**: Fills internal voids in concrete slabs.
`,
        category: "waterproofing",
        tags: ["Waterproofing", "Home Care", "Construction"],
      },
      {
        title:
          "Complete Guide to Choosing Between Laminate, SPC, and Engineered Wood",
        slug: "guide-choosing-laminate-spc-engineered-wood",
        coverImage: "/wooden flooring.jpg",
        excerpt:
          "Compare flooring options based on cost, durability, water resistance, and aesthetics to make the right choice for your next home renovation.",
        content: `### Decorating with Wood: The Visual Choice

Wooden floors bring warmth and elegance to any room. Choosing the right material can save you thousands in maintenance fees.

#### SPC Flooring (Stone Plastic Composite)
- **Composition**: Calcium carbonate, PVC powder, and stabilizers.
- **Pros**: 100% waterproof, dent-resistant, click-lock installation.
- **Best For**: Kitchens, basements, commercial halls.

#### Laminate Flooring
- **Composition**: High Density Fiberboard (HDF) with a photo decorative layer.
- **Pros**: Scratch-resistant, affordable, realistic wood visuals.
- **Best For**: Bedrooms, living rooms.

#### Engineered Wood Flooring
- **Composition**: Multi-layered real wood veneers glued together.
- **Pros**: Can be sanded, increases home resale value, premium timber textures.
- **Best For**: Luxury apartments, drawing rooms.
`,
        category: "wooden-flooring",
        tags: ["Flooring", "SPC", "Renovation"],
      },
    ]);

    // 8. Seed Lead Records
    await Lead.deleteMany({});
    const services = [
      "Waterproofing",
      "Wooden Flooring",
      "PVC (Polyvinyl Chloride)",
      "General",
    ];
    const cities = ["Noida", "Delhi", "Gurugram", "Faridabad", "Ghaziabad"];
    const statuses = [
      "New",
      "Contacted",
      "Inspection Scheduled",
      "Quotation Sent",
      "Negotiation",
      "Confirmed",
      "Work Started",
      "Completed",
      "Rejected",
    ];

    // Distribution per month to match the chart pattern (Jan-Jun 2026)
    const monthlyTarget = [
      { month: 0, count: 4 }, // Jan
      { month: 1, count: 7 }, // Feb
      { month: 2, count: 12 }, // Mar
      { month: 3, count: 9 }, // Apr
      { month: 4, count: 15 }, // May
      { month: 5, count: 20 }, // Jun
    ];

    const leadsToSeed: any[] = [];
    let leadSeq = 1;

    for (const target of monthlyTarget) {
      for (let i = 0; i < target.count; i++) {
        const leadIndex = leadSeq++;
        const service = services[leadIndex % services.length];
        const city = cities[leadIndex % cities.length];

        // Ensure Completed and Rejected have realistic distributions
        let status = statuses[leadIndex % statuses.length];
        if (leadIndex % 4 === 0) {
          status = "Completed";
        } else if (leadIndex % 7 === 0) {
          status = "Rejected";
        }

        const date = new Date(
          2026,
          target.month,
          Math.min(28, ((leadIndex * 3) % 28) + 1),
          10,
          0,
          0,
        );

        leadsToSeed.push({
          leadId: `HD-2026-${String(leadIndex).padStart(4, "0")}`,
          customerName: `Client ${leadIndex}`,
          phone: `+91 99999 ${String(10000 + leadIndex).substring(1)}`,
          email: `client${leadIndex}@homedecorater.in`,
          city: city,
          address: `House No. ${leadIndex * 5}, Sector ${(leadIndex % 10) + 1}, ${city}`,
          service: service,
          propertyType: leadIndex % 3 === 0 ? "Commercial" : "Residential",
          area: 500 + ((leadIndex * 150) % 3000),
          budget: 15000 + ((leadIndex * 8500) % 200000),
          status: status,
          images: [],
          notes: [
            {
              text: "Initial inquiry registered through website.",
              createdAt: date,
              createdBy: "System",
            },
          ],
          timeline: [
            {
              status: "New",
              notes: "Lead auto-created from website form.",
              updatedAt: date,
              updatedBy: "System",
            },
          ],
          createdAt: date,
          updatedAt: date,
        });
      }
    }

    await Lead.create(leadsToSeed);

    return NextResponse.json({
      success: true,
      message: "Database seeded successfully!",
      accounts: {
        superAdmin: { email: superAdmin.email, role: superAdmin.role },
      },
    });
  } catch (error: any) {
    console.error("Database seed error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
