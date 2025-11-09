class UltimateBullet extends Bullet {
    #damage;
    
    constructor(x, y, type, damage) {
        super(x, y, type);
        this.#damage = damage;
    }
    
    getDamage() {
        return this.#damage;
    }
    
    setDamage(value) {
        this.#damage = value;
    }
}
