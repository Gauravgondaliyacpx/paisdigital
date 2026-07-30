document.addEventListener("DOMContentLoaded", () => {

    /* HEADER */
    const header = document.querySelector(".header");
    const hamburger = document.querySelector(".nav__hamburger");
    const navMenu = document.querySelector(".nav__menu");

    if (hamburger && navMenu) {
        hamburger.addEventListener("click", () => {
            hamburger.classList.toggle("active");
            navMenu.classList.toggle("active");
            document.body.classList.toggle("menu-open");
        });

        navMenu.querySelectorAll(".nav__link").forEach(link => {
            link.addEventListener("click", (e) => {

                if (window.innerWidth <= 992) {

                    if (link.parentElement.classList.contains("nav__item--dropdown")) {
                        e.preventDefault();
                        link.parentElement.classList.toggle("active");
                        return;
                    }

                    hamburger.classList.remove("active");
                    navMenu.classList.remove("active");
                    document.body.classList.remove("menu-open");

                    document.querySelectorAll(".nav__item--dropdown.active").forEach(item => {
                        item.classList.remove("active");
                    });
                }
            });
        });
    }

    let lastScroll = 0;

    window.addEventListener("scroll", () => {
        const current = window.pageYOffset;

        header.classList.toggle("sticky", current > 50);

        if (current > lastScroll && current > 150) {
            header.style.transform = "translateY(-100%)";
        } else {
            header.style.transform = "translateY(0)";
        }

        lastScroll = current;
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 992 && hamburger && navMenu) {
            hamburger.classList.remove("active");
            navMenu.classList.remove("active");
            document.body.classList.remove("menu-open");

            document.querySelectorAll(".nav__item--dropdown.active").forEach(item => {
                item.classList.remove("active");
            });
        }
    });

    /* Marqee Track */
    document.querySelectorAll('.marquee__track').forEach(track => {

        const group = track.querySelector('.marquee__group');

        for (let i = 0; i < 2; i++) {
            track.appendChild(group.cloneNode(true));
        }

    });


    /*  GROWTH ENGINE SLIDER */
    const sliderEl = document.getElementById("slider");
    const nextBtn = document.getElementById("next");
    const prevBtn = document.getElementById("prev");
    const geDots = document.querySelectorAll(".growth-engine__dot");

    if (sliderEl && nextBtn && prevBtn) {
        const originalCards = Array.from(sliderEl.querySelectorAll(".growth-engine__card"));
        const total = originalCards.length;

        const firstClone = originalCards[0].cloneNode(true);
        const lastClone = originalCards[total - 1].cloneNode(true);
        sliderEl.appendChild(firstClone);
        sliderEl.insertBefore(lastClone, originalCards[0]);

        let allCards = sliderEl.querySelectorAll(".growth-engine__card");
        let geIndex = 1;
        let isTransitioning = false;
        const GAP = 16;

        function geCardWidth() {
            return allCards[0].offsetWidth + GAP;
        }

        function geMoveSlider(animate = true) {
            sliderEl.style.transition = animate ? "transform 0.6s ease" : "none";
            const offset = sliderEl.parentElement.offsetWidth / 2 - allCards[0].offsetWidth / 2;
            sliderEl.style.transform = `translateX(${offset - geIndex * geCardWidth()}px)`;
            updateGeDots();
        }

        function updateGeDots() {
            let active = geIndex - 1;
            if (active < 0) active = total - 1;
            if (active >= total) active = 0;
            geDots.forEach((d, i) => d.classList.toggle("growth-engine__dot--active", i === active));
        }

        nextBtn.addEventListener("click", () => {
            if (isTransitioning) return;
            isTransitioning = true;
            geIndex++;
            geMoveSlider(true);
        });

        prevBtn.addEventListener("click", () => {
            if (isTransitioning) return;
            isTransitioning = true;
            geIndex--;
            geMoveSlider(true);
        });

        sliderEl.addEventListener("transitionend", () => {
            allCards = sliderEl.querySelectorAll(".growth-engine__card");
            if (geIndex === allCards.length - 1) { geIndex = 1; geMoveSlider(false); }
            if (geIndex === 0) { geIndex = total; geMoveSlider(false); }
            isTransitioning = false;
        });

        geDots.forEach((dot, i) => {
            dot.addEventListener("click", () => {
                if (isTransitioning) return;
                isTransitioning = true;
                geIndex = i + 1;
                geMoveSlider(true);
            });
        });

        let geStartX = 0;
        sliderEl.addEventListener("touchstart", e => { geStartX = e.changedTouches[0].screenX; });
        sliderEl.addEventListener("touchend", e => {
            const diff = geStartX - e.changedTouches[0].screenX;
            if (Math.abs(diff) < 50 || isTransitioning) return;
            isTransitioning = true;
            geIndex += diff > 0 ? 1 : -1;
            geMoveSlider(true);
        });

        window.addEventListener("load", () => geMoveSlider(false));
        window.addEventListener("resize", () => geMoveSlider(false));
    }

    /*  CASE STUDIES SLIDER */
    const csTrack = document.querySelector(".case-studies__track");
    const csViewport = document.querySelector(".case-studies__viewport");
    const csNextBtn = document.querySelector(".case-studies__btn--next");
    const csPrevBtn = document.querySelector(".case-studies__btn--prev");
    const csPagination = document.querySelector(".case-studies__pagination");

    if (csTrack && csViewport && csNextBtn && csPrevBtn && csPagination) {
        const csCards = csTrack.querySelectorAll(".case-card");
        const CS_GAP = 24;
        let csIndex = 0;

        function csPerView() { return window.innerWidth <= 767 ? 1 : 2; }
        function csTotalPages() { return Math.ceil(csCards.length / csPerView()); }

        function csSetWidths() {
            const perView = csPerView();
            const vpW = csViewport.offsetWidth;
            const cardW = perView === 1 ? vpW : (vpW - CS_GAP * (perView - 1)) / perView;
            csCards.forEach(c => {
                c.style.width = cardW + "px";
                c.style.minWidth = cardW + "px";
            });
            csTrack.style.gap = CS_GAP + "px";
        }

        function csBuildDots() {
            csPagination.innerHTML = "";
            for (let i = 0; i < csTotalPages(); i++) {
                const dot = document.createElement("button");
                dot.className = "case-studies__dot" + (i === csIndex ? " active" : "");
                dot.addEventListener("click", () => { csIndex = i; csUpdate(); });
                csPagination.appendChild(dot);
            }
        }

        function csUpdate() {
            csSetWidths();
            const cardW = parseFloat(csCards[0].style.width);
            const move = csIndex * csPerView() * (cardW + CS_GAP);
            csTrack.style.transform = `translateX(-${move}px)`;
            csPagination.querySelectorAll(".case-studies__dot")
                .forEach((d, i) => d.classList.toggle("active", i === csIndex));
        }

        csNextBtn.addEventListener("click", () => {
            csIndex = csIndex < csTotalPages() - 1 ? csIndex + 1 : 0;
            csUpdate();
        });
        csPrevBtn.addEventListener("click", () => {
            csIndex = csIndex > 0 ? csIndex - 1 : csTotalPages() - 1;
            csUpdate();
        });

        let csResizeTimer;
        window.addEventListener("resize", () => {
            clearTimeout(csResizeTimer);
            csResizeTimer = setTimeout(() => { csIndex = 0; csBuildDots(); csUpdate(); }, 100);
        });

        csSetWidths();
        csBuildDots();
        csUpdate();
    }

    /* CS TESTIMONIAL SLIDER*/
    (function () {
        const track = document.getElementById("csTrack");
        const prevBtn = document.getElementById("csPrevBtn");
        const nextBtn = document.getElementById("csNextBtn");
        const pagination = document.getElementById("csPagination");

        if (!track || !prevBtn || !nextBtn || !pagination) return;

        const cards = track.querySelectorAll(".cs-card");
        const dots = pagination.querySelectorAll(".cs-section__dot");
        let current = 0;
        const total = cards.length;

        function goTo(index) {
            if (index < 0) index = total - 1;
            if (index >= total) index = 0;
            current = index;

            const cardWidth = track.parentElement.offsetWidth;
            track.style.transform = `translateX(-${current * (cardWidth + 24)}px)`;

            dots.forEach((d, i) => {
                d.classList.toggle("cs-section__dot--active", i === current);
            });
        }

        prevBtn.addEventListener("click", () => goTo(current - 1));
        nextBtn.addEventListener("click", () => goTo(current + 1));
        dots.forEach((dot, i) => dot.addEventListener("click", () => goTo(i)));

        let startX = 0;
        track.addEventListener("touchstart", e => { startX = e.touches[0].clientX; }, { passive: true });
        track.addEventListener("touchend", e => {
            const diff = startX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 50) goTo(diff > 0 ? current + 1 : current - 1);
        });

        document.addEventListener("keydown", e => {
            if (e.key === "ArrowLeft") goTo(current - 1);
            if (e.key === "ArrowRight") goTo(current + 1);
        });

        window.addEventListener("resize", () => goTo(current));
        goTo(0);
    })();


    /* 
       FAQ ACCORDION
     */
    const faqItems = document.querySelectorAll(".faq__item");

    faqItems.forEach(item => {
        const btn = item.querySelector(".faq__question");
        if (!btn) return;

        btn.addEventListener("click", () => {
            faqItems.forEach(other => {
                if (other !== item) other.classList.remove("active");
            });
            item.classList.toggle("active");
        });
    });

}); 