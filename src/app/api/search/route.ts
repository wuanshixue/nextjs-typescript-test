import { NextResponse } from "next/server";
import prisma from "@/lib/client";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get("q") || "").trim();

    if (q.length < 2) {
      return NextResponse.json({ users: [], posts: [] });
    }

    const [users, posts] = await Promise.all([
      prisma.user.findMany({
        where: {
          OR: [
            { username: { contains: q } },
            { name: { contains: q } },
            { surname: { contains: q } },
            { description: { contains: q } },
          ],
        },
        select: {
          id: true,
          username: true,
          name: true,
          surname: true,
          avatar: true,
        },
        take: 5,
      }),
      prisma.post.findMany({
        where: {
          OR: [{ desc: { contains: q } }],
        },
        select: {
          id: true,
          desc: true,
          img: true,
          user: {
            select: {
              username: true,
              avatar: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ]);

    return NextResponse.json({ users, posts });
  } catch (err) {
    console.error("/api/search error", err);
    return NextResponse.json({ users: [], posts: [] }, { status: 500 });
  }
}
