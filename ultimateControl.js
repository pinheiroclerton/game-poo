class UltimateControl {
    #cooldown;
    #isReady;
    
    constructor(cooldownTime) {
        this.#cooldown = cooldownTime;
        this.#isReady = true;
        this.lastUsed = 0;
        this.duration = 3000;
        this.active = false;
    }
    
    use() {
        if (this.#isReady) {
            this.active = true;
            this.lastUsed = millis();
            this.#isReady = false;
            
            return true;
        }
        return false;
    }
    
    update() {
        let currentTime = millis();
        
        if (this.active && currentTime - this.lastUsed > this.duration) {
            this.active = false;
        }
        
        if (!this.#isReady && currentTime - this.lastUsed > this.#cooldown) {
            this.#isReady = true;
        }
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
    
    getRemainingCooldown() {
        if (this.#isReady) return 0;
        let elapsed = millis() - this.lastUsed;
        return Math.max(0, this.#cooldown - elapsed);
    }
}
