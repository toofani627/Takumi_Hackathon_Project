// ========================
// Apps Registry - Future-proof app management
// ========================
const webosApps = [
	{ id: 'camera', label: 'Camera', icon: 'Assets/images/camera.png', openFn: 'openCameraWindow' },
	{ id: 'file-manager', label: 'File Manager', icon: 'Assets/images/file_manager.png', openFn: 'openFileManagerWindow' },
	{ id: 'music', label: 'Music', icon: 'Assets/images/Music.png', openFn: 'openMusicWindow' },
	{ id: 'calculator', label: 'Calculator', icon: 'Assets/images/Calculator.png', openFn: 'openCalculatorWindow' },
	{ id: 'settings', label: 'Settings', icon: 'Assets/images/settings.png', openFn: 'openSettingsWindow' },
	{ id: 'recycle-bin', label: 'Recycle Bin', icon: 'Assets/images/recycle-bin.png', openFn: 'openRecycleBin' }
];

/** URL-encode each path segment for img src / CSS */
function webosAssetUrl(path) {
	return path.split('/').map(encodeURIComponent).join('/');
}

function webosRenderLogin(root) {
	root.innerHTML = `
		<section class="webos-login-screen">
			<form action="" class="webos-login-form">
				<p>
					Welcome,<span>sign in to continue</span>
				</p>
				<input class="webos-login-input" type="text" placeholder="Username" name="username">
				<input class="webos-login-input" type="password" placeholder="Password" name="password">
				<button class="webos-login-oauth-button" type="submit">
					Continue
					>>
				</button>
			</form>
		</section>
	`;
}

function homeScreen(root) {
	root.innerHTML = `
		<section class="webos-home-screen" id="webos-home-screen">
			<div class="webos-apps-area"></div>
			<div class="webos-taskbar">
				<div class="webos-taskbar-item" data-label="Windows">
					<img src="Assets/images/windows.png" alt="Windows" class="webos-taskbar-icon">
					<span class="webos-taskbar-tooltip">Windows</span>
				</div>
				<div class="webos-taskbar-search">
					<img src="Assets/images/search.png" alt="Search" class="webos-taskbar-search-icon">
					<input type="text" placeholder="Search..." class="webos-taskbar-search-input">
					<img src="Assets/images/duck.png" alt="Duck" class="webos-taskbar-duck">
				</div>
				<div class="webos-taskbar-item" data-label="Camera">
					<img src="Assets/images/camera.png" alt="Camera" class="webos-taskbar-icon">
					<span class="webos-taskbar-tooltip">Camera</span>
				</div>
				<div class="webos-taskbar-item" data-label="File Manager">
					<img src="Assets/images/file_manager.png" alt="File Manager" class="webos-taskbar-icon">
					<span class="webos-taskbar-tooltip">File Manager</span>
				</div>
				<div class="webos-taskbar-item" data-label="Music">
					<img src="Assets/images/Music.png" alt="Music" class="webos-taskbar-icon">
					<span class="webos-taskbar-tooltip">Music</span>
				</div>
				<div class="webos-taskbar-item" data-label="Calculator">
					<img src="Assets/images/Calculator.png" alt="Calculator" class="webos-taskbar-icon">
					<span class="webos-taskbar-tooltip">Calculator</span>
				</div>
				<div class="webos-taskbar-item" data-label="Recycle Bin">
					<img src="Assets/images/recycle-bin.png" alt="Recycle Bin" class="webos-taskbar-icon">
					<span class="webos-taskbar-tooltip">Recycle Bin</span>
				</div>
				<div class="webos-taskbar-item" data-label="Settings">
					<img src="Assets/images/settings.png" alt="Settings" class="webos-taskbar-icon">
					<span class="webos-taskbar-tooltip">Settings</span>
				</div>
				<div class="webos-taskbar-right">
					<div class="webos-system-info">
						<div class="webos-time-date">
							<div class="webos-time" id="webos-time">12:00</div>
							<div class="webos-date" id="webos-date">Jan 01</div>
						</div>
						<div class="webos-battery">
							<div class="webos-battery-icon">
								<div class="webos-battery-bar" id="webos-battery-bar" style="width: 100%;"></div>
							</div>
							<span id="webos-battery-text">100%</span>
						</div>
						<div class="webos-volume-container">
							<img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.26 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z'/%3E%3C/svg%3E" alt="Volume" class="webos-volume-icon" id="webos-volume-icon">
							<div class="webos-volume-popup" id="webos-volume-popup">
								<input type="range" min="0" max="100" value="70" class="webos-volume-slider" id="webos-volume-slider">
								<span class="webos-volume-text" id="webos-volume-text">70%</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	`;

	// Initialize time, date, battery, and volume updates
	updateTimeAndDate();
	updateBatteryStatus();
	setupVolumeControl();
	
	// Setup Windows (Start Menu) icon click handler
	const windowsIcon = document.querySelector('[data-label="Windows"]');
	if (windowsIcon) {
		windowsIcon.addEventListener('click', openStartMenu);
	}

	// Setup taskbar apps from registry
	webosApps.forEach(app => {
		const taskbarIcon = document.querySelector(`[data-label="${app.label}"]`);
		if (taskbarIcon) {
			taskbarIcon.addEventListener('click', () => window[app.openFn]());
		}
	});

	// Add desktop icons
	const appsArea = document.querySelector('.webos-apps-area');
	const desktopContainer = document.createElement('div');
	desktopContainer.id = 'desktop-icons';
	desktopContainer.style.cssText = 'display: flex; flex-direction: column; gap: 15px; padding: 20px; width: fit-content; position: absolute; left: 20px; top: 20px;';

	webosApps.forEach(app => {
		const desktopIcon = document.createElement('div');
		desktopIcon.style.cssText = 'text-align: center; cursor: pointer; user-select: none;';
		desktopIcon.innerHTML = `
			<img src="${app.icon}" style="width: 40px; height: 40px; margin-bottom: 4px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));">
			<div style="font-size: 11px; color: #FBD000; text-shadow: 1px 1px 0 #000, 2px 2px 0 #000; max-width: 80px; word-break: break-word; font-weight: 700;">${app.label}</div>
		`;
		desktopIcon.addEventListener('click', () => window[app.openFn]());
		desktopIcon.addEventListener('dblclick', () => window[app.openFn]());
		desktopContainer.appendChild(desktopIcon);
	});

	appsArea.appendChild(desktopContainer);

	// Setup search functionality
	const searchInput = document.querySelector('.webos-taskbar-search-input');
	if (searchInput) {
		searchInput.addEventListener('keydown', (e) => {
			if (e.key === 'Enter') {
				handleSearch(searchInput.value);
			}
		});
	}
	
	// Update time and date every second
	setInterval(updateTimeAndDate, 1000);
	
	// Update battery status every 30 seconds
	setInterval(updateBatteryStatus, 30000);

	if (typeof WebOSDisk !== 'undefined') {
		WebOSDisk.applyToHomeScreen();
	}
}

