const {
  getSettings,
  updateSettings,
} = require("../controllers/settingsController");

const routes = (io, socket) => {
  const userToken = socket.handshake.query.token;

  socket.on("get_settings", (callback) => getSettings(callback, userToken));

  socket.on("update_settings", (received) =>
    updateSettings(received, io, userToken)
  );
};

module.exports = routes;
