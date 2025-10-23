"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

type UserHit = {
  id: string;
  username: string;
  name?: string | null;
  surname?: string | null;
  avatar?: string | null;
};

type PostHit = {
  id: number;
  desc: string;
  img?: string | null;
  user: { username: string; avatar?: string | null };
};

type SearchResponse = {
  users: UserHit[];
  posts: PostHit[];
};

const useDebouncedValue = (value: string, delay = 300) => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
};

export default function Search() {
  const [q, setQ] = useState("");
  const debounced = useDebouncedValue(q);
  const [data, setData] = useState<SearchResponse>({ users: [], posts: [] });
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!debounced || debounced.trim().length < 2) {
      setData({ users: [], posts: [] });
      return;
    }
    setLoading(true);
    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;
    fetch(`/api/search?q=${encodeURIComponent(debounced)}`, {
      signal: ac.signal,
    })
      .then((r) => r.json())
      .then((json: SearchResponse) => {
        setData(json);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [debounced]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const hasResults = useMemo(
    () => (data.users?.length || 0) + (data.posts?.length || 0) > 0,
    [data]
  );

  return (
    <div className="hidden xl:flex p-2 bg-slate-100 items-center rounded-xl relative min-w-72" ref={containerRef}>
      <input
        type="text"
        value={q}
        onChange={(e) => {
          setQ(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        placeholder="搜索用户或动态..."
        className="bg-transparent outline-none flex-1"
      />
      <Image src="/search.png" alt="" width={14} height={14} />

      {open && (loading || hasResults) && (
        <div className="absolute left-0 top-full mt-2 w-[28rem] max-h-[28rem] overflow-auto rounded-xl border bg-white shadow-lg z-50 p-3 flex flex-col gap-3">
          {loading && <div className="text-sm text-gray-500">搜索中...</div>}

          {!loading && (
            <>
              {data.users.length > 0 && (
                <div>
                  <div className="px-1 pb-2 text-xs font-semibold text-gray-500">用户</div>
                  <ul className="flex flex-col gap-2">
                    {data.users.map((u) => (
                      <li key={u.id}>
                        <Link
                          href={`/profile/${u.username}`}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50"
                          onClick={() => setOpen(false)}
                        >
                          <Image
                            src={u.avatar || "/noAvatar.png"}
                            alt=""
                            width={28}
                            height={28}
                            className="rounded-full"
                          />
                          <div className="flex flex-col leading-tight">
                            <span className="text-sm font-medium">{u.username}</span>
                            {(u.name || u.surname) && (
                              <span className="text-xs text-gray-500">
                                {[u.name, u.surname].filter(Boolean).join(" ")}
                              </span>
                            )}
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {data.posts.length > 0 && (
                <div>
                  <div className="px-1 pb-2 text-xs font-semibold text-gray-500">动态</div>
                  <ul className="flex flex-col gap-2">
                    {data.posts.map((p) => (
                      <li key={p.id}>
                        <Link
                          href={`/#post-${p.id}`}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50"
                          onClick={() => setOpen(false)}
                        >
                          <Image
                            src={p.img || "/noCover.png"}
                            alt=""
                            width={48}
                            height={36}
                            className="rounded-md object-cover w-12 h-9"
                          />
                          <div className="flex flex-col leading-tight max-w-[20rem]">
                            <span className="text-sm font-medium truncate">{p.desc}</span>
                            <span className="text-xs text-gray-500 truncate">by {p.user.username}</span>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {!hasResults && (
                <div className="text-sm text-gray-500">没有找到结果</div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