// Function to update time and date
function updateTimeAndDate() {
	const now = new Date();
	const hours = String(now.getHours()).padStart(2, '0');
	const minutes = String(now.getMinutes()).padStart(2, '0');
	const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	const month = monthNames[now.getMonth()];
	const day = String(now.getDate()).padStart(2, '0');
	
	const timeEl = document.getElementById('webos-time');
	const dateEl = document.getElementById('webos-date');
	
	if (timeEl) timeEl.textContent = `${hours}:${minutes}`;
	if (dateEl) dateEl.textContent = `${month} ${day}`;
}

// Function to update battery status using Battery Status API
function updateBatteryStatus() {
	if (navigator.getBattery) {
		navigator.getBattery().then(battery => {
			updateBatteryDisplay(battery);
			battery.addEventListener('levelchange', () => updateBatteryDisplay(battery));
		});
	} else {
		// Fallback if Battery API not available
		document.getElementById('webos-battery-bar').style.width = '85%';
		document.getElementById('webos-battery-text').textContent = '85%';
	}
}

function updateBatteryDisplay(battery) {
	const level = Math.round(battery.level * 100);
	const batteryBar = document.getElementById('webos-battery-bar');
	const batteryText = document.getElementById('webos-battery-text');
	
	if (batteryBar) batteryBar.style.width = level + '%';
	if (batteryText) batteryText.textContent = level + '%';
	
	// Change color based on battery level
	if (level < 20) {
		batteryBar.style.backgroundColor = '#ef4444';
	} else if (level < 50) {
		batteryBar.style.backgroundColor = '#facc15';
	} else {
		batteryBar.style.backgroundColor = '#4ade80';
	}
}

// Function to setup volume control
function setupVolumeControl() {
	const volumeIcon = document.getElementById('webos-volume-icon');
	const volumePopup = document.getElementById('webos-volume-popup');
	const volumeSlider = document.getElementById('webos-volume-slider');
	const volumeText = document.getElementById('webos-volume-text');
	
	if (volumeIcon) {
		volumeIcon.addEventListener('click', (e) => {
			e.stopPropagation();
			volumePopup.classList.toggle('show');
		});
	}
	
	if (volumeSlider) {
		volumeSlider.addEventListener('input', (e) => {
			const value = e.target.value;
			if (volumeText) volumeText.textContent = value + '%';
		});
	}
	
	// Close popup when clicking outside
	document.addEventListener('click', () => {
		if (volumePopup && volumePopup.classList.contains('show')) {
			volumePopup.classList.remove('show');
		}
	});
}

