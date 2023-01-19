/* Validar el linkeado 
console.log("Desde scripts.js");*/

/*Referencias del DOM
Busca en el dom un selector que se pase y devuelve el elemento   Interactuar con el dom (elementos de la pag web)

Seleccion de id*/
const btnNuevoJuego = document.querySelector("#btnNuevoJuego"),
    
    btnPedirCarta = document.querySelector("#btnPedirCarta"),
    btnDetener = document.querySelector("#btnDetener"),
    //Seleccionar todos lo small        Seleccion de etiqueta       Nodos
    puntosHTML = document.querySelectorAll("small"), 
    //Seleccionar cartas        Selccion de clase 
    jugadoresCartas = document.querySelectorAll(".cards");


//Variables
let baraja = [],
    jugadoresPuntos = [];

/*
    C = treboles/Clover
    D = Diamantes/Diamond
    H = Corazones/Heart
    S = Espadas/Sword
*/

const tipos = ["C", "D", "H", "S"],     // Sufijos 
    especiales = ["A", "J", "Q", "K"];      // Prefijos 


// Inicializa la app 
// Arrow functions/Funciones de flecha 
const init = (cantidadJugadores = 2) => {
    baraja = crearBaraja();
    //Limpia los puntos
    jugadoresPuntos = [];

    for (let i = 0; i < cantidadJugadores; i++) jugadoresPuntos.push(0);
    
    //Puntos en el fronted  Indice del jugador
    for (let jugadorPuntos in jugadoresPuntos){
        //En la pos del jugador quiero el contenido de la etiqueta
        
        puntosHTML[jugadorPuntos].textContent = 0;
        jugadoresCartas[jugadorPuntos].textContent = "";   
    }

    habilitarBotones();
};


const habilitarBotones = () =>{

    //Colcar los botones en falso

    btnPedirCarta.disabled = false;
    btnDetener.disabled = false;
};

        
const deshabilitarBotones = () => {
    btnPedirCarta.disabled = true;
    btnDetener.disabled = true;
};


//Se encarga de crear la baraja
const crearBaraja = () =>{
    
    baraja = [];        //Comenzar vacio

    //Llenado de baraja normales
    //2C, 3C...10C, 2D, 3D...
    for (let tipo of tipos){
        for (let i = 2; i <= 10; i++){
            baraja.push(i + tipo);  //Agregar elemento al final
        }
    
        //Prefijo tipo + el sufijo especial
        for(let especial of especiales) baraja.push(especial + tipo); //Antes del tipo colocar la letra especia 
        
    }
        
    return _.shuffle(baraja);         //Para producir pos random/Desordenar barajas
};


// Se encarga de retornar una carta 
const obtenerCarta = () => {
        //Validacion
    if (baraja.length <= 0) throw "No hay cartas en la baraja";
    
    return baraja.pop(); //Elimina el ultimo elem del arreglo y lo retorna
};
    
    /*
     * - Obtener valor de la carta
     * - Acumular puntos
   
     * const arg = {
     * carta: carta,
     * turno: o}
     */
    
                            //Pasar arg
const acumularPuntos = ({ carta, turno }) =>{
        
    jugadoresPuntos[turno] += obtenerValorDeCarta(carta); 
    /*  Otra forma:
    const valorDeCarta = obtenerValorDeCarta(carta);
    jugadoresPuntos[turno] += valorDeCarta*/ 

    /*Mostrar puntos al usuario visualmente */
    puntosHTML[turno].textContent = jugadoresPuntos[turno]

    return jugadoresPuntos[turno];
};
   

const obtenerValorDeCarta = (carta) => {
                                /* 10C: Longitud de carta "3" pero No quiero la ultima letra de la carta */
    const valor = carta.substring(0, carta.length - 1);
    
    /*Validacion es un numero?
                           Si lo es  : No lo es
                           Si es convertirlo a int Ej. number()
                           Si es una letra, Si es A = 11, sino valdra 10*/
    return !isNaN(valor) ? valor * 1 : valor === "A" ? 11 : 10;
};
    
        
const crearCarta = ({carta, turno}) =>{
            
    //Creando un elem html
    const imagen = document.createElement("img");
            
    imagen.src = `assets/${carta}.png`;
    imagen.classList.add("carta");
            
    //Agregarlo al dom
    jugadoresCartas[turno].append(imagen);

};


//Cuanto tiene que arriesgarse para pasar los 21
const turnoComputadora = (puntosMinimos) =>{
    let computadoraPuntos = 0;

    do {
        //empieza a pedir cartas
        const carta = obtenerCarta();
                                                                                //Tomar el ultimo jugador
        computadoraPuntos = acumularPuntos({carta, turno: jugadoresPuntos.length - 1,});
            
        crearCarta({carta, turno: jugadoresPuntos.length - 1});
                                                    //Puntos del jugador 1
    } while (computadoraPuntos < puntosMinimos && puntosMinimos <= 21);
        
    //Dependiendo de los puntos determina el ganador
    determinarGanador(jugadoresPuntos);
};

                                //Destructuracion de un arreglo
const determinarGanador = ([jugadorPuntos, computadoraPuntos]) =>{
    
    setTimeout(() =>{       //Timer
              
        if(jugadorPuntos > 21){
            alert("¡Cumputadora gana!");
            return;
        }

        if(computadoraPuntos > 21){
            alert("¡Jugador gana!");
            return;
        }

        if(jugadorPuntos === computadoraPuntos){
            alert("Nadie gana");
            return;
        }
           
        //Y ambos no superan los 21
        if(jugadorPuntos > computadoraPuntos){
            alert("¡Jugador gana!");
            return;
        }
        
        //Siempre y cuando no entre en ningun if
        alert("Computadora gana");

        }, 400);        //En 400 milisegundos ejecuta este codigo
}; 


//Eventos    Recibe el evento y el coldback-funcion a ejecutar cuando lo reciba
btnNuevoJuego.addEventListener("click", () =>{
    init();

});


btnPedirCarta.addEventListener("click", () => {
  
    const carta = obtenerCarta();
    const jugadorPuntos = acumularPuntos({ carta, turno: 0 });
        
    /*Estructurar obj en argumentos */
    crearCarta({carta, turno: 0});

    //Detener automaticamente cuando supere los 21

    if(jugadorPuntos < 21) return;

    deshabilitarBotones();

    //Bloquear botones antes de pasar el turno a la compu
    turnoComputadora(jugadorPuntos);
});


//Pasarle el turno a la computadora
btnDetener.addEventListener('click', () =>{

    deshabilitarBotones();
    turnoComputadora(jugadoresPuntos[0]);

});
