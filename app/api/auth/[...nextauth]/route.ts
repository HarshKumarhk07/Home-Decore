import { GET, POST } from "@/lib/auth";

export { GET, POST };
export const runtime = "nodejs"; // Force Node.js runtime since we connect to MongoDB (Mongoose)
