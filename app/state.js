export const state = {
  user: null,        // {email, nickname, profileImageUrl}
};

export function setUser(user) {
  state.user = user;
}
