var ctrl = {
    newGame: function() {
        currGame = new game(16, 16);
        board.writeBoard();
    },
    undo: function() {
        if (currGame.moveHistory.length > 0 && currGame.isGamming && currGame.Turn == X) {
            // Kiểm tra xem có ít nhất 2 nước đi (của X và O) để lùi
            if (currGame.moveHistory.length < 2) {
                alert('Không đủ nước đi để lùi cả hai lượt!');
                return;
            }

            // Lấy nước đi cuối cùng (của Bot - O)
            var lastMoveIndex = currGame.moveHistory.length - 1;
            var lastMoveBot = currGame.moveHistory[lastMoveIndex];
            
            // Lấy nước đi của người chơi (X) trước đó
            var playerMoveIndex = lastMoveIndex - 1;
            var lastMovePlayer = currGame.moveHistory[playerMoveIndex];

            // Kiểm tra xem nước đi có đúng là của Bot và Người chơi không
            if (lastMoveBot.value !== O || lastMovePlayer.value !== X) {
                alert('Không tìm thấy cặp nước đi hợp lệ để lùi!');
                return;
            }

            // Xóa nước đi của Bot
            currGame.sq[lastMoveBot.row][lastMoveBot.col] = 0;
            board.sqUpdate(lastMoveBot.row, lastMoveBot.col);
            currGame.noOfPiece--;
            
            // Xóa nước đi của Người chơi
            currGame.sq[lastMovePlayer.row][lastMovePlayer.col] = 0;
            board.sqUpdate(lastMovePlayer.row, lastMovePlayer.col);
            currGame.noOfPiece--;
            
            // Xóa cả hai nước đi khỏi lịch sử
            currGame.moveHistory.splice(playerMoveIndex, 2);
            currGame.Turn = X; // Giữ lượt cho người chơi
            alert('Đã lùi lại nước đi của cả bạn và Bot! Tiếp tục nhé!');
        } else {
            alert('Không thể lùi lại: Chưa có nước đi hoặc không phải lượt của bạn!');
        }
    },
    resign: function() {
        alert('Đánh Với Bot Mà Chịu Thua Gì ...!...kkk...kkk...! Thôi Làm lại Ván Mới Nè...!');
        currGame.isGamming = false;
        ctrl.newGame();
    },
    standUp: function() {
        if (currGame.Turn == X) {
            var bestMove = {row: 0, col:0};
            AIthink(X, bestMove);
            currGame.sq[bestMove.row][bestMove.col] = X;
            board.sqUpdate(bestMove.row, bestMove.col);
            referee.checkWin();
            currGame.Turn = O;
            currGame.noOfPiece++;
        } else {
            var bestMove = {row:0, col:0};
            AIthink(O, bestMove);
            currGame.sq[bestMove.row][bestMove.col] = O;
            board.sqUpdate(bestMove.row, bestMove.col);
            referee.checkWin();
            currGame.Turn = X;
            currGame.noOfPiece++;
        }
    }
};