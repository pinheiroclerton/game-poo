class Item {
    #type;
    #value;
    
    constructor(x, y, type, value) {
        this.x = x;
        this.y = y;
        this.#type = type;
        this.#value = value;
        this.collected = false;
        this.w = 30;
        this.h = 30;
    }
    
    show() {
        if (!this.collected) {
            push();
            switch(this.#type) {
                case 'health':
                    image(Load.get('iconHealth'), this.x, this.y, this.w, this.h);
                    break;
                case 'power':
                    image(Load.get('iconPowerUp'), this.x, this.y, this.w, this.h);
                    break;
                default:
                    fill(255);
            }
            pop();
        }
    }
    
    automove(speed) {
        this.y += speed;
    }
    
    checkCollision(playerX, playerY, playerW, playerH) {
        if (!this.collected) {
            let collision = collideRectRect(
                this.x, this.y, this.w, this.h,
                playerX, playerY, playerW, playerH
            );
            if (collision) {
                this.collected = true;
                return true;
            }
        }
        return false;
    }
    
    getType() {
        return this.#type;
    }
    
    setType(type) {
        this.#type = type;
    }
    
    getValue() {
        return this.#value;
    }
    
    setValue(value) {
        this.#value = value;
    }
    
    isCollected() {
        return this.collected;
    }
}
