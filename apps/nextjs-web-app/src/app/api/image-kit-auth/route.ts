import { NextResponse } from "next/server";
import ImageKit from "imagekit";

const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.NEXT_PUBLIC_URL_ENDPOINT!
});

export async function GET() {
  try {
    return NextResponse.json(imagekit.getAuthenticationParameters());
  } catch (error) {
    console.error("ImageKit authentication error:", error);
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
  }
}
