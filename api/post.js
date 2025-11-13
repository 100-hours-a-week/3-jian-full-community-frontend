import { get, post, put, del } from './http.js';

export const getPosts = (cursor) => {
    if (cursor !== null) return get('/posts', { cursor: cursor});
    else return get('/posts');
};

export const getPostDetail = (id) => get(`/posts/${id}`);

export const createPost = (title, content, postImageUrls) => post('/posts', { title: title, content: content, postImageUrls });

export const updatePost = (id, title, content, postImageUrls) => put(`/posts/${id}`, { title: title, content: content, postImageUrls });

export const deletePost = (id) => del(`/posts/${id}`);

export const likePost = async (postId) => {
  return post(`/posts/${postId}/likes`);
};

export const unlikePost = async (postId) => {
  return del(`/posts/${postId}/likes`);
};
