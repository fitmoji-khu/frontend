import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Closet.module.css';


const DUMMY_CLOTHES = [
    { id: 1, category: '상의', imageUrl: 'https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMjA4MDhfMjMx%2FMDAxNjU5OTQxOTYzNzU0.MQ1nV4SlWaaB5bm9moxQs0c1J81MUmeMPw_hWdZzte8g.BZ4-lqcnAlLCotbiuZZ1wlT2LjA8MK8YDO_8BoMM3psg.PNG.hkh443%2Fimage.png&type=a340' },
    { id: 2, category: '상의', imageUrl: 'https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMjA4MTlfNDcg%2FMDAxNjYwOTIwODczNDE0.b0C6qu2V2UDVQvQhsU5YdNFnt98utmadl4vhFptx5WUg.S03FpAEtRyraG-eyVv-BaGStgi02zwkE4gTRH3usAYEg.PNG.some1it_%2Fimage.png&type=a340' },
    { id: 3, category: '상의', imageUrl: 'https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMjA4MTlfNDcg%2FMDAxNjYwOTIwODczNDE0.b0C6qu2V2UDVQvQhsU5YdNFnt98utmadl4vhFptx5WUg.S03FpAEtRyraG-eyVv-BaGStgi02zwkE4gTRH3usAYEg.PNG.some1it_%2Fimage.png&type=a340' },
    { id: 4, category: '상의', imageUrl: 'https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMjA4MDdfMjcx%2FMDAxNjU5ODQ3MjgwOTE2.P_cc_3h4NnVVxD-jiVSVegVOtvRMKPHgxlw1XxH3NEcg.2UXj4CVsqSzgQpziJLTLptc-4TbmJ79MEmTVslGhKPEg.PNG.skywhite369%2Fimage.png&type=a340' },
    { id: 5, category: '상의', imageUrl: 'https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMjA4MTNfNzIg%2FMDAxNjYwMzIxMDA3NzQz.VEOTvTKV8XESAJV06Z0LXTocel44xTss5rImTi0w1KYg.UJFpGxChw7fvYpMRJ2237r8uFBc7FeWRemKSkVlHbLAg.PNG.some1it_%2Fimage.png&type=a340' },
    { id: 6, category: '상의', imageUrl: 'https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMjA4MTlfNTIg%2FMDAxNjYwOTIxMTIzMDI2.p1kpTptV5xd_Lt7R9ctvrY6caVq1up2UMr7z8ozYo7og.jGl03EkIb3GG0jHfigWVhrJLUol4wyz8hAiFflakR64g.PNG.some1it_%2Fimage.png&type=a340' },
    { id: 7, category: '상의', imageUrl: 'https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMjA4MDZfMjMx%2FMDAxNjU5Nzk2MzMzNDMz.cLMEYmPd5Uq0qur9Lq2JHLp0JwO-nWPmzxxwqFFaX94g.6vKm70Erz3hooKY-bRiVrQrclD_OsP9yp-ej_pJqWcwg.JPEG.serailac_1%2F1659796333260.jpg&type=a340' },
    { id: 8, category: '상의', imageUrl: 'https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMjA4MTNfNzIg%2FMDAxNjYwMzIxMDA3NzQz.VEOTvTKV8XESAJV06Z0LXTocel44xTss5rImTi0w1KYg.UJFpGxChw7fvYpMRJ2237r8uFBc7FeWRemKSkVlHbLAg.PNG.some1it_%2Fimage.png&type=a340' },
    { id: 9, category: '상의', imageUrl: 'https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMjA4MTlfNTIg%2FMDAxNjYwOTIxMTIzMDI2.p1kpTptV5xd_Lt7R9ctvrY6caVq1up2UMr7z8ozYo7og.jGl03EkIb3GG0jHfigWVhrJLUol4wyz8hAiFflakR64g.PNG.some1it_%2Fimage.png&type=a340' },
    { id: 10, category: '상의', imageUrl: 'https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMjA4MDZfMjMx%2FMDAxNjU5Nzk2MzMzNDMz.cLMEYmPd5Uq0qur9Lq2JHLp0JwO-nWPmzxxwqFFaX94g.6vKm70Erz3hooKY-bRiVrQrclD_OsP9yp-ej_pJqWcwg.JPEG.serailac_1%2F1659796333260.jpg&type=a340' },
  
    { id: 11, category: '하의', imageUrl: 'https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNTA5MTJfMjQx%2FMDAxNzU3NjQ2Nzk5NjU1.Fg1dSvrOcwNBbzcxf6o8ehuqjirSbvNe-BnybTGHiaQg.9N5Y38o-bgDAOsYgZDti21ApS_sDqKicY3igLvNSca0g.JPEG%2F900%25A3%25DF1757260174449.jpg&type=a340' },
    { id: 12, category: '하의', imageUrl: 'https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNTA2MTZfMjI5%2FMDAxNzUwMDc1MTQ0Njg5.I0EgNxTClgM71DTQeE5IOVyffuP3oG7mr-cluxLbuQAg.UXVN2xpQq7P166ufxq3fNcgCZRdjg89AZed-cR32GB8g.JPEG%2FIMG%25A3%25DF8575.jpg&type=a340' },
  
    { id: 13, category: '자켓', imageUrl: 'https://search.pstatic.net/common/?src=http%3A%2F%2Fshop1.phinf.naver.net%2F20220308_278%2F1646711065311pITiA_JPEG%2F185620_mainiamge4.jpg&type=a340' },
    { id: 14, category: '자켓', imageUrl: 'https://search.pstatic.net/common/?src=http%3A%2F%2Fshop1.phinf.naver.net%2F20220304_190%2F1646385969677abz47_JPEG%2F184435_mainiamge4.jpg&type=a340' },
  ];

