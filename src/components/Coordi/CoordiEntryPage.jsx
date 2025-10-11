import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCoordi } from "./coordiStore.js";
import styles from "./Coordi.module.css";


export default function CoordiEntryPage() {
  const navigate = useNavigate();
  const {
    state: { wardrobe, loading, error },
    loadWardrobe,
  } = useCoordi();


  // 최초 진입 시 내 옷장 불러오기
  useEffect(() => {
    loadWardrobe();
  }, [loadWardrobe]);

  const isEmpty = !loading && wardrobe.length === 0;

  return (
    <div className={styles.page}>
      <div className={styles.centerWrap}>


        {/* 비어있을 때 */}
        {!loading && !error && isEmpty && (
          <div className={styles.introCard}>
            <h2 className={styles.title}>아직 옷장이 비어 있어요!</h2>
            <img
              className={styles.logo}
              src="/Fitmoji.png"
              alt="Fitmoji 로고"
            />
            <p className={styles.desc}>
              AI 코디 추천을 받으려면 먼저 옷장을 채워주세요.
              <br />
              지금 [옷 추가하러 가기] 버튼을 눌러 나만의 옷장을
              만들어보세요!
            </p>
            <button
              type="button"
              className={styles.primaryCta}
              onClick={() => navigate("/closet/add")}
            >
              옷 추가하러 가기
            </button>
          </div>
        )}

        {/* 옷이 있을 때 */}
        {!loading && !error && !isEmpty && (
          <div className={styles.introCard}>
            <h2 className={styles.title}>코디 추천</h2>
            <img
              className={styles.logo}
              src="/Fitmoji.png"
              alt="Fitmoji 로고"
            />
            <p className={styles.desc}>
              하나의 옷을 선택하면, 인공지능이 색상, 스타일, 계절, 날씨를
              고려하여 가장 잘 어울리는 아이템을 추천해드립니다.
              <br />
              지금 옷을 선택하고, 완벽한 코디를 만나보세요!
            </p>
          </div>
        )}
      </div>

      {/* 우하단 “다음” 버튼 (옷 없으면 비활성화) */}
      <button
        type="button"
        className={styles.nextButton}
        onClick={() => navigate("/coordi/select")}
        disabled={loading || error || isEmpty}
      >
        다음
      </button>
    </div>
  );
}
