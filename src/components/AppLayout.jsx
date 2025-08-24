import React, { useState } from "react";

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
          alt=""
          width="32"
          height="32"
          style={{ objectFit: 'contain' }}
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
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:rounded-md focus:bg-sky-200 focus:px-3 focus:py-2"
      >
        본문 바로가기
      </a>

      <header className="sticky top-0 z-50 border-b border-sky-300/60 bg-sky-200/80 backdrop-blur supports-[backdrop-filter]:bg-sky-200/60">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex h-20 items-center justify-between relative">
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
                        aria-current={isActive(item.href) ? "page" : undefined}
                        className={
                          "text-sm tracking-tight text-sky-900/80 hover:text-sky-900 transition-colors " +
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

            <h1
              className="absolute left-1/2 -translate-x-1/2 text-3xl font-extrabold text-sky-950"
              style={{ pointerEvents: "none" }}
            >
              Fitmoji
            </h1>

            <div className="flex items-center gap-2">
              <a
                href="/mypage"
                className="hidden sm:inline-flex rounded-full bg-sky-300 px-4 py-2 text-sm font-semibold text-sky-950 shadow hover:bg-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
              >
                마이페이지
              </a>
              <button
                type="button"
                aria-label="메뉴 열기"
                className="md:hidden rounded-lg p-2 hover:bg-sky-300/60 focus:outline-none focus:ring-2 focus:ring-sky-500"
                onClick={() => setOpen((v) => !v)}
              >
                <svg
                  viewBox="0 0 24 24"
                  width="22"
                  height="22"
                  fill="currentColor"
                  aria-hidden
                >
                  {open ? (
                    <path d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path d="M3 6h18M3 12h18M3 18h18" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {open && (
            <nav className="md:hidden pb-3" aria-label="모바일 메뉴">
              <ul className="flex flex-col gap-1">
                {NAV_ITEMS.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      className={
                        "block rounded-xl px-3 py-2 text-sm text-sky-950/90 hover:bg-sky-300/40 " +
                        (isActive(item.href) ? "font-semibold" : "")
                      }
                      onClick={() => setOpen(false)}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
                <li className="sm:hidden">
                  <a
                    href="/mypage"
                    className="block rounded-xl bg-sky-300 px-3 py-2 text-center text-sm font-semibold text-sky-950 hover:bg-sky-400"
                    onClick={() => setOpen(false)}
                  >
                    마이페이지
                  </a>
                </li>
              </ul>
            </nav>
          )}
        </div>
      </header>

      <main id="main" className="mx-auto max-w-6xl px-4 py-8">
        {children}
      </main>
    </div>
  );
}
