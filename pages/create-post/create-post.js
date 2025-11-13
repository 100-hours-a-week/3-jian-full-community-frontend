import { uploadProfileImage } from "../../api/user.js"; // 네 프로젝트 로직에 맞게 수정
import { createPost } from "../../api/post.js";

// DOM 요소
const titleInput = document.getElementById("title");
const contentInput = document.getElementById("content");
const imageInput = document.getElementById("image");
const submitBtn = document.getElementById("submit-btn");

const titleHelper = document.getElementById('title-helper-text');
const contentHelper = document.getElementById('content-helper-text');

let imageUrls = [];  // 업로드된 이미지들

let isTitleValid = false;
let isContentValid = false;

// --------------------------------------------------------------------
// ⭐ 제목 검증
// --------------------------------------------------------------------
titleInput.addEventListener('blur', () => {
  const title = titleInput.value.trim();

  if (title.length === 0) {
    titleHelper.textContent = "제목은 필수 입력입니다.";
    isTitleValid = false;
  }
  else if (title.length > 26) {
    titleHelper.textContent = "제목은 최대 26글자까지 입력 가능합니다.";
    isTitleValid = false;
  }
  else {
    titleHelper.textContent = "";
    isTitleValid = true;
  }

  updateSubmitButtonState();
});

// --------------------------------------------------------------------
// ⭐ 내용 검증
// --------------------------------------------------------------------
contentInput.addEventListener('blur', () => {
  const content = contentInput.value.trim();

  if (content.length === 0) {
    contentHelper.textContent = "내용은 필수 입력입니다.";
    isContentValid = false;
  }
  else {
    contentHelper.textContent = "";
    isContentValid = true;
  }

  updateSubmitButtonState();
});

// --------------------------------------------------------------------
// ⭐ 이미지 업로드
// (프로필 업로드와 동일한 로직 재사용 — 서버에서 URL 반환한다고 가정)
// --------------------------------------------------------------------
imageInput.addEventListener("change", async (event) => {
  const image = event.target.files[0];
  if (!image) return;

  const formData = new FormData();
  formData.append('image', image);

  try {
    const res = await uploadProfileImage(formData); // 서버가 업로드 후 URL 반환한다고 가정
    imageUrls.push(res.imageUrl);
    console.log("업로드 성공: ", res.imageUrl);

  } catch (e) {
    console.error("이미지 업로드 실패: ", e);
  }
});

// --------------------------------------------------------------------
// ⭐ 작성 버튼 활성화 / 비활성화
// --------------------------------------------------------------------
function updateSubmitButtonState() {
  if (isTitleValid && isContentValid) {
    submitBtn.disabled = false;
    submitBtn.classList.add("active");

  } else {
    submitBtn.disabled = true;
    submitBtn.classList.remove("active");
  }
}

// --------------------------------------------------------------------
// ⭐ 작성 완료 버튼 클릭 → 서버로 POST
// --------------------------------------------------------------------
submitBtn.addEventListener("click", async () => {
  if (!isTitleValid || !isContentValid) return;

  const title = titleInput.value.trim();
  const content = contentInput.value.trim();

  try {
    await createPost(title, content, imageUrls);
    alert("게시글이 성공적으로 등록되었습니다!");
    //window.location.href = "/board/board.html";

  } catch (e) {
    alert("게시글 등록 실패");
    console.error(e);
  }
});
