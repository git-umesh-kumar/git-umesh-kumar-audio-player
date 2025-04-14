document.addEventListener('DOMContentLoaded', function () {

    const songs = [
        {
            id: 1,
            name: 'As It Was',
            artist: 'Harry Styles',
            album: "Harry's House",
            duration: '2:47',
            cover: '/assets/1.jpg',
            audio: '/assets/Harry Styles - As It Was (Official Video).mp3'
        },
        {
            id: 2,
            name: 'Blinding Lights',
            artist: 'The Weeknd',
            album: 'After Hours',
            duration: '3:20',
            cover: '/assets/2.jpg',
            audio: '/assets/The Weeknd - Blinding Lights (Official Video).mp3'
        },
        {
            id: 3,
            name: 'Bad Habit',
            artist: 'Steve Lacy',
            album: 'Gemini Rights',
            duration: '3:52',
            cover: '/assets/3.jpg',
            audio: '/assets/Ed Sheeran - Bad Habits [Official Video].mp3'
        },
        {
            id: 4,
            name: 'Heat Waves',
            artist: 'Glass Animals',
            album: 'Dreamland',
            duration: '3:59',
            cover: '/assets/4.jpg',
            audio: '/assets/Glass Animals - Heat Waves (Official Video).mp3'
        },
        {
            id: 5,
            name: 'Stay',
            artist: 'The Kid LAROI, Justin Bieber',
            album: 'OVER YOU',
            duration: '2:21',
            cover: '/assets/5.jpg',
            audio: '/assets/The Kid LAROI, Justin Bieber - STAY (Official Video).mp3'
        }
    ];


    const songRows = document.querySelectorAll('.song-row');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const progressBar = document.querySelector('.progress');
    const progressHandle = document.getElementById('progress-handle');
    const volumeLevel = document.getElementById('volume-level');
    const volumeHandle = document.getElementById('volume-handle');
    const currentSongImg = document.getElementById('current-song-img');
    const currentSongName = document.getElementById('current-song-name');
    const currentSongArtist = document.getElementById('current-song-artist');
    const timeElapsed = document.getElementById('time-elapsed');
    const timeTotal = document.getElementById('time-total');
    const nextBtn = document.getElementById('next-btn');
    const prevBtn = document.getElementById('prev-btn');
    const shuffleBtn = document.getElementById('shuffle-btn'); 
    const repeatBtn = document.getElementById('repeat-btn');   


    let isShuffle = false;
    let isRepeat = false;
    const audio = new Audio();
    let currentSongId = null;
    let isPlaying = false;
    let volume = 70;
    updateVolumeUI();
    audio.volume = volume / 100;

    songRows.forEach(row => {
        row.addEventListener('click', () => {
            const songId = parseInt(row.getAttribute('data-song-id'));
            playSong(songId);
        });
    });

    playPauseBtn.addEventListener('click', togglePlayPause);

    document.querySelector('.progress-bar').addEventListener('click', (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const percentage = clickX / rect.width;
        audio.currentTime = percentage * audio.duration;
    });

    document.querySelector('.volume-bar').addEventListener('click', (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        volume = (clickX / rect.width) * 100;
        audio.volume = volume / 100;
        updateVolumeUI();
    });


    shuffleBtn.addEventListener('click', () => {
        isShuffle = !isShuffle;
        shuffleBtn.classList.toggle('active', isShuffle);
    });

    repeatBtn.addEventListener('click', () => {
        isRepeat = !isRepeat;
        repeatBtn.classList.toggle('active', isRepeat);
    });


    function playSong(songId) {
        const song = songs.find(s => s.id === songId);
        if (!song) return;

        audio.src = song.audio;
        audio.play();
        isPlaying = true;
        currentSongId = songId;

        currentSongImg.src = song.cover;
        currentSongName.textContent = song.name;
        currentSongArtist.textContent = song.artist;

        songRows.forEach(row => {
            const rowId = parseInt(row.getAttribute('data-song-id'));
            row.classList.toggle('active', rowId === songId);
        });

        updatePlayPauseButton();
    }

    function togglePlayPause() {
        if (!audio.src && currentSongId === null) {
            playSong(1);
            return;
        }

        if (audio.paused) {
            audio.play();
            isPlaying = true;
        } else {
            audio.pause();
            isPlaying = false;
        }

        updatePlayPauseButton();
    }

    function updatePlayPauseButton() {
        const icon = playPauseBtn.querySelector('.material-symbols-outlined');
        icon.textContent = isPlaying ? 'pause_circle' : 'play_circle';
    }

    function updateVolumeUI() {
        volumeLevel.style.width = `${volume}%`;
        volumeHandle.style.left = `${volume}%`;
    }


    audio.addEventListener('timeupdate', () => {
        const percentage = (audio.currentTime / audio.duration) * 100;
        progressBar.style.width = `${percentage}%`;
        progressHandle.style.left = `${percentage}%`;
        timeElapsed.textContent = formatTime(audio.currentTime);
    });

    audio.addEventListener('loadedmetadata', () => {
        timeTotal.textContent = formatTime(audio.duration);
    });

    audio.addEventListener('ended', () => {
        if (isRepeat) {
            playSong(currentSongId); 
        } else if (isShuffle) {
            let nextId;
            do {
                nextId = Math.floor(Math.random() * songs.length) + 1;
            } while (nextId === currentSongId); 
            playSong(nextId); 
        } else {
            const nextSongId = currentSongId < songs.length ? currentSongId + 1 : 1;
            playSong(nextSongId); 
        }
    });


    nextBtn.addEventListener('click', () => {
        if (currentSongId !== null) {
            let nextId = currentSongId < songs.length ? currentSongId + 1 : 1;
            playSong(nextId);
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentSongId !== null) {
            let prevId = currentSongId > 1 ? currentSongId - 1 : songs.length;
            playSong(prevId);
        }
    });


    function formatTime(totalSeconds) {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = Math.floor(totalSeconds % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }


    const menuButton = document.createElement('button');
    menuButton.classList.add('menu-button');
    menuButton.innerHTML = '<span class="material-symbols-outlined">menu</span>';
    document.querySelector('.topbar')?.prepend(menuButton);
});
