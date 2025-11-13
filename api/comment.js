import { get, post, put, del } from './http.js';

export const getComments = (postId, cursor) => {
    if (cursor !== null) return get(`/posts/${postId}/comments`, { cursor: cursor });
    else return get(`/posts/${postId}/comments`);
}

export const createComment = (postId, content) => post(`/posts/${postId}/comments`, { content: content });

export const updateComment = (postId, commentId, content) => put(`/posts/${postId}/comments/${commentId}`, { content: content });

export const deleteComment = (postId, commentId) => del(`/posts/${postId}/comments/${commentId}`);