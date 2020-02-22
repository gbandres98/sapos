<template>
  <v-container fluid class="index__row">
    <v-row justify="center" class="index__row">
      <v-col sm="6" lg="3">
        <h1>el juego de los sapos 2</h1>
        <v-card min-width="370" class="index__card">
          <v-card-title>
            <h1>bienvenido amigo</h1>
          </v-card-title>
          <v-card-text>
            <v-form ref="form" lazy-validation>
              <div class="form__name-group">
                <v-text-field
                  :error="nameError"
                  :error-messages="nameErrorMessages"
                  v-model="name"
                  label="Nombre"
                  required
                  @change="clearNameError"
                ></v-text-field>
                <color-picker @color="color = $event"></color-picker>
              </div>
              <v-text-field
                :error="roomError"
                :error-messages="roomErrorMessages"
                v-model="room"
                label="Sala"
                required
                @change="clearRoomError"
              ></v-text-field>
              <v-btn color="primary" class="mr-4" @click="createRoom"
                >Crear sala</v-btn
              >
              <v-btn
                :disabled="!validRoom"
                color="primary"
                class="mr-4"
                @click="joinRoom"
                >Unirse</v-btn
              >
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import socket from "~/plugins/socket.io.js";
import ColorPicker from "~/components/ColorPicker";
import { mapMutations } from "vuex";

export default {
  name: "Index",
  components: { ColorPicker },
  data() {
    return {
      name: "",
      room: "",
      color: "",
      nameError: false,
      nameErrorMessages: [],
      roomError: false,
      roomErrorMessages: []
    };
  },
  computed: {
    validRoom() {
      return this.room.length >= 6;
    }
  },
  methods: {
    createRoom() {
      if (this.name.length < 1) {
        this.nameError = true;
        this.nameErrorMessages = ["un nombre por lo menos"];
      }

      socket.emit("create-room");
    },
    clearNameError() {
      this.nameError = false;
      this.nameErrorMessages = [];
    },
    clearRoomError() {
      this.roomError = false;
      this.roomErrorMessages = [];
    },
    joinRoom() {
      this.setMe(this.name);

      socket.emit("join-room", this.room, {
        name: this.name,
        color: this.color
      });
    },
    ...mapMutations({
      setMe: "setMe"
    })
  },
  mounted() {
    socket.on("room-created", code => {
      this.room = code;
      this.joinRoom();
    });
    socket.on("room-joined", () => {
      this.$router.push({
        path: "/game"
      });
    });
    socket.on("room-join-error", () => {
      this.roomError = true;
      this.roomErrorMessages = ["la sala no existe"];
    });
  }
};
</script>

<style lang="scss" scoped>
.index__row {
  height: 100%;
}

.index__card {
  margin-top: 50%;
}

.form__name-group {
  display: flex;
  align-items: center;
}
</style>
