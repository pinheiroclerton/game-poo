class Nave {
    xNave;
    yNave;
    vidas = 3;
    constructor(x, y) {
        this.xNave = x;
        this.yNave = y;
    }
    
    show(img) {
        image(img, this.xNave, this.yNave, 100, 100);
    }

    getX() {
        return this.xNave;
    }

    getY() {
        return this.yNave;
    }

    getVidas() {
        return this.vidas;
    }

    setX(x) {
        this.xNave = x;
    }

    setY(y) {
        this.yNave = y;
    }

    setVidas(v) {
        this.vidas = v;
    }
}