// ========================
// Apps Registry - Future-proof app management
// ========================
const webosApps = [
	{ id: 'camera', label: 'Camera', icon: 'Assets/images/camera.png', openFn: 'openCameraWindow' },
	{ id: 'file-manager', label: 'File Manager', icon: 'Assets/images/file_manager.png', openFn: 'openFileManagerWindow' },
	{ id: 'music', label: 'Music', icon: 'Assets/images/Music.png', openFn: 'openMusicWindow' },
	{ id: 'calculator', label: 'Calculator', icon: 'Assets/images/Calculator.png', openFn: 'openCalculatorWindow' },
	{
		id: 'mario',
		label: 'Mario Bros',
		icon: 'Assets/images/Game.png',
		openFn: 'openMarioGameWindow',
		searchTokens: ['mario', 'bros', 'brothers', 'nes', 'jumpman', 'game']
	},
	{
		id: 'notepad',
		label: 'Notepad',
		icon: 'Assets/images/notepad.svg',
		openFn: 'openNotepadWindow',
		searchTokens: ['note', 'text', 'editor', 'txt']
	},
	{
		id: 'browser',
		label: 'Browser',
		icon: 'Assets/images/browser.svg',
		openFn: 'openBrowserWindow',
		searchTokens: ['web', 'internet', 'net', 'chrome']
	},
	{ id: 'settings', label: 'Settings', icon: 'Assets/images/settings.png', openFn: 'openSettingsWindow' },
	{ id: 'recycle-bin', label: 'Recycle Bin', icon: 'Assets/images/recycle-bin.png', openFn: 'openRecycleBin' }
];

/** Lowercase haystack per app for taskbar Search + Start menu */
function webosAppSearchBlob(app) {
	const parts = [app.label.replace(/\s+/g, ' '), ...(app.searchTokens || [])];
	return parts.join(' ').toLowerCase();
}

function webosMatchingApps(query) {
	const q = query.trim().toLowerCase();
	if (!q) return webosApps.slice();
	return webosApps.filter((app) => webosAppSearchBlob(app).includes(q));
}

const webosHomeTickers = [];

