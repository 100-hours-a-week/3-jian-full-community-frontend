import { LoginPage } from './views/login.js';
import { SignupPage } from './views/signup.js'
import { EditProfilePage } from './views/editProfile.js';

const routes = {
  '/': LoginPage,
  '/login': LoginPage,
  '/signup': SignupPage,
  '/edit-profile': EditProfilePage,
};

export function navigate(path) {
  window.history.pushState({}, '', path);
  renderRoute(path);
}

export function initRouter() {
  // 뒤로 가기 / 앞으로 가기 지원
  window.addEventListener('popstate', () => {
    renderRoute(window.location.pathname);
  });

  renderRoute(window.location.pathname);
}

function renderRoute(path) {
  const view = routes[path] ?? LoginPage; 
  document.getElementById('app').innerHTML = view();
}