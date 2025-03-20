const X = 1, O = 2, Empty = 0;

var currGame = new game(16, 16);
board.writeBoard();

function game(noOfRow, noOfCol) {
    this.noOfRow = noOfRow, this.noOfCol = noOfCol;
    this.Turn = X;
    this.isGamming = true; // currGame.isGamming or Not.
    this.noOfPiece = 0; // number of Pieces on the table -> to check draw
    this.sq = new Array(); /* define an array storing XO position */
    this.moveHistory = []; /* mảng lưu lịch sử nước đi */
    for (var i = 0; i < this.noOfRow; i++) {
        this.sq[i] = new Array();
        for (var j = 0; j < this.noOfCol; j++) {
            this.sq[i][j] = 0;
        }
    }
    this.sq[7][7] = X;
    this.sq[7][8] = O;
    this.sq[8][8] = X;
    this.sq[8][7] = O;
    
    // Hàm xử lý nước đi của X hoặc O
    this.makeMove = function(i, j) {
        if (this.isGamming && this.sq[i][j] == 0) {
            if (this.Turn == X) {
                this.sq[i][j] = X;
                board.sqUpdate(i, j);
                this.noOfPiece++;
                this.moveHistory.push({row: i, col: j, value: X}); // Lưu nước đi vào lịch sử
                this.Turn = O; // Chuyển lượt sang O
            } else if (this.Turn == O) {
                this.sq[i][j] = O;
                board.sqUpdate(i, j);
                this.noOfPiece++;
                this.moveHistory.push({row: i, col: j, value: O}); // Lưu nước đi vào lịch sử
                this.Turn = X; // Chuyển lượt sang X
            }
            referee.checkWin(); // Kiểm tra thắng/thua/hòa sau mỗi nước đi
        }
    };
}