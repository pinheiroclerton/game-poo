class BossLife extends Life {
    #shields;
    
    constructor(maxLives, shields) {
        super(maxLives);
        this.#shields = shields;
        this.hasShield = true;
    }
    
    takeDamage(amount = 1) {
        if (this.#shields > 0) {
            this.#shields -= amount;
            if (this.#shields < 0) {
                this.#shields = 0;
                this.hasShield = false;
            }
            return true;
        } else {
            return super.takeDamage(amount);
        }
    }
    
    getShields() {
        return this.#shields;
    }
    
    setShields(value) {
        this.#shields = value;
    }
    
    getHasShield() {
        return this.hasShield;
    }
}
