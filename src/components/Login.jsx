import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import "./Login.module.css";

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

    const text = await res.text();
    const data = JSON.parse(text);

    localStorage.setItem("accessToken", data.token.access);
    localStorage.setItem("refreshToken", data.token.refresh);
    localStorage.setItem("authUser", JSON.stringify({ email }));
    window.dispatchEvent(new Event("auth-changed"));

    nav("/", { replace: true });
    } catch (err) {
        console.error("로그인 처리 중 에러:", err);
    }
    };

    return (
        <>
            <form onSubmit={onSubmit} style={{ maxWidth: 520, margin: "0 auto" }}>
                <input
                type="email"
                placeholder="이메일"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ display: "block", width: "100%", marginBottom: 12 }}
                />
                <input
                type="password"
                placeholder="비밀번호"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                style={{ display: "block", width: "100%", marginBottom: 12 }}
                />
                <button type="submit">로그인</button>
            </form>
        </>
    );
}
