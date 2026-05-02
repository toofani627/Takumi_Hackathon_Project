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
			<div class="webos-taskbar"></div>
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
 