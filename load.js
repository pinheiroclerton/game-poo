class Load {
    static midia = {};

    static preloadImages() {
        this.midia.menu = loadImage("media/img/menu.png");
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
        this.midia.iconHealth = loadImage("media/img/icon-health.png");
        this.midia.iconPowerUp = loadImage("media/img/icon-powerup.png");
    }

    static preloadFonts() {
        this.midia.pixelFont = loadFont("fonts/Minecraft.ttf");
    }

    static preloadAll() {
        this.preloadImages();
        this.preloadFonts();
    }

    static get(name) {
        return this.midia[name];
    }

    static getAll() {
        return this.midia;
    }
}