// ========================
// Start Menu Functions
// ========================
function openStartMenu() {
	const existingMenu = document.querySelector('.webos-start-menu');
	if (existingMenu) {
		existingMenu.remove();
		return;
	}
	
	const menu = document.createElement('div');
	menu.className = 'webos-start-menu';
	menu.style.cssText = 'position: fixed; left: 20px; bottom: 110px; width: 300px; background: #FFCC99; border: 3px solid #000; border-radius: 4px; box-shadow: 6px 6px 0 #C84C0C; z-index: 9999; display: flex; flex-direction: column;';
	
	const title = document.createElement('div');
	title.style.cssText = 'font-family: \"Press Start 2P\", monospace; background: #E52521; color: #FBD000; padding: 12px; font-size: 9px; font-weight: 400; border-bottom: 3px solid #000;';
	title.textContent = 'Apps';
	menu.appendChild(title);
	
	const content = document.createElement('div');
	content.style.cssText = 'max-height: 400px; overflow-y: auto; padding: 8px;';
	
	webosApps.forEach(app => {
		const item = document.createElement('div');
		item.style.cssText = 'display: flex; align-items: center; gap: 12px; padding: 8px; cursor: pointer; border-radius: 4px; transition: 0.2s;';
		item.innerHTML = `<img src="${app.icon}" style="width: 32px; height: 32px;"><span>${app.label}</span>`;
		item.addEventListener('mouseenter', () => (item.style.background = '#FBD000'));
		item.addEventListener('mouseleave', () => (item.style.background = 'transparent'));
		item.addEventListener('click', () => {
			window[app.openFn]();
			menu.remove();
		});
		content.appendChild(item);
	});
	
	menu.appendChild(content);
	document.body.appendChild(menu);
	
	document.addEventListener('click', (e) => {
		if (!menu.contains(e.target) && !document.querySelector('[data-label="Windows"]')?.contains(e.target)) {
			menu.remove();
		}
	});
}

function handleSearch(query) {
	if (!query.trim()) return;
	
	const lowerQuery = query.toLowerCase();
	const matchedApp = webosApps.find(app => app.label.toLowerCase().includes(lowerQuery));
	
	if (matchedApp) {
		window[matchedApp.openFn]();
		document.querySelector('.webos-taskbar-search-input').value = '';
	} else {
		alert(`No app found for "${query}"`);
	}
}

function openRecycleBin() {
	alert('Recycle Bin - empty');
}

function openMusicWindow() {
	const existing = document.getElementById('music-window');
	if (existing) {
		existing.style.display = 'flex';
		maxZIndex++;
		existing.style.zIndex = maxZIndex;
		const frame = document.getElementById('mario-player-frame');
		frame?.contentWindow?.postMessage({ type: 'WEBOS_RESTORE' }, '*');
		return;
	}

	const appsArea = document.querySelector('.webos-apps-area');
	const win = document.createElement('div');
	win.id = 'music-window';
	win.className = 'webos-music-window';
	win.style.cssText = 'position: absolute; left: 50px; top: 80px; width: 900px; height: 600px; background: #FFCC99; border: 4px solid #000; border-radius: 4px; box-shadow: 6px 6px 0 #C84C0C; display: flex; flex-direction: column; z-index: 100;';
	win.innerHTML = `
		<div style="background: #E52521; color: #FBD000; padding: 12px; font-family: \"Press Start 2P\", monospace; font-size: 9px; font-weight: 400; border-bottom: 3px solid #000; display: flex; justify-content: space-between; align-items: center;">
			<span>Mario Music</span>
			<div style="display: flex; gap: 4px;">
				<button class="webos-settings-btn" onclick="minimizeMusicWindow()" style="background: #049CD8; width: 30px; height: 30px;" title="Minimize">_</button>
				<button class="webos-settings-btn" onclick="maximizeMusicWindow()" style="background: #049CD8; width: 30px; height: 30px;" title="Maximize">[]</button>
				<button class="webos-settings-btn" onclick="closeMusicWindow()" style="background: #F83800; width: 30px; height: 30px;" title="Close">x</button>
			</div>
		</div>
		<iframe id="mario-player-frame" src="mario-music-player.html" style="flex: 1; border: none; border-radius: 0 0 8px 8px; width: 100%;"></iframe>
	`;
	appsArea.appendChild(win);
	makeWindowDraggable(win, 'div:first-child');
	addWindowFocusListener(win);
}

function minimizeMusicWindow() {
	const frame = document.getElementById('mario-player-frame');
	frame?.contentWindow?.postMessage({ type: 'WEBOS_MINIMIZE' }, '*');
	const win = document.getElementById('music-window');
	if (win) win.style.display = 'none';
}

function maximizeMusicWindow() {
	const win = document.getElementById('music-window');
	if (!win) return;
	if (win.classList.contains('maximized')) {
		win.classList.remove('maximized');
		win.style.cssText = 'position: absolute; left: 50px; top: 80px; width: 900px; height: 600px; background: #FFCC99; border: 4px solid #000; border-radius: 4px; box-shadow: 6px 6px 0 #C84C0C; display: flex; flex-direction: column; z-index: 100;';
	} else {
		win.classList.add('maximized');
		win.style.cssText = 'position: fixed; left: 0; top: 0; width: 100%; height: calc(100vh - 7vh); border: none; box-shadow: none; border-radius: 0; display: flex; flex-direction: column; z-index: 100;';
	}
}

