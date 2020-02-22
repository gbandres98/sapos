<template>
  <v-container>
    <v-row justify="center">
      <a class="exit-icon" href="http://sapos.gbandres.com">
        <v-icon>exit_to_app</v-icon>
      </a>
      <v-tooltip
        right
        :open-on-hover="false"
        :close-delay="1000"
        :value="copiedTip"
      >
        <template v-slot:activator="{ on }">
          <h1 @click="copyRoomCode" class="room-code" v-on="on">
            sala {{ room.code }}
          </h1>
        </template>
        <span>copiado!</span>
      </v-tooltip>
    </v-row>
    <v-row>
      <v-col cols="auto" sm="4">
        <player-list></player-list>
        <my-pick v-if="room.state > 2"></my-pick>
      </v-col>
      <v-col cols="auto" sm="8">
        <character-grid></character-grid>
      </v-col>
    </v-row>
    <v-dialog :persistent="true" :value="room.state === 4" :fullscreen="true">
      <endgame></endgame>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapState } from "vuex";
import PlayerList from "~/components/PlayerList";
import CharacterGrid from "~/components/CharacterGrid";
import MyPick from "~/components/MyPick";
import Endgame from "~/components/Endgame";

export default {
  components: { PlayerList, CharacterGrid, MyPick, Endgame },
  data() {
    return {
      copiedTip: false
    };
  },
  computed: {
    ...mapState(["room"])
  },
  methods: {
    copyRoomCode() {
      this.copiedTip = true;
      setTimeout(() => (this.copiedTip = false), 1000);
      this.$copyText(this.room.code);
    }
  }
};
</script>

<style lang="scss" scoped>
.room-code {
  cursor: pointer;
  margin-right: auto;
}

.exit-icon {
  margin-left: 20px;
  margin-right: auto;
}
</style>
