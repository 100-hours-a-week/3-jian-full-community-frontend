import { ENDPOINT } from "./config.js";

export const get = async (url, params = {}, headers = {}) => {
    const paramsExist = params && Object.keys(params).length > 0;
    const fullUrl = paramsExist
                ? `${ENDPOINT}${url}?` + new URLSearchParams(params).toString()
                : `${ENDPOINT}${url}`;
    const res = await fetch(fullUrl, {
        method: 'GET',
        headers: { ...headers, },
        credentials: 'include',
    });

    if (res.ok) {
        if (res.status === 204) return null;
        return await res.json();
    }

    const error = await res.text();
    throw new Error(error || res.statusText);
}

export const post = async (url, body, headers = {}) => {
    const isFormData = body instanceof FormData;
    const useDefaultHeaders = Object.keys(headers).length === 0 && !isFormData;

    const res = await fetch(`${ENDPOINT}${url}`, {
        method: 'POST',
        headers: useDefaultHeaders
        ? { 'Content-Type': 'application/json' }
        : headers,
        body: isFormData ? body : JSON.stringify(body),
        credentials: 'include',
    });

    if (res.ok) {
        if (res.status === 204) return null;
        try {
            return await res.json();
        } catch {
            return null;
        }
    }

    const error = await res.text();
    throw new Error(error || res.statusText);
}

export const put = async (url, body, headers = {}) => {
    const useDefault = Object.keys(headers).length === 0;
    const res = await fetch(`${ENDPOINT}${url}`, {
        method: 'PUT',
        body: useDefault ? JSON.stringify(body) : body,
        headers: useDefault ? { 'Content-Type': 'application/json' } : headers,
        credentials: 'include',
    });

    if (res.ok) return res.status === 204 ? null : res.json();

    const error = await res.text();
    throw new Error(error || res.statusText);
}

export const patch = async (url, body, headers = {}) => {
    const useDefault = Object.keys(headers).length === 0;
    const res = await fetch(`${ENDPOINT}${url}`, {
        method: 'PATCH',
        body: useDefault ? JSON.stringify(body) : body,
        headers: useDefault ? { 'Content-Type': 'application/json' } : headers,
        credentials: 'include',
    });

    if (res.ok) return res.status === 204 ? null : res.json();

    const error = await res.text();
    throw new Error(error || res.statusText);
}

export const del = async (url, headers = {}) => {
    const res = await fetch(`${ENDPOINT}${url}`, {
        method: 'DELETE',
        headers: { ...headers, },
        credentials: 'include',
    });

    if (res.ok) return res.status === 204 ? null : res.json();

    const error = await res.text();
    throw new Error(error || res.statusText);
}