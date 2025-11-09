class Item {
    #type;
    #value;
    #x;
    #y;
    #w;
    #h;
    #collected;

    constructor(x, y, type, value) {
        this.#x = x;
        this.#y = y;
        this.#type = type;
        this.#value = value;
        this.#collected = false;
        this.#w = 30;
        this.#h = 30;
    }

    show() {
        if (!this.#collected) {
            switch (this.#type) {
                case 'health':
                    image(Load.get('iconHealth'), this.#x, this.#y, this.#w, this.#h);
                    break;
                case 'power':
                    image(Load.get('iconPowerUp'), this.#x, this.#y, this.#w, this.#h);
                    break;
            }
        }
    }

    automove(speed) {
        this.#y += speed;
    }

    checkCollision(playerX, playerY, playerW, playerH) {
        if (!this.#collected) {
            let collision = collideRectRect(
                this.#x, this.#y, this.#w, this.#h,
                playerX, playerY, playerW, playerH
            );
            if (collision) {
                this.#collected = true;
                return true;
            }
        }
        return false;
    }

    getX() {
        return this.#x;
    }

    setX(x) {
        this.#x = x;
    }

    getY() {
        return this.#y;
    }

    setY(y) {
        this.#y = y;
    }

    getW() {
        return this.#w;
    }

    setW(w) {
        this.#w = w;
    }

    getH() {
        return this.#h;
    }

    setH(h) {
        this.#h = h;
    }

    getType() {
        return this.#type;
    }

    setType(type) {
        this.#type = type;
    }

    getValue() {
        return this.#value;
    }

    setValue(value) {
        this.#value = value;
    }

    isCollected() {
        return this.#collected;
    }

    setCollected(collected) {
        this.#collected = collected;
    }
}
