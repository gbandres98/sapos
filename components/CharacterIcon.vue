<template>
  <div>
    <v-dialog v-model="dialog" width="300" :disabled="dead || blocked">
      <template v-slot:activator="{ on }">
        <div class="character-icon" v-on="on">
          <v-img :src="`img/cross.png`" :class="overlayClass"></v-img>
          <v-img :src="`img/icons/${game}/${character}.png`"></v-img>
        </div>
      </template>

      <div class="modal__content">
        <h2>ha ganado {{ name }}?</h2>
        <div class="modal__buttons">
          <v-btn color="primary" @click="handleClick">sí</v-btn>
          <v-btn color="accent" @click="dialog = false">cancelar</v-btn>
        </div>
      </div>
    </v-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
import socket from "~/plugins/socket.io.js";
import characters from "~/utils/characters.js";

export default {
  name: "CharacterIcon",
  props: {
    character: {
      type: String,
      required: true
    },
    blocked: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    return {
      dialog: false
    };
  },
  computed: {
    overlayClass() {
      let res = this.blocked
        ? "character-icon__overlay--blocked"
        : "character-icon__overlay";
      if (this.dead) res += " dead";
      return res;
    },
    ...mapState({
      dead(state) {
        return Boolean(state.room.chars[this.character]);
      },
      game: state => state.room.game
    }),
    name() {
      return characters[this.game][this.character];
    }
  },
  methods: {
    handleClick() {
      this.dialog = false;
      socket.emit("kill-character", this.character);
    }
  }
};
</script>

<style lang="scss" scoped>
.character-icon {
  position: relative;
  cursor: pointer;
}

.character-icon__overlay {
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  transition: 0.5s ease;
  background: transparent;
  z-index: 9;

  &:hover {
    opacity: 1;
    backdrop-filter: grayscale(100%);
  }

  &.dead {
    opacity: 1;
    backdrop-filter: grayscale(100%);
  }
}

.character-icon__overlay--blocked {
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  transition: 0.5s ease;
  background: transparent;
  z-index: 9;

  &.dead {
    opacity: 1;
    backdrop-filter: grayscale(100%);
  }
}

.modal__content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.modal__buttons {
  margin: 5px;
}

//fuck firefox
.v-image {
  transition: 0.5s ease;
}

.character-icon__overlay:hover + .v-image {
  filter: grayscale(100%);
}

.dead + .v-image {
  filter: grayscale(100%);
}
</style>
