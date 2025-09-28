import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import s from "./PostDetail.module.css";

/* 더미 데이터 (백엔드 연결 시 GET /api/posts/:id 로 대체) */
const FAKE_POSTS = [
  {
    id: 1,
    title: "오늘의 데일리룩",
    content: "심플한 흰 셔츠 + 데님 조합",
    author: "ifevanilla",
    date: "2025.**.**",
    liked: true,
    likeCount: 7,
    commentCount: 2,
    comments: [
      { id: "c1", author: "박혜민", text: "깔끔하네요!", date: "2025.**.**" },
      { id: "c2", author: "서은비", text: "셔츠 어디꺼인가요?", date: "2025.**.**" },
    ],
  },
  {
    id: 2,
    title: "가을 코디 추천",
    content: "코트 + 니트 + 슬랙스 조합",
    author: "pdy606",
    date: "2025.**.**",
    liked: true,
    likeCount: 3,
    commentCount: 1,
    comments: [{ id: "c3", author: "정우태", text: "따뜻해보여요", date: "2025.**.**" }],
  },
  {
    id: 3,
    title: "산책 룩",
    content: "드라이핏 반팔 + 조거팬츠",
    author: "seoeunbi25",
    date: "2025.**.**",
    liked: false,
    likeCount: 1,
    commentCount: 0,
    comments: [],
  },
  {
    id: 4,
    title: "데이트 코디",
    content: "라이트 자켓 + 니트 스커트",
    author: "hyemin0216",
    date: "2025.**.**",
    liked: true,
    likeCount: 5,
    commentCount: 3,
    comments: [
      { id: "c4", author: "박다영", text: "예뻐요!", date: "2025.**.**" },
      { id: "c5", author: "김병규", text: "색 조합 좋다", date: "2025.**.**" },
      { id: "c6", author: "정하린", text: "신발 정보 궁금", date: "2025.**.**" },
    ],
  },
];

export default function PostDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const { state } = useLocation();
  const numericId = Number(id);

  const [post, setPost] = useState(null);
  const [liked, setLiked] = useState(false);
  const [input, setInput] = useState("");

  useEffect(() => {
    const rich = FAKE_POSTS.find((p) => p.id === numericId); // 백엔드 연결 시 fetch 대체

    if (state && state.id != null) {
      setPost(normalize({ ...(rich || {}), ...state }));
    } else if (rich) {
      setPost(normalize(rich));
    } else {
      setPost(
        normalize({
          id: numericId,
          title: "게시글",
          content: "",
          author: "unknown",
          date: "2025.**.**",
          likeCount: 0,
          commentCount: 0,
          comments: [],
        })
      );
    }
  }, [numericId, state]);

  useEffect(() => {
    setLiked(Boolean(post?.liked));
  }, [post]);

  const toggleLike = () => {
    setLiked((prev) => {
      const next = !prev;
      setPost((p) => (p ? { ...p, likeCount: p.likeCount + (next ? 1 : -1) } : p));
      return next;
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setPost((p) =>
      p
        ? {
            ...p,
            commentCount: p.commentCount + 1,
            comments: [
              ...p.comments,
              { id: String(Math.random()), author: "나", text: input, date: "2025.**.**" },
            ],
          }
        : p
    );
    setInput("");
  };

  if (!post) return null;

  return (
    <div className={s.wrap}>
      <button
        className={s.backBtn}
        onClick={() => nav(-1)}
        aria-label="뒤로 가기"
      >
        ←
      </button>

      <section className={s.header}>
        <div className={s.thumbBox}>
          <div className={s.thumb}>이미지</div>
          <button
            className={s.heart}
            aria-pressed={liked}
            onClick={toggleLike}
            title={liked ? "좋아요 취소" : "좋아요"}
            style={{ color: liked ? "#ea6464" : "#e1e1e1" }}
          >
            ♥
          </button>
          <div className={s.date}>{post.date}</div>
        </div>

        <div className={s.meta}>
          <div className={s.row}><span className={s.metaLabel}>제목</span>{post.title}</div>
          <div className={s.row}><span className={s.metaLabel}>내용</span>{post.content}</div>
          <div className={s.row}><span className={s.metaLabel}>아이디</span>{post.author}</div>
        </div>

        <div className={s.counters}>
          <span>추천 {post.likeCount}</span>
          <span>댓글 {post.commentCount}</span>
        </div>
      </section>

      <ul className={s.comments} role="list">
        {post.comments.map((c) => (
          <li key={c.id} className={s.commentItem}>
            <span className={s.commentAuthor}>{c.author}</span>
            <span className={s.commentText}>{c.text || "댓글 작성 내용~"}</span>
            <span className={s.commentDate}>{c.date}</span>
          </li>
        ))}
      </ul>

      <form className={s.inputBar} onSubmit={onSubmit}>
        <input
          className={s.input}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="댓글을 입력하세요"
        />
        <button className={s.send} aria-label="댓글 전송">▶</button>
      </form>
    </div>
  );
}

function normalize(raw = {}) {
  return {
    id: Number(raw.id ?? 0),
    title: raw.title ?? "",
    content: raw.content ?? "",
    author: raw.author ?? raw.user ?? "",
    date: raw.date ?? "2025.**.**",
    liked: Boolean(raw.liked),
    likeCount: Number(raw.likeCount ?? 0),
    commentCount: Number(raw.commentCount ?? (raw.comments?.length ?? 0)),
    comments: raw.comments ?? [],
  };
}
