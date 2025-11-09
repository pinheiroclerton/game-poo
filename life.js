class Life {
    #currentLives;
    #maxLives;
    
    constructor(maxLives) {
        this.#maxLives = maxLives;
        this.#currentLives = maxLives;
    }
    
    takeDamage(amount = 1) {
        this.#currentLives -= amount;
        if (this.#currentLives < 0) {
            this.#currentLives = 0;
        }
        return true;
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
    
    getCurrentLives() {
        return this.#currentLives;
    }
    
    setCurrentLives(value) {
        this.#currentLives = value;
        if (this.#currentLives > this.#maxLives) {
            this.#currentLives = this.#maxLives;
        }
    }
}
