import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./Closet.module.css";

const API_BASE = "http://localhost:8083"; 

export default function AnalysisResultPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const file = location.state.file;
  const previewUrl = location.state.previewUrl;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editable, setEditable] = useState(false);
  const [closetId, setClosetId] = useState(null);

  const [topCat, setTopCat] = useState("");
  const [subCat, setSubCat] = useState("");
  const [colors, setColors] = useState([]);
  const [confidence, setConfidence] = useState(null);

  const TOP_OPTIONS = ["상의", "하의", "아우터", "기타"];
  const SUB_OPTIONS = {
    상의: ["긴팔 원피스", "긴팔 상의", "반팔 원피스", "반팔 상의", "슬링 드레스", "베스트 드레스"],
    하의: ["반바지", "치마", "긴바지"],
    아우터: ["긴팔 아우터", "반팔 아우터", "조끼"],
    기타: ["가방"],
  };
  const COLOR_PRESETS = ["하얀색", "검정", "베이지", "회색", "남색", "파랑", "초록", "노랑", "빨강", "갈색", "분홍"];

  useEffect(() => {
    if (!file || !previewUrl) navigate("/closet/add", { replace: true });
  }, [file, previewUrl, navigate]);

  useEffect(() => {
    let ignore = false;

    const run = async () => {
      try {
        setLoading(true);
        setError("");
        const token = localStorage.getItem("accessToken");

        if (!token) throw new Error("로그인 후 이용해주세요.");

        const formData = new FormData();
        formData.append("file", file);

        const mediaRes = await fetch(`${API_BASE}/medias`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        if (!mediaRes.ok) throw new Error("이미지 업로드 실패");
        const mediaData = await mediaRes.json();
        const mediaId = mediaData.id;

        const closetRes = await fetch(`${API_BASE}/closets`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ mediaId }),
        });

        if (!closetRes.ok) throw new Error("옷 분석 실패");
        const closetData = await closetRes.json();

        if (ignore) return;

        setClosetId(closetData.id);
        setTopCat(closetData.upperCategory);
        setSubCat(closetData.lowerCategory);
        setColors(
          closetData.color
            ? closetData.color.split(",").map((c) => c.trim())
            : []
        );
        setConfidence(closetData.accuracy ?? null);

        console.log("등록 완료:", closetData);
      } catch (err) {
        console.error(err);
        setError("자동 분석 중 오류가 발생했습니다. 수동으로 수정해주세요.");
      } finally {
        setLoading(false);
      }
    };

    if (file) run();
    return () => {
      ignore = true;
    };
  }, [file]);


  const subOptions = useMemo(() => SUB_OPTIONS[topCat] || SUB_OPTIONS["기타"], [topCat]);

  const onAddColor = (c) => {
    if (!colors.includes(c)) setColors((prev) => [...prev, c]);
  };
  const onRemoveColor = (c) => setColors((prev) => prev.filter((x) => x !== c));
  const handleEditToggle = async () => {
    if (editable) {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) throw new Error("로그인 후 이용해주세요.");

        const body = {
          upperCategory: topCat,
          lowerCategory: subCat,
          color: colors.join(", "),
        };

        const res = await fetch(`${API_BASE}/closets/${closetId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        });

        if (!res.ok) throw new Error("수정 실패");
        alert("수정이 완료되었습니다!");
        navigate("/closet", { replace: true });
      } catch (err) {
        console.error(err);
        alert("수정 중 오류가 발생했습니다.");
      }
    }
  }

  const handleRegister = async (e) => {
    e?.preventDefault?.();
    alert("이미 자동 등록이 완료되었습니다!");
    navigate("/closet", { replace: true });
  };

  return (
    <div className={`${styles.pageContainer} ${styles.pageWithHeader}`}>
      <button className={styles.backArrow} onClick={() => navigate(-1)}>←</button>

      <div className={styles.analysisGrid}>
        <div className={styles.analysisCard}>
          <h3 className={styles.cardTitle}>옷 사진 이미지</h3>
          <div className={styles.imageBox}>
            {previewUrl ? (
              <img src={previewUrl} alt="cloth" className={styles.resultImage} />
            ) : (
              <div className={styles.emptyStateContainer}>이미지가 없습니다</div>
            )}
          </div>
        </div>

        <div className={styles.analysisCard}>
          <h3 className={styles.cardTitle}>자동 분석 결과</h3>

          {loading ? (
            <div className={styles.skeleton}>분석 중…</div>
          ) : error ? (
            <div className={styles.errorBox}>{error}</div>
          ) : (
            <>
              <div className={styles.fieldRow}>
                <span className={styles.fieldLabel}>상위 카테고리</span>
                {editable ? (
                  <select className={styles.select} value={topCat} onChange={(e) => setTopCat(e.target.value)}>
                    {TOP_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span className={styles.pill}>{topCat || "-"}</span>
                )}
              </div>

              <div className={styles.fieldRow}>
                <span className={styles.fieldLabel}>하위 카테고리</span>
                {editable ? (
                  <select className={styles.select} value={subCat} onChange={(e) => setSubCat(e.target.value)}>
                    {subOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span className={styles.pill}>{subCat || "-"}</span>
                )}
              </div>

              <div className={styles.fieldRow}>
                <span className={styles.fieldLabel}>색상</span>
                <div className={styles.colorArea}>
                  <div className={styles.chips}>
                    {colors.map((c) => (
                      <span key={c} className={styles.pill}>
                        {c}
                        {editable && (
                          <button className={styles.chipX} onClick={() => onRemoveColor(c)}>
                            ×
                          </button>
                        )}
                      </span>
                    ))}
                  </div>

                  {editable && (
                    <div className={styles.colorPicker}>
                      <select
                        className={styles.select}
                        onChange={(e) => onAddColor(e.target.value)}
                        defaultValue=""
                      >
                        <option value="" disabled>
                          색상 추가
                        </option>
                        {COLOR_PRESETS.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </div>

              {confidence && (
                <p className={styles.helperText}>정확도: {confidence.toFixed(2)}%</p>
              )}

              <p className={styles.helperText}>
                자동 분석 결과가 이미지와 다르면<br />
                수동 수정 후 등록해주세요
              </p>

              <button
                type="button"
                className={styles.cardAddButton}
                onClick={handleEditToggle}
                disabled={!closetId}
              >
                {editable ? "수정 완료" : "수동 수정"}
              </button>
            </>
          )}
        </div>
      </div>

      <button
        type="button"
        className={styles.nextButton}
        disabled={loading || !topCat}
        onClick={handleRegister}
      >
        등록 완료
      </button>
    </div>
  );
}