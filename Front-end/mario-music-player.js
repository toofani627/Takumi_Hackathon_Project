// Mario Music Player — Web Worker scan + WebOS lifecycle + Spotify-style seek (drag-safe scrubbing)

const MARIO_SNAPSHOT_KEY = 'webos_mario_player_snapshot';

class MarioMusicPlayer {
    constructor() {
        this.els = {
            audio: document.getElementById('audioPlayer'),
            playBtn: document.getElementById('playBtn'),
            nextBtn: document.getElementById('nextBtn'),
            prevBtn: document.getElementById('prevBtn'),
            seekBar: document.getElementById('seekBar'),
            seekRow: document.getElementById('playerSeekRow'),
            volumeSlider: document.getElementById('volumeSlider'),
            timeRangeDisplay: document.getElementById('timeRangeDisplay'),
            title: document.getElementById('currentTitle'),
            artist: document.getElementById('currentArtist'),
            playlistItems: document.getElementById('playlistItems'),
            searchBox: document.getElementById('searchBox'),
            folderPickerBtn: document.getElementById('folderPickerBtn'),
            folderName: document.getElementById('folderName'),
            songCount: document.getElementById('songCount'),
            loadingIndicator: document.getElementById('loadingIndicator'),
            loadingText: document.getElementById('loadingText'),
            playIconSvg: document.getElementById('playIconSvg'),
            pauseIconSvg: document.getElementById('pauseIconSvg')
        };

        this.playlist = [];
        this.filtered = [];
        this.currentIndex = 0;
        this.isPlaying = false;
        this.scanning = false;
        this.wasPlayingBeforeMinimize = false;
        /** While true, `timeupdate` must not overwrite the range (Spotify-clone pattern). */
        this.isSeeking = false;

        this.worker = new Worker('music-scanner-worker.js');
        this.worker.onmessage = (e) => this.handleWorkerMessage(e);
        this._diskSyncTick = 0;

        this.init();
    }

    init() {
        this.els.playBtn.onclick = () => this.togglePlay();
        this.els.nextBtn.onclick = () => {
            if (!this.playlist.length) return;
            this.play((this.currentIndex + 1) % this.playlist.length);
        };
        this.els.prevBtn.onclick = () => {
            if (!this.playlist.length) return;
            this.play((this.currentIndex - 1 + this.playlist.length) % this.playlist.length);
        };

        this.bindSeekBar();

        this.els.volumeSlider.oninput = (e) => {
            const v = Number(e.target.value) / 100;
            this.els.audio.volume = v;
            this.els.volumeSlider.style.setProperty('--vol-fill', `${e.target.value}%`);
        };
        this.els.searchBox.oninput = (e) => this.search(e.target.value);
        this.els.folderPickerBtn.onclick = () => this.pickFolder();

        this.els.audio.ontimeupdate = () => this.updateProgress();
        this.els.audio.onloadedmetadata = () => {
            this.updateTimeRange();
            this.syncSeekUiFromAudio();
        };
        this.els.audio.onended = () => {
            this.setSeekPercent(0);
            this.els.nextBtn.click();
        };
        this.els.audio.onplay = () => this.updatePlayBtn();
        this.els.audio.onpause = () => this.updatePlayBtn();

        this.els.audio.volume = 0.7;
        this.els.volumeSlider.value = 70;
        this.els.volumeSlider.style.setProperty('--vol-fill', '70%');
        this.updateSeekDisabled();
        this.updateTimeRange();
        this.updatePlayBtn();

        window.addEventListener('message', (e) => this.onParentMessage(e));
    }

