// middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// 定义哪些路由需要保护（必须登录）
const isProtectedRoute = createRouteMatcher([
    "/settings(.*)", // 设置页
    "/",              // 首页（可按需改）
]);

export default clerkMiddleware(async (auth, req) => {
    // 注意这里要 await 保护逻辑（Clerk v5 推荐 async）
    if (isProtectedRoute(req)) {
        await auth().protect();
    }
});

export const config = {
    matcher: [
        // ✅ 跳过静态资源与 Next.js 内部路径
        "/((?!_next|favicon.ico|.*\\..*).*)",
        // ✅ 让所有 API 路径都经过中间件
        "/(api|trpc)(.*)",
    ],
};
