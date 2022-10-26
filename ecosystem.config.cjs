const name = "Recruta";

module.exports = {
  apps: [{
    name,
    script: "./index.js",
    env: {
      DEBUG_COLORS: 1,
      // PORT: 8080
    },
    wait_ready: false,
    watch: false,
    out_file: __dirname + "/.pm2/logs/" + name + "-depurador-saida.log",
    error_file: __dirname + "/.pm2/logs/" + name + "-depurador-erro.log",
    pid_file: __dirname + "/.pm2/pids/" + name + ".pid",
  }]
}
