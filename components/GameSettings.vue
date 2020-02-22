<template>
  <div class="game-settings">
    <div v-if="gameState === 1">
      <h3 v-if="!imAdmin">esperando a {{ admin }}</h3>
      <v-btn
        v-else
        :disabled="!correctTeams"
        color="primary"
        class="game-settings__start"
        @click="toCharacterSelect"
        >empezar partida</v-btn
      >
      <v-btn v-if="imAdmin" color="primary" @click="toggleGame">{{
        game
      }}</v-btn>
    </div>
    <character-select v-if="gameState === 2"></character-select>
  </div>
</template>

<script>
import { mapState } from "vuex";
import socket from "~/plugins/socket.io.js";
import CharacterSelect from "./CharacterSelect";

export default {
  name: "GameSettings",
  components: {
    CharacterSelect
  },
  computed: {
    ...mapState({
      players: state => state.room.players,
      me: state => state.me,
      gameState: state => state.room.state,
      game: state => state.room.game
    }),
    admin() {
      return this.players.find(p => p.admin).name;
    },
    imAdmin() {
      return this.me === this.admin;
    },
    correctTeams() {
      return (
        this.players.map(p => p.team).filter((v, i, a) => a.indexOf(v) == i)
          .length > 1
      );
    }
  },
  methods: {
    toCharacterSelect() {
      socket.emit("to-character-select");
    },
    toggleGame() {
      socket.emit("toggle-game");
    }
  }
};
</script>

<style lang="scss" scoped>
.game-settings {
  background-color: rgba(0, 0, 0, 0.85);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  &__start {
    max-width: 200px;
  }
}
</style>
