import http from "http";
import socketIO from "socket.io";

const STATE_LOBBY = 1;
const STATE_CHAR_SELECT = 2;
const STATE_PLAYING = 3;
const STATE_FINISHED = 4;

const rooms = {};

export default function() {
  this.nuxt.hook("render:before", renderer => {
    const server = http.createServer(this.nuxt.renderer.app);
    const io = socketIO(server);
    // overwrite nuxt.server.listen()
    this.nuxt.server.listen = (port, host) => {
      port = process.env.PORT;
      console.log(port + " " + host);
      return new Promise(resolve =>
        server.listen(port || 3000, host || "0.0.0.0", resolve)
      );
    };
    // close this server on 'close' event
    this.nuxt.hook("close", () => new Promise(server.close));

    // Add socket.io events
    io.on("connection", socket => {
      socket.on("create-room", () => {
        console.log("create-room");

        const code = generateRoomCode();
        rooms[code] = {
          code,
          state: STATE_LOBBY,
          players: [],
          chars: {},
          game: "pm"
        };

        socket.emit("room-created", code);
      });

      socket.on("join-room", (code, player) => {
        console.log(`join-room ${code}`);

        const room = rooms[code];
        if (!room) {
          socket.emit("room-join-error");
          return;
        }

        if (room.players.length < 1) player.admin = true;
        player.socketId = socket.id;
        player.team = 1;

        room.players.push(player);
        socket.join(code);

        socket.emit("room-joined");
        updateRoom(io, room.code);
      });

      socket.on("change-team", socketId => {
        const roomCode = getPlayerRoom(socket.id);
        const player = rooms[roomCode].players.find(
          p => p.socketId === socketId
        );
        if (player && rooms[roomCode].state === STATE_LOBBY) {
          switch (player.team) {
            case 1:
              player.team = 2;
              break;
            case 2:
              player.team = 3;
              break;
            case 3:
              player.team = 4;
              break;
            case 4:
              player.team = 1;
              break;
          }
          updateRoom(io, roomCode);
        }
      });

      socket.on("kill-character", character => {
        const roomCode = getPlayerRoom(socket.id);
        const room = rooms[roomCode];
        room.chars[character] = Object.keys(room.chars).length + 1;

        const pickedCharacters = [...new Set(Object.values(room.picks))];
        const remaining = pickedCharacters.filter(
          c => !Object.keys(room.chars).includes(c)
        );
        if (remaining.length === 1) {
          room.state = STATE_FINISHED;
          const winningChar = remaining[0];
          const winningTeams = Object.keys(room.picks).filter(
            k => room.picks[k] === winningChar
          );
          const pickSummary = {};
          Object.keys(room.picks).forEach(t => {
            pickSummary[t] = {
              character: room.picks[t],
              round: room.chars[room.picks[t]],
              players: room.players.filter(p => p.team == t)
            };
          });

          room.endgame = {
            winningChar,
            winningTeams,
            pickSummary
          };
        }

        updateRoom(io, roomCode);
      });

      socket.on("disconnect", () => {
        const roomCode = getPlayerRoom(socket.id);
        if (roomCode) {
          removePlayer(roomCode, socket.id);
          updateRoom(io, roomCode);
        }
      });

      socket.on("to-character-select", () => {
        const roomCode = getPlayerRoom(socket.id);
        if (roomCode) {
          rooms[roomCode].state = STATE_CHAR_SELECT;
          updateRoom(io, roomCode);
        }
      });

      socket.on("change-pick", pickedCharacter => {
        const roomCode = getPlayerRoom(socket.id);
        const player = rooms[roomCode].players.find(
          p => p.socketId === socket.id
        );

        player.pick = pickedCharacter;
        updateRoom(io, roomCode);
      });

      socket.on("lock-pick", () => {
        const roomCode = getPlayerRoom(socket.id);
        const room = rooms[roomCode];
        const player = room.players.find(p => p.socketId === socket.id);

        player.locked = true;

        if (!room.players.some(p => !p.pick)) {
          room.state = STATE_PLAYING;
          const teams = room.players.map(p => p.team);
          const picks = {};
          teams.forEach(t => {
            const teamPicks = room.players
              .filter(p => p.team == t)
              .map(p => p.pick);
            picks[t] = teamPicks[Math.floor(Math.random() * teamPicks.length)];
          });

          room.picks = picks;
        }

        updateRoom(io, roomCode);
      });

      socket.on("toggle-game", () => {
        const roomCode = getPlayerRoom(socket.id);
        const room = rooms[roomCode];

        room.game = room.game === "pm" ? "melee" : "pm";
        updateRoom(io, roomCode);
      });
    });
  });
}

const generateRoomCode = () => {
  const code = ((Math.random() * 0xffffff) << 0).toString(16);
  if (rooms[code]) return generateRoomCode();
  else return code;
};

const updateRoom = (io, code) => {
  io.sockets.in(code).emit("room-update", rooms[code]);
};

const getPlayerRoom = socketId => {
  const room = Object.values(rooms).find(r =>
    r.players.some(p => p.socketId === socketId)
  );
  if (room) return room.code;
};

const removePlayer = (roomCode, socketId) => {
  rooms[roomCode].players.splice(
    rooms[roomCode].players.findIndex(p => p.socketId === socketId),
    1
  );
};
