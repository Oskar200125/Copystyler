document.addEventListener('DOMContentLoaded', () => {
    /* Header */
    const header = document.querySelector('#header');

    function checkScroll() {
        if (window.scrollY > 0) {
            header.classList.add('fixed');
        } else {
            header.classList.remove('fixed');
        }
    }

    checkScroll();

    window.addEventListener('scroll', checkScroll);



    /* Burger */
    const burger = document.getElementById('burger');
    const nav = document.querySelector('.nav');

    burger.addEventListener('click', () => {
        burger.classList.toggle('active');
        nav.classList.toggle('show');
        document.body.classList.toggle('no-scroll');
    });



    /* Intro link */
    const introLink = document.querySelector('#introLink');

    if (introLink) {
        introLink.addEventListener('click', function(e) {
            e.preventDefault();

            const album = document.querySelector('#album');
            const topPosition = album.offsetTop - 50;

            window.scrollTo({
                top: topPosition,
                behavior: 'smooth'
            });
        });
    }



    /* Player */
    const player = document.getElementById('player');

    if (player) {
        const tracks = Array.from(document.querySelectorAll('.track'));
        const playerName = document.getElementById('playerName');
        const playBtn = document.getElementById('playBtn');
        const playIcon = document.getElementById('playIcon');
        const pauseIcon = document.getElementById('pauseIcon');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const progressBar = document.getElementById('progressBar');
        const volumeBar = document.getElementById('volumeBar');
        const progressFill = document.getElementById('progressFill');
        const volumeFill = document.getElementById('volumeFill');

        const audio = new Audio();
        let currentIndex = -1;

        function loadTrack(index) {
            currentIndex = index;
            const track = tracks[currentIndex];

            audio.src = track.dataset.src;
            playerName.textContent = track.querySelector('.track__name').textContent;

            player.classList.add('player--active');

            tracks.forEach(t => t.classList.remove('track--active'));
            track.classList.add('track--active');

            audio.play();
        }

        function togglePlay() {
            if (audio.paused) {
                audio.play();
            } else {
                audio.pause();
            }
        }

        function updatePlayIcon() {
            const isPlaying = !audio.paused;
            playIcon.style.display = isPlaying ? 'none' : 'block';
            pauseIcon.style.display = isPlaying ? 'block' : 'none';
        }

        function playNext() {
            const nextIndex = (currentIndex + 1) % tracks.length;
            loadTrack(nextIndex);
        }

        function playPrev() {
            const prevIndex = (currentIndex - 1 + tracks.length) % tracks.length;
            loadTrack(prevIndex);
        }

        /* Function fill input player */
        function updateRangeFill(input, fillEl) {
            const min = Number(input.min) || 0;
            const max = Number(input.max) || 100;
            const value = Number(input.value);
            const percent = ((value - min) / (max - min)) * 100;

            fillEl.style.width = percent + '%';
        }

        // клик по треку в списке
        tracks.forEach((track, index) => {
            track.addEventListener('click', (e) => {
                e.preventDefault();
                loadTrack(index);
            });
        });

        // кнопки плеера
        playBtn.addEventListener('click', togglePlay);
        nextBtn.addEventListener('click', playNext);
        prevBtn.addEventListener('click', playPrev);

        // авто-переход на следующий трек
        audio.addEventListener('ended', playNext);

        // иконка play/pause
        audio.addEventListener('play', updatePlayIcon);
        audio.addEventListener('pause', updatePlayIcon);

        // прогресс-бар
        audio.addEventListener('timeupdate', () => {
            if (audio.duration) {
                progressBar.value = (audio.currentTime / audio.duration) * 100;
                updateRangeFill(progressBar, progressFill);
            }
        });

        progressBar.addEventListener('input', () => {
            if (audio.duration) {
                audio.currentTime = (progressBar.value / 100) * audio.duration;
                updateRangeFill(progressBar, progressFill);
            }
        });

        // громкость
        volumeBar.addEventListener('input', () => {
            audio.volume = volumeBar.value / 100;
            updateRangeFill(volumeBar, volumeFill);
        });

        updateRangeFill(progressBar, progressFill);
        updateRangeFill(volumeBar, volumeFill);
    }

    /* Accordeon playlist */
    const items = document.querySelectorAll('.music__item');

    items.forEach(item => {
        const top = item.querySelector('.music__top');

        top.addEventListener('click', () => {
            item.classList.toggle('active');
        });
    });

    /* Плавный показ страниц сайта */
    document.addEventListener('click', function (e) {
        const link = e.target.closest('a[href]');
        if (!link) return;

        const url = new URL(link.href, location.href);
        const normalize = (path) => path.replace(/index\.html$/, '');

        const isInternal = url.origin === location.origin;
        const isSamePage = normalize(url.pathname) === normalize(location.pathname);
        const isSpecial =
            link.target === '_blank' ||
            link.hasAttribute('download') ||
            e.ctrlKey || e.metaKey || e.shiftKey ||
            e.defaultPrevented;

        if (!isInternal || isSamePage || isSpecial) return;

        e.preventDefault();
        document.body.classList.add('finish');

        setTimeout(function () {
            window.location.href = link.href;
        }, 200);
    });

    window.addEventListener('pageshow', function () {
        document.body.classList.remove('finish');
    });

});
