import { get, post, put, patch } from './http.js';

export const checkEmail = (email) => get('/users/emails/availability', { email: email });

export const checkNickname = (nickname) => get('/users/nicknames/availability', { nickname: nickname });

export const uploadProfileImage = (formData) => post('/files/profile-images', formData);

export const signup = (email, password, nickname, profileImageUrl) => post('/users', {
    email: email, 
    password: password, 
    nickname: nickname, 
    profileImageUrl: profileImageUrl
});

export const signout = () => del('/users/me');

export const getProfile = () => get('/users/me');

export const editProfile = (nickname, profileImageUrl) => patch('/users/me', { nickname: nickname, profileImageUrl: profileImageUrl });

export const updatePassword = (oldPassword, newPassword) => put('/users/me/password', { oldPassword: oldPassword, newPassword: newPassword })