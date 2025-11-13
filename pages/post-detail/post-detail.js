// post-detail.js
import { getPostDetail, deletePost, likePost, unlikePost } from "../../api/post.js";
import { getComments, createComment, updateComment, deleteComment } from "../../api/comment.js";

const POST_ID = 103; // 임시 고정 ID

// 요소 선택
const titleEl = document.querySelector(".post-title");
const writerNameEl = document.querySelector(".writer-name");
const writerProfileEl = document.querySelector(".profile-circle");
const dateEl = document.querySelector(".post-date");
const contentEl = document.querySelector(".post-content");
const postImageEl = document.querySelector(".post-image");

const viewCountEl = document.querySelector(".post-stats .stat-box:nth-child(2)");
const commentCountEl = document.querySelector(".post-stats .stat-box:nth-child(3)");

const commentTextarea = document.querySelector(".comment-write textarea");
const commentSubmitBtn = document.querySelector(".comment-submit");

const commentListEl = document.querySelector(".comment-list");

const editBtn = document.querySelector(".post-header-right .edit-btn");
const deleteBtn = document.querySelector(".post-header-right .delete-btn");
const likeBox = document.querySelector(".like-box");
const likeCountText = document.querySelector(".like-count");


// 모달
const postDeleteModal = document.getElementById('post-delete-modal');
const postDeleteCancelBtn = document.getElementById('post-delete-cancel-btn');
const postDeleteConfirmBtn = document.getElementById('post-delete-confirm-btn');

let deletingPost = false;

let commentCursor = null;
let commentHasNext = true;
let commentIsLoading = false;

let isLiked = false; // 서버에서 가져와야 함
let likeCount = 0;   // 서버 값

window.addEventListener('DOMContentLoaded', async () => {
  await loadPostDetail();
});

window.addEventListener('scroll', () => {
    const scrollTop = document.documentElement.scrollTop;
    const viewportHeight = window.innerHeight;
    const fullHeight = document.documentElement.scrollHeight;


    // 화면 끝 200px 전이면 다음 페이지 불러오기
    if (scrollTop + viewportHeight >= fullHeight - 200) {
        loadMoreComments();
    }
});

// 📌 날짜 포맷
function formatDate(dateTime) {
  if (!dateTime) return "";
  return dateTime.replace("T", " ").split(".")[0];
}

// 📌 상세 조회
async function loadPostDetail() {
  try {
    const post = await getPostDetail(POST_ID);

    // 제목 / 작성자 / 시간
    titleEl.textContent = post.title;
    writerNameEl.textContent = post.writerNickname;
    dateEl.textContent = formatDate(post.createdAt);

    // 작성자 프로필
    if (post.writerProfileImageUrl) {
      writerProfileEl.style.backgroundImage = `url(${post.writerProfileImageUrl})`;
      writerProfileEl.style.backgroundSize = "cover";
    }

    // 내용
    contentEl.textContent = post.content;

    // 이미지 1개만 표시
    if (post.postImageUrls && post.postImageUrls.length > 0) {
      postImageEl.src = post.postImageUrls[0];
    } else {
      postImageEl.style.display = "none";
    }

    // 통계값
    likeCount = post.likeCount;
    likeCountText.textContent = likeCount;

    isLiked = post.isLiked; // ← API가 isLiked 제공한다고 가정
    updateLikeButtonUI();

    viewCountEl.innerHTML = `${post.viewCount}<br/><span>조회수</span>`;
    commentCountEl.innerHTML = `${post.commentCount}<br/><span>댓글수</span>`;

    // 댓글 렌더링
    const preview = post.commentsPreview;
    commentCursor = preview.nextCursor;
    commentHasNext = preview.hasNext;
    commentListEl.innerHTML = "";
    renderComments(preview.items);

  } catch (e) {
    console.error(e);
    alert("게시글을 불러오지 못했습니다.");
  }
}

function updateLikeButtonUI() {
    likeCountText.textContent = likeCount;

    if (isLiked) {
        likeBox.classList.add("disabled");
        likeBox.classList.remove("enabled");

    } else {
        likeBox.classList.add("enabled");
        likeBox.classList.remove("disabled");
    }
}


likeBox.addEventListener("click", async () => {
    if (!isLiked) {
        try {
            const res = await likePost(POST_ID); // → 좋아요 API 요청
            isLiked = true;
            likeCount += 1;

        } catch (e) {
            console.error("좋아요 실패", e);
        }
    } else {
        try {
            const res = await unlikePost(POST_ID); // → 좋아요 API 요청
            isLiked = false;
            likeCount -= 1;

        } catch (e) {
            console.error("좋아요 취소 실패", e);
        }
    }
    updateLikeButtonUI();
});

// 📌 댓글 렌더링 (commentsPreview.items)
function renderComments(comments) {
  comments.forEach((c) => {
    const item = document.createElement("article");
    item.classList.add("comment-item");

    item.innerHTML = `
      <div class="comment-header">
        <div class="comment-info">
          <div class="profile-circle"
              style="background-image:url('${c.writerProfileImageUrl || ""}'); background-size:cover;"></div>
          <span class="comment-writer">${c.writerNickname}</span>
          <span class="comment-date">${formatDate(c.createdAt)}</span>
        </div>

        <div class="comment-actions">
          ${c.isWriter ? `
            <button class="comment-edit-btn" data-id="${c.id}">수정</button>
            <button class="comment-delete-btn" data-id="${c.id}">삭제</button>
          ` : ""}
        </div>
      </div>

      <p class="comment-content">${c.content}</p>
    `;

    commentListEl.appendChild(item);
  });

  attachCommentActionEvents();
}

