class BossLife extends Life {
    #shields;
    #maxShields;

    constructor(maxLives, shields) {
        super(maxLives);
        this.#shields = shields;
        this.#maxShields = shields;
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

    drawHealthBar(x, y, barWidth, barHeight, maxHealth) {
        fill(50);
        rect(x, y, barWidth, barHeight);

        let healthPercent = this.getCurrentLives() / maxHealth;
        fill(255, 0, 0);
        rect(x, y, barWidth * healthPercent, barHeight);

        if (this.hasShield && this.#shields > 0) {
            let shieldPercent = this.#shields / this.#maxShields;
            fill(0, 150, 255, 150);
            rect(x, y, barWidth * shieldPercent, barHeight);
        }

        fill('black');
        textSize(14);
        textAlign(CENTER);
        text("HP: " + this.getCurrentLives() + " | Escudo: " + (this.hasShield ? this.#shields : "0"),
            x + barWidth / 2, y - 10);
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
