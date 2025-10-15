class Inimigo extends Nave{
    constructor(x, y, l, a) {
        super(x, y);
        this.w = l;
        this.h = a;
    }
    show(img) {
        image(img, this.xNave, this.yNave, this.w, this.h);
    }
    automove(speed, limit) {
        this.yNave = this.yNave + speed;
        if (this.yNave > limit) {
            this.yNave = 0;
            this.xNave = random(20, 180);
        }
    }

    getW() {
        return this.w;
    }

    getH() {
        return this.h;
    }

    setW(w) {
        this.w = w;
    }

    setH(h) {
        this.h = h;
    }
}