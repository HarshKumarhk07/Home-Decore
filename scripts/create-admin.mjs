// One-off script: create (or reset) a super-admin login in the configured MongoDB.
// Run with:  node scripts/create-admin.mjs
import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "node:crypto";

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI missing in .env");
  process.exit(1);
}

// Schema mirrors models/Admin.ts
const AdminSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    securityPin: { type: String, required: true },
    role: {
      type: String,
      enum: ["super_admin", "manager", "employee"],
      default: "employee",
    },
  },
  { timestamps: true }
);
const Admin = mongoose.models.Admin || mongoose.model("Admin", AdminSchema);

// --- Credentials --------------------------------------------------------
const EMAIL = "admin@homesdecorator.com";
const USERNAME = "Super Admin";

// Strong random password: uppercase + lowercase + digits, 10 chars.
function strongPassword() {
  const sets = [
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    "abcdefghijklmnopqrstuvwxyz",
    "0123456789",
  ];
  const all = sets.join("");
  const pick = (set) => set[crypto.randomInt(set.length)];
  // guarantee at least one from each set, then fill to length 10
  let chars = sets.map(pick);
  while (chars.length < 10) chars.push(pick(all));
  // shuffle
  for (let i = chars.length - 1; i > 0; i--) {
    const j = crypto.randomInt(i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars.join("");
}

const PASSWORD = strongPassword();
const SECURITY_PIN = String(crypto.randomInt(1000, 10000)); // 4 digits
// -----------------------------------------------------------------------

async function main() {
  await mongoose.connect(MONGODB_URI);

  const hashedPassword = await bcrypt.hash(PASSWORD, 10);
  const hashedPin = await bcrypt.hash(SECURITY_PIN, 10);

  // Remove any existing admin with this email, then create fresh.
  await Admin.deleteOne({ email: EMAIL.toLowerCase() });
  const admin = await Admin.create({
    username: USERNAME,
    email: EMAIL,
    password: hashedPassword,
    securityPin: hashedPin,
    role: "super_admin",
  });

  console.log("\n✅ Super-admin created successfully.\n");
  console.log("  Admin ID (Mongo _id) : " + admin._id.toString());
  console.log("  Login Email          : " + EMAIL);
  console.log("  Password             : " + PASSWORD);
  console.log("  Security PIN         : " + SECURITY_PIN);
  console.log("  Role                 : super_admin");
  console.log("\n  Login at: /admin/login  (email + password + security PIN)\n");

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error("❌ Failed to create admin:", err);
  process.exit(1);
});
