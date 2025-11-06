import React, { useMemo } from "react";
import AppLayout from "../AppLayout";
import s from "./MyPage.module.css";

const readAuth = () => {
  try {
    const raw = localStorage.getItem("authUser");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export default function MyPage() {
  const user = useMemo(readAuth, []);

  const nickname = user?.nickname || "닉네임";
  const avatarUrl = user?.avatarUrl || null;

  const personalLine =
    [user?.personalColor, ...(user?.styles || [])].filter(Boolean).join(" · ") || "개인 정보";

  const basicLine =
    [
      user?.gender,
      user?.ageBand,
      user?.height ? `${user.height}cm` : null,
      user?.weight ? `${user.weight}kg` : null,
    ]
      .filter(Boolean)
      .join(" · ") || "기본 정보";

  return (
    <>
      <section className={s.wrap}>
        <div className={s.card}>
          <div className={s.left}>
            <div className={s.avatarCircle}>
              {avatarUrl ? (
                <img src={avatarUrl} alt="프로필" />
              ) : (
                <div className={s.avatarFallback}>
                  <span>프로필</span>
                  <span>사진</span>
                </div>
              )}
            </div>
          </div>

          <div className={s.right}>
            <div className={s.row}>
              <div className={s.label}>닉네임</div>
              <div className={s.value}>{nickname}</div>
            </div>

            <div className={s.divider} />

            <div className={s.row}>
              <div className={s.label}>개인 정보</div>
              <div className={s.value}>{personalLine}</div>
            </div>

            <div className={s.divider} />

            <div className={s.row}>
              <div className={s.label}>기본 정보</div>
              <div className={s.value}>{basicLine}</div>
            </div>

            <div className={s.footer}>
              <button className={s.editBtn}>프로필 수정하기</button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
