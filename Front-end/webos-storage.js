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
			},
			notepad: { content: '', updatedAt: 0 },
			browser: { lastUrl: '' }
		},
		auth: { lastUsername: '' },
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

	function getNotepadContent() {
		const d = load();
		return d.apps && d.apps.notepad ? d.apps.notepad.content || '' : '';
	}

	function setNotepadContent(text) {
		const disk = load();
		disk.apps = disk.apps || {};
		disk.apps.notepad = { ...(disk.apps.notepad || {}), content: String(text ?? ''), updatedAt: Date.now() };
		save(disk);
	}

	function getBrowserLastUrl() {
		const d = load();
		return (d.apps && d.apps.browser && d.apps.browser.lastUrl) || '';
	}

	function setBrowserLastUrl(url) {
		const disk = load();
		disk.apps = disk.apps || {};
		disk.apps.browser = { ...(disk.apps.browser || {}), lastUrl: String(url ?? '') };
		save(disk);
	}

	function ensureFileManagerShape(fm) {
		if (!fm || typeof fm !== 'object') {
			return { photos: [], folder1: [], folder2: [], songs: [], documents: [] };
		}
		return {
			photos: Array.isArray(fm.photos) ? fm.photos : [],
			folder1: Array.isArray(fm.folder1) ? fm.folder1 : [],
			folder2: Array.isArray(fm.folder2) ? fm.folder2 : [],
			songs: Array.isArray(fm.songs) ? fm.songs : [],
			documents: Array.isArray(fm.documents) ? fm.documents : []
		};
	}

	function syncLegacyFileManager(fm) {
		try {
			localStorage.setItem(LEGACY_FILE_MGR, JSON.stringify(ensureFileManagerShape(fm)));
		} catch (_) {}
	}

	function getNotepadDocument(id) {
		const fm = ensureFileManagerShape(load().fileManager);
		return fm.documents.find((d) => d.id === id) || null;
	}

	function listNotepadDocuments() {
		return ensureFileManagerShape(load().fileManager).documents.slice();
	}

	function saveNotepadDocument(name, content, existingId) {
		const disk = load();
		const fm = ensureFileManagerShape(disk.fileManager);
		const cleanName = String(name || '').trim() || 'Untitled.txt';
		const text = String(content ?? '');

		if (existingId) {
			const i = fm.documents.findIndex((d) => d.id === existingId);
			if (i >= 0) {
				fm.documents[i] = { ...fm.documents[i], name: cleanName, content: text, updatedAt: Date.now() };
				disk.fileManager = fm;
				save(disk);
				syncLegacyFileManager(fm);
				return existingId;
			}
		}
		const id = 'doc_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 9);
		fm.documents.push({ id, name: cleanName, content: text, updatedAt: Date.now() });
		disk.fileManager = fm;
		save(disk);
		syncLegacyFileManager(fm);
		return id;
	}

	function updateNotepadDocumentContent(id, text) {
		const disk = load();
		const fm = ensureFileManagerShape(disk.fileManager);
		const i = fm.documents.findIndex((d) => d.id === id);
		if (i < 0) return;
		fm.documents[i] = { ...fm.documents[i], content: String(text ?? ''), updatedAt: Date.now() };
		disk.fileManager = fm;
		save(disk);
		syncLegacyFileManager(fm);
	}

	migrateLegacy();

	return {
		load,
		patch,
		getNotepadContent,
		setNotepadContent,
		getNotepadDocument,
		listNotepadDocuments,
		saveNotepadDocument,
		updateNotepadDocumentContent,
		getBrowserLastUrl,
		setBrowserLastUrl,
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
