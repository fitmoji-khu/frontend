import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import s from "./Login.module.css";

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8083/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: pw }),
      });
      console.log("전송 body:", { email, password: pw });


      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || "로그인 실패");
      }

      const access = data.token.access;
      const refresh = data.token.refresh;
      if (access == undefined) {
        throw new Error("서버로부터 토큰을 받지 못했습니다.")
      }
      console.log("accessToken", { access }, "refreshToken", { refresh })

      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);
      localStorage.setItem("authUser", JSON.stringify({ email }));
      window.dispatchEvent(new Event("auth-changed"));
      
      alert("로그인을 완료했습니다.");
      nav("/", { replace: true });
    } catch (err) {
      console.error("로그인 처리 중 에러:", err);
      alert("로그인 실패. 이메일과 비밀번호를 확인하세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className={s.wrap}>
        <form className={s.card} onSubmit={onSubmit}>
          <label className={s.label} htmlFor="email">
            이메일
          </label>
          <input
            id="email"
            className={s.input}
            type="email"
            placeholder="이메일을 입력하세요"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div className={s.underline} />

          <label className={s.label} htmlFor="pw">
            비밀번호
          </label>
          <input
            id="pw"
            className={s.input}
            type="password"
            placeholder="비밀번호를 입력하세요"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            required
          />
          <div className={s.underline} />

          <button type="submit" className={s.primaryBtn} disabled={loading}>
            {loading ? "처리 중..." : "완료"}
          </button>

          <div className={s.divider} />

          <p className={s.help}>회원가입하고 서비스를 이용하세요</p>
          <button
            type="button"
            className={s.secondaryBtn}
            onClick={() => nav("/signup")}
          >
            회원가입
          </button>
        </form>
      </div>
    </>
  );
}
