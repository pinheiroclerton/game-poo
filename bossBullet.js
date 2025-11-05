class BossBullet extends Bullet {
    #damage;
    
    constructor(x, y, type, damage) {
        super(x, y, type);
        this.#damage = damage;
        this.color = 'red';
        this.size = 1.5;
    }
    
    show() {
        push();
        tint(this.color);
        if (this.type == 1) {
            image(Load.get('bullet1'), this.x, this.y, 45, 15);
        } else {
            image(Load.get('bullet2'), this.x, this.y, 30, 60);
        }
        pop();
    }
    
    automove(speed, enemy) {
        if(enemy) {
            this.x = this.x + speed * 1.5;
        } else {
            this.x = this.x - speed * 1.5;
        }
    }
    
    getDamage() {
        return this.#damage;
    }
    
    setDamage(value) {
        this.#damage = value;
    }
    
    getColor() {
        return this.color;
    }
    
    setColor(color) {
        this.color = color;
    }
    
    getSize() {
        return this.size;
    }
    
    setSize(size) {
        this.size = size;
    }
}
