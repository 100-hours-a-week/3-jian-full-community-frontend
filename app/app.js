import { initRouter } from './router.js';
import { renderHeader } from './components/header.js';

window.addEventListener('DOMContentLoaded', () => {
    renderHeader();     // 공통 헤더 렌더
    initRouter();       // 라우터 초기화
});
