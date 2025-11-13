import { updatePassword } from '../../api/user.js';

const passwordForm = document.getElementById('password-form');
const oldPasswordInput = document.getElementById('old-password');
const newPasswordInput = document.getElementById('new-password');
const confirmNewPasswordInput = document.getElementById('confirm-new-password');
const submitBtn = document.getElementById('edit-btn');

let isValidNewPassword = false;
let isValidConfirmPassword = false;

// 이벤트 리스너 등록
passwordForm.addEventListener('submit', (e) => handleSubmit(e));
oldPasswordInput.addEventListener('blur', (e) => handleOldPasswordCheck(e));
newPasswordInput.addEventListener('blur', (e) => handleNewPasswordCheck(e));
confirmNewPasswordInput.addEventListener('blur', (e) => handlePasswordConfirm(e));

/* -------------------------------
 *  비밀번호 변경 요청 처리
 * ------------------------------- */
async function handleSubmit(e) {
  e.preventDefault();

  const oldPassword = oldPasswordInput.value.trim();
  const newPassword = newPasswordInput.value.trim();
  const helperText = document.getElementById('old-password-helper-text');

  // 유효성 검사 실패 시 제출 금지
  if (!isValidNewPassword || !isValidConfirmPassword) return;

  try {
    await updatePassword(oldPassword, newPassword);
    console.log('비밀번호가 성공적으로 변경되었습니다.');

  } catch (e) {
    helperText.textContent = '* 비밀번호를 다시 입력해주세요.';
    console.log('비밀번호 변경 실패:', e.message);
  }
}

function handleOldPasswordCheck(e) {
    e.preventDefault();

    const oldPassword = oldPasswordInput.value.trim();
    const helperText = document.getElementById('old-password-helper-text');

    if (!oldPassword) {
        helperText.textContent = '* 비밀번호를 입력해주세요.';
    }
    updateSubmitButtonState();
}

/* -------------------------------
 *  비밀번호 형식 검사
 * ------------------------------- */
function handleNewPasswordCheck(e) {
  e.preventDefault();

  const newPassword = newPasswordInput.value.trim();
  const confirmNewPassword = confirmNewPasswordInput.value.trim();
  const helperText = document.getElementById('new-password-helper-text');

  if (!newPassword) {
    helperText.textContent = '* 비밀번호를 입력해주세요.';
    isValidNewPassword = false;

  } else if (!/^(?=.*[A-Za-z])(?=.*\d).{8,20}$/.test(newPassword)) {
    helperText.textContent = '* 비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.';
    isValidNewPassword = false;

  } else if (newPassword !== confirmNewPassword) {
    helperText.textContent = '* 비밀번호 확인과 다릅니다.';
    isValidNewPassword = false;

  } else {
    helperText.textContent = '';
    isValidNewPassword = true;
  }
  updateSubmitButtonState();
}

/* -------------------------------
 *  비밀번호 확인 검사
 * ------------------------------- */
function handlePasswordConfirm(e) {
  e.preventDefault();

  const newPassword = newPasswordInput.value.trim();
  const confirmNewPassword = confirmNewPasswordInput.value.trim();
  const newPasswordHelperText = document.getElementById('new-password-helper-text');
  const confirmNewPasswordHelperText = document.getElementById('confirm-new-password-helper-text');

  if (!confirmNewPassword) {
    confirmNewPasswordHelperText.textContent = '* 비밀번호를 한번 더 입력해주세요.';
    isValidConfirmPassword = false;

  } else if (newPassword !== confirmNewPassword) {
    confirmNewPasswordHelperText.textContent = '* 비밀번호와 다릅니다.';
    isValidConfirmPassword = false;

  } else {
    confirmNewPasswordHelperText.textContent = '';
    isValidConfirmPassword = true;

    newPasswordHelperText.textContent = '';
    isValidNewPassword = true;
  }
  updateSubmitButtonState();
}

/* -------------------------------
 *  버튼 활성화 / 비활성화
 * ------------------------------- */
function updateSubmitButtonState() {
    console.log('valid?', isValidNewPassword, isValidConfirmPassword);
  if (isValidNewPassword && isValidConfirmPassword) {
    submitBtn.disabled = false;
    submitBtn.classList.add('active');

  } else {
    submitBtn.disabled = true;
    submitBtn.classList.remove('active');
  }
}
