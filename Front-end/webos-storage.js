/**
 * WebOS "virtual disk" — persists user data in localStorage (metadata + small blobs as data URLs).
 * For larger files in production, swap the custom wallpaper store to IndexedDB.
 */
const WEBOS_DISK_KEY = 'webos_disk_v1';
const LEGACY_FILE_MGR = 'webos_file_manager';
const LEGACY_MARIO = 'webos_mario_player_snapshot';

const WebOSDisk = (function () {
	const defaultState = () => ({
		version: 1,
		display: {
			brightness: 100
		},
		wallpaper: {
			kind: 'builtin',
			path: 'Assets/images/Wallpapers/Bg.png'
		},
		apps: {
			music: {
				volume: 0.7,
				currentIndex: 0,
				currentTime: 0,
				searchQuery: ''
			}
		},
		fileManager: null
	});

	function deepMerge(a, b) {
		if (!b || typeof b !== 'object') return a;
		const out = Array.isArray(a) ? [...a] : { ...a };
		for (const k of Object.keys(b)) {
			if (b[k] != null && typeof b[k] === 'object' && !Array.isArray(b[k]) && !(b[k] instanceof String)) {
				out[k] = deepMerge(a[k] || {}, b[k]);
			} else {
				out[k] = b[k];
			}
		}
		return out;
	}

	function load() {
		try {
			const raw = localStorage.getItem(WEBOS_DISK_KEY);
			if (!raw) return defaultState();
			const parsed = JSON.parse(raw);
			return deepMerge(defaultState(), parsed);
		} catch {
			return defaultState();
		}
	}

	function save(next) {
		try {
			localStorage.setItem(WEBOS_DISK_KEY, JSON.stringify(next));
		} catch (e) {
			console.warn('WebOSDisk save failed', e);
		}
	}

	function migrateLegacy() {
		let disk = load();
		let changed = false;

		try {
			if (!disk.fileManager && localStorage.getItem(LEGACY_FILE_MGR)) {
				disk.fileManager = JSON.parse(localStorage.getItem(LEGACY_FILE_MGR));
				changed = true;
			}
		} catch (_) {}

		try {
			if (localStorage.getItem(LEGACY_MARIO)) {
				const mario = JSON.parse(localStorage.getItem(LEGACY_MARIO));
				disk.apps.music = deepMerge(disk.apps.music || {}, {
					volume: mario.volume,
					currentIndex: mario.currentIndex,
					currentTime: mario.currentTime,
					searchQuery: mario.searchQuery || ''
				});
				changed = true;
			}
		} catch (_) {}

		if (changed) save(disk);
	}

	function setWallpaperBuiltin(relativePath) {
		const disk = load();
		disk.wallpaper = { kind: 'builtin', path: relativePath };
		save(disk);
		applyToHomeScreen();
	}

	function setWallpaperCustomDataUrl(dataUrl) {
		const disk = load();
		disk.wallpaper = { kind: 'custom', dataUrl };
		save(disk);
		applyToHomeScreen();
	}

	function setBrightness(percent) {
		const disk = load();
		disk.display.brightness = Math.min(100, Math.max(40, Number(percent) || 100));
		save(disk);
		applyToHomeScreen();
	}

	function updateMusicState(payload) {
		const disk = load();
		disk.apps.music = deepMerge(disk.apps.music || {}, payload);
		save(disk);
		try {
			localStorage.setItem(LEGACY_MARIO, JSON.stringify({ ...disk.apps.music, wasPlaying: false }));
		} catch (_) {}
	}

	function getMusicState() {
		return load().apps.music || {};
	}

	function pathToCssUrl(path) {
		const safe = path.split('/').map(encodeURIComponent).join('/');
		return `url('${safe}')`;
	}

	function applyToHomeScreen() {
		const el = document.querySelector('.webos-home-screen');
		if (!el) return;

		const disk = load();
		const br = (disk.display && disk.display.brightness) || 100;
		const norm = br / 100;

		if (disk.wallpaper && disk.wallpaper.kind === 'custom' && disk.wallpaper.dataUrl) {
			el.style.backgroundImage = 'url(' + JSON.stringify(disk.wallpaper.dataUrl) + ')';
		} else {
			const p = (disk.wallpaper && disk.wallpaper.path) || 'Assets/images/Wallpapers/Bg.png';
			el.style.backgroundImage = pathToCssUrl(p);
		}

		el.style.backgroundSize = 'cover';
		el.style.backgroundPosition = 'center';
		el.style.backgroundRepeat = 'no-repeat';
		el.style.filter = `brightness(${norm})`;
	}

	function getDiskForDisplay() {
		return load();
	}

	function patch(updates) {
		save(deepMerge(load(), updates));
	}

	migrateLegacy();

	return {
		load,
		patch,
		setWallpaperBuiltin,
		setWallpaperCustomDataUrl,
		setBrightness,
		updateMusicState,
		getMusicState,
		applyToHomeScreen,
		getDiskForDisplay,
		WALLPAPER_OPTIONS: [
			{ id: 'bg', label: 'Bg', path: 'Assets/images/Wallpapers/Bg.png' },
			{ id: 'wp4', label: 'Wallpaper 4', path: 'Assets/images/Wallpapers/Wallpaper 4.png' },
			{
				id: 'blue-pixel',
				label: 'Blue Pixel',
				path: 'Assets/images/Wallpapers/Blue Pixel Illustration Game Presentation - Presentation (1).png'
			},
			{ id: 'img0965', label: 'IMG 0965', path: 'Assets/images/Wallpapers/IMG_0965 (1).PNG' }
		]
	};
})();
