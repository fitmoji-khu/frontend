import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import s from "./PostCreate.module.css";

const STORAGE_KEY = "fitmoji.community.posts";
const currentUserId = "fit_user01";

export default function PostCreate() {
  const nav = useNavigate();
  const fileRef = useRef(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);

  const openPicker = () => fileRef.current?.click();

  const onPickFiles = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const tasks = files.map(
      (f) =>
        new Promise((res, rej) => {
          const fr = new FileReader();
          fr.onload = () => res({ id: `${Date.now()}-${Math.random()}`, src: fr.result });
          fr.onerror = rej;
          fr.readAsDataURL(f);
        })
    );
    const list = await Promise.all(tasks);
    setImages((prev) => [...prev, ...list]);
    e.target.value = "";
  };

  const removeImage = (id) => setImages((prev) => prev.filter((i) => i.id !== id));

  const fmtDate = (d = new Date()) => {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}.${mm}.${dd}`;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }

    const newPost = {
      id: Date.now(),
      title: title.trim(),
      author: currentUserId,
      liked: false,
      date: fmtDate(),
      likeCount: 0,
      commentCount: 0,
      comments: [],
      images: images.map((i) => i.src),
      content: content.trim(),
    };

    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      const updated = [newPost, ...saved];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.error("저장 실패:", err);
    }

    nav("/community");
  };

  return (
    <form className={s.wrap} onSubmit={onSubmit}>
      <button
        type="button"
        className={s.backBtn}
        onClick={() => nav(-1)}
        aria-label="뒤로 가기"
      >
        ←
      </button>

      <div className={s.content}>
        <div className={s.rowTop}>
          <input
            className={s.title}
            placeholder="제목을 입력해주세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={80}
          />
        </div>

        <hr className={s.divider} />

        <div className={s.rowBody}>
          <textarea
            className={s.body}
            placeholder="고민되는 스타일링에 대해서 자유롭게 이야기를 나눠보세요"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={8}
          />
          <button
            type="button"
            className={s.addSide}
            onClick={openPicker}
            aria-label="이미지 추가"
          >
            ＋
          </button>
        </div>

        {images.length > 0 && (
          <div className={s.previewGrid}>
            {images.map((img) => (
              <div className={s.thumb} key={img.id}>
                <img src={img.src} alt="첨부 미리보기" />
                <button
                  type="button"
                  className={s.remove}
                  onClick={() => removeImage(img.id)}
                  aria-label="이미지 삭제"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={onPickFiles}
        />

        <div className={s.footer}>
          <button type="submit" className={s.submit}>
            완료
          </button>
        </div>
      </div>
    </form>
  );
}