    /**
     * Spotify-style seek: pointer capture + isSeeking so `timeupdate` does not fight the thumb.
     */
    bindSeekBar() {
        const bar = this.els.seekBar;
        const row = this.els.seekRow;

        const endSeek = () => {
            if (!this.isSeeking) return;
            this.isSeeking = false;
            row?.classList.remove('is-seeking');
            this.syncSeekUiFromAudio();
        };

        const applySeekPercent = (pct) => {
            const audio = this.els.audio;
            if (!audio.duration || !isFinite(audio.duration)) return;
            const clamped = Math.min(100, Math.max(0, pct));
            audio.currentTime = (clamped / 100) * audio.duration;
        };

        bar.addEventListener('pointerdown', (e) => {
            if (bar.disabled) return;
            this.isSeeking = true;
            row?.classList.add('is-seeking');
            try {
                bar.setPointerCapture(e.pointerId);
            } catch (_) {}
        });

        window.addEventListener('pointerup', endSeek);
        window.addEventListener('pointercancel', endSeek);

        bar.addEventListener('input', () => {
            const pct = Number(bar.value);
            this.setSeekPercentVisual(pct);
            applySeekPercent(pct);
            this.updateTimeRange();
        });

        bar.addEventListener('change', () => {
            applySeekPercent(Number(bar.value));
            endSeek();
        });

        row?.addEventListener('click', (e) => {
            if (e.target === bar || bar.disabled || !this.els.audio.duration) return;
            const rect = row.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const pct = (x / rect.width) * 100;
            this.setSeekPercent(pct);
            applySeekPercent(pct);
            this.updateTimeRange();
        });
    }

    setSeekPercentVisual(pct) {
        this.els.seekBar.style.setProperty('--seek-pct', `${Math.min(100, Math.max(0, pct))}%`);
    }

    setSeekPercent(pct) {
        const v = Math.min(100, Math.max(0, pct));
        this.els.seekBar.value = String(v);
        this.setSeekPercentVisual(v);
    }

    syncSeekUiFromAudio() {
        const audio = this.els.audio;
        if (!audio.duration || !isFinite(audio.duration)) {
            this.setSeekPercent(0);
            return;
        }
        if (this.isSeeking) return;
        const pct = (audio.currentTime / audio.duration) * 100;
        this.setSeekPercent(pct);
    }

    updateSeekDisabled() {
        const on = !!this.els.audio.src && !!this.playlist.length;
        this.els.seekBar.disabled = !on;
        this.els.seekRow?.classList.toggle('player-seek-row--disabled', !on);
    }

    onParentMessage(e) {
        const t = e.data?.type;
        if (t === 'WEBOS_MINIMIZE') {
            this.wasPlayingBeforeMinimize = !this.els.audio.paused;
            this.els.audio.pause();
            this.persistSnapshot();
        } else if (t === 'WEBOS_RESTORE') {
            if (this.wasPlayingBeforeMinimize && this.playlist.length) {
                this.els.audio.play().catch(() => {});
            }
            this.wasPlayingBeforeMinimize = false;
        }
    }

    persistSnapshot() {
        try {
            const payload = {
                volume: this.els.audio.volume,
                currentTime: this.els.audio.currentTime,
                currentIndex: this.currentIndex,
                wasPlaying: this.wasPlayingBeforeMinimize,
                searchQuery: this.els.searchBox.value
            };
            sessionStorage.setItem(MARIO_SNAPSHOT_KEY, JSON.stringify(payload));
            this.syncMusicToParent(payload);
        } catch (_) {}
    }

    syncMusicToParent(payload) {
        try {
            if (window.parent && window.parent !== window) {
                window.parent.postMessage({ type: 'WEBOS_DISK_MUSIC', payload }, '*');
            }
        } catch (_) {}
    }

    showLoading(show = true) {
        this.els.loadingIndicator.style.display = show ? 'flex' : 'none';
    }

    updateLoadingText(text) {
        this.els.loadingText.textContent = text;
    }

    async pickFolder() {
        try {
            if (this.scanning) {
                alert('Already scanning. Please wait.');
                return;
            }

            this.showLoading(true);
            this.updateLoadingText('Opening folder picker...');

            const dirHandle = await window.showDirectoryPicker();
            this.playlist = [];
            this.scanning = true;

            this.updateLoadingText('Scanning files in background...');

            this.worker.postMessage({
                command: 'scan',
                dirHandle: dirHandle
            });
        } catch (e) {
            this.scanning = false;
            this.showLoading(false);
            if (e.name !== 'AbortError') console.error(e);
        }
    }

