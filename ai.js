function AIthink(player, move) {
    var XX, YY;
    var bestMove;
    var maxDepth = 2; // Giảm độ sâu tìm kiếm để tăng tốc
    var startTime = new Date().getTime();
    var timeLimit = 800; // Giới hạn thời gian tính toán (ms) - giảm xuống để phản hồi nhanh hơn

    for (let depth = 1; depth <= maxDepth; depth++) {
        alphabeta(O, -Infinity, Infinity, depth);
        if (new Date().getTime() - startTime > timeLimit) {
            break; // Hết thời gian, dừng tìm kiếm
        }
        bestMove = {row: XX, col: YY}; // Lưu lại kết quả tốt nhất
    }

    move.row = bestMove.row;
    move.col = bestMove.col;

    function cval() { // evaluate the board
        var cval_value = 0;
        var val = function(XO) {
            var value = 0;

            // Đánh giá theo hàng, cột, đường chéo
            for (var i = 0; i < currGame.noOfRow; i++) {
                for (var j = 0; j < currGame.noOfCol; j++) {
                    // Kiểm tra theo hàng
                    value += evaluateLine(i, j, 0, 1, XO); // (row, col, row_increment, col_increment, XO)

                    // Kiểm tra theo cột
                    value += evaluateLine(i, j, 1, 0, XO);

                    // Kiểm tra theo đường chéo chính
                    value += evaluateLine(i, j, 1, 1, XO);

                    // Kiểm tra theo đường chéo phụ
                    value += evaluateLine(i, j, 1, -1, XO);
                }
            }

            return value;
        }

        function evaluateLine(row, col, row_increment, col_increment, XO) {
            var score = 0;
            var count = 0; // Số quân liên tiếp
            var blank = 0; // Số ô trống
            var opponent = (XO === X) ? O : X; // Xác định đối thủ

            // Duyệt 5 ô liên tiếp
            for (var i = 0; i < 5; i++) {
                var r = row + i * row_increment;
                var c = col + i * col_increment;

                // Kiểm tra xem ô có hợp lệ không
                if (r >= 0 && r < currGame.noOfRow && c >= 0 && c < currGame.noOfCol) {
                    if (currGame.sq[r][c] == XO) {
                        count++;
                    } else if (currGame.sq[r][c] == Empty) {
                        blank++;
                    } else {
                        return 0; // Gặp quân của đối phương
                    }
                } else {
                    return 0; // Ra khỏi bàn cờ
                }
            }

            // Tính điểm dựa trên số quân liên tiếp và số ô trống
            if (count == 5) {
                score += 1000000; // Thắng
            } else if (count == 4 && blank == 1) {
                score += 50000; // Gần thắng
            } else if (count == 3 && blank == 2) {
                score += 5000; // Thế cờ tốt
            } else if (count == 2 && blank == 3) {
                score += 500;
            }

            // Kiểm tra khả năng chặn đối phương
            var blockScore = 0;
            count = 0;
            blank = 0;

            for (var i = 0; i < 5; i++) {
                var r = row + i * row_increment;
                var c = col + i * col_increment;

                if (r >= 0 && r < currGame.noOfRow && c >= 0 && c < currGame.noOfCol) {
                    if (currGame.sq[r][c] == opponent) {
                        count++;
                    } else if (currGame.sq[r][c] == Empty) {
                        blank++;
                    } else {
                        break;
                    }
                } else {
                    break;
                }
            }

            if (count == 4 && blank == 1) {
                blockScore += 40000; // Chặn nước đi nguy hiểm của đối phương
            } else if (count == 3 && blank == 2) {
                blockScore += 4000;
            }

            score += blockScore;

            return score;
        }

        cval_value = val(O) - val(X); // O là bot, X là người chơi
        return cval_value;
    }

    function alphabeta(XO, alpha, beta, depth) {
        if (referee.isWin() == X) {
            return -999999999;
        }
        if (referee.isWin() == O) {
            return 999999999;
        }
        if (depth == 0) {
            return cval();
        }
        var moveGen = function(XO) {
            this.moveRow = new Array();
            this.moveCol = new Array();
            this.noOfMove = 0;
            var possi = new Array(); /* define an array storing possible position */
            for (var i = 0; i < currGame.noOfRow; i++) {
                possi[i] = new Array();
                for (var j = 0; j < currGame.noOfCol; j++) {
                    possi[i][j] = false;
                }
            }
            for (var i = 0; i < currGame.noOfRow; i++) {
                for (var j = 0; j < currGame.noOfCol; j++) {
                    if ((currGame.sq[i][j] == Empty) && (!possi[i][j])) {
                        for (var stepI = -1; stepI <= 1; stepI++) {
                            for (var stepJ = -1; stepJ <= 1; stepJ++) {
                                if (i + stepI >= 0 && i + stepI < currGame.noOfRow && j + stepJ >= 0 && j + stepJ < currGame.noOfCol) {
                                    if (currGame.sq[i + stepI][j + stepJ] != Empty) {
                                        possi[i][j] = true;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            this.moves = [];
			this.existingPieces = [];
            for (var i = 0; i < currGame.noOfRow; i++) {
                for (var j = 0; j < currGame.noOfCol; j++) {
                    if (possi[i][j]) {
                        this.noOfMove++;
                        this.moveRow[this.noOfMove] = i;
                        this.moveCol[this.noOfMove] = j;
						this.moves.push({row:i, col:j})

                    }
					if (currGame.sq[i][j] != Empty){
						this.existingPieces.push({row:i, col:j});
					}
                }
            }
			this.sortMoves = function() {
				this.moves.sort((a, b) => {
					if (this.existingPieces.length === 0){
						return 0;
					}
					let distA = Math.min(...this.existingPieces.map(p => Math.abs(p.row - a.row) + Math.abs(p.col - a.col)));
					let distB = Math.min(...this.existingPieces.map(p => Math.abs(p.row - b.row) + Math.abs(p.col - b.col)));
					return distA - distB;
				});
			}
			
        }
		
        var makeMove = function(moveBoard, movePointer, XO) {
            currGame.sq[moveBoard.moves[movePointer-1].row][moveBoard.moves[movePointer-1].col] = XO;
        }
        var undoMove = function(moveBoard, movePointer) {
            currGame.sq[moveBoard.moves[movePointer-1].row][moveBoard.moves[movePointer-1].col] = Empty;
        }
        var gen = new moveGen(XO);
		gen.sortMoves();
        var movePointer = 1;
        var score;
		
        if (XO == O) { //Max's turn
            while (movePointer <= gen.moves.length) {
                makeMove(gen, movePointer, XO);
                score = alphabeta(X, alpha, beta, depth - 1);
                undoMove(gen, movePointer);
                if (score > alpha) {
                    XX = gen.moves[movePointer-1].row;
                    YY = gen.moves[movePointer-1].col;
                    alpha = score; //(we have found a better best move)
                }
                if (alpha >= beta) return alpha //(cut off);
                movePointer++;
            }
            return alpha; //best move
        } else { //Min's turn
            while (movePointer <=  gen.moves.length) {
                makeMove(gen, movePointer, XO);
                score = alphabeta(O, alpha, beta, depth - 1);
                undoMove(gen, movePointer);
                if (score < beta) {
                    beta = score; //(opponent has found a better worse move)
                }
                if (alpha >= beta) return beta //(cut off);
                movePointer++;
            }
            return beta; //(this is the opponent's best move)
        }
    }
}