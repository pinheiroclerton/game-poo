class BossUltimate extends UltimateControl {
    #power;
    
    constructor(cooldownTime, power) {
        super(cooldownTime);
        this.#power = power;
    }
    
    getPower() {
        return this.#power;
    }
    
    setPower(value) {
        this.#power = value;
    }
}