function closeMusicWindow() {
	try {
		sessionStorage.removeItem('webos_mario_player_snapshot');
	} catch (_) {}
	document.getElementById('music-window')?.remove();
}

function openCalculatorWindow() {
	const existing = document.getElementById('calculator-window');
	if (existing) {
		existing.style.display = 'flex';
		maxZIndex++;
		existing.style.zIndex = maxZIndex;
		return;
	}

	const appsArea = document.querySelector('.webos-apps-area');
	const win = document.createElement('div');
	win.id = 'calculator-window';
	win.className = 'webos-calculator-window';
	win.style.cssText =
		'position: absolute; left: 130px; top: 90px; width: 420px; height: 620px; min-width: 360px; background: #000000; border: 4px solid #049CD8; border-radius: 4px; box-shadow: 6px 6px 0 #AAAAAA; display: flex; flex-direction: column; z-index: 100; overflow: hidden;';
	win.innerHTML = `
		<div style="background: #049CD8; color: #000000; padding: 10px 12px; font-family: \"Press Start 2P\", monospace; font-size: 8px; border-bottom: 3px solid #000000; display: flex; justify-content: space-between; align-items: center; flex-shrink: 0; cursor: move;">
			<span>Retro Calculator</span>
			<div style="display: flex; gap: 4px;">
				<button type="button" class="webos-settings-btn" onclick="minimizeCalculatorWindow()" style="background: #43B047; width: 30px; height: 30px; color: #000; border: 2px solid #000;">_</button>
				<button type="button" class="webos-settings-btn" onclick="maximizeCalculatorWindow()" style="background: #43B047; width: 30px; height: 30px; color: #000; border: 2px solid #000;">[]</button>
				<button type="button" class="webos-settings-btn" onclick="closeCalculatorWindow()" style="background: #F83800; width: 30px; height: 30px; color: #000; border: 2px solid #000;">x</button>
			</div>
		</div>
		<iframe id="calculator-frame" src="Retro-Calculator/index.html" style="flex: 1; border: none; border-radius: 0 0 6px 6px; width: 100%; min-height: 0; background: #000;" title="Retro Calculator"></iframe>
	`;
	appsArea.appendChild(win);
	makeWindowDraggable(win, 'div:first-child');
	addWindowFocusListener(win);
}

function minimizeCalculatorWindow() {
	const win = document.getElementById('calculator-window');
	if (win) win.style.display = 'none';
}

function maximizeCalculatorWindow() {
	const win = document.getElementById('calculator-window');
	if (!win) return;
	if (win.classList.contains('maximized')) {
		win.classList.remove('maximized');
		win.style.cssText =
			'position: absolute; left: 130px; top: 90px; width: 420px; height: 620px; min-width: 360px; background: #000000; border: 4px solid #049CD8; border-radius: 4px; box-shadow: 6px 6px 0 #AAAAAA; display: flex; flex-direction: column; z-index: 100; overflow: hidden;';
	} else {
		win.classList.add('maximized');
		win.style.cssText =
			'position: fixed; left: 0; top: 0; width: 100%; height: calc(100vh - 7vh); border: none; box-shadow: none; border-radius: 0; display: flex; flex-direction: column; z-index: 100; overflow: hidden; background: #050505;';
	}
}

function closeCalculatorWindow() {
	document.getElementById('calculator-window')?.remove();
}

function webosInitLogin() {
	console.log("successful");
	const root = document.getElementById("webos-root");
	if (!root) {
		return;
	}

	// Skip login, go directly to home screen (WEB3 mode)
	initializeFolderData();
	homeScreen(root);

	window.addEventListener('message', (e) => {
		if (e.data && e.data.type === 'WEBOS_DISK_MUSIC' && typeof WebOSDisk !== 'undefined') {
			WebOSDisk.updateMusicState(e.data.payload);
		}
	});
}

window.addEventListener("load", webosInitLogin);

