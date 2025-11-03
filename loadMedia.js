class LoadMedia {
    static midia = {};

    static preloadImages() {
        this.midia.bkgd = loadImage("media/img/background.jpg");
        this.midia.bullet1 = loadImage("media/img/projectile_1.png");
        this.midia.bullet2 = loadImage("media/img/projectile_2.png");
        this.midia.mainShipIdle = loadImage("media/img/main-ship-idle.gif");
        this.midia.enemy1 = loadImage("media/img/enemy1.gif");
        this.midia.enemy2 = loadImage("media/img/enemy2.gif");
        this.midia.mainShipUp = loadImage("media/img/main-ship-up.gif");
        this.midia.mainShipDown = loadImage("media/img/main-ship-down.gif");
        this.midia.healthbar = loadImage("media/img/health-bar.png");
        this.midia.explosion = loadImage("media/img/explosion.gif");
        this.midia.explosionEnemy = loadImage("media/img/explosionEnemy.gif");
    }

    static preloadSounds() {
        this.midia.shootSound = loadSound("media/sounds/shoot.mp3");
        this.midia.explosionSound = loadSound("media/sounds/explosion.mp3");
        this.midia.ultimateSound = loadSound("media/sounds/ultimate.mp3");
    }

    static preloadAll() {
        this.preloadImages();
        this.preloadSounds();
    }

    static get(name) {
        return this.midia[name];
    }

    static getAll() {
        return this.midia;
    }
}
