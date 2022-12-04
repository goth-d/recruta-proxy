const name = "Recruta";

module.exports = {
	apps: [
		{
			name,
			script: "./src/index.js",
			env: {
				DEBUG_COLORS: 1,
				DEBUG: `${name}:*`,
				// PORT: 8080
			},
			wait_ready: false,
			watch: false,
			ignore_watch: ["./node_modules", "./.pm2"],
			max_restarts: 10,
			out_file: __dirname + "/.pm2/logs/" + name + "-depurador-saida.log",
			error_file: __dirname + "/.pm2/logs/" + name + "-depurador-erro.log",
			pid_file: __dirname + "/.pm2/pids/" + name + ".pid",
		},
	],
};