function webosClearHomeTickers() {
	while (webosHomeTickers.length) {
		clearInterval(webosHomeTickers.pop());
	}
}

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
				<div class="webos-login-hint" role="note">
					<span class="webos-login-hint-title">Demo sign-in</span>
					<span>Username is <strong>143</strong></span>
					<span>Password is <strong>123</strong></span>
				</div>
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
	webosClearHomeTickers();
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
					<input type="text" placeholder="Search apps — filters as you type" class="webos-taskbar-search-input" autocomplete="off" aria-autocomplete="list" aria-controls="webos-taskbar-search-results">
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
				<div class="webos-taskbar-item" data-label="Mario Bros">
					<img src="Assets/images/Game.png" alt="Mario Bros" class="webos-taskbar-icon">
					<span class="webos-taskbar-tooltip">Mario Bros</span>
				</div>
				<div class="webos-taskbar-item" data-label="Notepad">
					<img src="Assets/images/notepad.svg" alt="Notepad" class="webos-taskbar-icon">
					<span class="webos-taskbar-tooltip">Notepad</span>
				</div>
				<div class="webos-taskbar-item" data-label="Browser">
					<img src="Assets/images/browser.svg" alt="Browser" class="webos-taskbar-icon">
					<span class="webos-taskbar-tooltip">Browser</span>
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

	const searchInput = document.querySelector('.webos-taskbar-search-input');
	if (searchInput) {
		searchInput.addEventListener('keydown', (e) => {
			if (e.key === 'Enter') {
				handleSearch(searchInput.value);
			}
		});
	}
	
	webosHomeTickers.push(setInterval(updateTimeAndDate, 1000));
	webosHomeTickers.push(setInterval(updateBatteryStatus, 30000));

	if (typeof WebOSDisk !== 'undefined') {
		WebOSDisk.applyToHomeScreen();
	}

	setupWebosTaskbarSearchLive();
	setupWebosCalendarPopover();
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
	menu.style.cssText =
		'position: fixed; left: 20px; bottom: 110px; width: 320px; max-width: 92vw; background: #FFCC99; border: 3px solid #000; border-radius: 4px; box-shadow: 6px 6px 0 #C84C0C; z-index: 9999; display: flex; flex-direction: column;';

	const header = document.createElement('div');
	header.style.cssText =
		'font-family: \"Press Start 2P\", monospace; background: #E52521; color: #FBD000; padding: 10px 12px 8px; font-size: 9px; font-weight: 400; border-bottom: 3px solid #000;';
	header.textContent = 'Apps';
	menu.appendChild(header);

	const searchWrap = document.createElement('div');
	searchWrap.style.cssText = 'padding: 10px 10px 4px; background: #FFCC99; border-bottom: 2px dashed #C84C0C;';

	const menuSearch = document.createElement('input');
	menuSearch.type = 'search';
	menuSearch.placeholder = 'Search apps';
	menuSearch.setAttribute('aria-label', 'Search apps');
	menuSearch.style.cssText =
		'width: 100%; box-sizing: border-box; padding: 8px 10px; font-size: 14px; font-family: Pixelify Sans, sans-serif; border: 3px solid #000; border-radius: 4px; background: #fff; outline: none;';
	searchWrap.appendChild(menuSearch);
	menu.appendChild(searchWrap);

	const content = document.createElement('div');
	content.className = 'webos-start-menu-list';
	content.style.cssText = 'max-height: 360px; overflow-y: auto; padding: 8px;';

	const applyFilter = () => {
		const q = menuSearch.value.trim().toLowerCase();
		Array.from(content.querySelectorAll('[data-search-blob]')).forEach((row) => {
			const blob = row.getAttribute('data-search-blob') || '';
			row.style.display = !q || blob.includes(q) ? 'flex' : 'none';
		});
	};

	menuSearch.addEventListener('input', applyFilter);

	menuSearch.addEventListener('keydown', (e) => {
		if (e.key === 'Enter') {
			e.preventDefault();
			let rows = Array.from(content.querySelectorAll('[data-search-blob]')).filter((r) => r.style.display !== 'none');
			if (!rows.length) {
				const byName = webosMatchingApps(menuSearch.value);
				if (byName[0]) {
					window[byName[0].openFn]();
					menu.remove();
				}
				return;
			}
			const openFn = rows[0].getAttribute('data-open-fn');
			if (openFn) {
				window[openFn]();
				menu.remove();
			}
		}
	});

	webosApps.forEach((app) => {
		const item = document.createElement('div');
		item.className = 'webos-start-item';
		item.setAttribute('data-search-blob', webosAppSearchBlob(app));
		item.setAttribute('data-open-fn', app.openFn);
		item.style.cssText = 'display: flex; align-items: center; gap: 12px; padding: 8px; cursor: pointer; border-radius: 4px; transition: background 0.2s;';
		item.innerHTML = `<img src="${app.icon}" alt="" style="width: 32px; height: 32px;"><span style="font-size:14px;">${app.label}</span>`;
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

	queueMicrotask(() => {
		menuSearch.focus();
		applyFilter();
	});

	const onDocClick = (e) => {
		if (!menu.contains(e.target) && !document.querySelector('[data-label="Windows"]')?.contains(e.target)) {
			menu.remove();
			document.removeEventListener('click', onDocClick);
		}
	};
	setTimeout(() => document.addEventListener('click', onDocClick), 0);
}

function handleSearch(query) {
	const raw = typeof query === 'string' ? query : '';
	if (!raw.trim()) return;

	const matches = webosMatchingApps(raw);
	const inputEl = document.querySelector('.webos-taskbar-search-input');

	if (!matches.length) {
		if (raw.trim()) {
			alert(`No app found for "${raw.trim()}"`);
		}
		return;
	}

	window[matches[0].openFn]();
	if (inputEl) inputEl.value = '';
}

let webosCalendarEl = null;
let webosCalendarTimeInterval = null;

function closeWebosCalendar() {
	if (webosCalendarTimeInterval) {
		clearInterval(webosCalendarTimeInterval);
		webosCalendarTimeInterval = null;
	}
	webosCalendarEl?.remove();
	webosCalendarEl = null;
	document.removeEventListener('click', webosCalendarOutsideClose);
}

function webosCalendarOutsideClose(e) {
	const td = document.querySelector('.webos-time-date');
	if (webosCalendarEl && !webosCalendarEl.contains(e.target) && !(td && td.contains(e.target))) {
		closeWebosCalendar();
	}
}

function setupWebosCalendarPopover() {
	const wrap = document.querySelector('.webos-time-date');
	if (!wrap) return;
	wrap.style.cursor = 'pointer';
	wrap.setAttribute('role', 'button');
	wrap.tabIndex = 0;
	wrap.addEventListener('keydown', (e) => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			toggleWebosCalendar(wrap);
		}
	});
	wrap.addEventListener('click', (e) => {
		e.stopPropagation();
		toggleWebosCalendar(wrap);
	});
}

