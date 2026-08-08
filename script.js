document.addEventListener('DOMContentLoaded', () => {
    const sectionMap = {
        about: { id: 'about', button: 'aboutButton', hash: 'home' },
        pub: { id: 'pub', button: 'pubButton', hash: 'publications' },
        exp: { id: 'exp', button: 'expButton', hash: 'experience' },
        mis: { id: 'mis', button: 'miscButton', hash: 'misc' }
    };

    const hashAliases = {
        '': 'about',
        '#': 'about',
        '#home': 'about',
        '#about': 'about',
        '#publications': 'pub',
        '#pub': 'pub',
        '#experience': 'exp',
        '#exp': 'exp',
        '#misc': 'mis',
        '#miscellaneous': 'mis'
    };

    const sectionOrder = Object.keys(sectionMap);
    const buttons = document.querySelectorAll('#menu > ul > li > a');
    const contentArea = document.getElementById('content-area');
    let activeKey = 'about';

    function resolveHash(hash) {
        return hashAliases[(hash || '').toLowerCase()] || 'about';
    }

    function setActiveSection(key, options = {}) {
        const { animate = true, updateHash = true, scroll = false } = options;
        if (!sectionMap[key]) {
            return;
        }

        sectionOrder.forEach((sectionKey) => {
            const section = document.getElementById(sectionMap[sectionKey].id);
            if (!section) {
                return;
            }

            const isActive = sectionKey === key;
            section.classList.toggle('section-active', isActive);
            section.classList.toggle('section-inactive', !isActive);

            if (animate) {
                section.classList.toggle('section-transition', true);
            }
        });

        buttons.forEach((button) => {
            const li = button.parentElement;
            if (!li) {
                return;
            }
            li.classList.toggle('active', button.id === sectionMap[key].button);
        });

        if (updateHash) {
            const newHash = sectionMap[key].hash;
            history.replaceState(null, '', `#${newHash}`);
        }

        if (scroll) {
            if (key === 'about') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else if (contentArea) {
                const menu = document.getElementById('menu');
                const menuH = menu ? menu.offsetHeight : 0;
                const y = contentArea.getBoundingClientRect().top + window.scrollY - menuH - 24;
                window.scrollTo({ top: y, behavior: 'smooth' });
            }
        }

        activeKey = key;
    }

    function bindMenuClick(buttonId, targetKey) {
        const button = document.getElementById(buttonId);
        if (!button) {
            return;
        }

        button.addEventListener('click', (event) => {
            event.preventDefault();
            if (activeKey === targetKey && targetKey !== 'about') {
                return;
            }
            setActiveSection(targetKey, { animate: true, updateHash: true, scroll: true });
        });
    }

    bindMenuClick('aboutButton', 'about');
    bindMenuClick('pubButton', 'pub');
    bindMenuClick('expButton', 'exp');
    bindMenuClick('miscButton', 'mis');

    // Set sticky top for pub year filter based on actual menu height
    const menuEl = document.getElementById('menu');
    const pubFilterEls = document.querySelectorAll('.pub-year-filter, .pub-theme-filter');
    if (menuEl && pubFilterEls.length) {
        const updateStickyTop = () => {
            pubFilterEls.forEach((el) => { el.style.top = menuEl.offsetHeight + 'px'; });
        };
        updateStickyTop();
        window.addEventListener('resize', updateStickyTop);
    }

    // Publication year filter. "All" sits last in the pill row; the view opens on the
    // most recent year instead, so the landing state shows the newest work rather than
    // the whole list. Single source of truth for year filtering — setView() reuses it.
    const yearFilter = document.getElementById('pub-year-filter');
    const yearButtons = yearFilter ? yearFilter.querySelectorAll('.pub-year-btn') : [];
    const pubCards = document.querySelectorAll('.pub-scroll .post-container[data-year]');

    const years = [...pubCards].map((c) => Number(c.dataset.year)).filter(Number.isFinite);
    const DEFAULT_YEAR = years.length ? String(Math.max(...years)) : 'all';

    const applyYear = (year) => {
        yearButtons.forEach((b) => b.classList.toggle('active', b.dataset.year === year));

        pubCards.forEach((card) => {
            card.classList.toggle('year-hidden', !(year === 'all' || card.dataset.year === year));
        });

        // Show only the matching year-group header (or all when "All"). Headers are
        // injected later by the view-toggle block, so this is queried at call time.
        document.querySelectorAll('.year-group-header').forEach((h) => {
            h.classList.toggle('year-hidden', !(year === 'all' || h.dataset.year === year));
        });
    };

    if (yearFilter) {
        yearFilter.addEventListener('click', (e) => {
            const btn = e.target.closest('.pub-year-btn');
            if (!btn) return;
            applyYear(btn.dataset.year);
        });
    }

    const initialKey = resolveHash(window.location.hash);
    setActiveSection(initialKey, { animate: false, updateHash: false, scroll: false });

    window.addEventListener('hashchange', () => {
        const key = resolveHash(window.location.hash);
        if (key !== activeKey) {
            setActiveSection(key, { animate: true, updateHash: false, scroll: true });
        }
    });

    // News collapse: show first 8, toggle rest
    const newsScroll = document.querySelector('.news-scroll');
    if (newsScroll) {
        const NEWS_LIMIT = 8;
        const newsItems = newsScroll.querySelectorAll(':scope > p');
        const toggleBtn = document.getElementById('news-toggle');

        if (newsItems.length > NEWS_LIMIT && toggleBtn) {
            newsItems.forEach((item, i) => {
                if (i >= NEWS_LIMIT) item.classList.add('news-hidden');
            });

            let expanded = false;
            toggleBtn.addEventListener('click', () => {
                expanded = !expanded;
                newsItems.forEach((item, i) => {
                    if (i >= NEWS_LIMIT) item.classList.toggle('news-hidden', !expanded);
                });
                toggleBtn.textContent = expanded ? 'Show less ▴' : 'Show more ▾';
                toggleBtn.setAttribute('aria-expanded', String(expanded));
            });
        } else if (toggleBtn) {
            toggleBtn.style.display = 'none';
        }
    }

    // WeChat QR modal
    const wechatTrigger = document.getElementById('wechat-trigger');
    const wechatModal = document.getElementById('wechat-modal');
    if (wechatTrigger && wechatModal) {
        wechatTrigger.addEventListener('click', (e) => {
            e.preventDefault();
            wechatModal.showModal();
        });
        wechatModal.querySelector('.qr-modal-close').addEventListener('click', () => {
            wechatModal.close();
        });
        wechatModal.addEventListener('click', (e) => {
            if (e.target === wechatModal) wechatModal.close();
        });
    }

    const title = document.querySelector('#header-content h1');
    if (title) {
        title.addEventListener('mouseenter', () => {
            title.classList.add('title-hover');
        });
        title.addEventListener('mouseleave', () => {
            title.classList.remove('title-hover');
        });
    }

    // Lazy-load the visitor 3D globe when the section enters the viewport.
    // ClustrMaps was rebranded to MapMyVisitors and clustrmaps.com was retired
    // (no DNS), so the globe now loads from mapmyvisitors.com. The map ID is
    // unchanged, so the accumulated visitor count carries over.
    const globeWrap = document.getElementById('visitor-globe-wrap');
    if (globeWrap) {
        const globeObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                observer.disconnect();

                const injectGlobe = () => {
                    const s = document.createElement('script');
                    s.id = 'clstr_globe';
                    s.src = '//mapmyvisitors.com/globe.js?d=EBYPWQy20NjXizST4__XUvNIbKpzqPE2D7NuYf0xQMw';
                    s.async = true;
                    globeWrap.appendChild(s);
                };

                if (window.jQuery) {
                    injectGlobe();
                } else {
                    const jq = document.createElement('script');
                    jq.src = 'https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js';
                    jq.onload = injectGlobe;
                    document.head.appendChild(jq);
                }
            });
        }, { rootMargin: '180px 0px' });
        globeObserver.observe(globeWrap);
    }

    const tweetContainer = document.querySelector('.tweet-container');
    if (tweetContainer) {
        const tweetObserver = new IntersectionObserver((entries, observer) => {
            const hasVisibleTweet = entries.some((entry) => entry.isIntersecting);
            if (!hasVisibleTweet) {
                return;
            }

            const existing = document.querySelector('script[data-twitter-widget="true"]');
            if (!existing) {
                const twitterScript = document.createElement('script');
                twitterScript.src = 'https://platform.twitter.com/widgets.js';
                twitterScript.charset = 'utf-8';
                twitterScript.async = true;
                twitterScript.setAttribute('data-twitter-widget', 'true');
                document.body.appendChild(twitterScript);
            }

            observer.disconnect();
        }, { rootMargin: '240px 0px' });

        tweetObserver.observe(tweetContainer);
    }

    // Nav sticky sentinel: toggle .nav-stuck when nav sticks to top
    const navEl = document.getElementById('menu');
    if (navEl) {
        const sentinel = document.createElement('div');
        sentinel.style.height = '0';
        sentinel.setAttribute('aria-hidden', 'true');
        navEl.parentNode.insertBefore(sentinel, navEl);
        const navObserver = new IntersectionObserver(([entry]) => {
            navEl.classList.toggle('nav-stuck', !entry.isIntersecting);
        });
        navObserver.observe(sentinel);
    }

    // ────────── Publication view toggle (Year ↔ Theme) ──────────
    const viewToggle = document.querySelector('.pub-view-toggle');
    const pubScroll = document.querySelector('.pub-scroll');
    if (viewToggle && pubScroll) {
        // Cards carry multiple cross-cutting theme keywords (data-themes) and a fame+recency
        // rank (--theme-order). In theme view the flexbox order sorts them by that rank; the
        // theme-filter buttons filter by keyword. No per-theme group headers (papers are multi-label).
        const cards = pubScroll.querySelectorAll('.post-container[data-themes]');

        // Inject year-group headers (By-Year view landmarks); hidden in theme view via CSS.
        // Cards are in descending-year DOM order, so insert a header before each year's first card.
        const yearCounts = {};
        cards.forEach((c) => {
            const y = c.dataset.year;
            yearCounts[y] = (yearCounts[y] || 0) + 1;
        });
        let lastYear = null;
        cards.forEach((card) => {
            const y = card.dataset.year;
            if (y !== lastYear) {
                const yh = document.createElement('div');
                yh.className = 'year-group-header';
                yh.dataset.year = y;
                yh.innerHTML = `<span>${y}</span><span class="year-count">${yearCounts[y]} paper${yearCounts[y] > 1 ? 's' : ''}</span>`;
                pubScroll.insertBefore(yh, card);
                lastYear = y;
            }
        });

        const viewButtons = viewToggle.querySelectorAll('.view-btn');
        const themeFilter = document.getElementById('pub-theme-filter');
        const themeButtons = themeFilter ? themeFilter.querySelectorAll('.pub-theme-btn') : [];
        const allCards = document.querySelectorAll('.pub-scroll .post-container[data-year]');

        // Theme view has no "All" pill — exactly one theme is always selected, and the
        // By-Year view is where the complete list lives. Multi-label: a card matches if
        // its data-themes list contains the selected keyword.
        const DEFAULT_THEME = 'world-models';

        const applyTheme = (theme) => {
            themeButtons.forEach((b) => b.classList.toggle('active', b.dataset.theme === theme));
            allCards.forEach((card) => {
                const themes = (card.dataset.themes || '').split(/\s+/);
                card.classList.toggle('theme-hidden', !themes.includes(theme));
            });
        };

        // Leaving theme view must clear theme-hidden outright: the CSS rule that hides
        // those cards is view-agnostic, so a leftover filter would blank out the year view.
        const clearThemeFilter = () => {
            allCards.forEach((c) => c.classList.remove('theme-hidden'));
            themeButtons.forEach((b) => b.classList.remove('active'));
        };

        if (themeFilter) {
            themeFilter.addEventListener('click', (e) => {
                const btn = e.target.closest('.pub-theme-btn');
                if (!btn) return;
                applyTheme(btn.dataset.theme);
            });
        }

        const setView = (mode) => {
            document.body.classList.toggle('view-theme', mode === 'theme');
            viewButtons.forEach((b) => {
                const active = b.dataset.view === mode;
                b.classList.toggle('active', active);
                b.setAttribute('aria-selected', String(active));
            });
            // Whenever the view mode changes, reset filtering so leftover state from the
            // other view can never hide cards. Each view opens on its own default:
            // the newest year, or the headline theme.
            if (mode === 'theme') {
                applyYear('all');
                applyTheme(DEFAULT_THEME);
            } else {
                clearThemeFilter();
                applyYear(DEFAULT_YEAR);
            }
            try { localStorage.setItem('pubView', mode); } catch (_) {}
        };

        viewToggle.addEventListener('click', (e) => {
            const btn = e.target.closest('.view-btn');
            if (!btn) return;
            setView(btn.dataset.view);
        });

        // Always default to the By-Year view on load (do not restore a saved theme view).
        setView('year');
    }

    // ────────── BibTeX modal ──────────
    const bibModal = document.getElementById('bibtex-modal');
    if (bibModal) {
        const codeEl = bibModal.querySelector('.bibtex-content');
        const titleEl = bibModal.querySelector('.bibtex-modal-title');
        const copyBtn = bibModal.querySelector('.bibtex-copy-btn');
        const closeBtn = bibModal.querySelector('.bibtex-close-btn');

        document.addEventListener('click', (e) => {
            const btn = e.target.closest('.cite-btn');
            if (!btn) return;
            const id = btn.dataset.paperId;
            const entry = (window.PAPER_BIBTEX || {})[id];
            if (!entry) {
                console.warn(`BibTeX missing for paper id="${id}"`);
                return;
            }
            codeEl.textContent = entry.trim();
            if (titleEl) titleEl.textContent = btn.dataset.paperTitle || 'BibTeX';
            if (copyBtn) {
                copyBtn.classList.remove('copied');
                copyBtn.textContent = 'Copy';
            }
            bibModal.showModal();
        });

        if (copyBtn) {
            copyBtn.addEventListener('click', async () => {
                try {
                    await navigator.clipboard.writeText(codeEl.textContent);
                    copyBtn.classList.add('copied');
                    copyBtn.textContent = 'Copied!';
                } catch (_) {
                    // Fallback: select range
                    const range = document.createRange();
                    range.selectNode(codeEl);
                    const sel = window.getSelection();
                    sel.removeAllRanges();
                    sel.addRange(range);
                    document.execCommand('copy');
                    sel.removeAllRanges();
                    copyBtn.classList.add('copied');
                    copyBtn.textContent = 'Copied!';
                }
            });
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', () => bibModal.close());
        }
        bibModal.addEventListener('click', (e) => {
            if (e.target === bibModal) bibModal.close();
        });
    }

    // ────────── GitHub stars: real-time counts (no stale caching) ──────────
    // Revalidates on every load so the number always tracks GitHub.
    //  1) GitHub API  -> EXACT live count (e.g. "1,632"), when the visitor's IP
    //     still has unauthenticated budget (60/hr/IP; home networks usually do).
    //  2) shields.io  -> robust fallback (server-side proxy, no per-visitor GitHub
    //     limit), fresh (no force-cache), only hit when the API call fails — e.g.
    //     on a shared office NAT whose GitHub budget is exhausted. Rounded ("1.6k").
    //  localStorage only paints an instant first value and survives offline; it
    //  never gates a fetch, so it can't make the number stale. tier1k highlight is
    //  driven by the numeric count >= 1000.
    const ghStarAnchors = document.querySelectorAll('.gh-stars[data-repo]');
    if (ghStarAnchors.length) {
        const CACHE_KEY = 'ghStarsCache_v2';
        let cache = {};
        try {
            cache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
        } catch (_) { cache = {}; }

        const fmt = (n) => Number(n).toLocaleString('en-US'); // 1632 -> "1,632"
        // Parse a star string ("1.6k", "856", "2.1m") back to a number.
        const parseStars = (v) => {
            const s = String(v).trim().toLowerCase();
            if (s.endsWith('k')) return parseFloat(s) * 1e3;
            if (s.endsWith('m')) return parseFloat(s) * 1e6;
            return parseFloat(s.replace(/,/g, '')) || 0;
        };

        const setCount = (anchor, display, numeric) => {
            const el = anchor.querySelector('.gh-stars-count');
            if (el) el.textContent = display || '';
            anchor.classList.toggle('tier1k', Number(numeric) >= 1000);
        };
        const store = (anchor, repo, display, numeric) => {
            setCount(anchor, display, numeric);
            cache[repo] = { display, n: numeric, t: Date.now() };
        };

        const fetchStars = async (anchor) => {
            const repo = anchor.dataset.repo;
            const cached = cache[repo];
            // Instant paint from last-known value so there's no empty flash.
            if (cached) setCount(anchor, cached.display, cached.n);

            // 1) Exact, real-time.
            try {
                const r = await fetch(`https://api.github.com/repos/${repo}`, {
                    headers: { 'Accept': 'application/vnd.github+json' },
                    cache: 'no-store',
                });
                if (r.ok) {
                    const j = await r.json();
                    if (typeof j.stargazers_count === 'number') {
                        store(anchor, repo, fmt(j.stargazers_count), j.stargazers_count);
                        return;
                    }
                }
            } catch (_) { /* fall through to the proxy */ }

            // 2) Robust fallback (rounded but fresh; survives an exhausted IP).
            try {
                const r = await fetch(`https://img.shields.io/github/stars/${repo}.json`, { cache: 'no-store' });
                if (r.ok) {
                    const j = await r.json();
                    const str = j.message || j.value;
                    if (str && str !== 'invalid') {
                        store(anchor, repo, str, parseStars(str));
                        return;
                    }
                }
            } catch (_) { /* keep whatever we painted from cache */ }

            // 3) Both sources failed — leave the cached value, or empty if none
            //    (the static ★ icon stays and the pill still links to the repo).
            if (!cached) setCount(anchor, '', 0);
        };

        Promise.all(Array.from(ghStarAnchors).map(fetchStars)).then(() => {
            try { localStorage.setItem(CACHE_KEY, JSON.stringify(cache)); } catch (_) {}
        });
    }

    // ────────── Video play/pause overlays ──────────
    const PAUSE_SVG = '<svg viewBox="0 0 16 16" width="11" height="11" fill="currentColor" aria-hidden="true"><rect x="3.5" y="2.5" width="3" height="11" rx="1"/><rect x="9.5" y="2.5" width="3" height="11" rx="1"/></svg>';
    const PLAY_SVG = '<svg viewBox="0 0 16 16" width="11" height="11" fill="currentColor" aria-hidden="true"><path d="M4.6 2.7v10.6a.6.6 0 0 0 .92.5l8.3-5.3a.6.6 0 0 0 0-1L5.52 2.2a.6.6 0 0 0-.92.5z"/></svg>';
    document.querySelectorAll('.post-thumb video').forEach((video) => {
        const overlay = document.createElement('span');
        overlay.className = 'video-overlay';
        overlay.setAttribute('aria-hidden', 'true');
        overlay.innerHTML = PAUSE_SVG;
        video.parentElement.appendChild(overlay);

        const sync = () => {
            if (video.paused) {
                overlay.classList.add('is-paused');
                overlay.innerHTML = PLAY_SVG;
            } else {
                overlay.classList.remove('is-paused');
                overlay.innerHTML = PAUSE_SVG;
            }
        };

        video.addEventListener('click', (e) => {
            e.preventDefault();
            if (video.paused) {
                video.play().catch(() => {});
            } else {
                video.pause();
            }
        });

        video.addEventListener('play', sync);
        video.addEventListener('pause', sync);

        // preload metadata for faster first frame (was preload="none")
        if (video.preload === 'none') video.preload = 'metadata';
    });
});
