const board = [
  //aqui voy a colocar cada una de las jugadas
  ["", "", ""],
  ["", "", ""],
  ["", "", ""],
];

let turn = 0; // 0 es user y 1 es pc
const boardContainer = document.querySelector("#board");
const playerDiv = document.querySelector("#player"); // es donde vamos a mostrar de quien es el turno

startGame();

function startGame() {
  renderBoard();
  turn = Math.random() <= 0.5 ? 0 : 1; // aleatorio quien empieza el game

  renderCurrentPlayer();

  if (turn === 0) {
    playerPlays();
  } else {
    PCPlays();
  }
}

function playerPlays() {
  const cells = document.querySelectorAll(".cell"); // tengo que añadir un event listener a cada celda

  cells.forEach((cell, i) => {
    const column = i % 3; // aca estoy sacando el modulo porque necesito la posicion de la celda en el tablero
    const row = parseInt(i / 3);

    if (board[row][column] === "") {
      // si no tiene nada quiere decir que esa casilla esta vacia para jugar
      cell.addEventListener("click", (e) => {
        board[row][column] = "O"; // solo las teclas que estan vacias van a tener el listener
        cell.textContent = board[row][column]; // aqui imprimo en el tablero

        turn = 1;
        const won = checkIfWinner();

        if (won === "none") {
          PCPlays();
          return;
        }

        if (won === "draw") {
          renderDraw();
          cell.removeEventListener("click", this);
          return;
        }

        PCPlays();
      });
    }
  });
}

function PCPlays() {
  renderCurrentPlayer();

  setTimeout(() => {
    // para que se ejecute una funcion un segundo y medio despues
    let played = false;
    const options = checkIfCanWin();

    if (options.length > 0) {
      // chequea si hay opciones
      const bestOption = options[0]; // cada opcion tiene su value y la posicion en i y en j
      for (let i = 0; i < bestOption.length; i++) {
        // aca recorremos la opcion
        if (bestOption[i].value === 0) {
          // quiere decir que la casilla esta vacia
          const posi = bestOption[i].i;
          const posj = bestOption[i].j;
          board[posi][posj] = "X"; // por ultimo voy a actualizar mi tablero
          played = true;
          break;
        }
      }
    } else {
      // si no hay opciones
      for (let i = 0; i < board.length; i++) {
        // recorro cada elemento de mi arreglo
        for (let j = 0; j < board[i].length; j++) {
          if (board[i][j] === "" && !played) {
            // si esta posicion esta vacia y no he jugado
            board[i][j] = "X"; // entonces en esa posicion coloca la X
            played = true;
          }
        }
      }
    }
    turn = 0;
    renderBoard();
    renderCurrentPlayer();

    const won = checkIfWinner();

    if (won === "none") {
      playerPlays();
      return;
    }

    if (won === "draw") {
      renderDraw(); // esta funcion no existe
      return;
    }
  }, 1500);
}

function renderDraw() {
  playerDiv.textContent = "Draw";
}

function checkIfCanWin() {
  // si ya tiene 2 casillas debo elegir la tercera para ganar
  const arr = JSON.parse(JSON.stringify(board)); // con esto se saca una copia profunda bidimensional del tablero actual

  for (let i = 0; i < arr.length; i++) {
    // aqui vamos a validar y recorrer con este doble arreglo
    for (let j = 0; j < arr.length; j++) {
      // eje de las columnas
      if (arr[i][j] === "X") {
        // x es la pc
        // nos toca sumar todas las posibilidades para saber si se puede ganar
        arr[i][j] = { value: 1, i, j }; // aca estoy sustituyendo la copia de mi tablero por objetos
      }
      if (arr[i][j] === "") {
        arr[i][j] = { value: 0, i, j }; // para saber si puedo ganar voy a sumar los valores / aca esta vacio
      }
      if (arr[i][j] === "O") {
        arr[i][j] = { value: -2, i, j }; // aca la casilla esta ocupada por el usuario
      }
    }
  }
  const p1 = arr[0][0]; // el siguiente punto es hacer la relacion de todas las casillas en variables
  const p2 = arr[0][1];
  const p3 = arr[0][2];
  const p4 = arr[1][0];
  const p5 = arr[1][1];
  const p6 = arr[1][2];
  const p7 = arr[2][0];
  const p8 = arr[2][1];
  const p9 = arr[2][2];

  const s1 = [p1, p2, p3]; // estas son todas las posibilidades en que puedo ganar el juego
  const s2 = [p4, p5, p6]; // cada una va a tener un objeto de tipo value con la posicion i y j
  const s3 = [p7, p8, p9]; // solo es sumar para que la pc escoja la casilla 3 cuando este vacio
  const s4 = [p1, p4, p7];
  const s5 = [p2, p5, p8];
  const s6 = [p3, p6, p9];
  const s7 = [p1, p5, p9];
  const s8 = [p3, p5, p7];

  const res = [s1, s2, s3, s4, s5, s6, s7, s8].filter((line) => {
    return (
      line[0].value + line[1].value + line[2].value === 2 || // solo las condiciones para ganar o
      line[0].value + line[1].value + line[2].value === -4 // para bloquear la jugada del usuario
    );
  });

  return res;
}

function checkIfWinner() {
  const p1 = board[0][0]; // el siguiente punto es hacer la relacion de todas las casillas en variables
  const p2 = board[0][1];
  const p3 = board[0][2];
  const p4 = board[1][0];
  const p5 = board[1][1];
  const p6 = board[1][2];
  const p7 = board[2][0];
  const p8 = board[2][1];
  const p9 = board[2][2];

  const s1 = [p1, p2, p3]; // estas son todas las posibilidades en que puedo ganar el juego
  const s2 = [p4, p5, p6]; // cada una va a tener un objeto de tipo value con la posicion i y j
  const s3 = [p7, p8, p9];
  const s4 = [p1, p4, p7];
  const s5 = [p2, p5, p8];
  const s6 = [p3, p6, p9];
  const s7 = [p1, p5, p9];
  const s8 = [p3, p5, p7];

  const res = [s1, s2, s3, s4, s5, s6, s7, s8].filter((line) => {
    return (
      line[0] + line[1] + line[2] === "XXX" ||
      line[0] + line[1] + line[2] === "OOO"
    );
  });

  if (res.length > 0) {
    // quiere decir que hay un ganador
    if (res[0][0] === "X") {
      playerDiv.textContent = "PC WINS";
      return "pcwon";
    } else {
      playerDiv.textContent = "USER WINS";
      return "userwon";
    }
  } else {
    let draw = true;
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board.length; j++) {
        if (board[i][j] === "") {
          // mientras haya una casilla vacia
          draw = false;
        }
      }
    }
    return draw ? "draw" : "none";
  }
}

function renderCurrentPlayer() {
  playerDiv.textContent = `
    ${turn === 0 ? "Player turn" : "PC Turn"}
  `;
}

function renderBoard() {
  const html = board.map((row) => {
    // este es un arreglo bidimensional
    const cells = row.map((cell) => {
      // a cada fila quiero que le agregues un map
      return `<button class = "cell">${cell}</button>`; // estoy poniendo adentro el valor de esa celda
    });
    return `<div class = "row">${cells.join("")}</div>`; // y despues debo insertarle una capa para acomodar cada una de las filas
  });

  boardContainer.innerHTML = html.join(""); // porque sigue siendo un arreglo
}
