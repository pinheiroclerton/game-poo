class PlayerUltimate extends UltimateBullet {
    constructor(x, y, type, damage) {
        super(x, y, type, damage);
    }
    
    show() {
        image(Load.get('bullet2'), this.x, this.y, 20, 40);
    }
}
