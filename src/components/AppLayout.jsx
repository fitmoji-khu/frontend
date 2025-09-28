import React, { useState } from "react";
import "../App.css";


const NAV_ITEMS = [
  { href: "/recommend", label: "코디 추천" },
  { href: "/community", label: "커뮤니티" },
  { href: "/try-on", label: "옷 입혀보기" },
  { href: "/support", label: "고객센터" },
];

function LogoMark() {
  return (
    <div className="flex items-center gap-2">
      <div className="h-12 w-12 rounded-full bg-white shadow-inner grid place-items-center">
        <img
          src="/Fitmoji.png"
          alt="Fitmoji 로고"
          width="32"
          height="32"
          style={{ objectFit: "contain" }}
          loading="lazy"
        />
      </div>
      <span className="sr-only">Fitmoji</span>
    </div>
  );
}

export default function AppLayout({ children, activePath = "/" }) {
  const [open, setOpen] = useState(false);

  const isActive = (href) =>
    activePath === href || activePath.startsWith(href + "/");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="sticky top-0 z-50 border-b border-sky-300/60 bg-sky-200/80 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex h-20 items-center justify-between relative">
            {/* 로고 + 네비 */}
            <div className="flex items-center gap-6">
              <a href="/" className="shrink-0" aria-label="Fitmoji 홈">
                <LogoMark />
              </a>
              <nav className="hidden md:block" aria-label="주요 메뉴">
                <ul className="flex items-center gap-6">
                  {NAV_ITEMS.map((item) => (
                    <li key={item.href}>
                      <a
                        href={item.href}
                        className={
                          "text-sm tracking-tight text-sky-900/80 hover:text-sky-900 " +
                          (isActive(item.href)
                            ? "font-semibold underline underline-offset-4"
                            : "")
                        }
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            <h1 className="absolute left-1/2 -translate-x-1/2 text-3xl font-extrabold text-sky-950">
              Fitmoji
            </h1>

            <a
              href="/mypage"
              className="hidden sm:inline-flex rounded-full bg-sky-300 px-4 py-2 text-sm font-semibold text-sky-950 shadow hover:bg-sky-400"
            >
              마이페이지
            </a>
          </div>
        </div>
      </header>

      {/* 메인 */}
      <main id="main" className="mx-auto max-w-6xl px-4 py-8">
        {children}
      </main>
    </div>
  );
}
