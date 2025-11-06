import React, { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import s from "./Signup.module.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const GENDERS = ["여성", "남성", "선택안함"];

export default function Signup() {
  const nav = useNavigate();

  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirm: "",
    name: "",
    personalColor: "",
    style: "",
    height: "",
    weight: "",
    gender: "",
    birthAt: "",
  });

  const okStep0 =
    form.email.includes("@") &&
    form.password.length >= 6 &&
    form.password === form.confirm &&
    form.name.trim().length >= 1;

  const okStep4 = true;

  const next = () => setStep((n) => Math.min(4, n + 1));
  const prev = () => setStep((n) => Math.max(0, n - 1));
  const onInput = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const HEIGHTS = Array.from({ length: 71 }, (_, i) => 140 + i);
  const WEIGHTS = Array.from({ length: 101 }, (_, i) => 40 + i);

  const finalize = async () => {
    try {
      const authUser = {
        email: form.email,
        password: form.password,
        name: form.name,
        personalColor: form.personalColor,
        style: form.style,
        height: form.height,
        weight: form.weight,
        gender: form.gender,
        birthAt: form.birthAt,
      };
      const res = await fetch("http://localhost:8083/users", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(authUser),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "회원가입 실패");
      }

      console.log("회원가입 성공:", data);

      localStorage.setItem("authUser", JSON.stringify(authUser));
      window.dispatchEvent(new Event("auth-changed"));
      alert("회원가입이 완료되었습니다");
      nav("/login", { replace: true });
    } catch (e) {
      console.error("회원가입 중 오류:", e);
      alert("회원가입 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step < 4) {
      next();
      return;
    }
    await finalize();
  };

  return (
    <>
      <div className={s.wrap}>
        <form className={s.card} onSubmit={handleSubmit}>
          {step === 0 && (
            <>
              <h2 className={s.title}>이메일과 비밀번호를 입력해주세요</h2>
              <div className={s.row}>
                <input
                  className={s.input}
                  type="email"
                  placeholder="이메일을 입력해주세요"
                  value={form.email}
                  onChange={onInput("email")}
                  required
                />
                <input
                  className={s.input}
                  type="password"
                  placeholder="비밀번호(6자 이상)"
                  value={form.password}
                  onChange={onInput("password")}
                  required
                />
                <input
                  className={s.input}
                  type="password"
                  placeholder="비밀번호를 다시 입력해주세요"
                  value={form.confirm}
                  onChange={onInput("confirm")}
                  required
                />
                <input
                  className={s.input}
                  type="text"
                  placeholder="닉네임을 입력해주세요"
                  value={form.name}
                  onChange={onInput("name")}
                  required
                />
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <h2 className={s.title}>당신의 정보를 입력해주세요</h2>
            </>
          )}

          {step === 2 && (
            <>
              <div className={s.skipRow}>
                <button type="button" className={s.skipLink} onClick={next}>
                  건너뛰기
                </button>
              </div>

              <h2 className={`${s.title} ${s.titleCenter}`}>당신의 퍼스널 컬러는?</h2>

              <div className={s.pcList} role="group" aria-label="퍼스널 컬러">
                {[
                  { key: "봄웜", label: "봄웜", desc: "따뜻하고 밝은 느낌의 화사한 색상", cls: s.pcSpring },
                  { key: "여름쿨", label: "여름쿨", desc: "부드럽고 차분한 파스텔 톤의 색상", cls: s.pcSummer },
                  { key: "가을웜", label: "가을웜", desc: "짙고 딥한 따뜻한 톤 다운된 색상", cls: s.pcAutumn },
                  { key: "겨울쿨", label: "겨울쿨", desc: "선명하고 대비 강한 색상", cls: s.pcWinter },
                  { key: "선택안함",   label: "선택안함", desc: "퍼스널컬러에 대해 잘 모르는 경우", cls: s.pcNone },
                ].map((opt) => {
                  const selected = form.personalColor === opt.key;
                  return (
                    <button
                      type="button"
                      key={opt.key}
                      className={`${s.pcRow} ${selected ? s.pcSelected : ""}`}
                      onClick={() => setForm((f) => ({ ...f, personalColor: opt.key }))}
                    >
                      <span className={`${s.pcPill} ${opt.cls}`}>{opt.label}</span>
                      <span className={s.pcDesc}>{opt.desc}</span>
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className={s.skipRow}>
                <button type="button" className={s.skipLink} onClick={next}>
                  건너뛰기
                </button>
              </div>

              <h2 className={`${s.title} ${s.titleCenter}`}>당신의 선호 추구미는?</h2>

              <div className={s.prefList} role="group" aria-label="선호 추구미">
                {[
                  { label: "귀여운", desc: "발랄하고 사랑스러운 분위기" },
                  { label: "힙한",   desc: "세련되고 감각적인 분위기" },
                  { label: "고급스러운", desc: "성숙하고 차분한 분위기" },
                  { label: "꾸안꾸", desc: "자연스러운 센스있는 분위기" },
                  { label: "청순한", desc: "맑고 깨끗한 분위기" },
                ].map((opt) => {
                  const selected = form.style.includes(opt.label);
                  return (
                    <button
                      type="button"
                      key={opt.label}
                      className={`${s.prefRow} ${selected ? s.prefSelected : ""}`}
                      onClick={() =>
                        setForm((f) => ({
                          ...f,
                          style: selected
                            ? f.style.filter((x) => x !== opt.label)
                            : [...f.style, opt.label],
                        }))
                      }
                    >
                      <span className={s.prefPill}>{opt.label}</span>
                      <span className={s.prefDesc}>{opt.desc}</span>
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {step === 4 && (
            <>
              <div className={s.skipRow}>
                <button type="button" className={s.skipLink} onClick={finalize}>
                  건너뛰기
                </button>
              </div>

              <h2 className={`${s.title} ${s.titleCenter}`}>당신의 기본 정보는?</h2>

              <div className={s.field2col}>
                <div>
                  <div className={s.formLabel}>키</div>
                  <div className={s.selectWrap}>
                    <select
                      className={s.selectPill}
                      value={form.height}
                      onChange={onInput("height")}
                    >
                      <option value="">선택</option>
                      {HEIGHTS.map((h) => (
                        <option key={h} value={h}>
                          {h} cm
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <div className={s.formLabel}>몸무게</div>
                  <div className={s.selectWrap}>
                    <select
                      className={s.selectPill}
                      value={form.weight}
                      onChange={onInput("weight")}
                    >
                      <option value="">선택</option>
                      {WEIGHTS.map((w) => (
                        <option key={w} value={w}>
                          {w} kg
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className={s.formLabel} style={{ marginTop: 14 }}>
                성별
              </div>
              <div className={s.choiceGrid3}>
                {GENDERS.map((g) => (
                  <button
                    type="button"
                    key={g}
                    className={`${s.pillBtn} ${form.gender === g ? s.pillOn : ""}`}
                    onClick={() => setForm((f) => ({ ...f, gender: g }))}
                  >
                    {g}
                  </button>
                ))}
              </div>
              <div className={s.formLabel} style={{ marginTop: 14 }}>
                생년월일
              </div>
              <div className={s.birthInputWrap}>
                <input
                  type="text"
                  className={s.birthInput}
                  placeholder="예: 2005-05-25"
                  value={form.birthAt}
                  onChange={onInput("birthAt")}
                  pattern="\d{4}-\d{2}-\d{2}"
                  maxLength={10}
                  required
                />
              </div>
            </>
          )}

          <div className={s.cardFooter}>
            <div className={s.stepper} role="status" aria-label={`전체 5단계 중 ${step + 1}단계`}>
              <div className={s.stepDots}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className={`${s.stepDot} ${i <= step ? s.stepDotOn : ""}`} />
                ))}
              </div>
              <span>{step + 1}/5</span>
            </div>

            <div className={s.actions}>
              {step > 0 && (
                <button type="button" className={`${s.btn} ${s.btnGhost}`} onClick={prev}>
                  이전
                </button>
              )}
              {step < 4 ? (
                <button type="submit" className={s.btn} disabled={step === 0 && !okStep0}>
                  다음
                </button>
              ) : (
                <button type="submit" className={s.btn} disabled={!okStep4}>
                  완료
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </>
  );
}