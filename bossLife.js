class BossLife extends Life {
    #shields;
    
    constructor(maxLives, shields) {
        super(maxLives);
        this.#shields = shields;
        this.hasShield = true;
        this.regenerating = false;
    }
    
    takeDamage(amount = 1) {
        if (!this.invulnerable) {
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
        return false;
    }
    
    regenerateShield(amount) {
        if (!this.hasShield && this.#shields < 100) {
            this.#shields += amount;
            if (this.#shields >= 100) {
                this.#shields = 100;
                this.hasShield = true;
            }
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
    
    isRegenerating() {
        return this.regenerating;
    }
    
    setRegenerating(value) {
        this.regenerating = value;
    }
}
