import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Closet.module.css';

export default function AddClothPage() {
  const navigate = useNavigate();

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  const fileInputRef = useRef(null);

  // 뒤로가기 버튼 클릭 시
  const handleBackClick = () => {
    navigate(-1); 
  };

  // '+ 추가하기' 버튼 클릭 시 
  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  // 사용자가 파일을 선택했을 때 실행되는 함수
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // '다음' 버튼 클릭 시
  const handleNextClick = () => {
    if (!selectedFile) {
      alert('이미지를 선택해주세요.');
      return;
    }
    navigate('/closet/result', { state: { previewUrl, file: selectedFile } });
  };

  return (
    <div className={`${styles.pageContainer} ${styles.pageWithHeader}`}>
      {/* --- 뒤로가기 화살표 --- */}
      <button className={styles.backArrow} onClick={handleBackClick}>
        ←
      </button>

      {/* --- 중앙 업로드 카드 --- */}
      <div className={styles.uploadCard}>
        {!previewUrl ? (
          // 이미지를 선택하기 전
          <>
            <h2>옷 사진 업로드</h2>
            <p>옷의 색깔과 패턴이 잘보이도록<br />사진을 찍어 업로드해주세요!</p>
              <button className={styles.cardAddButton} onClick={handleUploadClick}>
                + 추가하기
            </button>
          </>
        ) : (
          // 이미지를 선택한 후
          <>
            <h2>사진이 선택되었습니다!</h2>
            <img src={previewUrl} alt="Selected cloth" className={styles.imagePreview} />
          </>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
        accept="image/*" // 이미지 파일만 선택할 수 있도록 필터링
      />

      {/* --- 다음 버튼 --- */}
      <button 
        className={styles.nextButton} 
        onClick={handleNextClick} 
        disabled={!selectedFile}
      >
        다음
      </button>
    </div>
  );
}