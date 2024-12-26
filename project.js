  // Import prompt-sync library for user input
  const prompt = require("prompt-sync")();

  // Define the dimensions of the slot machine
  const ROWS = 3;
  const COLUMNS = 3;

  // Define how many of each symbol should appear in the game
  const SYMBOLS_COUNT = {
      A: 2,
      B: 4,
      C: 6,
      D: 8,
  }

  // Define the multiplier value for each symbol
  const SYMBOL_VALUES = {
      A: 5,
      B: 4,
      C: 3,
      D: 2,
  }

  // Function to handle player deposits
  const deposit = () => {
      while (true){
      const depositAmount = prompt("Enter the amount you want to deposit: ");
      const numberDepositAmount = parseFloat(depositAmount);

      if (isNaN(numberDepositAmount) || numberDepositAmount <= 0) {
          console.log("Please enter a valid Deposit.");
          deposit();
      } else {
          return numberDepositAmount;
      }
  }
  }

  // Function to get the number of lines the player wants to bet on
  const getNumberOfLines = () => {
      while (true) {
          const lines = prompt("Enter the number of lines (1-3): ");
          const numberOfLines = parseFloat(lines);

          if (isNaN(numberOfLines) || numberOfLines < 1 || numberOfLines > 3) {
              console.log("Please enter a valid number of lines.");
          } else {
              return numberOfLines;
          }
      }
  }

  // Function to get the bet amount per line
  const getBet = (balance, lines) => {
      while (true) {
          const bet = prompt("Enter the amount you want to bet per line: ");
          const numberBet = parseFloat(bet);

          if (isNaN(numberBet) || numberBet <= 0 || numberBet > balance/ lines) {
              console.log(" Invalid bet amount. Please try again.");
              getBet(balance);
          } else {
              return numberBet;
          }
      }
  }

  // Function to generate random slot machine spin
  const spin = () => {
      const symbols = [];
      // Create an array with the correct number of each symbol
      for (const [Symbol, count] of Object.entries(SYMBOLS_COUNT)){
          for (let i = 0; i < count; i++){
              symbols.push(Symbol);
          }
      }
    
      // Generate random symbols for each reel
      const reels = [];
      for (let i = 0; i < COLUMNS; i++){
          reels.push([]);
          const reelSymbols = [...symbols];
          for(let j = 0; j < ROWS; j++){
              const randomIndex = Math.floor(Math.random() * reelSymbols.length);
              const selectedSymbol = reelSymbols [randomIndex];
              reels[i].push(selectedSymbol);
              reelSymbols.splice(randomIndex, 1);
          }
      }
      return reels;
  };

  // Function to transpose the reels into rows for easier win checking
  const transpose = (reels) => {
      const rows = [];
      for (let i = 0; i < ROWS; i++){
          rows.push([]);
          for (let j = 0; j < COLUMNS; j++){
              rows[i].push(reels[j][i]);
          }
      }

      return rows;
  }

  // Function to print the slot machine rows
  const printRows = (rows) => {
      for (const row of rows){
          let rowString = "";
          for (const [i, symbol] of row.entries()){
              rowString += symbol;
              if (i < row.length - 1){
                  rowString += " | ";
              }
          }
          console.log(rowString);
      }
  }

  const getWinnings = (rows, bet, lines) => {
        let winnings = 0;
        for (let row = 0; row < lines; row++){
            const symbols = rows[row];
            let allSame = true;

            for (let i = 1; i < symbols.length; i++){
                if (symbols[i] !== symbols[0]){
                    allSame = false;
                    break;
                }
            }

            if (allSame){
                winnings += bet * SYMBOL_VALUES[symbols[0]];
            }
        }

        return winnings;
  } 

  const game = () => {
      let balance = deposit();

      while (true){
        
        console.log(`Your balance is ${balance}`);
      const lines = getNumberOfLines();
      const bet = getBet(balance, lines);
      balance -= bet * lines;
      const reels = spin();
      const rows = transpose(reels);
      printRows(rows);
      const winnings = getWinnings(rows, bet, lines);
      balance += winnings;
      console.log(`You won ${winnings}!`);

      if (balance <= 0){
          console.log("You ran out of money!");
          break;   
        }
        const playAgain = prompt("Do you want to play again? (y/n): ");
        if (playAgain !== "y"){
            break;
        }
      }
  };

game();