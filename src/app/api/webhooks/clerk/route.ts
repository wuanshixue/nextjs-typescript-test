export const runtime = "nodejs"; // ✅ 强制使用 Node.js runtime

import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import prisma from "@/lib/client";

export async function POST(req: Request) {
    const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
        throw new Error("❌ Missing WEBHOOK_SECRET in .env.local");
    }

    const headerPayload = await headers();
    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");

    if (!svix_id || !svix_timestamp || !svix_signature) {
        return new Response("❌ Missing Svix headers", { status: 400 });
    }

    const payload = await req.json();
    const body = JSON.stringify(payload);
    const wh = new Webhook(WEBHOOK_SECRET);

    let evt: WebhookEvent;
    try {
        evt = wh.verify(body, {
            "svix-id": svix_id,
            "svix-timestamp": svix_timestamp,
            "svix-signature": svix_signature,
        }) as WebhookEvent;
    } catch (err) {
        console.error("❌ Webhook verification failed:", err);
        return new Response("Invalid signature", { status: 400 });
    }

    const { id } = evt.data;
    const eventType = evt.type;

  /*console.log("🚀 Clerk webhook triggered");
    console.log(`🔹 ID: ${id}`);
    console.log(`🔹 Event type: ${eventType}`);
    console.log("🔹 Body:", body);*/

  if (eventType === "user.created") {
    try {
      await prisma.user.create({
        data: {
          id: evt.data.id,
          username:
            payload.data.username ||
            `user_${evt.data.id.substring(5)}`,
          avatar: payload.data.image_url || "/noAvatar.png",
          cover: "/noCover.png",
        },
      });
      return new Response("✅ User created", { status: 201 });
    } catch (err) {
      console.error("❌ Failed to create user", err);
      return new Response("Failed to create user", { status: 500 });
    }
  }

  if (eventType === "user.updated") {
    try {
      await prisma.user.update({
        where: { id: evt.data.id },
        data: {
          username: payload.data.username,
          avatar: payload.data.image_url || "/noAvatar.png",
        },
      });
      return new Response("✅ User updated", { status: 200 });
    } catch (err) {
      console.error("❌ Failed to update user", err);
      return new Response("Failed to update user", { status: 500 });
    }
  }

  if (eventType === "user.deleted") {
    try {
      await prisma.user.delete({
        where: { id: evt.data.id },
      });
      return new Response("✅ User deleted", { status: 200 });
    } catch (err) {
      console.error("❌ Failed to delete user", err);
      return new Response("Failed to delete user", { status: 500 });
    }
  }

  return new Response("✅ Webhook received", { status: 200 });
}
