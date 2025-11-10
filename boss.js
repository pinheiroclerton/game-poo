class Boss extends Inimigo {
    #lifeSystem;
    #maxHealth;

    constructor(x, y, l, a, health, shields) {
        super(x, y, l, a);
        this.#maxHealth = health;
        this.#lifeSystem = new BossLife(health, shields);
        this.ultimate = new UltimateControl(5000, 3);
        this.moveDirection = 1;
        this.speed = 2;
    }

    show(img) {
        super.show(img);
    }

    automove(speed, limit) {
        let newY = this.getY() + (this.moveDirection * this.speed);
        newY = constrain(newY, 0 - this.getH(), height - this.getH());

        if (newY <= 0 - this.getH() || newY >= height - this.getH()) {
            this.moveDirection *= -1;
        }

        this.setX(this.getX());
        this.setY(newY);
    }

    takeDamage(damage) {
        this.#lifeSystem.takeDamage(damage);
        if (this.#lifeSystem.getCurrentLives() <= 9) {
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

    drawHealthBar(x, y, barWidth, barHeight) {
        this.#lifeSystem.drawHealthBar(x, y, barWidth, barHeight, this.#maxHealth);
    }
}
