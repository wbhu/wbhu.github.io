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
    const pubYearFilterEl = document.querySelector('.pub-year-filter');
    if (menuEl && pubYearFilterEl) {
        const updateStickyTop = () => {
            pubYearFilterEl.style.top = menuEl.offsetHeight + 'px';
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
});
