// src/api/coordi.api.js

/** 분류 체계: 페이지/스토어에서도 쓰도록 export */
export const TOP_OPTIONS = ["상의", "하의", "자켓", "기타"];
export const SUB_OPTIONS = {
  상의: ["티셔츠", "셔츠/블라우스", "니트/스웨터", "후디/맨투맨", "민소매", "기타"],
  하의: ["데님", "슬랙스", "스커트", "트레이닝", "반바지", "기타"],
  자켓: ["코트", "가디건", "패딩", "베스트", "기타"],
  기타: ["기타"],
};
export const COLOR_PRESETS = [
  "하얀색",
  "검정",
  "베이지",
  "회색",
  "남색",
  "파랑",
  "초록",
  "노랑",
  "빨강",
  "갈색",
  "분홍",
];

/** ====== 여기부터는 목 API (가짜 데이터) ====== */
/** 실제 백엔드 연결 시 아래 함수들만 fetch로 교체하면 됩니다. */

const MOCK_WARDROBE = [
  // 실제 프로젝트에선 서버에서 가져오게 됨. 지금은 샘플 6개.
  {
    id: "w1",
    imageUrl: "/images/sample-top1.png",
    categoryTop: "상의",
    categorySub: "티셔츠",
    colors: ["하얀색"],
  },
  {
    id: "w2",
    imageUrl: "/images/sample-top2.png",
    categoryTop: "상의",
    categorySub: "후디/맨투맨",
    colors: ["검정"],
  },
  {
    id: "w3",
    imageUrl: "/images/sample-bottom1.png",
    categoryTop: "하의",
    categorySub: "데님",
    colors: ["파랑"],
  },
  {
    id: "w4",
    imageUrl: "/images/sample-bottom2.png",
    categoryTop: "하의",
    categorySub: "슬랙스",
    colors: ["회색"],
  },
  {
    id: "w5",
    imageUrl: "/images/sample-jacket1.png",
    categoryTop: "자켓",
    categorySub: "가디건",
    colors: ["베이지"],
  },
  {
    id: "w6",
    imageUrl: "/images/sample-other1.png",
    categoryTop: "기타",
    categorySub: "기타",
    colors: ["남색"],
  },
];

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

/** 옷장 불러오기 (목) */
export async function getClosetItems() {
  // 실제:
  // const res = await fetch('/api/closet/items');
  // return await res.json();
  await delay(250);
  return MOCK_WARDROBE;
}

/** 추천 받기 (목)
 *  선택된 상의가 있으면 하의/자켓을 추천하는 등 아주 단순한 규칙으로 목 구성
 */
export async function getRecommendations(selectedItemIds, activity) {
  // 실제:
  // const res = await fetch('/api/coordi/recommend', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ selectedItemIds, activity }),
  // });
  // return await res.json();

  await delay(300);

  // 간단 추천 로직(목): 선택된 카테고리를 보완해주는 아이템을 골라줌
  const selected = MOCK_WARDROBE.filter((w) => selectedItemIds.includes(w.id));
  const selectedTopCats = new Set(selected.map((s) => s.categoryTop));

  const needsBottom = selectedTopCats.has("상의") && !selectedTopCats.has("하의");
  const needsOuter = (selectedTopCats.has("상의") || selectedTopCats.has("하의")) && !selectedTopCats.has("자켓");

  const candidates = MOCK_WARDROBE.filter(
    (w) =>
      (needsBottom && w.categoryTop === "하의") ||
      (needsOuter && w.categoryTop === "자켓")
  );

  // 없으면 임의 2개
  const recommendations = candidates.length
    ? candidates.slice(0, 2)
    : MOCK_WARDROBE.slice(0, 2);

  return recommendations;
}

/** 별점 전송 (목) */
export async function sendRating({ selectedItemIds, recommendedIds, rating }) {
  // 실제:
  // await fetch('/api/coordi/rating', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ selectedItemIds, recommendedIds, rating }),
  // });
  await delay(150);
  return { ok: true };
}
