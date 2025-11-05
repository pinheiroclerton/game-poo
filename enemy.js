class Inimigo extends Nave{
    #w;
    #h;

    constructor(x, y, l, a) {
        super(x, y);
        this.#w = l;
        this.#h = a;
    }
    show(img) {
        image(img, this.getX(), this.getY(), this.getW(), this.getH());
    }
    automove(speed, limit) {
        this.setY(this.getY() + speed);
        if (this.getY() > limit) {
            this.setY(0);
            this.setX(random(20, 180));
        }
    }

    getW() {
        return this.#w;
    }

    getH() {
        return this.#h;
    }

    setW(w) {
        this.#w = w;
    }

    setH(h) {
        this.#h = h;
    }
}