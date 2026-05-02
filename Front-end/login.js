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

function webosValidateLogin(username, password) {
	const sampleCredentials = {
		username: "12",
		password: "12"
	};
	return username === sampleCredentials.username && password === sampleCredentials.password;
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
	homeScreen(root);
}

window.addEventListener("load", webosInitLogin);
 