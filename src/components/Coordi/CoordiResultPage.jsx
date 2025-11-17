import React, { useState, useEffect } from 'react';
import styles from './Coordi.module.css'; // 공통 CSS
import useCoordiStore from './coordiStore.js'; // 1단계 (장바구니)
import { getRecommendations } from './coordi.api.js'; // 2단계 (전화기)
import CoordiItemCard from './CoordiItemCard.jsx'; // 방금 만든 카드

export default function CoordiResultPage() {
  // --- 1. 상태(State) 관리 ---
  const [recommendationSet, setRecommendationSet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // '상세정보' 아코디언 UI를 위한 상태
  const [expandedCategoryKey, setExpandedCategoryKey] = useState(null);

  // --- 2. 데이터 가져오기 (Store & API) ---
  const selectedClosetId = useCoordiStore((state) => state.selectedClosetId);

  useEffect(() => {
    // API 호출을 위한 비동기 함수
    const fetchData = async () => {
      // 1. 장바구니에 ID가 없으면 (e.g., 새로고침)
      if (!selectedClosetId) {
        setError('선택된 옷 정보가 없습니다. 옷 선택 페이지로 돌아가주세요.');
        setLoading(false);
        return;
      }

      // 2. 로그인 토큰 가져오기
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setError('로그인이 필요합니다.');
        setLoading(false);
        return;
      }

      // 3. API 호출 (try-catch로 감싸기)
      try {
        setLoading(true);
        // '전화기(getRecommendations)'로 '주문(selectedClosetId, token)'하기
        const data = await getRecommendations(selectedClosetId, token);
        
        // '배달 온 음식(data)'을 state에 저장
        setRecommendationSet(data);

      } catch (err) {
        setError('추천 정보를 불러오는 데 실패했습니다.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData(); // 함수 실행
  }, [selectedClosetId]); // selectedClosetId가 바뀔 때만 실행 (페이지 첫 로드)

  // --- 3. 이벤트 핸들러 ---
  const handleToggleDetails = (categoryKey) => {
    // 클릭한 카드가 이미 열려있으면 닫고 (null), 아니면 새로 연다.
    setExpandedCategoryKey(prevKey => 
      (prevKey === categoryKey ? null : categoryKey)
    );
  };

  // --- 4. 렌더링 ---
  if (loading) {
    return <div className={styles.pageContainer}>로딩 중...</div>;
  }

  if (error) {
    return <div className={styles.pageContainer}>{error}</div>;
  }

  if (!recommendationSet) {
    return <div className={styles.pageContainer}>추천 데이터가 없습니다.</div>;
  }

  // (★핵심★) API 응답 객체의 '키'들 (e.g., ["하의", "아우터", "악세서리", "신발"])
  const categoryKeys = Object.keys(recommendationSet);

  return (
    <div className={styles.pageContainer}>
      <h1>코디 추천 결과</h1>
      
      <div className={styles.cardSection}>
        {categoryKeys.map((key) => {
          // key = "하의", "아우터", ...
          const item = recommendationSet[key];
          const isExpanded = (expandedCategoryKey === key);

          return (
            <CoordiItemCard
              key={key}
              categoryLabel={key} // "하의", "아우터" ...
              item={item} // { name, price, ... }
              isExpanded={isExpanded}
              onToggleDetails={() => handleToggleDetails(key)}
            />
          );
        })}
      </div>
      
      {/*완료시 어디로 가는지???*/}
      <div className={styles.buttonContainer}>
        <button className={styles.completeButton}>완료</button>
      </div> 
    </div>
  );
}
