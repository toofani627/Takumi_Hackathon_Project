// ========================
// Apps Registry - Future-proof app management
// ========================
const webosApps = [
	{ id: 'camera', label: 'Camera', icon: 'Assets/images/camera.png', openFn: 'openCameraWindow' },
	{ id: 'file-manager', label: 'File Manager', icon: 'Assets/images/file_manager.png', openFn: 'openFileManagerWindow' },
	{ id: 'music', label: 'Music', icon: 'Assets/images/Music.png', openFn: 'openMusicWindow' },
	{ id: 'settings', label: 'Settings', icon: 'Assets/images/settings.png', openFn: 'openSettingsWindow' },
	{ id: 'recycle-bin', label: 'Recycle Bin', icon: 'Assets/images/recycle-bin.png', openFn: 'openRecycleBin' }
];

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

// Validate login against backend API
async function webosValidateLogin(password) {
	try {
		console.log("Attempting login with password:", password);
		
		const response = await fetch('http://localhost:5000/auth_gate', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ password: password })
		});

		console.log("Response status:", response.status);
		const data = await response.json();
		console.log("Response data:", data);

		if (data.authorized === true) {
			// Store token for future API calls
			localStorage.setItem('webos_token', data.token);
			localStorage.setItem('webos_ui_config', data.ui_config);
			console.log("Login successful");
			return { success: true, token: data.token };
		} else {
			console.log("Login failed:", data.msg || data.err || 'Unknown error');
			return { success: false, error: data.msg || data.err || 'Authentication failed' };
		}
	} catch (error) {
		console.error('Auth error:', error);
		return { success: false, error: 'Connection error: ' + error.message };
	}
}

