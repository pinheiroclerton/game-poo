class Nave {
    #xNave;
    #yNave;
    #lifeSystem;
    
    constructor(x, y) {
        this.#xNave = x;
        this.#yNave = y;
        this.#lifeSystem = new Life(6);
    }
    
    show(img) {
        image(img, this.#xNave, this.#yNave, 100, 100);
    }

    getX() {
        return this.#xNave;
    }

    getY() {
        return this.#yNave;
    }

    getVidas() {
        return this.#lifeSystem.getCurrentLives();
    }

    setX(x) {
        this.#xNave = x;
    }

    setY(y) {
        this.#yNave = y;
    }

    setVidas(v) {
        this.#lifeSystem.setCurrentLives(v);
    }
    
    takeDamage(amount = 1) {
        return this.#lifeSystem.takeDamage(amount);
    }
    
    heal(amount = 1) {
        this.#lifeSystem.heal(amount);
    }
    
    isAlive() {
        return this.#lifeSystem.isAlive();
    }
    
    update() {
        this.#lifeSystem.update();
    }
}
