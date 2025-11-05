class Life {
    #currentLives;
    #maxLives;
    
    constructor(maxLives) {
        this.#maxLives = maxLives;
        this.#currentLives = maxLives;
        this.invulnerable = false;
        this.invulnerabilityTime = 0;
    }
    
    takeDamage(amount = 1) {
        if (!this.invulnerable) {
            this.#currentLives -= amount;
            if (this.#currentLives < 0) {
                this.#currentLives = 0;
            }
            return true;
        }
        return false;
    }
    
    heal(amount = 1) {
        this.#currentLives += amount;
        if (this.#currentLives > this.#maxLives) {
            this.#currentLives = this.#maxLives;
        }
    }
    
    isAlive() {
        return this.#currentLives > 0;
    }
    
    isDead() {
        return this.#currentLives <= 0;
    }
    
    setInvulnerable(duration) {
        this.invulnerable = true;
        this.invulnerabilityTime = millis() + duration;
    }
    
    update() {
        if (this.invulnerable && millis() > this.invulnerabilityTime) {
            this.invulnerable = false;
        }
    }
    
    getCurrentLives() {
        return this.#currentLives;
    }
    
    setCurrentLives(value) {
        this.#currentLives = value;
        if (this.#currentLives > this.#maxLives) {
            this.#currentLives = this.#maxLives;
        }
    }
    
    getMaxLives() {
        return this.#maxLives;
    }
    
    setMaxLives(value) {
        this.#maxLives = value;
    }
    
    getInvulnerable() {
        return this.invulnerable;
    }
}
