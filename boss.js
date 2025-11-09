class Boss extends Inimigo {
    #lifeSystem;
    
    constructor(x, y, l, a, health, shields) {
        super(x, y, l, a);
        this.#lifeSystem = new BossLife(health, shields);
        this.ultimate = new BossUltimate(5000, 3);
        this.moveDirection = 1;
        this.speed = 2;
        this.leftEdge = 30;
    }
    
    show(img) {
        super.show(img);
    }
    
    automove(speed, limit) {
        let newY = this.getY() + (this.moveDirection * this.speed);
        
        if (newY <= 0 - this.getH() || newY >= height - this.getH()) {
            this.moveDirection *= -1;
            newY = constrain(newY, 0 - this.getH(), height - this.getH());
        }
        
        this.setX(this.leftEdge);
        this.setY(constrain(newY, 0 - this.getH(), height - this.getH()));
    }
    
    takeDamage(damage) {
        this.#lifeSystem.takeDamage(damage);
        if (this.#lifeSystem.getCurrentLives() <= 3) {
            this.speed = 4;
        }
    }
    
    getHealth() {
        return this.#lifeSystem.getCurrentLives();
    }
    
    setHealth(value) {
        this.#lifeSystem.setCurrentLives(value);
    }
    
    getShields() {
        return this.#lifeSystem.getShields();
    }
    
    setShields(value) {
        this.#lifeSystem.setShields(value);
    }
    
    getHasShield() {
        return this.#lifeSystem.getHasShield();
    }
}
