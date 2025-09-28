import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Community.module.css";

const currentUserId = "ifevanilla";

// 더미 데이터
const INITIAL_POSTS = [
  { id: 1, title: "오늘의 데일리룩", author: "ifevanilla", liked: true,  date: "2025.**.**" },
  { id: 2, title: "가을 코디 추천",    author: "pdy606",  liked: true,  date: "2025.**.**" },
  { id: 3, title: "산책 룩",     author: "seoeunbi25",     liked: false, date: "2025.**.**" },
  { id: 4, title: "데이트 코디",       author: "hyemin0216", liked: true,  date: "2025.**.**" },
];

export default function Community() {
  const navigate = useNavigate();

  const [tab, setTab] = useState("community");
  const [query, setQuery] = useState("");
  const [posts, setPosts] = useState(INITIAL_POSTS);

  useEffect(() => {
  }, []);

  const filtered = posts.filter((p) => {
    const matchesQuery = p.title.toLowerCase().includes(query.toLowerCase());
    if (tab === "mine") return p.author === currentUserId && matchesQuery;
    return matchesQuery;
  });

  const toggleLike = async (id) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, liked: !p.liked } : p))
    );
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.tabs} role="tablist" aria-label="커뮤니티 탭">
        <button
          type="button"
          role="tab"
          aria-selected={tab === "community"}
          className={`${styles.tab} ${tab === "community" ? styles.active : ""}`}
          onClick={() => setTab("community")}
        >
          커뮤니티
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "mine"}
          className={`${styles.tab} ${tab === "mine" ? styles.active : ""}`}
          onClick={() => setTab("mine")}
        >
          나의 게시글 목록
        </button>

        <button
          type="button"
          className={styles.add}
          onClick={() => navigate("/community/new")}
          aria-label="글쓰기"
          title="글쓰기"
        >
          ＋
        </button>
      </div>

      <div className={styles.search}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="검색어를 입력하세요"
          className={styles.searchInput}
          aria-label="게시글 검색"
        />
        <span className={styles.searchIco} aria-hidden>🔍</span>
      </div>

      <ul className={styles.list} role="list">
        {filtered.map((p) => (
          <li
            key={p.id}
            className={styles.item}
            onClick={() => navigate(`/community/${p.id}`, { state: p })}
            style={{ cursor: "pointer" }}
          >
            <div className={styles.left}>
              <div className={styles.thumb}>이미지</div>
              <div className={styles.title}>{p.title}</div>
            </div>

            <div className={styles.right}>
              <button
                type="button"
                className={`${styles.heart} ${p.liked ? styles.on : ""}`}
                aria-pressed={p.liked}
                title={p.liked ? "좋아요 취소" : "좋아요"}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleLike(p.id);
                }}
              >
                ♥
              </button>
              <span className={styles.date}>{p.date}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
