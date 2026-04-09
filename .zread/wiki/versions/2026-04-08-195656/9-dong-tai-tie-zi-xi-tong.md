动态帖子系统是整个社交平台的核心交互模块，承担着用户内容生产与消费的主要职责。该系统采用 Next.js App Router 架构，结合 Prisma ORM 与 MySQL 数据库，实现了从数据持久化到前端展示的完整闭环。

## 系统架构概览

```
┌─────────────────┐     ┌──────────────────┐     ┌────────────────┐
│  用户浏览器      │────▶│  Next.js Server  │────▶│  MySQL Database│
│  (AddPost/Feed) │     │  (Actions/API)   │     │  (Prisma ORM)  │
└─────────────────┘     └──────────────────┘     └────────────────┘
        │                        │
        ▼                        ▼
┌─────────────────┐     ┌──────────────────┐
│  PostInteraction│     │  Post/Comments   │
│  (交互组件)      │     │  (展示组件)       │
└─────────────────┘     └──────────────────┘
```

## 数据模型设计

动态帖子系统的核心数据模型定义于 `prisma/schema.prisma`，采用关系型数据库设计：

| 模型 | 作用 | 关键字段 |
|------|------|----------|
| **Post** | 帖子主体 | id, desc, img, userId, createdAt |
| **Comment** | 评论数据 | id, desc, userId, postId |
| **Like** | 点赞记录（多态） | userId, postId?, commentId? |

```prisma
// prisma/schema.prisma (第44-77行)
model Post {
  id        Int       @id @default(autoincrement())
  desc      String
  img       String?
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId    String
  comments  Comment[]
  likes     Like[]
}
```

**设计要点**：Post 与 User 是一对多关系，通过 `onDelete: Cascade` 实现级联删除，确保用户删除时其所有帖子自动清理。Like 模型采用多态设计，通过 `postId` 和 `commentId` 的可选关联支持帖子和评论两种点赞场景。

Sources: [schema.prisma](prisma/schema.prisma#L44-L77)

## 核心组件架构

### Feed 动态列表组件

`Feed` 组件是帖子流的核心容器，作为 Server Component 直接与数据库交互，支持三种数据获取模式：

```typescript
// src/components/feed/Feed.tsx (第13-21行)
const Feed = async ({
  username,
  currentUserId,
  mode = "feed",
}: {
  username?: string;
  currentUserId: string | null;
  mode?: "feed" | "recommend";
}) => { ... }
```

| 模式 | 用途 | 数据来源 |
|------|------|----------|
| `feed` | 首页动态 | 当前用户及其关注者的帖子 |
| `recommend` | 推荐流 | 各用户点赞最高的帖子 |
| `profile` | 个人主页 | 指定用户的全部帖子 |

**推荐算法实现**：获取发过帖的用户（限制60个），对每个用户取点赞量最高的帖子，最后按点赞数降序排序。

```typescript
// src/components/feed/Feed.tsx (第87-116行)
// 推荐：取每个用户点赞量最高的那篇 post
if (!username && mode === "recommend") {
  const usersWithPosts = await prisma.user.findMany({
    where: { posts: { some: {} } },
    select: { id: true },
    take: 60,
    orderBy: { createdAt: "desc" },
  });
  const topPosts = await Promise.all(
    usersWithPosts.map(async (u) => {
      const p = await prisma.post.findFirst({
        where: { userId: u.id },
        include: {
          user: true,
          likes: { select: { userId: true } },
          _count: { select: { comments: true } },
        },
        orderBy: [
          { likes: { _count: "desc" } },
          { createdAt: "desc" },
        ],
      });
      return p as PostWithExtras | null;
    })
  );
  posts = topPosts.filter(Boolean) as PostWithExtras[];
  posts.sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0));
}
```

Sources: [Feed.tsx](src/components/feed/Feed.tsx#L13-L116)

### Post 单帖组件

作为展示层核心，`Post` 组件负责单条帖子的完整渲染，包含用户信息、图片、内容及交互区：

```typescript
// src/components/feed/Post.tsx (第16-69行)
const Post=( { post }:{ post : FeedPostType } )=>{
    const {userId} = auth();
    return(
        <div id={`post-${post.id}`} className="flex flex-col gap-4">
            {/*用户信息区域*/}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href={`/profile/${post.user.username}`} ...>
                        <Image src={post.user.avatar || "/noAvatar.png"} ... />
                    </Link>
                    <Link href={`/profile/${post.user.username}`} ...>
                        {post.user.name && post.user.surname
                            ? post.user.name + " " + post.user.surname
                            : post.user.username}
                    </Link>
                </div>
                {userId === post.user.id && <PostInfo postId={post.id}/>}
            </div>
            {/*内容和图片*/}
            <div className="flex flex-col gap-4">
                {post.img &&<div className="w-full min-h-96 relative">
                    <Image src={post.img} ... />
                </div>}
                <p>{post.desc}</p>
            </div>
            {/*交互区域*/}
            <PostInteraction postId={post.id} likes={...} commentNumber={...} />
            <Comments postId={post.id} />
        </div>
    )
}
```

Sources: [Post.tsx](src/components/feed/Post.tsx#L16-L69)

### AddPost 发帖组件

发帖功能采用客户端组件实现，结合 Cloudinary 实现图片/视频上传，通过 Server Action 处理数据提交：

```typescript
// src/components/AddPost.tsx (第18-41行)
const AddPost = () => {
  const { user, isLoaded } = useUser();
  const [desc, setDesc] = useState("");
  const [media, setMedia] = useState<{ img: string; video: string }>({
    img: "",
    video: "",
  });

  const handleSuccess = (result: CloudinaryResult, widget: CloudinaryWidget) => {
    const info = result?.info as Partial<MediaInfo>;
    if (info?.secure_url) {
      if (info.resource_type === "video") {
        setMedia((prev) => ({ ...prev, video: info.secure_url! }));
      } else {
        setMedia((prev) => ({ ...prev, img: info.secure_url! }));
      }
    }
    widget.close();
  };
  // ...
};
```

**表单提交流程**：
1. 用户填写描述文本，选择图片或视频
2. Cloudinary 上传并返回资源 URL
3. 表单提交时调用 Server Action `addPost(formData, media)`
4. 服务端验证并写入数据库

```typescript
// src/components/AddPost.tsx (第56-77行)
<form action={(formData) => addPost(formData, media)} className="flex gap-4">
  <textarea placeholder="What's on your mind?" name="desc" ... />
  <AddPostButton />
</form>
```

Sources: [AddPost.tsx](src/components/AddPost.tsx#L18-L77)

## 交互功能模块

### PostInteraction 帖子交互

帖子交互组件处理点赞和评论计数显示，通过 Server Actions 与后端通信。

### Comments 评论系统

评论功能采用独立组件实现，支持帖子的评论展示和交互。

## 扩展阅读

- 了解帖子系统的基础——[认证系统](6-ren-zheng-xi-tong)的用户体系如何支撑帖子归属
- 学习数据如何流动——[客户端与服务端Actions](15-ke-hu-duan-yu-fu-wu-duan-actions)详述 `addPost` 等操作实现
- 探索图片上传机制——[图像与媒体资源](20-tu-xiang-yu-mei-ti-zi-yuan)讲解 Cloudinary 集成