    handleWorkerMessage(event) {
        const { type, files, status, message } = event.data;

        if (type === 'progress') {
            this.updateLoadingText(status);
        } else if (type === 'complete') {
            this.playlist = files;
            this.els.folderName.textContent = 'Music Folder';
            this.filter();
            this.showLoading(false);
            this.scanning = false;
            this.updateSeekDisabled();
        } else if (type === 'error') {
            console.error('Worker error:', message);
            this.scanning = false;
            this.showLoading(false);
            alert('Error scanning folder: ' + message);
        } else if (type === 'cancelled') {
            this.scanning = false;
            this.showLoading(false);
        }
    }

    filter(query = '') {
        const q = query.toLowerCase();
        this.filtered = this.playlist.filter(
            (s) => s.name.toLowerCase().includes(q) || s.artist.toLowerCase().includes(q)
        );
        this.render();
    }

    search(q) {
        this.filter(q);
    }

    render() {
        if (!this.filtered.length) {
            this.els.playlistItems.innerHTML = '<div class="empty-state">No songs</div>';
            this.els.songCount.textContent = '0 songs';
            return;
        }

        this.els.playlistItems.innerHTML = this.filtered
            .map((s) => {
                const playlistIndex = this.playlist.indexOf(s);
                return `<div class="playlist-item ${playlistIndex === this.currentIndex ? 'active' : ''}" onclick="player.play(${playlistIndex})">
                <div class="playlist-item-title">${s.name}</div>
                <div class="playlist-item-artist">${s.artist}</div>
            </div>`;
            })
            .join('');

        this.els.songCount.textContent = `${this.filtered.length} ${this.filtered.length === 1 ? 'song' : 'songs'}`;
    }

    play(index) {
        if (index < 0 || index >= this.playlist.length || !this.playlist.length) return;

        this.currentIndex = index;
        const song = this.playlist[index];
        this.els.audio.src = URL.createObjectURL(song.file);
        this.els.title.textContent = song.name;
        this.els.artist.textContent = song.artist;
        this.els.audio.play();
        this.updatePlayBtn();
        this.updateSeekDisabled();
        this.render();
    }

    togglePlay() {
        if (!this.playlist.length) {
            alert('Pick a music folder first.');
            return;
        }
        if (!this.els.audio.src) this.play(0);
        else this.els.audio[this.isPlaying ? 'pause' : 'play']();
    }

    updateProgress() {
        if (!this.isSeeking && this.els.audio.duration) {
            const pct = (this.els.audio.currentTime / this.els.audio.duration) * 100;
            this.setSeekPercent(pct);
        }
        this.updateTimeRange();
        this._diskSyncTick++;
        if (this._diskSyncTick % 45 === 0) {
            this.syncMusicToParent({
                volume: this.els.audio.volume,
                currentTime: this.els.audio.currentTime,
                currentIndex: this.currentIndex,
                searchQuery: this.els.searchBox.value
            });
        }
    }

    updateTimeRange() {
        const cur = this.formatTime(this.els.audio.currentTime || 0);
        const dur = this.formatTime(this.els.audio.duration || 0);
        if (this.els.timeRangeDisplay) {
            this.els.timeRangeDisplay.textContent = `${cur} / ${dur}`;
        }
    }

    updatePlayBtn() {
        this.isPlaying = !this.els.audio.paused;
        if (this.els.playIconSvg && this.els.pauseIconSvg) {
            this.els.playIconSvg.classList.toggle('is-hidden', this.isPlaying);
            this.els.pauseIconSvg.classList.toggle('is-hidden', !this.isPlaying);
        }
    }

    formatTime(s) {
        if (isNaN(s)) return '00:00';
        const m = Math.floor(s / 60);
        const sec = Math.floor(s % 60);
        return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.player = new MarioMusicPlayer();
    console.log('Mario Music Player ready.');
});
