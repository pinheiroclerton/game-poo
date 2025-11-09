class BossUltimateBullet extends UltimateBullet {
    constructor(x, y, type, damage) {
        super(x, y, type, damage);
        this.color = 'red';
    }
    
    show() {
        push();
        tint(this.color);
        image(Load.get('bullet2'), this.x, this.y, 30, 60);
        pop();
    }
    
    automove(speed, enemy) {
        if(enemy) {
            this.x = this.x + speed * 1.5;
        } else {
            this.x = this.x - speed * 1.5;
        }
    }
    
    getColor() {
        return this.color;
    }
    
    setColor(color) {
        this.color = color;
    }
}