function toggleWebosCalendar(anchor) {
	if (webosCalendarEl) {
		closeWebosCalendar();
		return;
	}

	const cal = document.createElement('div');
	cal.className = 'webos-calendar-popover';
	let viewMonth = new Date();
	viewMonth = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), 1);

	const render = () => {
		const now = new Date();
		const y = viewMonth.getFullYear();
		const m = viewMonth.getMonth();
		const monthLabel = viewMonth.toLocaleString(undefined, { month: 'long', year: 'numeric' });
		const firstDow = new Date(y, m, 1).getDay();
		const daysInMonth = new Date(y, m + 1, 0).getDate();
		const today = new Date();
		const isToday = (d) =>
			d === today.getDate() && m === today.getMonth() && y === today.getFullYear();

		const cells = [];
		for (let i = 0; i < firstDow; i++) {
			cells.push('<div class="webos-cal-cell webos-cal-empty"></div>');
		}
		for (let d = 1; d <= daysInMonth; d++) {
			const cls = isToday(d) ? 'webos-cal-cell webos-cal-today' : 'webos-cal-cell';
			cells.push(`<div class="${cls}">${d}</div>`);
		}

		const timeStr = now.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' });
		const dateStr = now.toLocaleDateString(undefined, {
			weekday: 'long',
			month: 'long',
			day: 'numeric',
			year: 'numeric'
		});

		cal.innerHTML = `
			<div class="webos-cal-header">
				<button type="button" class="webos-cal-nav" aria-label="Previous month">‹</button>
				<span class="webos-cal-month">${monthLabel}</span>
				<button type="button" class="webos-cal-nav" aria-label="Next month">›</button>
			</div>
			<div class="webos-cal-weekdays">
				${['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((w) => `<span>${w}</span>`).join('')}
			</div>
			<div class="webos-cal-grid">${cells.join('')}</div>
			<div class="webos-cal-footer">
				<div class="webos-cal-time-big" id="webos-cal-live-time">${timeStr}</div>
				<div class="webos-cal-date-big">${dateStr}</div>
			</div>
		`;

		const [prevBtn, nextBtn] = cal.querySelectorAll('.webos-cal-nav');
		prevBtn.addEventListener('click', (e) => {
			e.stopPropagation();
			viewMonth = new Date(y, m - 1, 1);
			render();
		});
		nextBtn.addEventListener('click', (e) => {
			e.stopPropagation();
			viewMonth = new Date(y, m + 1, 1);
			render();
		});
	};

	render();
	document.body.appendChild(cal);
	const rect = anchor.getBoundingClientRect();
	cal.style.position = 'fixed';
	cal.style.right = `${Math.max(12, window.innerWidth - rect.right)}px`;
	cal.style.bottom = `${window.innerHeight - rect.top + 10}px`;
	cal.style.zIndex = '12000';
	webosCalendarEl = cal;

	webosCalendarTimeInterval = setInterval(() => {
		const el = document.getElementById('webos-cal-live-time');
		if (el) {
			el.textContent = new Date().toLocaleTimeString(undefined, {
				hour: '2-digit',
				minute: '2-digit',
				second: '2-digit'
			});
		}
	}, 1000);

	setTimeout(() => document.addEventListener('click', webosCalendarOutsideClose), 0);
}