// Settings Window Functions
function openSettingsWindow() {
	const appsArea = document.querySelector('.webos-apps-area');
	const disk = typeof WebOSDisk !== 'undefined' ? WebOSDisk.getDiskForDisplay() : { display: { brightness: 100 } };
	const b = disk.display && disk.display.brightness != null ? disk.display.brightness : 100;

	const win = document.createElement('div');
	win.id = 'settings-window';
	win.className = 'webos-settings-window';
	win.style.cssText = 'left: 100px; top: 80px; width: 520px; max-width: 96vw; z-index: 100;';
	win.innerHTML = `
		<div class="webos-settings-titlebar">
			<span>Settings</span>
			<div class="webos-settings-buttons">
				<button class="webos-settings-btn" onclick="minimizeSettingsWindow()" title="Minimize">_</button>
				<button class="webos-settings-btn" onclick="maximizeSettingsWindow()" title="Maximize">[]</button>
				<button class="webos-settings-btn" onclick="closeSettingsWindow()" style="background: #F83800;" title="Close">x</button>
			</div>
		</div>
		<div class="webos-settings-content">
			<b>Display Settings</b>
			<div class="webos-settings-label-group">
				<label class="webos-settings-label">Brightness</label>
				<input type="range" min="40" max="100" value="${b}" class="webos-settings-slider" oninput="updateSliderValue(this)">
				<span class="webos-settings-value" id="brightness-val">${b}%</span>
			</div>
			<b>Personalization</b>
			<div class="webos-wallpaper-section">
				<label class="webos-settings-label" style="display:block;width:100%;min-width:0;margin-bottom:6px;">Wallpaper</label>
				<div id="webos-wallpaper-grid" class="webos-wallpaper-grid" role="group" aria-label="Choose wallpaper"></div>
				<div class="webos-wallpaper-actions">
					<button type="button" class="webos-btn-import" id="webos-wallpaper-import-btn">Import from computer</button>
					<input type="file" id="webos-wallpaper-file" accept="image/png,image/jpeg,image/webp,image/gif" style="display:none" />
					<div class="webos-wallpaper-import-preview" id="webos-wallpaper-import-preview">
						<img id="webos-custom-wall-thumb-img" alt="Custom wallpaper preview" style="display:none;" />
						<span id="webos-custom-wall-thumb-label">Custom image appears here</span>
					</div>
				</div>
			</div>
			<b>Audio Settings</b><br>Volume | Device<br><br>
			<b>System Settings</b><br>About | Logout
		</div>
	`;
	appsArea.appendChild(win);
	initSettingsWallpaperUI();
	makeWindowDraggable(win, '.webos-settings-titlebar');
	addWindowFocusListener(win);
}

function initSettingsWallpaperUI() {
	if (typeof WebOSDisk === 'undefined') return;

	const grid = document.getElementById('webos-wallpaper-grid');
	const disk = WebOSDisk.getDiskForDisplay();
	const wp = disk.wallpaper || { kind: 'builtin', path: 'Assets/images/Wallpapers/Bg.png' };

	const setActiveThumb = (el) => {
		document.querySelectorAll('.webos-wallpaper-thumb').forEach((t) => t.classList.remove('webos-wallpaper-thumb--active'));
		if (el) el.classList.add('webos-wallpaper-thumb--active');
	};

	if (grid) {
		grid.innerHTML = '';
		WebOSDisk.WALLPAPER_OPTIONS.forEach((opt) => {
			const btn = document.createElement('button');
			btn.type = 'button';
			btn.className = 'webos-wallpaper-thumb';
			btn.dataset.path = opt.path;
			const isActive = wp.kind === 'builtin' && wp.path === opt.path;
			if (isActive) btn.classList.add('webos-wallpaper-thumb--active');
			btn.innerHTML = `<img src="${webosAssetUrl(opt.path)}" alt=""><span>${opt.label}</span>`;
			btn.addEventListener('click', () => {
				WebOSDisk.setWallpaperBuiltin(opt.path);
				setActiveThumb(btn);
				const img = document.getElementById('webos-custom-wall-thumb-img');
				const lbl = document.getElementById('webos-custom-wall-thumb-label');
				if (img) img.style.display = 'none';
				if (lbl) lbl.textContent = 'Custom image appears here';
			});
			grid.appendChild(btn);
		});
	}

	const img = document.getElementById('webos-custom-wall-thumb-img');
	const lbl = document.getElementById('webos-custom-wall-thumb-label');
	if (wp.kind === 'custom' && wp.dataUrl && img && lbl) {
		img.src = wp.dataUrl;
		img.style.display = 'block';
		lbl.textContent = 'Using imported wallpaper';
	}

	document.getElementById('webos-wallpaper-import-btn')?.addEventListener('click', () => {
		document.getElementById('webos-wallpaper-file')?.click();
	});

	document.getElementById('webos-wallpaper-file')?.addEventListener('change', (e) => {
		const file = e.target.files && e.target.files[0];
		if (!file || !file.type.startsWith('image/')) return;
		if (file.size > 4 * 1024 * 1024) {
			alert('Image is too large. Please use a file under 4 MB.');
			e.target.value = '';
			return;
		}
		const reader = new FileReader();
		reader.onload = () => {
			const dataUrl = reader.result;
			WebOSDisk.setWallpaperCustomDataUrl(dataUrl);
			setActiveThumb(null);
			document.querySelectorAll('#webos-wallpaper-grid .webos-wallpaper-thumb').forEach((t) => t.classList.remove('webos-wallpaper-thumb--active'));
			if (img) {
				img.src = dataUrl;
				img.style.display = 'block';
			}
			if (lbl) lbl.textContent = 'Using imported wallpaper';
		};
		reader.readAsDataURL(file);
		e.target.value = '';
	});
}

