import { checkEmail, checkNickname, uploadProfileImage, signup } from '../../api/user.js';

const signupForm = document.getElementById('signupForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirm-password');
const nicknameInput = document.getElementById('nickname');
const profileImage = document.getElementById('profileImage');
const profilePreview = document.getElementById('profilePreview');

let isValidEmail = false;
let isValidPassword = false;
let isValidConfirmPassword = false;
let isValidNickname = false;
let profileImageUrl = null;

signupForm.addEventListener('submit', (e) => handleSignup(e));
emailInput.addEventListener('blur', async (e) => handleEmailCheck(e));
passwordInput.addEventListener('blur', (e) => handlePasswordCheck(e));
confirmPasswordInput.addEventListener('blur', (e) => handlePasswordConfirm(e));
nicknameInput.addEventListener('blur', async (e) => handleNicknameCheck(e));
profilePreview.addEventListener('click', () => profileImage.click());
profileImage.addEventListener('change', async (e) => handleProfileImageUpload(e));

async function handleSignup(e) {
    e.preventDefault(); // 새로 고침 방지

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    const nickname = nicknameInput.value.trim();
    const helperText = document.getElementById('profile-helper-text');

    // 유효성 검사
    if (profileImageUrl === null) {
        helperText.textContent = '* 프로필 사진을 추가해주세요.';
        return;
    }
    if (!isValidEmail || !isValidPassword || !isValidConfirmPassword || !isValidNickname) {
        return;
    }

    try {
        const user = await signup(email, password, nickname, profileImageUrl);
    } catch (e) {
        console.log('회원가입 실패: ', e.message);
    }
}

async function handleEmailCheck(e) {
    e.preventDefault(); // 새로 고침 방지

    const email = emailInput.value.trim();
    const helperText = document.getElementById('email-helper-text');

    // 형식 검사
    if (!email) {
        helperText.textContent = '* 이메일을 입력해주세요.';
        isValidEmail = false;

    } else if (!/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,15}/.test(email)) {
        helperText.textContent = '* 올바른 이메일 주소 형식을 입력해주세요. (예: example@example.com)';
        isValidEmail = false;
        return;
    }

    try {
        const { isAvailable } = await checkEmail(email);
        if (!isAvailable) {
            helperText.textContent = '* 중복된 이메일입니다.';
            isValidEmail = false;
        } else {
            helperText.textContent = '';
            isValidEmail = true;
        }

    } catch (e) {
        console.error(e);
        isValidEmail = false;
    }
    updateSubmitButtonState();
}

async function handlePasswordCheck(e) {
    e.preventDefault(); // 새로 고침 방지

    const password = passwordInput.value.trim();
    const helperText = document.getElementById('password-helper-text');

    if (!password) {
        helperText.textContent = '* 비밀번호를 입력해주세요.';
        isValidPassword = false;

    } else if (!/^(?=.*[A-Za-z])(?=.*\d).{8,20}$/.test(password)) {
        helperText.textContent = '* 비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.';
        isValidPassword = false;

    } else {
        helperText.textContent = '';
        isValidPassword = true;
    }
    updateSubmitButtonState();
}

async function handlePasswordConfirm(e) {
    e.preventDefault(); // 새로 고침 방지

    const password = passwordInput.value.trim();
    const confirmPassword = confirmPasswordInput.value.trim();
    const helperText = document.getElementById('confirm-password-helper-text');

    if (!confirmPassword) {
        helperText.textContent = '* 비밀번호를 한번 더 입력해주세요.';
        isValidPassword = false;

    } else if (password !== confirmPassword) {
        helperText.textContent = '* 비밀번호가 다릅니다.';
        isValidConfirmPassword = false;

    } else {
        helperText.textContent = '';
        isValidConfirmPassword = true;
    }
    updateSubmitButtonState();
}

async function handleNicknameCheck(e) {
    e.preventDefault(); // 새로 고침 방지

    const nickname = nicknameInput.value.trim();
    const helperText = document.getElementById('nickname-helper-text');

    // 형식 검사
    if (!nickname) {
        helperText.textContent = '* 닉네임을 입력해주세요.';
        isValidNickname = false;
        return;
    }

    if (nickname.includes(' ')) {
        helperText.textContent = '* 띄어쓰기를 없애주세요.';
        isValidNickname = false;
        return;
    }

    if (nickname.length > 10) {
        helperText.textContent = '* 닉네임은 최대 10자까지 작성 가능합니다.';
        isValidNickname = false;
        return;
    }

    if (!/^[가-힣a-zA-Z0-9]+$/.test(nickname)) {
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
        isValidNickname = false;
    }
    updateSubmitButtonState();
}

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
    updateSubmitButtonState();
}

function updateSubmitButtonState() {
  const submitBtn = document.getElementById('signup-btn');

  const allValid =
    isValidEmail &&
    isValidPassword &&
    isValidConfirmPassword &&
    isValidNickname &&
    profileImageUrl !== null;

  if (allValid) {
    submitBtn.disabled = false;
    submitBtn.classList.add('active');

  } else {
    submitBtn.disabled = true;
    submitBtn.classList.remove('active');
  }
}