function setupWebosTaskbarSearchLive() {
	const wrap = document.querySelector('.webos-taskbar-search');
	const input = document.querySelector('.webos-taskbar-search-input');
	if (!wrap || !input) return;

	let listEl = wrap.querySelector('.webos-taskbar-search-results');
	if (!listEl) {
		listEl = document.createElement('div');
		listEl.className = 'webos-taskbar-search-results';
		listEl.id = 'webos-taskbar-search-results';
		listEl.hidden = true;
		listEl.setAttribute('role', 'listbox');
		wrap.appendChild(listEl);
	}

	const hide = () => {
		listEl.hidden = true;
		listEl.innerHTML = '';
	};

	const showMatches = () => {
		const q = input.value;
		if (!q.trim()) {
			hide();
			return;
		}
		const matches = webosMatchingApps(q);
		listEl.innerHTML = '';
		matches.forEach((app) => {
			const row = document.createElement('button');
			row.type = 'button';
			row.className = 'webos-taskbar-search-row';
			row.setAttribute('role', 'option');
			const img = document.createElement('img');
			img.src = app.icon;
			img.alt = '';
			const span = document.createElement('span');
			span.textContent = app.label;
			row.appendChild(img);
			row.appendChild(span);
			row.addEventListener('mousedown', (ev) => {
				ev.preventDefault();
				window[app.openFn]();
				input.value = '';
				hide();
			});
			listEl.appendChild(row);
		});
		listEl.hidden = matches.length === 0;
	};

	input.addEventListener('input', showMatches);
	input.addEventListener('focus', () => {
		if (input.value.trim()) showMatches();
	});
	document.addEventListener('click', (e) => {
		if (!wrap.contains(e.target)) hide();
	});
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
		<div class="webos-chrome-titlebar" style="background: #E52521; color: #FBD000; padding: 12px; font-family: \"Press Start 2P\", monospace; font-size: 9px; font-weight: 400; border-bottom: 3px solid #000; flex-shrink: 0; cursor: move;">
			<span class="webos-chrome-title-text">Mario Music</span>
			<div class="webos-chrome-buttons">
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
		<div class="webos-chrome-titlebar" style="background: #049CD8; color: #000000; padding: 10px 12px; font-family: \"Press Start 2P\", monospace; font-size: 8px; border-bottom: 3px solid #000000; flex-shrink: 0; cursor: move;">
			<span class="webos-chrome-title-text">Retro Calculator</span>
			<div class="webos-chrome-buttons">
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

function openMarioGameWindow() {
	const existing = document.getElementById('mario-game-window');
	if (existing) {
		existing.style.display = 'flex';
		maxZIndex++;
		existing.style.zIndex = maxZIndex;
		return;
	}

	const appsArea = document.querySelector('.webos-apps-area');
	const win = document.createElement('div');
	win.id = 'mario-game-window';
	win.className = 'webos-mario-game-window';
	win.style.cssText =
		'position: absolute; left: 40px; top: 56px; width: min(800px, 94vw); height: min(740px, calc(94vh - 8vh)); min-width: 400px; min-height: 480px; background: #000; border: 4px solid #E52521; border-radius: 4px; box-shadow: 6px 6px 0 #C84C0C; display: flex; flex-direction: column; z-index: 100; overflow: hidden;';
	win.innerHTML = `
		<div class="webos-chrome-titlebar" style="background: #E52521; color: #FBD000; padding: 10px 12px; font-family: \"Press Start 2P\", monospace; font-size: 8px; font-weight: 400; border-bottom: 3px solid #000; flex-shrink: 0; cursor: move;">
			<span class="webos-chrome-title-text">Mario Bros</span>
			<div class="webos-chrome-buttons">
				<button type="button" class="webos-settings-btn" onclick="minimizeMarioGameWindow()" style="background: #049CD8; width: 30px; height: 30px; color: #000; border: 2px solid #000;">_</button>
				<button type="button" class="webos-settings-btn" onclick="maximizeMarioGameWindow()" style="background: #049CD8; width: 30px; height: 30px; color: #000; border: 2px solid #000;">[]</button>
				<button type="button" class="webos-settings-btn" onclick="closeMarioGameWindow()" style="background: #F83800; width: 30px; height: 30px; color: #000; border: 2px solid #000;">x</button>
			</div>
		</div>
		<iframe id="mario-game-frame" src="mario-game/index.html" style="flex: 1; border: none; width: 100%; min-height: 0; background: #000;" title="Mario Bros"></iframe>
	`;
	appsArea.appendChild(win);
	makeWindowDraggable(win, 'div:first-child');
	addWindowFocusListener(win);
}

function minimizeMarioGameWindow() {
	const win = document.getElementById('mario-game-window');
	if (win) win.style.display = 'none';
}

function maximizeMarioGameWindow() {
	const win = document.getElementById('mario-game-window');
	if (!win) return;
	if (win.classList.contains('maximized')) {
		win.classList.remove('maximized');
		win.style.cssText =
			'position: absolute; left: 40px; top: 56px; width: min(800px, 94vw); height: min(740px, calc(94vh - 8vh)); min-width: 400px; min-height: 480px; background: #000; border: 4px solid #E52521; border-radius: 4px; box-shadow: 6px 6px 0 #C84C0C; display: flex; flex-direction: column; z-index: 100; overflow: hidden;';
	} else {
		win.classList.add('maximized');
		win.style.cssText =
			'position: fixed; left: 0; top: 0; width: 100%; height: calc(100vh - 7vh); border: none; box-shadow: none; border-radius: 0; display: flex; flex-direction: column; z-index: 100; overflow: hidden; background: #000;';
	}
}

function closeMarioGameWindow() {
	document.getElementById('mario-game-window')?.remove();
}

function webosBrowserStartHref() {
	try {
		return new URL('browser-start.html', window.location.href).href;
	} catch (_) {
		return 'browser-start.html';
	}
}

function webosNormalizeBrowserHref(raw) {
	const t = String(raw || '').trim();
	if (!t) return webosBrowserStartHref();
	if (/^https?:\/\//i.test(t)) return t;
	if (/^(file|blob|data):/i.test(t)) return t;
	if (t.startsWith('//')) return 'https:' + t;
	try {
		const asUrl = new URL(t);
		if (asUrl.protocol === 'http:' || asUrl.protocol === 'https:') return asUrl.href;
	} catch (_) {}
	if (/^[\w.-]+\.[a-z]{2,}([/:?].*)?$/i.test(t)) return 'https://' + t;
	try {
		return new URL(t, window.location.href).href;
	} catch (_) {
		return webosBrowserStartHref();
	}
}

/**
 * Opens a URL in a real browser tab (full Chromium / engine) — same as a normal browser.
 * The in-app iframe is only for the local start page; embedding arbitrary sites in iframes is blocked by most websites.
 */
function webosBrowserOpenInSystemTab(rawUrl) {
	const t = String(rawUrl || '').trim();
	if (!t) {
		alert('Enter a website address (e.g. example.com or https://…).');
		return false;
	}
	const u = webosNormalizeBrowserHref(t);
	const w = window.open(u, '_blank', 'noopener,noreferrer');
	if (!w || w.closed) {
		alert('Your browser blocked the new tab. Allow pop-ups for this site, then try again.');
		return false;
	}
	if (typeof WebOSDisk !== 'undefined') WebOSDisk.setBrowserLastUrl(u);
	const addr = document.getElementById('webos-browser-address');
	if (addr) addr.value = u;
	return true;
}

let webosNotepadSaveTimer = null;
let webosNotepadActiveDocId = null;

function webosApplyNotepadDocument(docId) {
	const id = docId == null ? null : docId;
	webosNotepadActiveDocId = id;
	const ta = document.getElementById('notepad-textarea');
	const lbl = document.getElementById('notepad-doc-label');
	if (!ta) return;
	if (id && typeof WebOSDisk !== 'undefined') {
		const doc = WebOSDisk.getNotepadDocument(id);
		if (doc) {
			ta.value = doc.content || '';
			if (lbl) lbl.textContent = doc.name || 'Document';
			return;
		}
	}
	ta.value = typeof WebOSDisk !== 'undefined' ? WebOSDisk.getNotepadContent() : '';
	if (lbl) lbl.textContent = 'Scratch';
}

function openNotepadWindow(docId) {
	const id = docId == null ? null : docId;
	const existing = document.getElementById('notepad-window');
	if (existing) {
		existing.style.display = 'flex';
		maxZIndex++;
		existing.style.zIndex = maxZIndex;
		webosApplyNotepadDocument(id);
		return;
	}

	const appsArea = document.querySelector('.webos-apps-area');
	const win = document.createElement('div');
	win.id = 'notepad-window';
	win.className = 'webos-notepad-window';
	win.style.cssText =
		'position:absolute;left:60px;top:72px;width:min(520px,92vw);height:min(420px,78vh);min-width:320px;min-height:240px;display:flex;flex-direction:column;z-index:100;overflow:hidden;';
	win.innerHTML = `
		<div class="webos-chrome-titlebar webos-notepad-titlebar" style="background:#43B047;color:#000;padding:10px 12px;font-family:\"Press Start 2P\",monospace;font-size:8px;border-bottom:3px solid #000;flex-shrink:0;cursor:move;">
			<span class="webos-chrome-title-text" style="display:flex;flex-direction:column;gap:2px;line-height:1.35;align-items:flex-start;">
				<span>Notepad</span>
				<span id="notepad-doc-label" style="font-family:Pixelify Sans,sans-serif;font-size:10px;font-weight:600;opacity:0.95;">Scratch</span>
			</span>
			<div class="webos-chrome-buttons">
				<button type="button" class="webos-settings-btn" onclick="minimizeNotepadWindow()" style="background:#049CD8;width:30px;height:30px;color:#000;border:2px solid #000;">_</button>
				<button type="button" class="webos-settings-btn" onclick="maximizeNotepadWindow()" style="background:#049CD8;width:30px;height:30px;color:#000;border:2px solid #000;">[]</button>
				<button type="button" class="webos-settings-btn" onclick="closeNotepadWindow()" style="background:#F83800;width:30px;height:30px;color:#000;border:2px solid #000;">x</button>
			</div>
		</div>
		<div class="webos-notepad-toolbar">
			<button type="button" class="webos-notepad-tool-btn" onclick="webosNotepadNewFile()">New</button>
			<button type="button" class="webos-notepad-tool-btn" onclick="webosNotepadSaveToFiles()">Save to Files…</button>
		</div>
		<div class="webos-notepad-body">
			<textarea id="notepad-textarea" class="webos-notepad-textarea" spellcheck="false" placeholder="Type here…" aria-label="Notepad content"></textarea>
			<div class="webos-notepad-status">Scratch pad syncs to disk. Saved files live in File Manager → Documents.</div>
		</div>
	`;
	appsArea.appendChild(win);
	webosApplyNotepadDocument(id);
	const ta = document.getElementById('notepad-textarea');
	if (ta) {
		ta.addEventListener('input', () => {
			clearTimeout(webosNotepadSaveTimer);
			webosNotepadSaveTimer = setTimeout(() => {
				if (typeof WebOSDisk === 'undefined') return;
				if (webosNotepadActiveDocId) {
					WebOSDisk.updateNotepadDocumentContent(webosNotepadActiveDocId, ta.value);
				} else {
					WebOSDisk.setNotepadContent(ta.value);
				}
			}, 400);
		});
	}
	makeWindowDraggable(win, 'div:first-child');
	addWindowFocusListener(win);
}

function webosNotepadNewFile() {
	webosNotepadActiveDocId = null;
	const ta = document.getElementById('notepad-textarea');
	if (ta) ta.value = '';
	if (typeof WebOSDisk !== 'undefined') WebOSDisk.setNotepadContent('');
	const lbl = document.getElementById('notepad-doc-label');
	if (lbl) lbl.textContent = 'Scratch';
}

function webosNotepadSaveToFiles() {
	const ta = document.getElementById('notepad-textarea');
	if (!ta || typeof WebOSDisk === 'undefined') return;
	let defaultName = 'Note.txt';
	if (webosNotepadActiveDocId) {
		const d = WebOSDisk.getNotepadDocument(webosNotepadActiveDocId);
		if (d && d.name) defaultName = d.name;
	}
	const name = window.prompt('Save to File Manager → Documents', defaultName);
	if (name === null) return;
	const newId = WebOSDisk.saveNotepadDocument(name, ta.value, webosNotepadActiveDocId || undefined);
	webosNotepadActiveDocId = newId;
	const saved = WebOSDisk.getNotepadDocument(newId);
	const lbl = document.getElementById('notepad-doc-label');
	if (lbl && saved) lbl.textContent = saved.name;
}

function minimizeNotepadWindow() {
	const w = document.getElementById('notepad-window');
	if (w) w.style.display = 'none';
}

function maximizeNotepadWindow() {
	const w = document.getElementById('notepad-window');
	if (!w) return;
	if (w.classList.contains('maximized')) {
		w.classList.remove('maximized');
		w.style.cssText =
			'position:absolute;left:60px;top:72px;width:min(520px,92vw);height:min(420px,78vh);min-width:320px;min-height:240px;display:flex;flex-direction:column;z-index:100;overflow:hidden;';
	} else {
		w.classList.add('maximized');
		w.style.cssText =
			'position:fixed;left:0;top:0;width:100%;height:calc(100vh - 7vh);display:flex;flex-direction:column;z-index:100;overflow:hidden;border-radius:0;box-shadow:none;';
	}
}

function closeNotepadWindow() {
	webosNotepadActiveDocId = null;
	document.getElementById('notepad-window')?.remove();
}

function openBrowserWindow() {
	const existing = document.getElementById('browser-window');
	if (existing) {
		existing.style.display = 'flex';
		maxZIndex++;
		existing.style.zIndex = maxZIndex;
		return;
	}

	const start = webosBrowserStartHref();
	const lastAddr = (typeof WebOSDisk !== 'undefined' && WebOSDisk.getBrowserLastUrl()) || '';

	const appsArea = document.querySelector('.webos-apps-area');
	const win = document.createElement('div');
	win.id = 'browser-window';
	win.className = 'webos-browser-window';
	win.style.cssText =
		'position:absolute;left:72px;top:64px;width:min(920px,94vw);height:min(560px,calc(94vh - 10vh));min-width:360px;min-height:320px;display:flex;flex-direction:column;z-index:100;overflow:hidden;';

	win.innerHTML = `
		<div class="webos-chrome-titlebar" style="background:#049CD8;color:#FBD000;padding:10px 12px;font-family:\"Press Start 2P\",monospace;font-size:8px;border-bottom:3px solid #000;flex-shrink:0;cursor:move;">
			<span class="webos-chrome-title-text">Takumi Browser</span>
			<div class="webos-chrome-buttons">
				<button type="button" class="webos-settings-btn" onclick="minimizeBrowserWindow()" style="background:#43B047;width:30px;height:30px;color:#000;border:2px solid #000;">_</button>
				<button type="button" class="webos-settings-btn" onclick="maximizeBrowserWindow()" style="background:#43B047;width:30px;height:30px;color:#000;border:2px solid #000;">[]</button>
				<button type="button" class="webos-settings-btn" onclick="closeBrowserWindow()" style="background:#F83800;width:30px;height:30px;color:#000;border:2px solid #000;">x</button>
			</div>
		</div>
		<div class="webos-browser-toolbar">
			<button type="button" class="webos-browser-btn" onclick="webosBrowserBack()" title="Back on start page">◀</button>
			<button type="button" class="webos-browser-btn" onclick="webosBrowserReload()" title="Reload start page">↻</button>
			<input type="url" class="webos-browser-address" id="webos-browser-address" value="" spellcheck="false" autocomplete="off" aria-label="Address" placeholder="https://…">
			<button type="button" class="webos-browser-btn webos-browser-btn--go" onclick="webosBrowserGo()" title="Open in a normal browser tab">Open</button>
			<button type="button" class="webos-browser-btn" onclick="webosBrowserHome()" title="Show start page here">Start</button>
		</div>
		<iframe id="webos-browser-frame" class="webos-browser-frame" referrerpolicy="no-referrer-when-downgrade" title="Start page" sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"></iframe>
		<div class="webos-browser-hint">The panel above is your <strong>start page</strong>. <strong>Open</strong> loads the address in a <strong>real browser tab</strong> (full site, logins, and scripts work). Allow pop-ups if asked.</div>
	`;

	appsArea.appendChild(win);

	const addr = document.getElementById('webos-browser-address');
	const iframe = document.getElementById('webos-browser-frame');
	if (addr) addr.value = lastAddr;
	if (iframe) iframe.src = start;

	addr?.addEventListener('keydown', (e) => {
		if (e.key === 'Enter') webosBrowserGo();
	});

	makeWindowDraggable(win, 'div:first-child');
	addWindowFocusListener(win);
}

function webosBrowserGo() {
	const addr = document.getElementById('webos-browser-address');
	if (!addr) return;
	webosBrowserOpenInSystemTab(addr.value);
}

function webosBrowserBack() {
	const iframe = document.getElementById('webos-browser-frame');
	if (!iframe?.contentWindow) return;
	try {
		iframe.contentWindow.history.back();
	} catch (_) {}
}

function webosBrowserHome() {
	const iframe = document.getElementById('webos-browser-frame');
	if (iframe) iframe.src = webosBrowserStartHref();
}

function webosBrowserReload() {
	const iframe = document.getElementById('webos-browser-frame');
	if (!iframe) return;
	try {
		iframe.contentWindow.location.reload();
	} catch (_) {
		iframe.src = webosBrowserStartHref();
	}
}

function minimizeBrowserWindow() {
	const w = document.getElementById('browser-window');
	if (w) w.style.display = 'none';
}

function maximizeBrowserWindow() {
	const w = document.getElementById('browser-window');
	if (!w) return;
	if (w.classList.contains('maximized')) {
		w.classList.remove('maximized');
		w.style.cssText =
			'position:absolute;left:72px;top:64px;width:min(920px,94vw);height:min(560px,calc(94vh - 10vh));min-width:360px;min-height:320px;display:flex;flex-direction:column;z-index:100;overflow:hidden;';
	} else {
		w.classList.add('maximized');
		w.style.cssText =
			'position:fixed;left:0;top:0;width:100%;height:calc(100vh - 7vh);display:flex;flex-direction:column;z-index:100;overflow:hidden;border-radius:0;box-shadow:none;';
	}
}

function closeBrowserWindow() {
	document.getElementById('browser-window')?.remove();
}

function webosAboutDialog() {
	alert(
		'Takumi WebOS\n\nNotepad and Browser data are stored in localStorage. Your session uses sessionStorage. Sign out clears the session and reloads the page.'
	);
}

function webosLogoutFromSettings() {
	if (typeof WebOSBackend !== 'undefined' && confirm('Sign out and return to login?')) {
		WebOSBackend.logout();
	}
}

function webosInitLogin() {
	const root = document.getElementById('webos-root');
	if (!root) {
		return;
	}

	window.addEventListener('message', (e) => {
		if (e.data && e.data.type === 'WEBOS_DISK_MUSIC' && typeof WebOSDisk !== 'undefined') {
			WebOSDisk.updateMusicState(e.data.payload);
		}
	});

	initializeFolderData();

	if (typeof WebOSBackend !== 'undefined' && WebOSBackend.isAuthenticated()) {
		homeScreen(root);
		return;
	}

	webosRenderLogin(root);
	queueMicrotask(() => {
		const u = root.querySelector('.webos-login-form input[name="username"]');
		if (u && typeof WebOSBackend !== 'undefined') {
			u.value = WebOSBackend.getSuggestedUsername();
		}
	});

	const form = root.querySelector('.webos-login-form');
	if (form) {
		form.addEventListener('submit', (e) => {
			e.preventDefault();
			const fd = new FormData(form);
			const username = fd.get('username');
			const password = fd.get('password');
			if (typeof WebOSBackend === 'undefined' || !WebOSBackend.login(username, password)) {
				alert('Enter a username (at least 2 characters) and a password.');
				return;
			}
			homeScreen(root);
		});
	}
}

window.addEventListener('load', webosInitLogin);

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
			<b>System Settings</b>
			<div style="display:flex;flex-wrap:wrap;gap:10px;margin-top:8px;">
				<button type="button" class="webos-btn-import" onclick="webosAboutDialog()">About</button>
				<button type="button" class="webos-btn-import" onclick="webosLogoutFromSettings()">Sign out</button>
			</div>
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
			<div class="webos-folder-item" onclick="openFolder('documents')">
				<div class="webos-folder-item-icon">TXT</div>
				<div class="webos-folder-item-name">Documents</div>
				<div class="webos-folder-item-count">${(folderData.documents || []).length} items</div>
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
		songs: [],
		documents: []
	};

	if (typeof WebOSDisk !== 'undefined') {
		const disk = WebOSDisk.load();
		if (!disk.fileManager && !localStorage.getItem('webos_file_manager')) {
			WebOSDisk.patch({ fileManager: defaultData });
			localStorage.setItem('webos_file_manager', JSON.stringify(defaultData));
		} else if (disk.fileManager && !localStorage.getItem('webos_file_manager')) {
			localStorage.setItem('webos_file_manager', JSON.stringify(disk.fileManager));
		} else if (disk.fileManager && !Array.isArray(disk.fileManager.documents)) {
			WebOSDisk.patch({ fileManager: { ...disk.fileManager, documents: [] } });
		}
	} else if (!localStorage.getItem('webos_file_manager')) {
		localStorage.setItem('webos_file_manager', JSON.stringify(defaultData));
	}
}

