import { checkNickname, uploadProfileImage, getProfile, editProfile, signout } from '../../api/user.js';
import { login } from '../../api/auth.js';

// ✅ DOM 요소 가져오기
const emailInput = document.getElementById('email');
const nicknameInput = document.getElementById('nickname');
const helperText = document.getElementById('nickname-helper-text');
const headerProfileImg = document.getElementById('profileToggle');
const profileImage = document.getElementById('profile-image');
const profilePreview = document.getElementById('profile-preview');
const profileEditBtn = document.getElementById('edit-photo-btn');
const editBtn = document.getElementById('edit-btn');
const deleteBtn = document.getElementById('text-btn');
const modal = document.getElementById('delete-modal');
const cancelBtn = document.getElementById('cancel-btn');
const confirmBtn = document.getElementById('confirm-btn');

// ✅ 초기 유효성 상태
let isValidNickname = true;
let profileImageUrl = null;

// ✅ 초기 데이터 설정 (백엔드에서 받아온 사용자 정보)
window.addEventListener('load', () => {
  loadUserProfile();
});

async function loadUserProfile() {
  try {
    const user = await getProfile();

    emailInput.value = user.email;
    emailInput.disabled = true;
    nicknameInput.value = user.nickname;
    profileImageUrl = user.profileImageUrl;
    profilePreview.style.backgroundImage = `url("${profileImageUrl}")`;
    headerProfileImg.src = profileImageUrl;

  } catch (e) {
    console.log('사용자 정보 불러오기 실패:', e);
  }
}

// ✅ 프로필 드롭다운
document.addEventListener("DOMContentLoaded", () => {
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
});

// ✅ 닉네임 실시간 유효성 검사
nicknameInput.addEventListener('blur', handleNicknameCheck);

async function handleNicknameCheck() {
    const nickname = nicknameInput.value.trim();

    if (!nickname) {
      helperText.textContent = '* 닉네임을 입력해주세요.';
      isValidNickname = false;
      return;

    } else if (nickname.includes(' ')) {
      helperText.textContent = '* 띄어쓰기를 없애주세요.';
      isValidNickname = false;
      return;

    } else if (nickname.length > 10) {
      helperText.textContent = '* 닉네임은 최대 10자까지 작성 가능합니다.';
      isValidNickname = false;
      return;

    } else if (!/^[가-힣a-zA-Z0-9]+$/.test(nickname)) {
      helperText.textContent = '* 닉네임은 한글, 영어, 숫자만 사용할 수 있습니다.';
      isValidNickname = false;
      return;
    } 

    try {
        const { isAvailable } = await checkNickname(nickname);
        if (!isAvailable) {
            helperText.textContent = '* 중복된 닉네임입니다.';
            isValidNickname = false;
        } else {
            helperText.textContent = '';
            isValidNickname = true;
        }

    } catch (e) {
        console.error(e);
        helperText.textContent = '* 닉네임 중복 확인 중 오류가 발생했습니다.';
        isValidNickname = false;
    }
}

// ✅ 프로필 사진 변경
profileEditBtn.addEventListener('click', () => profileImage.click());
profileImage.addEventListener('change', async (e) => handleProfileImageUpload(e));

async function handleProfileImageUpload(e) {
    e.preventDefault(); // 새로 고침 방지

    const helperText = document.getElementById('profile-helper-text');
    const image = e.target.files[0];

    if (!image) {
        profileImageUrl = null;
        helperText.textContent = '* 프로필 사진을 추가해주세요.';

        // + 아이콘 다시 표시
        profilePreview.style.backgroundImage = '';
        profilePreview.innerHTML = '<span class="plus-icon">+</span>';
        return;
    }

    const formData = new FormData();
    formData.append('image', image);
    try {
        const body = await uploadProfileImage(formData);

        helperText.textContent = '';
        console.log('업로드 성공:', body);
        profileImageUrl = body?.imageUrl ?? null;

        // 깔끔한 background-image 버전
        profilePreview.style.backgroundImage = `url(${body.imageUrl})`;
        profilePreview.querySelector('.plus-icon')?.remove(); // + 아이콘 제거

    } catch (e) {
        console.error(e);
        alert('업로드에 실패했습니다. 다시 시도해주세요.');
    }
}

// ✅ 프로필 저장
editBtn.addEventListener('click', async (e) => {
  e.preventDefault(); // 새로 고침 방지

  const nickname = nicknameInput.value.trim();

  if (!isValidNickname) return;

  try {
    await editProfile(nickname, profileImageUrl);
    headerProfileImg.src = profileImageUrl;
    console.log('프로필이 수정되었습니다.');

  } catch (e) {
    console.log(e);
    console.log('프로필 수정 실패. 다시 시도해주세요.');
  }
});

// 🔹 모달 열기
deleteBtn.addEventListener('click', () => {
  modal.style.display = 'flex';
});

// 🔹 닫기 (취소 버튼 / 배경 클릭)
cancelBtn.addEventListener('click', () => {
  modal.style.display = 'none';
});

modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.style.display = 'none';
  }
});

// 🔹 확인 버튼 클릭 시 처리
confirmBtn.addEventListener('click', async () => {
  try {
    await signout(); // 예시: 실제 회원탈퇴 API 호출
    console.log('회원탈퇴가 완료되었습니다.');

  } catch (err) {
    console.log('회원탈퇴 중 오류가 발생했습니다.');

  } finally {
    modal.style.display = 'none';
  }
});
