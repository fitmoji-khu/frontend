import React, { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import s from "./Signup.module.css";

const GENDERS = ["여성", "남성", "선택안함"];
const AGE_BANDS = ["10대", "20대", "30대", "40대", "50대", "60대 이상"];

const fileToDataUrl = (file) =>
  new Promise((res, rej) => {
    const fr = new FileReader();
    fr.onload = () => res(fr.result);
    fr.onerror = rej;
    fr.readAsDataURL(file);
  });

export default function Signup() {
  const nav = useNavigate();

  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirm: "",
    nickname: "",
    avatar: null,
    personalColor: "",
    styles: [],
    height: "",
    weight: "",
    gender: "",
    ageBand: "",
  });

  const avatarUrl = useMemo(
    () => (form.avatar ? URL.createObjectURL(form.avatar) : null),
    [form.avatar]
  );

  const okStep0 =
    form.email.includes("@") &&
    form.password.length >= 6 &&
    form.password === form.confirm &&
    form.nickname.trim().length >= 1;

  const okStep4 = true;

  const next = () => setStep((n) => Math.min(4, n + 1));
  const prev = () => setStep((n) => Math.max(0, n - 1));
  const onInput = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const fileRef = useRef(null);
  const openFile = () => fileRef.current?.click();
  const onPick = (e) => {
    const f = e.target.files?.[0];
    if (f) setForm((s0) => ({ ...s0, avatar: f }));
  };

  const HEIGHTS = Array.from({ length: 71 }, (_, i) => 140 + i);
  const WEIGHTS = Array.from({ length: 101 }, (_, i) => 40 + i);

  const finalize = async () => {
    try {
      let avatarDataUrl = null;
      if (form.avatar) {
        avatarDataUrl = await fileToDataUrl(form.avatar);
      }

      const authUser = {
        id: crypto.randomUUID?.() || String(Date.now()),
        email: form.email,
        nickname: form.nickname,
        avatarUrl: avatarDataUrl,
        personalColor: form.personalColor,
        styles: form.styles,
        height: form.height,
        weight: form.weight,
        gender: form.gender,
        ageBand: form.ageBand,
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem("authUser", JSON.stringify(authUser));
      window.dispatchEvent(new Event("auth-changed"));
      nav("/login", { replace: true });
    } catch (e) {
      console.error(e);
      alert("가입 중 문제가 발생했습니다. 다시 시도해주세요.");
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
                  value={form.nickname}
                  onChange={onInput("nickname")}
                  required
                />
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <h2 className={s.title}>당신의 정보를 입력해주세요</h2>
              <div className={s.badges} aria-hidden>
                <span className={s.badge}>기본 정보</span>
                <span className={s.badge}>스타일 취향</span>
                <span className={s.badge}>퍼스널 컬러</span>
              </div>
              <div className={s.avatarWrap}>
                <div className={s.avatar}>
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="미리보기" />
                  ) : (
                    <img src="/Fitmoji.png" alt="Fitmoji" width="64" height="64" />
                  )}
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={onPick}
                />
                <button className={s.uploader} type="button" onClick={openFile}>
                  프로필 이미지 선택(선택)
                </button>
                <p className={s.help}>
                  이미지는 선택 사항입니다. 나중에 마이페이지에서 변경할 수 있어요.
                </p>
              </div>
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
                  { key: "spring", label: "봄웜", desc: "따뜻하고 밝은 느낌의 화사한 색상", cls: s.pcSpring },
                  { key: "summer", label: "여름쿨", desc: "부드럽고 차분한 파스텔 톤의 색상", cls: s.pcSummer },
                  { key: "autumn", label: "가을웜", desc: "짙고 딥한 따뜻한 톤 다운된 색상", cls: s.pcAutumn },
                  { key: "winter", label: "겨울쿨", desc: "선명하고 대비 강한 색상", cls: s.pcWinter },
                  { key: "none",   label: "선택안함", desc: "퍼스널컬러에 대해 잘 모르는 경우", cls: s.pcNone },
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
                  const selected = form.styles.includes(opt.label);
                  return (
                    <button
                      type="button"
                      key={opt.label}
                      className={`${s.prefRow} ${selected ? s.prefSelected : ""}`}
                      onClick={() =>
                        setForm((f) => ({
                          ...f,
                          styles: selected
                            ? f.styles.filter((x) => x !== opt.label)
                            : [...f.styles, opt.label],
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
                나잇대
              </div>
              <div className={s.choiceGrid3}>
                {AGE_BANDS.map((a) => (
                  <button
                    type="button"
                    key={a}
                    className={`${s.pillBtn} ${form.ageBand === a ? s.pillOn : ""}`}
                    onClick={() => setForm((f) => ({ ...f, ageBand: a }))}
                  >
                    {a}
                  </button>
                ))}
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