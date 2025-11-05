class BossUltimate extends Ultimate {
    #power;
    
    constructor(cooldownTime, power) {
        super(cooldownTime);
        this.#power = power;
        this.attackMode = 'normal';
        this.burstCount = 3;
    }
    
    use() {
        if (super.use()) {
            this.attackMode = 'burst';
            return true;
        }
        return false;
    }
    
    update() {
        super.update();
        
        if (!this.active && this.attackMode === 'burst') {
            this.attackMode = 'normal';
        }
    }
    
    getPower() {
        return this.#power;
    }
    
    setPower(value) {
        this.#power = value;
    }
    
    getAttackMode() {
        return this.attackMode;
    }
    
    setAttackMode(mode) {
        this.attackMode = mode;
    }
    
    getBurstCount() {
        return this.burstCount;
    }
    
    setBurstCount(count) {
        this.burstCount = count;
    }
}
