import { handlers } from "@/auth"; // Referring to the auth.ts we just created
export const { GET, POST } = handlers;

// import { handlers } from "@/auth"; // Referring to the auth.ts we just created
// import { NextRequest } from "next/server";

// export async function GET(req: NextRequest) {
//   return handlers.GET(req);
// }

// export async function POST(req: NextRequest) {
//   return handlers.POST(req);
// }
