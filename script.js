document.addEventListener('DOMContentLoaded', () => {
    const sectionMap = {
        about: { id: 'about', button: 'aboutButton', hash: 'home' },
        pub: { id: 'pub', button: 'pubButton', hash: 'publications' },
        exp: { id: 'exp', button: 'expButton', hash: 'experience' },
        pat: { id: 'pat', button: 'patButton', hash: 'patents' },
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
        '#patents': 'pat',
        '#pat': 'pat',
        '#misc': 'mis',
        '#miscellaneous': 'mis'
    };

    const sectionOrder = Object.keys(sectionMap);
    const buttons = document.querySelectorAll('#menu > ul > a');
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
            section.hidden = !isActive;

            if (animate) {
                section.classList.toggle('section-transition', true);
            }
        });

        buttons.forEach((button) => {
            const li = button.querySelector('li');
            if (!li) {
                return;
            }
            li.classList.toggle('active', button.id === sectionMap[key].button);
        });

        if (updateHash) {
            const newHash = sectionMap[key].hash;
            history.replaceState(null, '', `#${newHash}`);
        }

        if (scroll && contentArea) {
            const y = contentArea.getBoundingClientRect().top + window.scrollY - 18;
            window.scrollTo({ top: y, behavior: 'smooth' });
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
            if (activeKey === targetKey) {
                return;
            }
            setActiveSection(targetKey, { animate: true, updateHash: true, scroll: true });
        });
    }

    bindMenuClick('aboutButton', 'about');
    bindMenuClick('pubButton', 'pub');
    bindMenuClick('expButton', 'exp');
    bindMenuClick('patButton', 'pat');
    bindMenuClick('miscButton', 'mis');

    const initialKey = resolveHash(window.location.hash);
    setActiveSection(initialKey, { animate: false, updateHash: false, scroll: false });

    window.addEventListener('hashchange', () => {
        const key = resolveHash(window.location.hash);
        if (key !== activeKey) {
            setActiveSection(key, { animate: true, updateHash: false, scroll: true });
        }
    });

    const title = document.querySelector('#header-content h1');
    if (title) {
        title.addEventListener('mouseenter', () => {
            title.classList.add('title-hover');
        });
        title.addEventListener('mouseleave', () => {
            title.classList.remove('title-hover');
        });
    }

    
    const clustrAnchor = document.getElementById('visitor-map-anchor');
    if (clustrAnchor) {
        const mapObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }
                const mapScript = document.createElement('script');
                mapScript.id = 'clustrmaps';
                mapScript.src = '//cdn.clustrmaps.com/map_v2.js?cl=f8fafc&w=150&t=tt&d=EBYPWQy20NjXizST4__XUvNIbKpzqPE2D7NuYf0xQMw&co=f8fafc&cmo=3b82f6&cmn=2563eb&ct=64748b';
                mapScript.async = true;
                clustrAnchor.appendChild(mapScript);
                observer.disconnect();
            });
        }, { rootMargin: '180px 0px' });

        mapObserver.observe(clustrAnchor);
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
});
