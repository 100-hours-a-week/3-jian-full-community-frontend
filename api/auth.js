import { post, del } from './http.js';

export const login = async (email, password) => post('/sessions', {email, password});

export const logout = async () => del('/sessions')