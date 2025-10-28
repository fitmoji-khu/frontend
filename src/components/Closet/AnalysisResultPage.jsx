import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./Closet.module.css";

/*백엔드 준비 전 임시*/
async function mockAnalyzeAPI(file) {
  await new Promise((r) => setTimeout(r, 900));
  return {
    topCategory: "상의",
    subCategory: "블라우스/셔츠",
    colors: ["하얀색", "검정"],
  };
}

async function mockRegisterAPI(payload) {
  await new Promise((r) => setTimeout(r, 600));
  return { id: "item_123" };
}
/* !! 밑에 종류 회의로 수정해야함 */

const TOP_OPTIONS = ["상의", "하의", "아우터", "기타"];
const SUB_OPTIONS = {
  상의: ["긴팔 원피스", "긴팔 상의", "반팔 원피스", "반팔 상의", "슬링 드레스", "베스트 드레스"],
  하의: ["반바지", "치마", "긴바지" ],
  아우터: ["긴팔 아우터", "반팔 아우터", "조끼"],
  기타: ["가방"],
};
const COLOR_PRESETS = ["하얀색", "검정", "베이지", "회색", "남색", "파랑", "초록", "노랑", "빨강", "갈색", "분홍"];
//색상표 수정.
export default function AnalysisResultPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const file = location.state?.file || null;
  const previewUrl = location.state?.previewUrl || "";

  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState("");

  const [editable, setEditable] = useState(false);
  const [topCat, setTopCat] = useState("");
  const [subCat, setSubCat] = useState("");
  const [colors, setColors] = useState([]);
  const [confidence, setConfidence] = useState(null);

  useEffect(() => {
    if (!file || !previewUrl) {
      navigate("/closet/add", { replace: true });
    }
  }, [file, previewUrl, navigate]);

  // 진입 시 자동 분석
  useEffect(() => {
    let ignore = false;
    const run = async () => {
      try {
        setLoading(true);
        setError("");
        // 실제 API 들어갈 곳. mockAnalyzeAPI 교체

        const data = await mockAnalyzeAPI(file);
        if (ignore) return;

        setTopCat(data.topCategory || "");
        setSubCat(data.subCategory || "");
        setColors(data.colors || []);
        setConfidence(data.confidence ?? null);
      } catch (e) {
        setError("자동 분석 중 오류가 발생했어요. 수동 수정으로 계속 진행할 수 있어요.");
      } finally {
        setLoading(false);
      }
    };
    if (file) run();
    return () => { ignore = true; };
  }, [file]);

  const subOptions = useMemo(() => SUB_OPTIONS[topCat] || SUB_OPTIONS["기타"], [topCat]);

  const onAddColor = (c) => {
    if (!colors.includes(c)) setColors((prev) => [...prev, c]);
  };
  const onRemoveColor = (c) => setColors((prev) => prev.filter((x) => x !== c));

  const handleRegister = async (e) => {
    e?.preventDefault?.();
    try {
      setLoading(true);

      // 나중에 fetch로 바꾸기.

      const data = await mockRegisterAPI({ file, topCat, subCat, colors });
      alert("등록 완료!");
      navigate("/closet", { replace: true, state: { newItemId: data.id } });
    } catch (e) {
      alert("등록에 실패했어요. 잠시 후 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${styles.pageContainer} ${styles.pageWithHeader}`}>
      <button className={styles.backArrow} onClick={() => navigate(-1)}>←</button>

      <div className={styles.analysisGrid}>
        {/* 이미지 카드 */}
        <div className={styles.analysisCard}>
          <h3 className={styles.cardTitle}>옷 사진 이미지</h3>
          <div className={styles.imageBox}>
            {previewUrl ? (
                <img src={previewUrl} alt="cloth" className={styles.resultImage}/>
            ) : (
                <div className={styles.emptyStateContainer}>이미지가 없습니다</div>
            )}
        </div>
    </div>

        {/* 결과 카드 */}
        <div className={styles.analysisCard}>
          <h3 className={styles.cardTitle}>자동 분석 결과</h3>

          {loading ? (
            <div className={styles.skeleton}>분석 중…</div>
          ) : error ? (
            <div className={styles.errorBox}>{error}</div>
          ) : (
            <>
              {/* 상위 카테고리 */}
              <div className={styles.fieldRow}>
                <span className={styles.fieldLabel}>상위 카테고리</span>
                {editable ? (
                  <select className={styles.select} value={topCat} onChange={(e)=>setTopCat(e.target.value)}>
                    {TOP_OPTIONS.map((opt)=> <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                ) : (
                  <span className={styles.pill}>{topCat || "-"}</span>
                )}
              </div>

              {/* 하위 카테고리 */}
              <div className={styles.fieldRow}>
                <span className={styles.fieldLabel}>하위 카테고리</span>
                {editable ? (
                  <select className={styles.select} value={subCat} onChange={(e)=>setSubCat(e.target.value)}>
                    {subOptions.map((opt)=> <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                ) : (
                  <span className={styles.pill}>{subCat || "-"}</span>
                )}
              </div>

              {/* 색상 */}
              <div className={styles.fieldRow}>
                <span className={styles.fieldLabel}>색상</span>
                <div className={styles.colorArea}>
                  <div className={styles.chips}>
                    {colors.map((c)=>(
                      <span key={c} className={styles.pill}>
                        {c}
                        {editable && (
                          <button className={styles.chipX} onClick={()=>onRemoveColor(c)}>×</button>
                        )}
                      </span>
                    ))}
                  </div>

                  {editable && (
                    <div className={styles.colorPicker}>
                      <select className={styles.select} onChange={(e)=>onAddColor(e.target.value)} defaultValue="">
                        <option value="" disabled>색상 추가</option>
                        {COLOR_PRESETS.map((c)=> <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  )}
                </div>
              </div>


              <p className={styles.helperText}>
                자동 분석 결과가 이미지와 다르면<br/>수동 수정 후 등록해주세요
              </p>

              <button
                type="button"
                className={styles.cardAddButton}
                onClick={() => setEditable((v)=>!v)}
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
        onClick={(e) => handleRegister(e)}
      >
        등록
      </button>
    </div>
  );
}
