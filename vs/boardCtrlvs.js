var ctrl = {
    newGame: function() {
        currGame = new game(16, 16);
        board.writeBoard();
    },
    undo: function() {
        if (currGame.moveHistory.length > 0 && currGame.isGamming) {
            // Lấy nước đi cuối cùng từ lịch sử
            var lastMove = currGame.moveHistory.pop();
            // Xóa nước đi trên bàn cờ
            currGame.sq[lastMove.row][lastMove.col] = 0;
            board.sqUpdate(lastMove.row, lastMove.col);
            // Giảm số lượng quân cờ
            currGame.noOfPiece--;
            // Đổi lượt chơi về lượt trước đó
            currGame.Turn = lastMove.value === X ? X : O;
            alert('Cho Hồi 1 Nước Nè!....Chú Ý Lại Nha Bạn Ơi!...kkk...kkk...');
        } else {
            alert('Chưa có nước đi nào để quay lại hoặc trận đấu đã kết thúc!');
        }
    },
    resign: function() {
        if (currGame.isGamming) {
            // Xác định bên thắng dựa trên lượt hiện tại
            if (currGame.Turn === X) {
                alert('Bạn đã chịu thua!Bắt đầu ván mới nào!Vui vẻ lên nào...kkk...kkk...');
            } else {
                alert('Bạn đã chịu thua!Bắt đầu ván mới nào!Vui vẻ lên nào...kkk...kkk...');
            }
            currGame.isGamming = false; // Kết thúc ván hiện tại
            ctrl.newGame(); // Reset và bắt đầu ván mới
        } else {
            alert('Trận đấu đã kết thúc rồi, bắt đầu ván mới thôi!');
            ctrl.newGame(); // Nếu đã kết thúc, vẫn reset ván mới
        }
    },
    standUp: function() {
        alert('Chức năng gợi ý đã bị xóa vì giờ bạn tự điều khiển cả hai lượt!');
    }
};