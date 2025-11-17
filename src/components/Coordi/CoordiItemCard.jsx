import React from 'react';
import styles from './Coordi.module.css';

export default function CoordiItemCard({
  categoryLabel, // e.g., "하의", "아우터"
  item, // e.g., { name, price, image, link }
  isExpanded, // 이 카드가 확장되었는지 여부 (true/false)
  onToggleDetails, // "상세정보" 버튼 클릭 시 실행될 함수
}) {
  
  // API 응답에서 name과 price를 추출
  const productName = item.name || "상품명 없음";
  const price = new Intl.NumberFormat('ko-KR').format(Number(item.price));

  return (
    <div className={styles.cardWrapper}>
      <h3 className={styles.cardTitle}>{categoryLabel}</h3>
      
      <div className={styles.imageBox}>
        <img src={item.image} alt={productName} />
      </div>

      {/* '상세정보' 버튼 */}
      <button className={styles.detailsButton} onClick={onToggleDetails}>
        상세정보 {isExpanded ? '<' : '>'}
      </button>

      {/* 'isExpanded' 상태에 따라 상세정보 영역을 보여줌 */}
      <div 
        className={styles.detailsWrapper} 
        data-expanded={isExpanded}
      >
        <div className={styles.detailsContent}>
          <p>제품명: {productName}</p>
          <p className={styles.price}>가격: {price}원</p>
          {/* 외부 링크로 연결 (새 탭에서 열기) */}
          <a href={item.link} target="_blank" rel="noopener noreferrer">
            보러 가기
          </a>
        </div>
      </div>
    </div>
  );
}