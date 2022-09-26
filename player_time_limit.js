var timeLimit = 14400; //Tiempo en segundos Ejemplo: 4 horas = 14400

onEvent("player.tick", event => {
    let player = event.player;
    
    if ((event.level.time % 20) === 0) { //Si es nuevo o es un día distinto comienza el tiempo desde 0 y suma 1 cada segundo
            let today = new Date().toDateString();
            let playername = player.name.string;
            let data = event.server.persistentData;
            let playerData = data[playername];
            if (!playerData) playerData = data[playername] = {}
            if (!playerData.timePlayed) playerData.timePlayed = 0;
            if (`${playerData.lastPlayed || ''}` != `${today}`) {
                playerData.timePlayed = 0;
                playerData.lastPlayed = today;
            }
            playerData.timePlayed += 1; 

            if (playerData.timePlayed >= timeLimit) { //Expulsa al jugador (sin OP) una vez superado el tiempo límite
                console.log("El jugador" + playername + " ha superado el tiempo límite.");
                console.info("El jugador" + playername + " ha superado el tiempo límite.");
                if (!event.player.op) {
                    player.kick("Has superado las 4 horas de juego. ¡Nos vemos mañana!");
            }
            }
     
    }
});


function onRtpExecute(ctx) { //calcula tiempo y lo dice al jugador y a la consola

    const player = ctx.source.getPlayerOrException().asKJS();
    let playerData = player.server.persistentData[player.name.string];

    console.log(`Jugador: ${player.name}, Tiempo jugado: ${Math.floor(playerData.timePlayed / 3600).toString().padStart(2, '0')} : ${Math.floor(playerData.timePlayed % 3600 / 60).toString().padStart(2, '0')} : ${Math.floor(playerData.timePlayed % 60).toString().padStart(2, '0')}`);

    player.tell(`☆ Has jugado ${Math.floor(playerData.timePlayed / 3600).toString().padStart(1, '0')}h ${Math.floor(playerData.timePlayed % 3600 / 60).toString().padStart(2, '0')}min`);
    player.tell(`★ Te quedan ${3 - Math.floor(playerData.timePlayed / 3600).toString().padStart(1, '0')}h ${Math.abs(60 - Math.floor(playerData.timePlayed % 3600 / 60).toString().padStart(2, '0'))}min`);

    return 1;
}


function commandRegistry(ev) { //crea un comando
    const {
        commands: Commands
    } = ev;
    ev.register(Commands.literal("tiempo").executes(onRtpExecute));
}

onEvent("command.registry", commandRegistry);
