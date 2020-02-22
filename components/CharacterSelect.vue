<template>
  <div>
    <v-select
      :value="this.myPlayer.pick"
      :items="characterList"
      @change="changePick"
      label="elige un personaje"
    ></v-select>
    <div>
      <v-tooltip bottom v-for="p in myTeam" :key="p.socketId">
        <template v-slot:activator="{ on }">
          <div
            class="selected-character"
            :style="{ 'border-left-color': p.color }"
            v-on="on"
          >
            {{ characters[p.pick] }}
          </div>
        </template>
        <span>{{ p.name }}</span>
      </v-tooltip>
    </div>
    <v-btn
      :disabled="!myPlayer.pick"
      color="primary"
      class="lock-pick"
      @click="lockPick"
      >{{ myPlayer.locked ? "fijado!" : "fijar" }}</v-btn
    >
  </div>
</template>

<script>
import characters from "~/utils/characters";
import { mapState } from "vuex";
import socket from "~/plugins/socket.io.js";

export default {
  name: "CharacterSelect",
  data() {
    return {
      pick: ""
    };
  },
  computed: {
    characters() {
      return characters[this.room.game];
    },
    characterList() {
      return Object.entries(characters[this.room.game])
        .map(a => ({ text: a[1], value: a[0] }))
        .sort((a, b) => a.text.localeCompare(b.text));
    },
    ...mapState(["room", "me"]),
    myPlayer() {
      return this.room.players.find(p => p.name === this.me);
    },
    myTeam() {
      return this.room.players.filter(
        p => p.team === this.myPlayer.team && p.pick
      );
    }
  },
  methods: {
    changePick(event) {
      socket.emit("change-pick", event);
    },
    lockPick() {
      socket.emit("lock-pick");
    }
  }
};
</script>

<style lang="scss" scoped>
.selected-character {
  margin: 0px 5px;
  background-color: gray;
  display: inline-block;
  padding: 2px 5px;
  border-left: 13px solid;
  border-radius: 2px;
  cursor: pointer;
}

.lock-pick {
  margin-top: 10px;
}
</style>
