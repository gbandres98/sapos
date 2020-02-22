<template>
  <div class="character-list__container">
    <v-row no-gutters class="character-list">
      <v-col
        v-for="character in characterList"
        :key="character"
        class="character-list__icon"
      >
        <character-icon :character="character"></character-icon>
      </v-col>
    </v-row>
    <game-settings v-if="gameState < 3" class="game-settings"></game-settings>
  </div>
</template>

<script>
import { mapState } from "vuex";
import CharacterIcon from "./CharacterIcon";
import GameSettings from "./GameSettings";
import characters from "~/utils/characters";

export default {
  name: "CharacterGrid",
  components: {
    CharacterIcon,
    GameSettings
  },
  computed: {
    characterList() {
      return Object.keys(characters[this.game]);
    },
    ...mapState({
      gameState: state => state.room.state,
      game: state => state.room.game
    })
  }
};
</script>

<style lang="scss" scoped>
.character-list {
  justify-content: center;
}

.character-list__icon {
  width: 11%;
  flex-basis: 11%;
  flex-grow: 0;
}

.character-list__container {
  position: relative;
}

.game-settings {
  z-index: 99;
}
</style>
