import { state, setUser } from '../state.js';
import { navigate } from '../router.js';
import { logout } from '../api/user.js';

export function renderHeader() {
  const header = document.getElementById('header');

  header.innerHTML = `
    <header class="page-header">
        <div class="header-inner">
            <h1 class="page-title">아무 말 대잔치</h1>

            <!-- 우측 프로필 및 드롭다운 -->
            <div class="profile-menu">
                <img 
                  src="${state.user?.profileImageUrl ?? './assets/default-profile.png'}" 
                  class="profile-icon" 
                  id="profileToggle" 
                />

                <ul class="dropdown" id="dropdownMenu">
                    <li><a href="#" id="menu-edit-profile">회원정보수정</a></li>
                    <li><a href="#" id="menu-edit-password">비밀번호수정</a></li>
                    <li><a href="#" id="menu-logout">로그아웃</a></li>
                </ul>
            </div>
        </div>
        <hr class="divider" />
    </header>
  `;

  /*
    드롭다운 토글
  */
  const toggle = document.getElementById("profileToggle");
  const menu = document.getElementById("dropdownMenu");

  toggle.addEventListener("click", (e) => {
    e.stopPropagation();
    menu.classList.toggle("show");
  });

  document.addEventListener("click", (e) => {
    if (!toggle.contains(e.target) && !menu.contains(e.target)) {
      menu.classList.remove("show");
    }
  });

  /*
    드롭다운 메뉴
  */
  document.getElementById('menu-edit-profile')
    .addEventListener('click', () => navigate('/edit-profile'));

  document.getElementById('menu-edit-password')
    .addEventListener('click', () => navigate('/edit-password'));

  document.getElementById('menu-logout')
    .addEventListener('click', async () => {
        try {
            await logout();
            setUser(null);            // 상태 초기화
            navigate('/login');       // 로그인 페이지로 이동

        } catch (e) {
            console.log('로그아웃 실패:', e);
        }
    });
}