function makeWindowDraggable(element, titleSelector) {
	const titlebar = element.querySelector(titleSelector);
	let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
	
	titlebar.onmousedown = (e) => {
		maxZIndex++;
		element.style.zIndex = maxZIndex;
		pos3 = e.clientX;
		pos4 = e.clientY;
		document.onmouseup = () => {
			document.onmousemove = null;
		};
		document.onmousemove = (e) => {
			pos1 = pos3 - e.clientX;
			pos2 = pos4 - e.clientY;
			pos3 = e.clientX;
			pos4 = e.clientY;
			element.style.top = (element.offsetTop - pos2) + 'px';
			element.style.left = (element.offsetLeft - pos1) + 'px';
		};
	};
}

function minimizeSettingsWindow() {
	const win = document.getElementById('settings-window');
	if (win) {
		win.style.display = win.style.display === 'none' ? 'flex' : 'none';
	}
}

function maximizeSettingsWindow() {
	const win = document.getElementById('settings-window');
	if (!win) return;
	if (win.classList.contains('maximized')) {
		win.classList.remove('maximized');
		win.style.cssText = 'position: absolute; left: 100px; top: 80px; width: 520px; max-width: 96vw; height: auto; z-index: 100;';
	} else {
		win.classList.add('maximized');
		win.style.cssText = 'position: fixed; left: 0; top: 0; width: 100%; height: calc(100vh - 7vh); border: none; box-shadow: none; border-radius: 0;';
	}
}

function closeSettingsWindow() {
	document.getElementById('settings-window')?.remove();
}

function updateSliderValue(slider) {
	const parent = slider.parentElement;
	const valueSpan = parent.querySelector('.webos-settings-value');
	const label = parent.querySelector('.webos-settings-label').textContent.trim();

	if (label === 'Brightness') {
		valueSpan.textContent = slider.value + '%';
		if (typeof WebOSDisk !== 'undefined') {
			WebOSDisk.setBrightness(slider.value);
		}
	}
}

// ========================
// Camera Window Functions
// ========================
let cameraStream = null;

function openCameraWindow() {
	const appsArea = document.querySelector('.webos-apps-area');
	const win = document.createElement('div');
	win.id = 'camera-window';
	win.className = 'webos-camera-window';
	win.style.cssText = 'left: 300px; top: 150px; width: 480px; height: 420px; z-index: 100;';
	win.innerHTML = `
		<div class="webos-camera-titlebar">
			<span class="webos-camera-titlebar-text">Camera</span>
			<div class="webos-camera-titlebar-buttons">
				<button class="webos-settings-btn" onclick="minimizeCameraWindow()" style="background: #049CD8;">_</button>
				<button class="webos-settings-btn" onclick="maximizeCameraWindow()" style="background: #049CD8;">[]</button>
				<button class="webos-settings-btn" onclick="closeCameraWindow()" style="background: #F83800;">x</button>
			</div>
		</div>
		<div class="webos-camera-content">
			<video id="camera-video" width="448" height="230" style="border: 3px solid #000; border-radius: 4px; margin-bottom: 12px; object-fit: cover; background: #049CD8;" autoplay playsinline></video>
			<div style="display: flex; gap: 8px; width: 100%; justify-content: center;">
				<button class="webos-settings-btn" onclick="captureAndSavePhoto()" style="background: #43B047; flex: 1; color: #000;">Take Photo</button>
			</div>
			<p id="camera-status" style="text-align: center; margin-top: 8px; font-size: 12px;">Initializing camera...</p>
		</div>
	`;
	appsArea.appendChild(win);
	makeWindowDraggable(win, '.webos-camera-titlebar');
	
	initializeCamera();
}

function initializeCamera() {
	if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
		navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } })
			.then(stream => {
				cameraStream = stream;
				const video = document.getElementById('camera-video');
				if (video) {
					video.srcObject = stream;
					document.getElementById('camera-status').textContent = 'Camera ready';
					document.getElementById('camera-status').style.color = '#C84C0C';
				}
			})
			.catch(error => {
				console.error('Camera error:', error);
				document.getElementById('camera-status').textContent = 'Camera not available';
				document.getElementById('camera-status').style.color = '#F83800';
			});
	} else {
		document.getElementById('camera-status').textContent = 'Camera not supported';
		document.getElementById('camera-status').style.color = '#F83800';
	}
}

function minimizeCameraWindow() {
	const win = document.getElementById('camera-window');
	if (win) {
		win.style.display = win.style.display === 'none' ? 'flex' : 'none';
	}
}

function maximizeCameraWindow() {
	const win = document.getElementById('camera-window');
	if (!win) return;
	if (win.classList.contains('maximized')) {
		win.classList.remove('maximized');
		win.style.cssText = 'position: absolute; left: 300px; top: 150px; width: 480px; height: 360px;';
	} else {
		win.classList.add('maximized');
		win.style.cssText = 'position: fixed; left: 0; top: 0; width: 100%; height: calc(100vh - 7vh); border: none; box-shadow: none; border-radius: 0;';
	}
}

function closeCameraWindow() {
	if (cameraStream) {
		cameraStream.getTracks().forEach(track => track.stop());
		cameraStream = null;
	}
	document.getElementById('camera-window')?.remove();
}