function homeScreen(root) {
	root.innerHTML = `
		<section class="webos-home-screen">
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
				</div>			<div class="webos-taskbar-item" data-label="Music">
				<img src="Assets/images/Music.png" alt="Music" class="webos-taskbar-icon">
				<span class="webos-taskbar-tooltip">Music</span>
			</div>				<div class="webos-taskbar-item" data-label="Recycle Bin">
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
			<div style="font-size: 11px; color: white; text-shadow: 1px 1px 2px rgba(0,0,0,0.5); max-width: 80px; word-break: break-word;">${app.label}</div>
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
	menu.style.cssText = 'position: fixed; left: 20px; bottom: 110px; width: 300px; background: #F0F0F0; border: 2px solid #333; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.3); z-index: 9999; display: flex; flex-direction: column;';
	
	const title = document.createElement('div');
	title.style.cssText = 'background: linear-gradient(90deg, #0078D4 0%, #50E6FF 100%); color: white; padding: 12px; font-weight: bold; border-bottom: 1px solid #ddd;';
	title.innerHTML = 'Apps';
	menu.appendChild(title);
	
	const content = document.createElement('div');
	content.style.cssText = 'max-height: 400px; overflow-y: auto; padding: 8px;';
	
	webosApps.forEach(app => {
		const item = document.createElement('div');
		item.style.cssText = 'display: flex; align-items: center; gap: 12px; padding: 8px; cursor: pointer; border-radius: 4px; transition: 0.2s;';
		item.innerHTML = `<img src="${app.icon}" style="width: 32px; height: 32px;"><span>${app.label}</span>`;
		item.addEventListener('mouseenter', () => item.style.background = '#E0E0E0');
		item.addEventListener('mouseleave', () => item.style.background = 'transparent');
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
	const appsArea = document.querySelector('.webos-apps-area');
	const win = document.createElement('div');
	win.id = 'music-window';
	win.className = 'webos-music-window';
	win.style.cssText = 'position: absolute; left: 50px; top: 80px; width: 900px; height: 600px; background: #F5E6D3; border: 3px solid #333; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.3); display: flex; flex-direction: column; z-index: 100;';
	win.innerHTML = `
		<div style="background: linear-gradient(135deg, #E91E63 0%, #9C27B0 100%); color: white; padding: 12px; font-weight: bold; border-bottom: 2px solid #7B1FA2; display: flex; justify-content: space-between; align-items: center;">
			<span>🍄 Mario's Music Player 🍄</span>
			<div style="display: flex; gap: 4px;">
				<button class="webos-settings-btn" onclick="minimizeMusicWindow()" style="background: #E91E63; width: 30px; height: 30px;">_</button>
				<button class="webos-settings-btn" onclick="maximizeMusicWindow()" style="background: #C2185B; width: 30px; height: 30px;">☐</button>
				<button class="webos-settings-btn" onclick="closeMusicWindow()" style="background: #FF6B6B; width: 30px; height: 30px;">×</button>
			</div>
		</div>
		<iframe id="mario-player-frame" src="mario-music-player.html" style="flex: 1; border: none; border-radius: 0 0 8px 8px; width: 100%;"></iframe>
	`;
	appsArea.appendChild(win);
	makeWindowDraggable(win, 'div:first-child');
	addWindowFocusListener(win);
}

function minimizeMusicWindow() {
	const win = document.getElementById('music-window');
	if (win) win.style.display = win.style.display === 'none' ? 'flex' : 'none';
}

function maximizeMusicWindow() {
	const win = document.getElementById('music-window');
	if (!win) return;
	if (win.classList.contains('maximized')) {
		win.classList.remove('maximized');
		win.style.cssText = 'position: absolute; left: 50px; top: 80px; width: 900px; height: 600px; background: #F5E6D3; border: 3px solid #333; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.3); display: flex; flex-direction: column; z-index: 100;';
	} else {
		win.classList.add('maximized');
		win.style.cssText = 'position: fixed; left: 0; top: 0; width: 100%; height: calc(100vh - 7vh); border: none; box-shadow: none; border-radius: 0; display: flex; flex-direction: column; z-index: 100;';
	}
}

function closeMusicWindow() {
	document.getElementById('music-window')?.remove();
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
}

window.addEventListener("load", webosInitLogin);

// Settings Window Functions
function openSettingsWindow() {
	const appsArea = document.querySelector('.webos-apps-area');
	const win = document.createElement('div');
	win.id = 'settings-window';
	win.className = 'webos-settings-window';
	win.style.cssText = 'left: 100px; top: 100px; width: 420px; z-index: 100;';
	win.innerHTML = `
		<div class="webos-settings-titlebar">
			<span>Settings</span>
			<div class="webos-settings-buttons">
				<button class="webos-settings-btn" onclick="minimizeSettingsWindow()">_</button>
				<button class="webos-settings-btn" onclick="maximizeSettingsWindow()">☐</button>
				<button class="webos-settings-btn" onclick="closeSettingsWindow()" style="background: #FF6B6B;">×</button>
			</div>
		</div>
		<div class="webos-settings-content">
			<b>Display Settings</b>
			<div class="webos-settings-label-group">
				<label class="webos-settings-label">Brightness</label>
				<input type="range" min="0" max="100" value="75" class="webos-settings-slider" onchange="updateSliderValue(this)">
				<span class="webos-settings-value" id="brightness-val">75%</span>
			</div>
			<div class="webos-settings-label-group">
				<label class="webos-settings-label">Resolution</label>
				<input type="range" min="1" max="5" value="3" class="webos-settings-slider" onchange="updateSliderValue(this)">
				<span class="webos-settings-value" id="resolution-val">1920x1080</span>
			</div>
			<br>
			<b>Audio Settings</b><br>Volume | Device<br><br>
			<b>System Settings</b><br>About | Logout
		</div>
	`;
	appsArea.appendChild(win);
	makeWindowDraggable(win, '.webos-settings-titlebar');
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
		win.style.cssText = 'position: absolute; left: 100px; top: 100px; width: 420px; height: auto;';
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
	} else if (label === 'Resolution') {
		const resolutions = ['1024x768', '1280x720', '1920x1080', '2560x1440', '3840x2160'];
		valueSpan.textContent = resolutions[slider.value - 1];
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
			<span class="webos-camera-titlebar-text">📷 Camera</span>
			<div class="webos-camera-titlebar-buttons">
				<button class="webos-settings-btn" onclick="minimizeCameraWindow()" style="background: #00BCD4;">_</button>
				<button class="webos-settings-btn" onclick="maximizeCameraWindow()" style="background: #0097A7;">☐</button>
				<button class="webos-settings-btn" onclick="closeCameraWindow()" style="background: #FF6B6B;">×</button>
			</div>
		</div>
		<div class="webos-camera-content">
			<video id="camera-video" width="448" height="230" style="border: 3px solid #000; border-radius: 8px; margin-bottom: 12px; object-fit: cover; background: linear-gradient(135deg, #0288D1 0%, #00BCD4 50%, #00E5FF 100%);" autoplay playsinline></video>
			<div style="display: flex; gap: 8px; width: 100%; justify-content: center;">
				<button class="webos-settings-btn" onclick="captureAndSavePhoto()" style="background: #0097A7; flex: 1;">Take Photo</button>
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
					document.getElementById('camera-status').style.color = '#049CD8';
				}
			})
			.catch(error => {
				console.error('Camera error:', error);
				document.getElementById('camera-status').textContent = 'Camera not available';
				document.getElementById('camera-status').style.color = '#FF6B6B';
			});
	} else {
		document.getElementById('camera-status').textContent = 'Camera not supported';
		document.getElementById('camera-status').style.color = '#FF6B6B';
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
			<span class="webos-file-manager-titlebar-text">📁 File Manager</span>
			<div class="webos-file-manager-titlebar-buttons">
				<button class="webos-settings-btn" onclick="minimizeFileManagerWindow()" style="background: #43B047;">_</button>
				<button class="webos-settings-btn" onclick="maximizeFileManagerWindow()" style="background: #388E3C;">☐</button>
				<button class="webos-settings-btn" onclick="closeFileManagerWindow()" style="background: #FF6B6B;">×</button>
			</div>
		</div>
		<div class="webos-file-manager-content">
			<div class="webos-folder-item" onclick="openFolder('photos')">
				<div class="webos-folder-item-icon">📷</div>
				<div class="webos-folder-item-name">Photos</div>
				<div class="webos-folder-item-count">${folderData.photos.length} items</div>
			</div>
			<div class="webos-folder-item" onclick="openFolder('folder1')">
				<div class="webos-folder-item-icon">📂</div>
				<div class="webos-folder-item-name">Folder 1</div>
				<div class="webos-folder-item-count">${folderData.folder1.length} items</div>
			</div>
			<div class="webos-folder-item" onclick="openFolder('folder2')">
				<div class="webos-folder-item-icon">📂</div>
				<div class="webos-folder-item-name">Folder 2</div>
				<div class="webos-folder-item-count">${folderData.folder2.length} items</div>
			</div>
			<div class="webos-folder-item" onclick="openFolder('songs')">
				<div class="webos-folder-item-icon">🎵</div>
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
	
	if (!localStorage.getItem('webos_file_manager')) {
		localStorage.setItem('webos_file_manager', JSON.stringify(defaultData));
	}
}

function loadFolderData() {
	initializeFolderData();
	const data = localStorage.getItem('webos_file_manager');
	return JSON.parse(data || '{"photos":[],"folder1":[],"folder2":[],"songs":[]}');
}

function saveFolderData(data) {
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
	document.getElementById('camera-status').textContent = `✓ Photo saved to Photos folder`;
	document.getElementById('camera-status').style.color = '#4CAF50';
	
	// Reset after 2 seconds
	setTimeout(() => {
		document.getElementById('camera-status').textContent = 'Camera ready';
		document.getElementById('camera-status').style.color = '#049CD8';
	}, 2000);
}

function openPhotoViewer(photo) {
	const viewer = document.createElement('div');
	viewer.className = 'webos-photo-viewer';
	viewer.style.cssText = 'position: fixed; left: 0; top: 0; width: 100%; height: 100%; background: #000; z-index: 10000; display: flex; align-items: center; justify-content: center;';
	viewer.innerHTML = `
		<div style="position: relative; width: 90%; height: 90%; display: flex; align-items: center; justify-content: center;">
			<img src="${photo.data}" style="max-width: 100%; max-height: 100%; object-fit: contain;">
			<button onclick="this.closest('.webos-photo-viewer').remove()" style="position: absolute; top: 20px; right: 20px; background: #FF6B6B; color: white; border: none; width: 40px; height: 40px; cursor: pointer; border-radius: 50%; font-size: 20px;">×</button>
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
	folderWindow.style.cssText = 'position: absolute; left: 150px; top: 150px; width: 600px; height: 450px; background: #fff; border: 3px solid #333; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.3); display: flex; flex-direction: column; z-index: 100;';
	
	const titlebar = document.createElement('div');
	titlebar.style.cssText = 'background: linear-gradient(135deg, #43B047 0%, #388E3C 100%); color: white; padding: 10px; font-weight: bold; border-bottom: 2px solid #2e7d32; display: flex; justify-content: space-between; align-items: center; cursor: move;';
	titlebar.innerHTML = `
		<span>📁 ${folderName.charAt(0).toUpperCase() + folderName.slice(1)}</span>
		<button onclick="this.closest('.webos-folder-view-window').remove()" style="background: #FF6B6B; color: white; border: none; width: 30px; height: 30px; cursor: pointer; border-radius: 4px;">×</button>
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
 