const CELL_WIDTH = 35;
const CELL_HEIGHT = 35;

class TableCell {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = CELL_WIDTH;
        this.height = CELL_HEIGHT;
        this.value = 0;
        this.locked = false;
        this.color = COLORS.tableTextColor;
    }
}