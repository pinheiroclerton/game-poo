class BossBullet extends Bullet {
    constructor(x, y, type, damage) {
        super(x, y, true);
        this.type = type;
        this.damage = damage;
        this.color = 'red';
    }
    
    show() {
        push();
        tint(this.color);
        if (this.type == 1) {
            image(Load.get('projectileEnemy'), this.getX(), this.getY(), 45, 15);
        } else {
            image(Load.get('ultBoss'), this.getX(), this.getY(), 30, 60);
        }
        pop();
    }
    
    automove(speed, enemy) {
        if(enemy) {
            this.setX(this.getX() + speed * 1.5);
        } else {
            this.setX(this.getX() - speed * 1.5);
        }
    }
    
    getDamage() {
        return this.damage;
    }
    
    setDamage(value) {
        this.damage = value;
    }
    
    getColor() {
        return this.color;
    }
    
    setColor(color) {
        this.color = color;
    }
}