const FILTERS = ['상의', '하의', '자켓', '기타'];
const ITEMS_PER_PAGE = 8;

export default function ClosetListPage() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState(FILTERS[0]);
  const [currentPage, setCurrentPage] = useState(0);

  const filteredClothes = useMemo(() => {
    return DUMMY_CLOTHES.filter(cloth => cloth.category === activeFilter);
  }, [activeFilter]);

  const totalPages = Math.ceil(filteredClothes.length / ITEMS_PER_PAGE);
  const paginatedClothes = filteredClothes.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE
  );
  
  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
    setCurrentPage(0);
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  };
  
  const handleNavigateToAddCloth = () => navigate('/closet/add');
  const handleNavigateToTryOn = () => navigate('/try-on');

  return (
    <div className={styles.pageContainer}>
      <nav className={styles.tabsContainer}>
        <button className={`${styles.tab} ${styles.activeTab}`}>
          나의 옷장 목록
        </button>
        <button className={styles.tab} onClick={handleNavigateToTryOn}>
          옷 입혀보기
        </button>
      </nav>

      <div className={styles.controlsContainer}>
        <div className={styles.filterGroup}>
          {FILTERS.map((filter) => (
            <button
              key={filter}
              className={`${styles.filterButton} ${activeFilter === filter ? styles.activeFilter : ''}`}
              onClick={() => handleFilterClick(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
        <button className={styles.addButton} onClick={handleNavigateToAddCloth}>
          + 추가하기
        </button>
      </div>

      <div className={styles.clothGridContainer}>
        {filteredClothes.length === 0 ? (
          <div className={styles.emptyStateContainer}>
            <p>옷을 추가해주세요!</p>
          </div>
        ) : (
          <>
            {currentPage > 0 && (
              <button className={`${styles.gridNavigationArrow} ${styles.left}`} onClick={handlePrevPage}>
                &lt;
              </button>
            )}
            
            <div className={styles.clothGrid}>
              {paginatedClothes.map((cloth) => (
                <div key={cloth.id} className={styles.clothItem}>
                  <img src={cloth.imageUrl} alt={`clothing item ${cloth.id}`} />
                </div>
              ))}
            </div>

            {currentPage < totalPages - 1 && (
              <button className={`${styles.gridNavigationArrow} ${styles.right}`} onClick={handleNextPage}>
                &gt;
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}