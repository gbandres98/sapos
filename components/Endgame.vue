<template>
  <div class="endgame">
    <h1>se acabó!</h1>
    <h2>{{ winners }}</h2>
    <div class="endgame__summary">
      <div
        v-for="(sum, team) in room.endgame.pickSummary"
        :key="team"
        class="endgame__pick"
      >
        <h3 :class="`team team--${team}`">Equipo {{ team }}</h3>
        <div
          v-for="p in sum.players"
          :key="p.socketId"
          class="selected-character"
          :style="{ 'border-left-color': p.color }"
          v-on="on"
        >
          {{ p.name }}
        </div>
        <character-icon
          class="endgame__character"
          :character="sum.character"
          :blocked="true"
        ></character-icon>
        <h5 v-if="sum.round">eliminado en ronda {{ sum.round }}</h5>
        <h5 v-else>ganador!</h5>
      </div>
    </div>
    <v-btn color="primary" href="http://sapos.gbandres.com">salir</v-btn>
  </div>
</template>

<script>
import { mapState } from "vuex";
import characters from "~/utils/characters";
import CharacterIcon from "./CharacterIcon";
export default {
  name: "Endgame",
  components: {
    CharacterIcon
  },
  data() {
    return {
      on: {}
    };
  },
  computed: {
    ...mapState(["room"]),
    winners() {
      if (this.room.endgame.winningTeams.length === 1) {
        return `ha ganado el equipo ${this.room.endgame.winningTeams[0]} con ${
          characters[this.room.game][
            this.room.picks[this.room.endgame.winningTeams[0]]
          ]
        }`;
      } else {
        let teams = "";
        this.room.endgame.winningTeams.forEach(t => (teams += ` ${t},`));
        teams = teams.slice(0, -1);
        return `empate de los equipos${teams} con ${
          characters[this.room.game][
            this.room.picks[this.room.endgame.winningTeams[0]]
          ]
        }`;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.endgame {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: rgba($color: #000000, $alpha: 0.9);
  height: 100%;
  justify-content: center;
}

.endgame__summary {
  display: flex;
  justify-content: center;
}

.endgame__pick {
  flex-basis: 0;
  text-align: center;
  margin: 5px 5px;
}

.team {
  border: 2px solid map-get($grey, "darken-2");
  border-radius: 10px;
  display: inline-block;
  padding: 2px 5px;
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

.selected-character {
  margin: 0px 5px;
  background-color: gray;
  display: inline-block;
  padding: 2px 5px;
  border-left: 13px solid;
  border-radius: 2px;
  cursor: pointer;
  margin: 10px 0px;
}

.endgame__character {
  max-width: 100px;
  margin: auto;
}
</style>
