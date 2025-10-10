import React, { useState, useEffect } from "react";
import Slide from "./Slide";
import styles from './MainPage.module.css';

const SLIDES_DATA = [
  {
    id: 0,
    title: "나만의 맞춤형 코디를 추천받고 싶다면,",
    descriptions: [
      { text: "평소에 어떻게 코디해야 할지 몰라 옷장에만 있던 \n아이템을 등록해 다양한 코디를 추천받아 보세요", color: "#FCF7C5" },
      { text: "갑자기 변한 날씨에 대처할 수 있게 \n오늘 날씨에 맞는 코디를 추천받아 보세요", color: "#FFE5ED" },
    ],
    link: null,
  },
  {
    id: 1,
    title: "당신만을 위한 스타일링,\n지금 바로 시작해보세요!",
    descriptions: [
      { text: "AI 코디 추천 알고리즘은 옷을 인식하고, 색감과 날씨 정보를 종합하여 사용자에게 어울리는 스타일을 제안합니다.", color: "#BDFFD8" },
    ],
    link: { text: "> 코디 추천 바로가기", to: "/recommend", color: "#7BD5FF" },
  },
  {
    id: 2,
    title: "서로의 스타일, 함께 만들어가요!",
    descriptions: [
      { text: "맘에 드는 코디에 좋아요를 누르고,\n궁금한 점이나 의견은 댓글로 자유롭게 나눠보세요.\n당신의 피드백이 누군가에게 큰 도움이 될 수 있어요!", color: "#FDEAC5" },
    ],
    link: { text: "> 커뮤니티 바로가기", to: "/community", color: "#7BD5FF" },
  },
  {
    id: 3,
    title: "오늘의 스타일, 직접 입혀보세요!",
    descriptions: [{ text: "옷장 속 아이템을 자유롭게 조합해보며\n나만의 코디를 완성해보세요!", color: "#EACDFF" }],
    link: { text: "> 나의 옷장 바로가기", to: "/closet", color: "#7BD5FF" },
  },
];

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % SLIDES_DATA.length);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + SLIDES_DATA.length) % SLIDES_DATA.length);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES_DATA.length);
    }, 5000);
    
    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className={styles.carouselContainer}>
      <div className={styles.carouselWindow}>
        <div
          className={styles.slideStrip}
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {SLIDES_DATA.map((slide) => (
            <div key={slide.id} className={styles.slideWrapper}>
              <Slide 
                title={slide.title}
                descriptions={slide.descriptions}
                link={slide.link}
              />
            </div>
          ))}
        </div>
      </div>
      
      <button onClick={goToPrevious} className={`${styles.arrowButton} ${styles.left}`}>
        &lt;
      </button>
      <button onClick={nextSlide} className={`${styles.arrowButton} ${styles.right}`}>
        &gt;
      </button>

      <div className={styles.dotsContainer}>
        {SLIDES_DATA.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`${styles.dot} ${index === currentSlide ? styles.active : ''}`}
          />
        ))}
      </div>
    </div>
  );
}