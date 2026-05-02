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
					<span class="webos-taskbar-search-text">Search</span>
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
			</div>
		</section>
	`;
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
 