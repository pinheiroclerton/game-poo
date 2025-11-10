class Bullet {
    #x;
    #y;
    #isEnemy;

    constructor(x, y, isEnemy = false) {
        this.#x = x;
        this.#y = y;
        this.#isEnemy = isEnemy;
    }

    show() {
        const bulletImage = this.#isEnemy ? Load.get('projectileEnemy') : Load.get('bullet1');
        image(bulletImage, this.#x, this.#y, 30, 10);
    }

    automove(speed, enemy) {
        if (enemy) {
            this.setX(this.getX() + speed);
        } else {
            this.setX(this.getX() - speed);
        }
    }

    getX() {
        return this.#x;
    }

    getY() {
        return this.#y;
    }

    getIsEnemy() {
        return this.#isEnemy;
    }

    getType() {
        return 1;
    }

    setX(x) {
        this.#x = x;
    }

    setY(y) {
        this.#y = y;
    }
}