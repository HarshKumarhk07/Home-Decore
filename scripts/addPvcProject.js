// One-off script: inserts a single PVC project into the database.
// Run with:  node scripts/addPvcProject.js
// Does NOT delete or modify any existing data.

const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

// --- Load MONGODB_URI from .env (dotenv isn't installed) ---
function loadEnv() {
  const envPath = path.join(__dirname, "..", ".env");
  const content = fs.readFileSync(envPath, "utf8");
  for (const line of content.split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (match) process.env[match[1]] = match[2];
  }
}
loadEnv();

const ProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: { type: String, enum: ["waterproofing", "wooden-flooring", "pvc"], required: true },
    location: { type: String, required: true },
    completionDate: { type: Date, required: true },
    areaCovered: { type: String, required: true },
    materialsUsed: [{ type: String }],
    duration: { type: String, required: true },
    warranty: { type: String, required: true },
    clientName: { type: String },
    images: [{ type: String, required: true }],
    videos: [{ type: String }],
    beforeAfter: { before: { type: String }, after: { type: String } },
    description: { type: String, required: true },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Project = mongoose.models.Project || mongoose.model("Project", ProjectSchema);

const newProject = {
  title: "Office PVC Wall Cladding & SPC Flooring",
  slug: "office-pvc-wall-cladding-spc-flooring",
  category: "pvc",
  location: "Cyber Hub, Gurugram",
  completionDate: new Date("2026-06-18"),
  areaCovered: "3,400 Sq Ft",
  materialsUsed: ["Interlocking PVC Wall Panels", "Anti-Static SPC Flooring", "PU Edge Sealant"],
  duration: "18 Days",
  warranty: "5 Years Coating Warranty",
  clientName: "Nexus Workspaces Pvt. Ltd.",
  images: ["/PVC Wall Panels & Cladding.jpg"],
  beforeAfter: {
    before: "/SPC Click-Lock Flooring.jpg",
    after: "/PVC Wall Panels & Cladding.jpg",
  },
  description:
    "End-to-end installation of water-resistant, termite-proof PVC wall cladding paired with anti-static SPC flooring across an open-plan corporate office, delivering a hygienic, zero-maintenance, and elegant finish.",
  isFeatured: true,
};

async function main() {
  await mongoose.connect(process.env.MONGODB_URI, { bufferCommands: false });
  console.log("Connected to MongoDB.");

  const existing = await Project.findOne({ slug: newProject.slug });
  if (existing) {
    console.log("A project with this slug already exists. Skipping insert:", existing._id.toString());
  } else {
    const created = await Project.create(newProject);
    console.log("PVC project added:", created._id.toString(), "-", created.title);
  }

  await mongoose.disconnect();
  console.log("Done.");
}

main().catch(async (err) => {
  console.error("Failed to add PVC project:", err);
  try { await mongoose.disconnect(); } catch {}
  process.exit(1);
});