// ========================
// File Manager Window Functions
// ========================
function openFileManagerWindow() {
	const appsArea = document.querySelector('.webos-apps-area');
	const win = document.createElement('div');
	win.id = 'file-manager-window';
	win.className = 'webos-file-manager-window';
	win.style.cssText = 'left: 600px; top: 200px; width: 500px; height: 400px; z-index: 100;';
	
	// Get folder data from localStorage
	const folderData = loadFolderData();
	
	win.innerHTML = `
		<div class="webos-file-manager-titlebar">
			<span class="webos-file-manager-titlebar-text">Files</span>
			<div class="webos-file-manager-titlebar-buttons">
				<button class="webos-settings-btn" onclick="minimizeFileManagerWindow()" style="background: #049CD8;">_</button>
				<button class="webos-settings-btn" onclick="maximizeFileManagerWindow()" style="background: #049CD8;">[]</button>
				<button class="webos-settings-btn" onclick="closeFileManagerWindow()" style="background: #F83800;">x</button>
			</div>
		</div>
		<div class="webos-file-manager-content">
			<div class="webos-folder-item" onclick="openFolder('photos')">
				<div class="webos-folder-item-icon">PH</div>
				<div class="webos-folder-item-name">Photos</div>
				<div class="webos-folder-item-count">${folderData.photos.length} items</div>
			</div>
			<div class="webos-folder-item" onclick="openFolder('folder1')">
				<div class="webos-folder-item-icon">F1</div>
				<div class="webos-folder-item-name">Folder 1</div>
				<div class="webos-folder-item-count">${folderData.folder1.length} items</div>
			</div>
			<div class="webos-folder-item" onclick="openFolder('folder2')">
				<div class="webos-folder-item-icon">F2</div>
				<div class="webos-folder-item-name">Folder 2</div>
				<div class="webos-folder-item-count">${folderData.folder2.length} items</div>
			</div>
			<div class="webos-folder-item" onclick="openFolder('songs')">
				<div class="webos-folder-item-icon">MU</div>
				<div class="webos-folder-item-name">Songs</div>
				<div class="webos-folder-item-count">${folderData.songs.length} items</div>
			</div>
		</div>
	`;
	appsArea.appendChild(win);
	makeWindowDraggable(win, '.webos-file-manager-titlebar');
}

function minimizeFileManagerWindow() {
	const win = document.getElementById('file-manager-window');
	if (win) {
		win.style.display = win.style.display === 'none' ? 'flex' : 'none';
	}
}

function maximizeFileManagerWindow() {
	const win = document.getElementById('file-manager-window');
	if (!win) return;
	if (win.classList.contains('maximized')) {
		win.classList.remove('maximized');
		win.style.cssText = 'position: absolute; left: 600px; top: 200px; width: 500px; height: 400px;';
	} else {
		win.classList.add('maximized');
		win.style.cssText = 'position: fixed; left: 0; top: 0; width: 100%; height: calc(100vh - 7vh); border: none; box-shadow: none; border-radius: 0;';
	}
}

function closeFileManagerWindow() {
	document.getElementById('file-manager-window')?.remove();
}

// ========================
// localStorage Management Functions
// ========================
function initializeFolderData() {
	const defaultData = {
		photos: [],
		folder1: [],
		folder2: [],
		songs: []
	};

	if (typeof WebOSDisk !== 'undefined') {
		const disk = WebOSDisk.load();
		if (!disk.fileManager && !localStorage.getItem('webos_file_manager')) {
			WebOSDisk.patch({ fileManager: defaultData });
			localStorage.setItem('webos_file_manager', JSON.stringify(defaultData));
		} else if (disk.fileManager && !localStorage.getItem('webos_file_manager')) {
			localStorage.setItem('webos_file_manager', JSON.stringify(disk.fileManager));
		}
	} else if (!localStorage.getItem('webos_file_manager')) {
		localStorage.setItem('webos_file_manager', JSON.stringify(defaultData));
	}
}

function loadFolderData() {
	initializeFolderData();
	if (typeof WebOSDisk !== 'undefined') {
		const disk = WebOSDisk.load();
		if (disk.fileManager) return disk.fileManager;
	}
	const data = localStorage.getItem('webos_file_manager');
	return JSON.parse(data || '{"photos":[],"folder1":[],"folder2":[],"songs":[]}');
}

function saveFolderData(data) {
	if (typeof WebOSDisk !== 'undefined') {
		WebOSDisk.patch({ fileManager: data });
	}
	localStorage.setItem('webos_file_manager', JSON.stringify(data));
}

function addItemToFolder(folderName, item) {
	const data = loadFolderData();
	if (data[folderName]) {
		data[folderName].push(item);
		saveFolderData(data);
	}
}

