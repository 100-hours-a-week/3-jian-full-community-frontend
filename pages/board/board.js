import { getPosts } from "../../api/post.js";

const postList = document.querySelector('.post-list');
let cursor = null;  // 처음엔 null
let isLoading = false;
let hasNext = true;

// 페이지 로드 시 게시글 불러오기
window.addEventListener('DOMContentLoaded', async () => {
  await loadPosts();
});

window.addEventListener('scroll', () => {
    const scrollTop = document.documentElement.scrollTop;
    const viewportHeight = window.innerHeight;
    const fullHeight = document.documentElement.scrollHeight;


    // 화면 끝 200px 전이면 다음 페이지 불러오기
    if (scrollTop + viewportHeight >= fullHeight - 200) {
        loadPosts();
    }
});

// API 호출 + 렌더링
async function loadPosts() {
    if (isLoading || !hasNext) return;  // 중복 요청 방지 + 마지막 페이지 방지
    isLoading = true;

    try {
        const res = await getPosts(cursor);

        const posts = res.items;
        cursor = res.nextCursor;
        hasNext = res.hasNext;

        posts.forEach(renderPostCard);
        isLoading = false;
        
    } catch (err) {
        console.error('게시글 불러오기 실패', err);
    }
}

/**
 * 개별 게시글 카드 렌더링 함수
 */
function renderPostCard(post) {
    const card = document.createElement('article');
    card.classList.add('post-card');
    card.dataset.postId = post.id;

    const formattedTitle = post.title
    ? (post.title.length > 26
        ? post.title.substring(0, 26) + "..."
        : post.title)
    : "";

    const formattedDate = post.createdAt
    ? post.createdAt.replace("T", " ").split(".")[0]
    : "";

    const formattedLikeCount =
    post.likeCount >= 1000
        ? Math.floor(post.likeCount / 1000) + "k"
        : post.likeCount;

    const formattedCommentCount =
    post.commentCount >= 1000
        ? Math.floor(post.commentCount / 1000) + "k"
        : post.commentCount;

    const formattedViewCount =
    post.viewCount >= 1000
        ? Math.floor(post.viewCount / 1000) + "k"
        : post.viewCount;

    card.innerHTML = `
        <div class="post-header">
        <div>
            <h3 class="post-title">${formattedTitle}</h3>
            <div class="post-meta">
            <span>좋아요 ${formattedLikeCount}</span>
            <span>댓글 ${formattedCommentCount}</span>
            <span>조회수 ${formattedViewCount}</span>
            </div>
        </div>
        <span class="post-date">${formattedDate}</span>
        </div>

        <hr class="post-divider" />

        <div class="post-writer">
        <div class="profile-circle"></div>
        <span class="writer-name">${post.writerNickname}</span>
        </div>
    `;

    // ⭐ 추가: 프로필 이미지 세팅
    const profileCircle = card.querySelector('.profile-circle');

    if (post.writerProfileImageUrl) {
        profileCircle.style.backgroundImage = `url('${post.writerProfileImageUrl}')`;
    }

    // 클릭 시 상세 페이지 이동
    card.addEventListener('click', () => {
        //window.location.href = `/post-detail.html?id=${post.id}`;
    });

    postList.appendChild(card);
}
