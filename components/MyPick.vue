<template>
  <v-row>
    <v-col>
      <h2>tu pick:</h2>
      <v-icon @click="showPick = !showPick">remove_red_eye</v-icon>
    </v-col>
    <v-col>
      <div v-if="showPick">
        <h3>{{ characterList[character] }}</h3>
        <character-icon :character="character"></character-icon></div
    ></v-col>
  </v-row>
</template>

<script>
import { mapState } from "vuex";
import CharacterIcon from "./CharacterIcon";
import characters from "~/utils/characters";

export default {
  name: "MyPick",
  components: {
    CharacterIcon
  },
  data() {
    return {
      showPick: true
    };
  },
  computed: {
    ...mapState(["room", "me"]),
    character() {
      const team = this.room.players.find(p => p.name === this.me).team;
      return this.room.picks[team];
    },
    characterList() {
      return characters[this.room.game];
    }
  }
};
</script>
