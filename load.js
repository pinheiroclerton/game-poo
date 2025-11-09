class Load {
    static midia = {};

    static preloadImages() {
        this.midia.menu = loadImage("media/img/menu.png");
        this.midia.menuP = loadImage("media/img/menu-p.png");
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
        this.midia.setas = loadImage("media/img/setas.png");
        this.midia.wasd = loadImage("media/img/wasd.png");
        this.midia.spacebar = loadImage("media/img/spacebar.png");
        this.midia.enter = loadImage("media/img/enter.png");
        this.midia.projectileEnemy = loadImage("media/img/projectileEnemy.png");
        this.midia.ultBoss = loadImage("media/img/ultBoss.png");
    }

    static preloadFonts() {
        this.midia.pixelFont = loadFont("fonts/Minecraft.ttf");
    }

    static preloadSounds() {
        this.midia.explosionSound = loadSound("media/sounds/explosion.mp3");
        this.midia.shootSound = loadSound("media/sounds/shoot.mp3");
        this.midia.ultimateSound = loadSound("media/sounds/ultimate.mp3");
        this.midia.themeSound = loadSound("media/sounds/Theme.mp3");
        this.midia.themeBossSound = loadSound("media/sounds/ThemeBoss.mp3");
    }

    static preloadAll() {
        this.preloadImages();
        this.preloadFonts();
        this.preloadSounds();
    }

    static get(name) {
        return this.midia[name];
    }

    static getAll() {
        return this.midia;
    }
}
