class Bullet {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
    }
    show() {
        if (this.type == 1) {
            image(bullet1, this.x, this.y, 30, 10);
        } else {
            image(bullet2, this.x, this.y, 20, 40);
        }
    }
    automove(speed, enemy) {
        if(enemy) {
            this.x = this.x + speed;
        } else {
            this.x = this.x - speed;
        }
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }

    getType() {
        return this.type;
    }

    setX(x) {
        this.x = x;
    }

    setY(y) {
        this.y = y;
    }

    setType(t) {
        this.type = t;
    }
}