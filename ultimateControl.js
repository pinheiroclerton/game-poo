class UltimateControl {
    #cooldown;
    #isReady;
    #power;

    constructor(cooldownTime, power = 1) {
        this.#cooldown = cooldownTime;
        this.#isReady = true;
        this.lastUsed = 0;
        this.#power = power;
    }

    use() {
        if (this.#isReady) {
            this.lastUsed = millis();
            this.#isReady = false;
            return true;
        }
        return false;
    }

    update() {
        if (!this.#isReady && millis() - this.lastUsed > this.#cooldown) {
            this.#isReady = true;
        }
    }

    getRemainingCooldown() {
        if (this.#isReady) return 0;
        let elapsed = millis() - this.lastUsed;
        return Math.max(0, this.#cooldown - elapsed);
    }

    getCooldown() {
        return this.#cooldown;
    }

    setCooldown(value) {
        this.#cooldown = value;
    }

    getIsReady() {
        return this.#isReady;
    }

    setIsReady(value) {
        this.#isReady = value;
    }

    getPower() {
        return this.#power;
    }

    setPower(value) {
        this.#power = value;
    }
}