function loadFolderData() {
	initializeFolderData();
	let fm;
	if (typeof WebOSDisk !== 'undefined') {
		const disk = WebOSDisk.load();
		if (disk.fileManager) fm = disk.fileManager;
	}
	if (!fm) {
		try {
			fm = JSON.parse(localStorage.getItem('webos_file_manager') || '{}');
		} catch (_) {
			fm = {};
		}
	}
	return {
		photos: fm.photos || [],
		folder1: fm.folder1 || [],
		folder2: fm.folder2 || [],
		songs: fm.songs || [],
		documents: fm.documents || []
	};
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
	} else if (folderName === 'documents') {
		items.forEach((item) => {
			const itemEl = document.createElement('div');
			itemEl.style.cssText =
				'text-align: center; cursor: pointer; padding: 8px; border-radius: 4px; border: 1px solid #ddd; transition: all 0.2s; display: flex; flex-direction: column; align-items: center;';
			const icon = document.createElement('div');
			icon.style.cssText =
				'width: 100px; height: 100px; display: flex; align-items: center; justify-content: center; margin-bottom: 4px; border-radius: 4px; background: #049CD8; border: 3px solid #000; font-family: \"Press Start 2P\", monospace; font-size: 10px; color: #FBD000;';
			icon.textContent = 'TXT';
			const label = document.createElement('div');
			label.style.cssText = 'font-size: 11px; word-break: break-all; max-height: 40px; overflow: hidden; width: 100%;';
			label.textContent = item.name || 'Untitled';
			itemEl.appendChild(icon);
			itemEl.appendChild(label);
			itemEl.addEventListener('mouseenter', () => (itemEl.style.background = '#f0f0f0'));
			itemEl.addEventListener('mouseleave', () => (itemEl.style.background = 'transparent'));
			itemEl.addEventListener('dblclick', () => {
				if (item.id) openNotepadWindow(item.id);
			});
			content.appendChild(itemEl);
		});
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
			itemEl.addEventListener('mouseenter', () => (itemEl.style.background = '#f0f0f0'));
			itemEl.addEventListener('mouseleave', () => (itemEl.style.background = 'transparent'));
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
 