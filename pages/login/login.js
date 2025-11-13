import { login } from '../../api/auth.js';

const form = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');

let isValidEmail = false;
let isValidPassword = false;

form.addEventListener('submit', async (e) => handleLogin(e));
emailInput.addEventListener('blur', (e) => handleEmailCheck(e));
passwordInput.addEventListener('blur', (e) => handlePasswordCheck(e));

async function handleLogin(e) {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    const helperText = document.getElementById('password-helper-text');
    
    if (!isValidEmail || !isValidPassword) {
        return;
    }

    try {
        const user = await login(email, password);
    } catch (e) {
        helperText.textContent = '* 아이디 또는 비밀번호를 확인해주세요.';
        console.log('로그인 실패: ', e.message);
    }
}

function handleEmailCheck(e) {
    e.preventDefault(); // 새로 고침 방지

    const email = emailInput.value.trim();
    const helperText = document.getElementById('email-helper-text');

    if (!email) {
        helperText.textContent = '* 이메일을 입력해주세요.';
        isValidEmail = false;

    } else if (!/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,15}/.test(email)) {
        helperText.textContent = '* 올바른 이메일 주소 형식을 입력해주세요. (예: example@example.com)';
        isValidEmail = false;

    } else {
        helperText.textContent = '';
        isValidEmail = true;
    }
}

function handlePasswordCheck(e) {
    e.preventDefault(); // 새로 고침 방지

    const password = passwordInput.value.trim();
    const helperText = document.getElementById('password-helper-text');

    if (!password) {
        helperText.textContent = '* 비밀번호를 입력해주세요.';
        isValidPassword = false;

    } else if (!/^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(password)) {
        helperText.textContent = '* 비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.';
        isValidPassword = false;

    } else {
        helperText.textContent = '';
        isValidPassword = true;
    }
}