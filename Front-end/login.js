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

function webosInitLogin() {
	console.log("successful");
	const root = document.getElementById("webos-root");
	if (!root) {
		return;
	}

	// Check if already authenticated
	const token = localStorage.getItem('webos_token');
	if (token) {
		homeScreen(root);
		return;
	}

	// Show login screen
	webosRenderLogin(root);

	// Handle form submission
	const form = document.querySelector('.webos-login-form');
	if (form) {
		form.addEventListener('submit', async (e) => {
			e.preventDefault();
			
			const passwordInput = document.querySelector('input[name="password"]');
			const password = passwordInput.value;

			if (!password) {
				alert('Please enter a password');
				return;
			}

			// Validate against backend
			const result = await webosValidateLogin(password);

			if (result.success) {
				homeScreen(root);
			} else {
				alert('Login failed: ' + result.error);
			}
		});
	}
}

window.addEventListener("load", webosInitLogin);
 