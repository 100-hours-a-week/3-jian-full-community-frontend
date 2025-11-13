// edit-post.js
import { getPostDetail, updatePost } from "../../api/post.js";
import { uploadProfileImage } from "../../api/user.js";

const titleInput = document.getElementById("title");
const contentInput = document.getElementById("content");
const imageInput = document.getElementById("image");
const submitBtn = document.querySelector(".submit-btn");
const backBtn = document.querySelector(".back-btn");

const titleHelper = document.getElementById("title-helper-text");
const contentHelper = document.getElementById("content-helper-text");

let imageUrls = [];         
let isTitleValid = false;
let isContentValid = false;

// ⭐⭐ 페이지 연동 이전 임시 포스트 ID
const TEMP_POST_ID = 152;

// --------------------------------------
// ⭐ DOM 로드되면 바로 조회 API 실행
// --------------------------------------
window.addEventListener("DOMContentLoaded", async () => {
  try {
    const post = await getPostDetail(TEMP_POST_ID);

    // 기존 데이터 세팅
    titleInput.value = post.title ?? "";
    contentInput.value = post.content ?? "";

    if (post.postImageUrls && Array.isArray(post.postImageUrls)) {
      imageUrls = [...post.postImageUrls];
    }

    // 초기 값으로 유효성 검사
    validateTitle();
    validateContent();
    updateSubmitButtonState();

  } catch (e) {
    console.error("게시글 조회 실패", e);
    alert("게시글 정보를 불러오지 못했습니다.");
  }
});

// --------------------------------------
// 제목 검증
// --------------------------------------
function validateTitle() {
  const title = titleInput.value.trim();

  if (title.length === 0) {
    titleHelper.textContent = "제목은 필수 입력입니다.";
    isTitleValid = false;
  } else if (title.length > 26) {
    titleHelper.textContent = "제목은 26자 이내여야 합니다.";
    isTitleValid = false;
  } else {
    titleHelper.textContent = "";
    isTitleValid = true;
  }
}

// --------------------------------------
// 내용 검증
// --------------------------------------
function validateContent() {
  const content = contentInput.value.trim();

  if (content.length === 0) {
    contentHelper.textContent = "내용은 필수 입력입니다.";
    isContentValid = false;
  } else {
    contentHelper.textContent = "";
    isContentValid = true;
  }
}

// input 이벤트 연결
titleInput.addEventListener("input", () => {
  validateTitle();
  updateSubmitButtonState();
});
contentInput.addEventListener("input", () => {
  validateContent();
  updateSubmitButtonState();
});

// --------------------------------------
// 이미지 업로드
// --------------------------------------
imageInput.addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
        const res = await uploadProfileImage(formData); // 문자열만 반환
        const postImageUrls = res.postImageUrls;
        if (postImageUrls && Array.isArray(postImageUrls)) {
            imageUrls = [];
            imageUrls = [...postImageUrls];
        }
    } catch (err) {
        console.error(err);
        alert("이미지 업로드 실패");
    }
});

// --------------------------------------
// 제출 버튼 활성화
// --------------------------------------
function updateSubmitButtonState() {
    if (isTitleValid && isContentValid) {
        submitBtn.disabled = false;
        submitBtn.classList.add("active");
        
    } else {
        submitBtn.disabled = true;
        submitBtn.classList.remove("active");
    }
}

// --------------------------------------
// 수정 요청
// --------------------------------------
submitBtn.addEventListener("click", async () => {
    if (!isTitleValid || !isContentValid) return;
        const title = titleInput.value.trim();
        const content = contentInput.value.trim();
        const postImageUrls = imageUrls;

    try {
        await updatePost(TEMP_POST_ID, title, content, postImageUrls);
        alert("게시글이 수정되었습니다!");
        
    } catch (e) {
        console.error(e);
        alert("게시글 수정 실패");
    }
});