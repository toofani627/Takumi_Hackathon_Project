// Mario Music Player - Using Web Worker for folder scanning

class MarioMusicPlayer {
    constructor() {
        // DOM Elements
        this.els = {
            audio: document.getElementById('audioPlayer'),
            playBtn: document.getElementById('playBtn'),
            nextBtn: document.getElementById('nextBtn'),
            prevBtn: document.getElementById('prevBtn'),
            seekBar: document.getElementById('seekBar'),
            volumeSlider: document.getElementById('volumeSlider'),
            currentTime: document.getElementById('currentTime'),
            duration: document.getElementById('duration'),
            title: document.getElementById('currentTitle'),
            artist: document.getElementById('currentArtist'),
            playlistItems: document.getElementById('playlistItems'),
            searchBox: document.getElementById('searchBox'),
            folderPickerBtn: document.getElementById('folderPickerBtn'),
            folderName: document.getElementById('folderName'),
            songCount: document.getElementById('songCount'),
            loadingIndicator: document.getElementById('loadingIndicator'),
            loadingText: document.getElementById('loadingText')
        };

        // Player State
        this.playlist = [];
        this.filtered = [];
        this.currentIndex = 0;
        this.isPlaying = false;
        this.audioFormats = ['.mp3', '.wav', '.m4a', '.ogg', '.aac', '.flac'];
        this.scanning = false;

        // Initialize Web Worker
        this.worker = new Worker('music-scanner-worker.js');
        this.worker.onmessage = (e) => this.handleWorkerMessage(e);

        this.init();
    }

    init() {
        // Event Listeners
        this.els.playBtn.onclick = () => this.togglePlay();
        this.els.nextBtn.onclick = () => this.play((this.currentIndex + 1) % this.playlist.length);
        this.els.prevBtn.onclick = () => this.play((this.currentIndex - 1 + this.playlist.length) % this.playlist.length);
        this.els.seekBar.onchange = (e) => this.els.audio.currentTime = (e.target.value / 100) * this.els.audio.duration;
        this.els.volumeSlider.oninput = (e) => this.els.audio.volume = e.target.value / 100;
        this.els.searchBox.oninput = (e) => this.search(e.target.value);
        this.els.folderPickerBtn.onclick = () => this.pickFolder();

        // Audio Events
        this.els.audio.ontimeupdate = () => this.updateProgress();
        this.els.audio.onloadedmetadata = () => this.els.duration.textContent = this.formatTime(this.els.audio.duration);
        this.els.audio.onended = () => this.els.nextBtn.click();
        this.els.audio.onplay = () => this.updatePlayBtn();
        this.els.audio.onpause = () => this.updatePlayBtn();

        this.els.audio.volume = 0.7;
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
                alert('⏳ Already scanning. Please wait...');
                return;
            }

            this.showLoading(true);
            this.updateLoadingText('Opening folder picker...');

            const dirHandle = await window.showDirectoryPicker();
            this.playlist = [];
            this.scanning = true;

            this.updateLoadingText('Scanning files in background...');
            
            // Send to worker - worker handles it without blocking UI
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
        const { type, files, count, status, message } = event.data;

        if (type === 'progress') {
            this.updateLoadingText(status);
        } else if (type === 'complete') {
            this.playlist = files;
            this.els.folderName.textContent = 'Music Folder';
            this.filter();
            this.showLoading(false);
            this.scanning = false;
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
        this.filtered = this.playlist.filter(s => s.name.toLowerCase().includes(q) || s.artist.toLowerCase().includes(q));
        this.render();
    }

    search(q) {
        this.filter(q);
    }

    render() {
        if (!this.filtered.length) {
            this.els.playlistItems.innerHTML = '<div class="empty-state">📂 No songs</div>';
            this.els.songCount.textContent = '0 songs';
            return;
        }

        this.els.playlistItems.innerHTML = this.filtered.map((s, i) => {
            const playlistIndex = this.playlist.indexOf(s);
            return `<div class="playlist-item ${playlistIndex === this.currentIndex ? 'active' : ''}" onclick="player.play(${playlistIndex})">
                <div class="playlist-item-title">♪ ${s.name}</div>
                <div class="playlist-item-artist">${s.artist}</div>
            </div>`;
        }).join('');

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
        this.render();
    }

    togglePlay() {
        if (!this.playlist.length) {
            alert('🍄 Pick a music folder first!');
            return;
        }
        if (!this.els.audio.src) this.play(0);
        else this.els.audio[this.isPlaying ? 'pause' : 'play']();
    }

    updateProgress() {
        if (this.els.audio.duration) {
            this.els.seekBar.value = (this.els.audio.currentTime / this.els.audio.duration) * 100;
            this.els.currentTime.textContent = this.formatTime(this.els.audio.currentTime);
        }
    }

    updatePlayBtn() {
        this.isPlaying = !this.els.audio.paused;
        this.els.playBtn.textContent = this.isPlaying ? '⏸️' : '▶️';
    }

    formatTime(s) {
        if (isNaN(s)) return '0:00';
        const m = Math.floor(s / 60);
        return `${m}:${Math.floor(s % 60).toString().padStart(2, '0')}`;
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    window.player = new MarioMusicPlayer();
    console.log('🍄 Mario Music Player ready!');
});
