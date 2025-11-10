class UltimateBullet extends Bullet {
    #damage;

    constructor(x, y, type, damage) {
        super(x, y, false);
        this.#damage = damage;
    }

    show() {
        image(Load.get('bullet2'), this.getX(), this.getY(), 20, 40);
    }

    getType() {
        return 2;
    }

    getDamage() {
        return this.#damage;
    }

    setDamage(value) {
        this.#damage = value;
    }
}
