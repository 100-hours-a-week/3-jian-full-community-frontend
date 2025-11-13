export function LoginView() {
  return `
    <main class="login-container">
      <section class="login-card">
        <h2 class="login-title">로그인</h2>

        <form id="loginForm" class="login-form">

          <div class="form-group">
            <label for="email">이메일</label>
            <input id="email" type="email" placeholder="이메일을 입력하세요" />
            <p id="email-helper-text" class="helper-text"></p>
          </div>

          <div class="form-group">
            <label for="password">비밀번호</label>
            <input id="password" type="password" placeholder="비밀번호를 입력하세요" />
            <p id="password-helper-text" class="helper-text"></p>
          </div>

          <button type="submit" id="login-btn" class="login-btn" disabled>로그인</button>
          <button type="button" id="signup-btn" class="text-btn">회원가입</button>

        </form>
      </section>
    </main>
  `;
}