function attachCommentActionEvents() {
  document.querySelectorAll(".comment-edit-btn").forEach((btn) => {
    btn.addEventListener("click", () => enterEditMode(btn.dataset.id));
  });

  document.querySelectorAll(".comment-delete-btn").forEach((btn) => {
    btn.addEventListener("click", () => openCommentDeleteModal(btn.dataset.id));
  });
}

function enterEditMode(commentId) {
  const commentItem = document.querySelector(`button[data-id="${commentId}"]`)
    .closest(".comment-item");

  const contentEl = commentItem.querySelector(".comment-content");
  const oldContent = contentEl.textContent;

  // textarea UI로 변환
  contentEl.outerHTML = `
    <textarea class="comment-edit-area">${oldContent}</textarea>
  `;

  const actionsEl = commentItem.querySelector(".comment-actions");
  actionsEl.innerHTML = `
    <button class="comment-edit-save" data-id="${commentId}">수정완료</button>
    <button class="comment-edit-cancel" data-id="${commentId}">취소</button>
  `;

  // 이벤트 연결
  commentItem.querySelector(".comment-edit-save")
    .addEventListener("click", () => saveCommentEdit(commentId));

  commentItem.querySelector(".comment-edit-cancel")
    .addEventListener("click", () => cancelCommentEdit(commentId, oldContent));
}
function cancelCommentEdit(commentId, originalContent) {
  const commentItem = document.querySelector(`button[data-id="${commentId}"]`)
    .closest(".comment-item");

  const textarea = commentItem.querySelector(".comment-edit-area");
  textarea.outerHTML = `<p class="comment-content">${originalContent}</p>`;

  // 버튼 원래대로 복구
  const actionsEl = commentItem.querySelector(".comment-actions");
  actionsEl.innerHTML = `
    <button class="comment-edit-btn" data-id="${commentId}">수정</button>
    <button class="comment-delete-btn" data-id="${commentId}">삭제</button>
  `;

  attachCommentActionEvents();
}
async function saveCommentEdit(commentId) {
  const commentItem = document.querySelector(`button[data-id="${commentId}"]`)
    .closest(".comment-item");

  const textarea = commentItem.querySelector(".comment-edit-area");
  const newContent = textarea.value.trim();

  if (newContent.length === 0) {
    alert("내용을 입력하세요.");
    return;
  }

  try {
    await updateComment(POST_ID, commentId, newContent);

    textarea.outerHTML = `<p class="comment-content">${newContent}</p>`;

    // 버튼 원상복구
    const actionsEl = commentItem.querySelector(".comment-actions");
    actionsEl.innerHTML = `
      <button class="comment-edit-btn" data-id="${commentId}">수정</button>
      <button class="comment-delete-btn" data-id="${commentId}">삭제</button>
    `;

    attachCommentActionEvents(); // 다시 이벤트 연결
  } catch (e) {
    console.error("댓글 수정 실패", e);
    alert("댓글 수정 실패");
  }
}


// 📌 댓글 등록
commentSubmitBtn.addEventListener("click", async () => {
  const content = commentTextarea.value.trim();
  if (!content) return alert("댓글 내용을 입력해주세요!");

  try {
    await createComment(POST_ID, content);
    commentTextarea.value = "";
    await loadPostDetail();
  } catch (e) {
    console.error(e);
    alert("댓글 등록 실패");
  }
});

// 📌 게시글 수정 이동
editBtn.addEventListener("click", () => {
  window.location.href = `/edit-post/edit-post.html?id=${POST_ID}`;
});

// 📌 게시글 삭제
deleteBtn.addEventListener("click", () => {
  deletingPost = true;
  openModal();
});

// 📌 모달 조작
function openModal() {
  postDeleteModal.classList.add("show");
}

function closeModal() {
  postDeleteModal.classList.remove("show");
}

postDeleteCancelBtn.addEventListener("click", closeModal);

postDeleteConfirmBtn.addEventListener("click", async () => {
  try {
    if (deletingPost) {
      await deletePost(POST_ID);
      alert("게시글이 삭제되었습니다.");
      window.location.href = "/board/board.html";
    }

  } catch (e) {
    console.error(e);
    alert("삭제 실패");

  } finally {
    deletingPost = false;
    closeModal();
  }
});

async function loadMoreComments() {
  if (commentIsLoading || !commentHasNext) return;

  commentIsLoading = true;

  try {
    const res = await getComments(POST_ID, commentCursor);

    renderComments(res.items);

    commentCursor = res.nextCursor;
    commentHasNext = res.hasNext;
    commentIsLoading = false;

  } catch (e) {
    console.error("댓글 추가 로드 실패", e);
  }

  commentIsLoading = false;
}

let deletingCommentId = null;

function openCommentDeleteModal(commentId) {
  deletingCommentId = commentId;
  document.getElementById("comment-delete-modal").classList.add("show");
}

document.getElementById("comment-delete-cancel").onclick = () => {
  document.getElementById("comment-delete-modal").classList.remove("show");
};

document.getElementById("comment-delete-confirm").onclick = async () => {
  try {
    await deleteComment(POST_ID, deletingCommentId);
    document.getElementById("comment-delete-modal").classList.remove("show");
    await loadPostDetail();
  } catch (e) {
    console.error("댓글 삭제 실패", e);
  }
};

