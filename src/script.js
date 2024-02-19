class Puissance4 {
  // Constructeur de la classe, prend l'ID de l'élément HTML où le jeu sera rendu, ainsi que le nombre de lignes et de colonnes du jeu (6 lignes et 7 colonnes par défaut)
  constructor(element_id, rows = 6, cols = 7) {
    // Initialisation des attributs de la classe
    this.rows = rows; // Nombre de lignes du jeu
    this.cols = cols; // Nombre de colonnes du jeu
    this.board = Array(this.rows); // Tableau représentant le plateau de jeu
    for (let i = 0; i < this.rows; i++) {
      this.board[i] = Array(this.cols).fill(0); // Initialisation de chaque cellule du plateau à 0 (vide)
    }
    this.turn = 1; // Indique le tour du joueur (1 pour le joueur 1, 2 pour le joueur 2)
    this.moves = 0; // Nombre de coups joués
    this.winner = null; // Indique le gagnant du jeu (null s'il n'y a pas encore de gagnant)
    this.element = document.querySelector(element_id); // Référence à l'élément HTML où le jeu sera rendu
    this.element.addEventListener('click', (event) => this.handle_click(event)); // Écouteur d'événement pour le clic sur la grille
    this.render(); // Méthode pour initialiser le rendu du jeu
  }

  // Méthode pour rendre le jeu dans l'élément HTML spécifié
  render() {
    let table = document.createElement('table'); // Création d'un élément <table> pour représenter le plateau de jeu
    for (let i = this.rows - 1; i >= 0; i--) {
      let tr = table.appendChild(document.createElement('tr')); // Création d'une ligne <tr> dans la table
      for (let j = 0; j < this.cols; j++) {
        let td = tr.appendChild(document.createElement('td')); // Création d'une cellule <td> dans la ligne
        let colour = this.board[i][j]; // Couleur du jeton dans la cellule
        if (colour)
          td.className = 'player' + colour; // Ajout de classe pour styliser le jeton du joueur correspondant
        td.dataset.column = j; // Attribution d'un attribut data-column contenant le numéro de colonne
      }
    }
    this.element.innerHTML = ''; // Nettoyage de l'élément HTML où le jeu sera rendu
    this.element.appendChild(table); // Ajout de la table dans l'élément HTML
  }

  // Méthode pour définir une case avec le joueur et mettre à jour le nombre de coups
  set(row, column, player) {
    this.board[row][column] = player; // Définition du joueur dans la case spécifiée
    this.moves++; // Incrémentation du nombre de coups joués
  }

  // Méthode pour jouer un coup dans la colonne spécifiée
  play(column) {
    let row;
    for (let i = 0; i < this.rows; i++) {
      if (this.board[i][column] == 0) {
        row = i; // Trouver la première case vide dans la colonne spécifiée
        break;
      }
    }
    if (row === undefined) {
      return null; // Retourner null si la colonne est pleine
    } else {
      this.set(row, column, this.turn); // Jouer le coup dans la case vide
      return row; // Retourner le numéro de ligne où le jeton a été placé
    }
  }

  // Gestionnaire d'événement pour le clic sur la grille
  handle_click(event) {
    // Vérifier s'il y a déjà un gagnant ou si le jeu est terminé
    if (this.winner !== null) {
      // Proposer de redémarrer le jeu si c'est terminé
      if (window.confirm("Game over!\n\nDo you want to restart?")) {
        this.reset(); // Réinitialiser le jeu
        this.render(); // Rendre à nouveau le jeu
      }
      return;
    }
    let column = event.target.dataset.column;
    if (column !== undefined) {
      column = parseInt(column);
      let row = this.play(parseInt(column)); // Jouer le coup dans la colonne spécifiée
      if (row === null) {
        window.alert("Column is full!"); // Alerte si la colonne est pleine
      } else {
        // Vérifier s'il y a un gagnant après le coup
        if (this.win(row, column, this.turn)) {
          this.winner = this.turn; // Définir le joueur gagnant
        } else if (this.moves >= this.rows * this.cols) {
          this.winner = 0; // Définir le jeu comme nul si toutes les cases sont remplies
        }
        // Passer au tour suivant
        this.turn = 3 - this.turn;
        this.render(); // Rendre à nouveau le jeu après le coup
        // Afficher un message en fonction du résultat du jeu
        switch (this.winner) {
          case 0:
            window.alert("Null game!!");
            break;
          case 1:
            window.alert("Player 1 wins");
            break;
          case 2:
            window.alert("Player 2 wins");
            break;
        }
      }
    }
  }

  // Méthode pour vérifier s'il y a un gagnant après chaque coup
  win(row, column, player) {
    // Vérifier les lignes, les colonnes et les diagonales à partir de la dernière case jouée
    let count = 0;
    for (let j = 0; j < this.cols; j++) {
      count = (this.board[row][j] == player) ? count + 1 : 0;
      if (count >= 4) return true; // S'il y a 4 jetons alignés, le joueur gagne
    }
    count = 0;
    for (let i = 0; i < this.rows; i++) {
      count = (this.board[i][column] == player) ? count + 1 : 0;
      if (count >= 4) return true;
    }
    count = 0;
    let shift = row - column;
    for (let i = Math.max(shift, 0); i < Math.min(this.rows, this.cols + shift); i++) {
      count = (this.board[i][i - shift] == player) ? count + 1 : 0;
      if (count >= 4) return true;
    }
    count = 0;
    shift = row + column;
    for (let i = Math.max(shift - this.cols + 1, 0); i < Math.min(this.rows, shift + 1); i++) {
      count = (this.board[i][shift - i] == player) ? count + 1 : 0;
      if (count >= 4) return true;
    }
    return false;
  }

  // Méthode pour réinitialiser le jeu
  reset() {
    // Réinitialiser chaque case du plateau à 0 (vide)
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        this.board[i][j] = 0;
      }
    }
    this.moves = 0; // Réinitialiser le nombre de coups joués
    this.winner = null; // Réinitialiser le gagnant du jeu
  }
}

// Créer une instance de Puissance4 avec l'ID de l'élément HTML où le jeu sera rendu
let p4 = new Puissance4('#game');
