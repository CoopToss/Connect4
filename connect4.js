// Connect Four Game

class Game {
    constructor(p1, p2, height = 6, width = 7) {
      // Initialize the game with players, board height and width, current player, and game state
      this.players = [p1, p2];
      this.height = height;
      this.width = width;
      this.currPlayer = p1;
      this.makeBoard(); // Create the game board in JavaScript
      this.makeHtmlBoard(); // Create the HTML representation of the game board
      this.gameOver = false; // Set initial game state to not over
    }
  
    /** makeBoard: create in-JS board structure:
     *   board = array of rows, each row is array of cells  (board[y][x])
     */
    makeBoard() {
      // Create an empty board as a 2D array
      this.board = [];
      for (let y = 0; y < this.height; y++) {
        this.board.push(Array.from({ length: this.width }));
      }
    }
  
    /** makeHtmlBoard: make HTML table and row of column tops.  */
    makeHtmlBoard() {
      const board = document.getElementById('board'); // Get the board element from HTML
      board.innerHTML = ''; // Clear any existing content in the board
  
      // Create clickable areas for dropping pieces (column tops)
      const top = document.createElement('tr');
      top.setAttribute('id', 'column-top');
  
      // Add event listener to handle clicks on column tops
      this.handleGameClick = this.handleClick.bind(this);
      top.addEventListener("click", this.handleGameClick);
  
      // Create the column tops
      for (let x = 0; x < this.width; x++) {
        const headCell = document.createElement('td');
        headCell.setAttribute('id', x);
        top.append(headCell);
      }
  
      board.append(top); // Append the column tops to the board
  
      // Create the main part of the board
      for (let y = 0; y < this.height; y++) {
        const row = document.createElement('tr');
      
        for (let x = 0; x < this.width; x++) {
          const cell = document.createElement('td');
          cell.setAttribute('id', `${y}-${x}`);
          row.append(cell);
        }
      
        board.append(row);
      }
    }
  
    /** findSpotForCol: given column x, return top empty y (null if filled) */
    findSpotForCol(x) {
      // Find the top empty cell in the specified column
      for (let y = this.height - 1; y >= 0; y--) {
        if (!this.board[y][x]) {
          return y;
        }
      }
      return null; // Return null if column is already filled
    }
  
    /** placeInTable: update DOM to place piece into HTML board */
    placeInTable(y, x) {
      // Place a piece into the specified cell of the HTML board
      const piece = document.createElement('div');
      piece.classList.add('piece');
      piece.style.backgroundColor = this.currPlayer.color;
      piece.style.top = -50 * (y + 2); // Offset to animate dropping piece
  
      const spot = document.getElementById(`${y}-${x}`);
      spot.append(piece);
    }
  
    /** endGame: announce game end */
    endGame(msg) {
      // Display game end message
      alert(msg);
      const top = document.querySelector("#column-top");
      top.removeEventListener("click", this.handleGameClick); // Remove event listener
    }
  
    /** handleClick: handle click of column top to play piece */
    handleClick(evt) {
      // Get x-coordinate of clicked column
      const x = +evt.target.id;
  
      // Get next available spot in column (if none, ignore click)
      const y = this.findSpotForCol(x);
      if (y === null) {
        return;
      }
  
      // Place piece in board and add to HTML table
      this.board[y][x] = this.currPlayer;
      this.placeInTable(y, x);
  
      // Check for tie
      if (this.board.every(row => row.every(cell => cell))) {
        return this.endGame('Tie!');
      }
  
      // Check for win
      if (this.checkForWin()) {
        this.gameOver = true;
        return this.endGame(`The ${this.currPlayer.color} player won!`);
      }
  
      // Switch players
      this.currPlayer =
        this.currPlayer === this.players[0] ? this.players[1] : this.players[0];
    }
  
    /** checkForWin: check board cell-by-cell for "does a win start here?" */
    checkForWin() {
      // Function to check if there is a win starting from given cells
      const _win = cells =>
        cells.every(
          ([y, x]) =>
            y >= 0 &&
            y < this.height &&
            x >= 0 &&
            x < this.width &&
            this.board[y][x] === this.currPlayer
        );
  
      // Iterate through all cells to check for wins in different directions
      for (let y = 0; y < this.height; y++) {
        for (let x = 0; x < this.width; x++) {
          const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
          const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
          const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
          const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];
  
          // Check for win in each direction
          if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
            return true; // Return true if there is a win
          }
        }
      }
    }
}

// Player class for storing player information
class Player {
    constructor(color) {
      this.color = color;
    }
}

// Event listener for starting the game when the "Start Game" button is clicked
document.getElementById('start-game').addEventListener('click', () => {
    // Create player objects with colors entered by users
    let p1 = new Player(document.getElementById('p1-color').value);
    let p2 = new Player(document.getElementById('p2-color').value);
    new Game(p1, p2); // Start a new game with the players
});
