import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import s from "./Login.module.css";

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8083/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: pw }),
      });

      const raw = await res.text();
      let data = {};
      try { data = JSON.parse(raw || "{}"); } catch (e) { data = {}; }

      if (res.ok && data?.token) {
        localStorage.setItem("accessToken", data.token.access);
        localStorage.setItem("refreshToken", data.token.refresh);
        localStorage.setItem("authUser", JSON.stringify({ email }));
        window.dispatchEvent(new Event("auth-changed"));
        nav("/", { replace: true });
      } else {
        alert(data?.message || "로그인 실패. 이메일/비밀번호를 확인하세요.");
      }
    } catch (err) {
      console.error("로그인 처리 중 에러:", err);
      alert("네트워크 오류로 로그인에 실패했습니다.");
    }
  };

  return (
    <>
      <form onSubmit={onSubmit} className={s.card} autoComplete="on">
        <label className={s.label}>이메일</label>
        <input
          type="email"
          className={s.input}
          placeholder="이메일을 입력하세요"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />

        <label className={s.label} style={{ marginTop: 16 }}>비밀번호</label>
        <input
          type="password"
          className={s.input}
          placeholder="비밀번호를 입력하세요"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          autoComplete="current-password"
          required
        />

        <div style={{ height: 16 }} />
        <button type="submit" className={`${s.btn} ${s.btnPrimary}`}>완료</button>

        <hr className={s.hr} />
        <div className={s.help}>회원가입하고 서비스를 이용하세요</div>
        <button type="button" className={s.btn} onClick={() => nav("/signup")}>
          회원가입
        </button>
      </form>
    </>
  );
}
