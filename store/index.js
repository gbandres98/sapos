export const state = () => ({
  room: {},
  me: ""
});

export const mutations = {
  setRoom(state, room) {
    state.room = room;
  },
  setMe(state, me) {
    state.me = me;
  }
};
