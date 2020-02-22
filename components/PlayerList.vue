<template>
  <div class="player-list">
    <h1>jugadores</h1>
    <v-card
      v-for="player in room.players"
      :key="player.name"
      :style="{ borderLeft: `solid ${player.color} 5px` }"
    >
      <v-row>
        <v-col>
          <v-card-title>{{ player.name }}</v-card-title>
          <v-card-subtitle
            v-if="player.admin"
            class="player-list__card__subtitle"
            >admin</v-card-subtitle
          >
        </v-col>
        <v-col>
          <v-card-text>
            <div
              :class="`team team--${player.team}`"
              @click="changeTeam(player.socketId)"
            >
              Equipo {{ player.team }}
            </div>
            <v-icon v-if="room.state === 2 && player.locked">lock</v-icon>
          </v-card-text>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script>
import { mapState } from "vuex";
import socket from "~/plugins/socket.io.js";

export default {
  name: "PlayerList",
  computed: {
    ...mapState(["room", "me"]),
    admin() {
      return this.room.players.find(p => p.name === this.me).admin;
    }
  },
  methods: {
    changeTeam(name) {
      socket.emit("change-team", name);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variables.scss";

.player-list__card__subtitle {
  text-align: left;
}
.team {
  border: 2px solid map-get($grey, "darken-2");
  border-radius: 10px;
  cursor: pointer;
  &--1 {
    background-color: $team1;
  }
  &--2 {
    background-color: $team2;
  }
  &--3 {
    background-color: $team3;
  }
  &--4 {
    background-color: $team4;
  }
}

@media screen and (max-width: 600px) {
  .player-list {
    width: 80vw;
  }
}
</style>
