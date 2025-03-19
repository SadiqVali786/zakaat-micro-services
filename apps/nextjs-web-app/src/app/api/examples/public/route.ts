import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const data = { id: 123, msg: "I am Sadiq Vali" };
  return NextResponse.json({ data }, { status: 200 });
};
