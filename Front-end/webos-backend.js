/**
 * Client-side session + helpers layered on WebOSDisk (localStorage).
 */
const WebOSBackend = (function () {
	const SESSION_KEY = 'webos_session_authed';

	function isAuthenticated() {
		try {
			return sessionStorage.getItem(SESSION_KEY) === 'true';
		} catch (_) {
			return false;
		}
	}

	function login(username, password) {
		const u = (username || '').trim();
		const p = typeof password === 'string' ? password : '';
		if (u.length < 2 || p.length < 1) return false;
		sessionStorage.setItem(SESSION_KEY, 'true');
		if (typeof WebOSDisk !== 'undefined') {
			WebOSDisk.patch({
				auth: { ...(WebOSDisk.load().auth || {}), lastUsername: u, loggedInAt: Date.now() }
			});
		}
		return true;
	}

	function logout() {
		sessionStorage.removeItem(SESSION_KEY);
		if (typeof location !== 'undefined') location.reload();
	}

	function getSuggestedUsername() {
		if (typeof WebOSDisk === 'undefined') return '';
		try {
			return WebOSDisk.load().auth?.lastUsername || '';
		} catch (_) {
			return '';
		}
	}

	return { SESSION_KEY, isAuthenticated, login, logout, getSuggestedUsername };
})();
