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

    // Publication year filter
    const yearFilter = document.getElementById('pub-year-filter');
    if (yearFilter) {
        const yearButtons = yearFilter.querySelectorAll('.pub-year-btn');
        const pubCards = document.querySelectorAll('.pub-scroll .post-container[data-year]');

        yearFilter.addEventListener('click', (e) => {
            const btn = e.target.closest('.pub-year-btn');
            if (!btn) return;

            const year = btn.dataset.year;
            yearButtons.forEach((b) => b.classList.toggle('active', b === btn));

            pubCards.forEach((card) => {
                if (year === 'all' || card.dataset.year === year) {
                    card.classList.remove('year-hidden');
                } else {
                    card.classList.add('year-hidden');
                }
            });

            // Show only the matching year-group header (or all when "All")
            document.querySelectorAll('.year-group-header').forEach((h) => {
                h.classList.toggle('year-hidden', !(year === 'all' || h.dataset.year === year));
            });
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

    // Lazy-load ClustrMaps 3D globe when visitor section enters viewport
    const globeWrap = document.getElementById('visitor-globe-wrap');
    if (globeWrap) {
        const globeObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                observer.disconnect();

                const injectGlobe = () => {
                    const s = document.createElement('script');
                    s.id = 'clstr_globe';
                    s.src = '//clustrmaps.com/globe.js?d=EBYPWQy20NjXizST4__XUvNIbKpzqPE2D7NuYf0xQMw';
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
        const yearFilter = document.getElementById('pub-year-filter');
        const yearButtons = yearFilter ? yearFilter.querySelectorAll('.pub-year-btn') : [];
        const themeFilter = document.getElementById('pub-theme-filter');
        const themeButtons = themeFilter ? themeFilter.querySelectorAll('.pub-theme-btn') : [];
        const allCards = document.querySelectorAll('.pub-scroll .post-container[data-year]');

        const resetYearFilter = () => {
            // Show every card and year header; mark "All" as the active year button
            allCards.forEach((c) => c.classList.remove('year-hidden'));
            document.querySelectorAll('.year-group-header').forEach((h) => h.classList.remove('year-hidden'));
            yearButtons.forEach((b) => b.classList.toggle('active', b.dataset.year === 'all'));
        };

        const resetThemeFilter = () => {
            // Show every card; mark "All" as the active theme button
            allCards.forEach((c) => c.classList.remove('theme-hidden'));
            themeButtons.forEach((b) => b.classList.toggle('active', b.dataset.theme === 'all'));
        };

        // Theme filter (mirrors the year filter; only visible in theme view). Multi-label:
        // a card matches if its data-themes list contains the selected keyword.
        if (themeFilter) {
            themeFilter.addEventListener('click', (e) => {
                const btn = e.target.closest('.pub-theme-btn');
                if (!btn) return;
                const theme = btn.dataset.theme;
                themeButtons.forEach((b) => b.classList.toggle('active', b === btn));
                document.querySelectorAll('.pub-scroll .post-container[data-themes]').forEach((card) => {
                    const themes = (card.dataset.themes || '').split(/\s+/);
                    card.classList.toggle('theme-hidden', !(theme === 'all' || themes.includes(theme)));
                });
            });
        }

        const setView = (mode) => {
            document.body.classList.toggle('view-theme', mode === 'theme');
            viewButtons.forEach((b) => {
                const active = b.dataset.view === mode;
                b.classList.toggle('active', active);
                b.setAttribute('aria-selected', String(active));
            });
            // Whenever the view mode changes, reset both filters to a clean "All" state.
            // Prevents previously-applied filtering from hiding cards in the other view.
            resetYearFilter();
            resetThemeFilter();
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

    // ────────── GitHub stars (live count via shields.io JSON, 6h cache) ──────────
    const ghStarAnchors = document.querySelectorAll('.gh-stars[data-repo]');
    if (ghStarAnchors.length) {
        const CACHE_KEY = 'ghStarsCache_v1';
        const TTL_MS = 6 * 60 * 60 * 1000; // 6 hours
        let cache = {};
        try {
            cache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
        } catch (_) { cache = {}; }
        const now = Date.now();
        const fresh = (entry) => entry && (now - entry.t) < TTL_MS;

        // Parse a shields.io star string ("1.6k", "856", "2.1m") to a number.
        const parseStars = (v) => {
            const s = String(v).trim().toLowerCase();
            if (s.endsWith('k')) return parseFloat(s) * 1e3;
            if (s.endsWith('m')) return parseFloat(s) * 1e6;
            return parseFloat(s.replace(/,/g, '')) || 0;
        };

        const setCount = (anchor, value) => {
            const el = anchor.querySelector('.gh-stars-count');
            if (el) el.textContent = value;
            // Highlight (tier1k) ONLY when the live count is >= 1000; otherwise plain.
            anchor.classList.toggle('tier1k', parseStars(value) >= 1000);
        };

        const fetchStars = async (anchor) => {
            const repo = anchor.dataset.repo;
            const cached = cache[repo];
            if (fresh(cached)) {
                setCount(anchor, cached.v);
                return;
            }
            try {
                const r = await fetch(`https://img.shields.io/github/stars/${repo}.json`, { cache: 'force-cache' });
                if (!r.ok) throw new Error('HTTP ' + r.status);
                const json = await r.json();
                const value = json.message || json.value || '?';
                setCount(anchor, value);
                cache[repo] = { v: value, t: now };
            } catch (e) {
                // Fallback to last cached value if any; else leave empty so the
                // static ★ icon isn't doubled (the pill still links to the repo).
                if (cached) {
                    setCount(anchor, cached.v);
                } else {
                    setCount(anchor, '');
                }
            }
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