function captureAndSavePhoto() {
	const video = document.getElementById('camera-video');
	if (!video || !video.srcObject) {
		alert('Camera not ready');
		return;
	}
	
	// Create hidden canvas to capture video frame
	const canvas = document.createElement('canvas');
	canvas.width = 448;
	canvas.height = 230;
	const ctx = canvas.getContext('2d');
	ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
	
	// Save photo to localStorage
	const photoData = canvas.toDataURL('image/png');
	const timestamp = new Date().toLocaleTimeString();
	const photoName = `Photo_${timestamp}`;
	
	addItemToFolder('photos', { name: photoName, data: photoData });
	
	// Update status
	document.getElementById('camera-status').textContent = 'Saved to Photos';
	document.getElementById('camera-status').style.color = '#43B047';
	
	// Reset after 2 seconds
	setTimeout(() => {
		document.getElementById('camera-status').textContent = 'Camera ready';
		document.getElementById('camera-status').style.color = '#C84C0C';
	}, 2000);
}

function openPhotoViewer(photo) {
	const viewer = document.createElement('div');
	viewer.className = 'webos-photo-viewer';
	viewer.style.cssText = 'position: fixed; left: 0; top: 0; width: 100%; height: 100%; background: #000; z-index: 10000; display: flex; align-items: center; justify-content: center;';
	viewer.innerHTML = `
		<div style="position: relative; width: 90%; height: 90%; display: flex; align-items: center; justify-content: center;">
			<img src="${photo.data}" style="max-width: 100%; max-height: 100%; object-fit: contain;">
			<button onclick="this.closest('.webos-photo-viewer').remove()" style="position: absolute; top: 20px; right: 20px; background: #F83800; color: #FFCC99; border: 3px solid #000; width: 40px; height: 40px; cursor: pointer; border-radius: 4px; font-size: 16px;">x</button>
			<div style="position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); color: white; background: rgba(0,0,0,0.7); padding: 10px 20px; border-radius: 4px; font-size: 14px;">${photo.name}</div>
		</div>
	`;
	viewer.addEventListener('click', (e) => {
		if (e.target === viewer) viewer.remove();
	});
	document.body.appendChild(viewer);
}

let maxZIndex = 100;
function addWindowFocusListener(windowEl) {
	windowEl.addEventListener('mousedown', () => {
		maxZIndex++;
		windowEl.style.zIndex = maxZIndex;
	});
}

function openFolder(folderName) {
	const folderData = loadFolderData();
	const items = folderData[folderName] || [];
	
	const folderWindow = document.createElement('div');
	folderWindow.className = 'webos-folder-view-window';
	folderWindow.style.cssText = 'position: absolute; left: 150px; top: 150px; width: 600px; height: 450px; background: #FFCC99; border: 4px solid #000; border-radius: 4px; box-shadow: 6px 6px 0 #43B047; display: flex; flex-direction: column; z-index: 100;';
	
	const titlebar = document.createElement('div');
	titlebar.style.cssText = 'background: #43B047; color: #000; padding: 10px; font-family: \"Press Start 2P\", monospace; font-size: 8px; font-weight: 400; border-bottom: 3px solid #000; display: flex; justify-content: space-between; align-items: center; cursor: move;';
	const folderLabel = folderName.charAt(0).toUpperCase() + folderName.slice(1);
	titlebar.innerHTML = `
		<span>${folderLabel}</span>
		<button onclick="this.closest('.webos-folder-view-window').remove()" style="background: #F83800; color: #FFCC99; border: 2px solid #000; width: 30px; height: 30px; cursor: pointer; border-radius: 4px;">x</button>
	`;
	
	const content = document.createElement('div');
	content.style.cssText = 'flex: 1; overflow: hidden; padding: 12px; display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 12px; align-content: flex-start;';
	
	if (items.length === 0) {
		content.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #999; padding: 40px;">Folder is empty</p>';
	} else {
		items.forEach((item, index) => {
			const itemEl = document.createElement('div');
			itemEl.style.cssText = 'text-align: center; cursor: pointer; padding: 8px; border-radius: 4px; border: 1px solid #ddd; transition: all 0.2s; display: flex; flex-direction: column; align-items: center;';
			itemEl.innerHTML = `
				<div style="width: 100px; height: 100px; display: flex; align-items: center; justify-content: center; margin-bottom: 4px; border-radius: 4px; overflow: hidden; background: #f5f5f5;">
					<img src="${item.data}" style="width: 100%; height: 100%; object-fit: cover;">
				</div>
				<div style="font-size: 11px; word-break: break-all; max-height: 30px; overflow: hidden; width: 100%;">${item.name}</div>
			`;
			itemEl.addEventListener('mouseenter', () => itemEl.style.background = '#f0f0f0');
			itemEl.addEventListener('mouseleave', () => itemEl.style.background = 'transparent');
			itemEl.addEventListener('dblclick', () => openPhotoViewer(item));
			content.appendChild(itemEl);
		});
	}
	
	folderWindow.appendChild(titlebar);
	folderWindow.appendChild(content);
	const appsArea = document.querySelector('.webos-apps-area');
	appsArea.appendChild(folderWindow);
	makeWindowDraggable(folderWindow, 'div:first-child');
	addWindowFocusListener(folderWindow);
}
 