var gameState = 'menu';
var gameOver = false;
var score = 0;

var playButton, instructionsButton, creditsButton, backButton, menuButton, winMenuButton;

var player, playerAmmunition;
var player2, player2Ammunition;
var player2Visible = false;
var playerBulletCount = 1;
var player2BulletCount = 1;
var ultimate;
var ultimate2;

var enemies = [];
var enemyAmmunition;
var boss = null;
var bossSpawned = false;
var enemiesKilled = 0;
var bossLastShot = 0;

var enemySpawnTimer = 0;
var enemySpawnRate = 60;
var itemSpawnTimer = 0;
var itemSpawnRate = 300;
var items = [];

var lastShootButton = false;
var lastUltimateButton = false;
var lastPlayer2Shoot = false;
var lastPlayer2Ultimate = false;
var lastMenuButton = false;
var gamePaused = false;
var lastPauseButton = false;
var lastEscKey = false;
var gameStartDelay = 0;

function preload() {
    Load.preloadAll();
}

function setup() {
    createCanvas(1425, 660);
    textFont(Load.get('pixelFont'));

    createMenuButtons();

    initializeGame();
}

function draw() {
    if (gameState === 'menu') {
        drawMenu();
    } else if (gameState === 'instructions') {
        drawInstructions();
    } else if (gameState === 'credits') {
        drawCredits();
    } else if (gameState === 'playing') {
        drawGame();
    } else if (gameState === 'gameover') {
        drawGameOver();
    } else if (gameState === 'win') {
        drawWin();
    }
}

function initializeGame() {
    player = new Nave(width - 200, (height / 2) + 50);
    player2 = new Nave(width - 200, (height / 2) - 50);
    playerAmmunition = [];
    player2Ammunition = [];
    enemyAmmunition = [];
    enemies = [];
    items = [];
    enemySpawnTimer = 0;
    itemSpawnTimer = 0;
    enemiesKilled = 0;
    bossSpawned = false;
    boss = null;
    playerBulletCount = 1;
    gameOver = false;
    score = 0;
    gamePaused = false;

    lastShootButton = false;
    lastUltimateButton = false;
    lastPlayer2Shoot = false;
    lastPlayer2Ultimate = false;
    lastMenuButton = false;
    gameStartDelay = 30;

    ultimate = new UltimateControl(10000);
    ultimate2 = new UltimateControl(10000);

    Load.get('themeSound').loop();

    spawnEnemy();
    spawnEnemy();
}

function drawGame() {
    background(Load.get('bkgd'));

    playButton.hide();
    instructionsButton.hide();
    creditsButton.hide();
    backButton.hide();
    menuButton.hide();
    winMenuButton.hide();

    checkPause();

    if (gameStartDelay > 0) {
        gameStartDelay--;
    }

    if (!gamePaused) {
        spawnEnemiesOverTime();
        bossSpawn();
        spawnItemsOverTime();
        updateEnemies();
        updateBoss();
        updateItems();
        enemyShot();
        bossShot();
        drawBullets();
        if (player2Visible) {
            drawPlayer2Bullets();
        }
        drawEnemyBullets();
        ultimate.update();
        if (player2Visible) {
            ultimate2.update();
        }
        checkLife();
    }

    gamecontrol();
    gerenciarVidas(player.getVidas());
    drawUltimateBar();
    drawScore();

    if (gamePaused) {
        drawPauseOverlay();
    }

    checkGameOver();
}

function checkLife() {
    if (player.getVidas() <= 0) {
        player.setVidas(0);
    }
    if (player2.getVidas() <= 0) {
        player2.setVidas(0);
    }
}

function checkGameOver() {
    if (!player2Visible && player.getVidas() <= 0 && !gameOver) {
        gameOver = true;
        gameState = 'gameover';
    }
    else if (player2Visible && player.getVidas() <= 0 && player2.getVidas() <= 0 && !gameOver) {
        gameOver = true;
        gameState = 'gameover';
    }
}

function keyPressed() {
    if (gameState !== 'playing' && keyCode == 32 && !lastMenuButton) {
        if (gameState === 'menu') {
            showInstructions();
        } else if (gameState === 'instructions') {
            startGame();
        } else if (gameState === 'credits') {
            returnToMenu();
        } else if (gameState === 'gameover') {
            showCredits();
        } else if (gameState === 'win') {
            showCredits();
        }
        lastMenuButton = true;
    }

    if (keyCode != 32) {
        lastMenuButton = false;
    }

    if (keyCode === 80 && gameState === 'playing') {
        player2Visible = !player2Visible;
        if (player2Visible) {
            player2.setVidas(10);
        }
    }

    if (gameState === 'playing' && player && player.getVidas() > 0 && !gamePaused && gameStartDelay === 0) {
        if (keyCode === 67 && !lastShootButton) {
            Load.get('shootSound').play();
            if (playerBulletCount === 1) {
                let b = new Bullet(player.getX(), player.getY() + 45);
                playerAmmunition.push(b);
            } else if (playerBulletCount >= 2) {
                let b1 = new Bullet(player.getX(), player.getY() + 25);
                let b2 = new Bullet(player.getX(), player.getY() + 65);
                playerAmmunition.push(b1);
                playerAmmunition.push(b2);
            }
            lastShootButton = true;
        } else if (keyCode === 86 && !lastUltimateButton) {
            if (ultimate.use()) {
                Load.get('ultimateSound').play();
                let b = new UltimateBullet(player.getX(), player.getY() + 30, 2, 4);
                playerAmmunition.push(b);
            }
            lastUltimateButton = true;
        }
    }

    if (gameState === 'playing' && player2Visible && player2 && player2.getVidas() > 0 && !gamePaused && gameStartDelay === 0) {
        if (keyCode === 78 && !lastPlayer2Shoot) {
            Load.get('shootSound').play();
            if (player2BulletCount === 1) {
                let b = new Bullet(player2.getX(), player2.getY() + 45);
                player2Ammunition.push(b);
            } else if (player2BulletCount >= 2) {
                let b1 = new Bullet(player2.getX(), player2.getY() + 25);
                let b2 = new Bullet(player2.getX(), player2.getY() + 65);
                player2Ammunition.push(b1);
                player2Ammunition.push(b2);
            }
            lastPlayer2Shoot = true;
        } else if (keyCode === 77 && !lastPlayer2Ultimate) {
            if (ultimate2.use()) {
                Load.get('ultimateSound').play();
                let b = new UltimateBullet(player2.getX(), player2.getY() + 30, 2, 4);
                player2Ammunition.push(b);
            }
            lastPlayer2Ultimate = true;
        }
    }
}

function keyReleased() {
    if (keyCode === 32) {
        lastMenuButton = false;
    }
    if (keyCode === 67) {
        lastShootButton = false;
    }
    if (keyCode === 86) {
        lastUltimateButton = false;
    }
    if (keyCode === 78) {
        lastPlayer2Shoot = false;
    }
    if (keyCode === 77) {
        lastPlayer2Ultimate = false;
    }
}

function gamecontrol() {
    if (gamePaused) {
        if (player.getVidas() > 0) {
            player.show(Load.get('mainShipIdle'));
        }
        if (player2Visible && player2.getVidas() > 0) {
            player2.show(Load.get('mainShipIdle'));
        }
        return;
    }

    let p1IsMovingUp = false;
    let p1IsMovingDown = false;
    let p2IsMovingUp = false;
    let p2IsMovingDown = false;

    let gp = navigator.getGamepads();

    if (gp[0]) {
        if ((gp[0].axes[1] < -0.2) && player.getY() > 0) {
            player.setY(player.getY() - 5);
            p1IsMovingUp = true;
        }
        if ((gp[0].axes[1] > 0.2) && player.getY() < height - 100) {
            player.setY(player.getY() + 5);
            p1IsMovingDown = true;
        }
        if ((gp[0].axes[0] < -0.2) && player.getX() > 0) {
            player.setX(player.getX() - 5);
        }
        if ((gp[0].axes[0] > 0.2) && player.getX() < width - 100) {
            player.setX(player.getX() + 5);
        }

        if (player.getVidas() > 0 && !gamePaused && gameStartDelay === 0) {
            if (gp[0].buttons[1].pressed && !lastShootButton) {
                Load.get('shootSound').play();
                if (playerBulletCount === 1) {
                    let b = new Bullet(player.getX(), player.getY() + 45);
                    playerAmmunition.push(b);
                } else if (playerBulletCount >= 2) {
                    let b1 = new Bullet(player.getX(), player.getY() + 25);
                    let b2 = new Bullet(player.getX(), player.getY() + 65);
                    playerAmmunition.push(b1);
                    playerAmmunition.push(b2);
                }
                lastShootButton = true;
            } else if (!gp[0].buttons[1].pressed) {
                lastShootButton = false;
            }

            if (gp[0].buttons[2].pressed && !lastUltimateButton) {
                if (ultimate.use()) {
                    Load.get('ultimateSound').play();
                    let b = new UltimateBullet(player.getX(), player.getY() + 30, 2, 4);
                    playerAmmunition.push(b);
                }
                lastUltimateButton = true;
            } else if (!gp[0].buttons[2].pressed) {
                lastUltimateButton = false;
            }
        }
    }

    if (player.getVidas() > 0) {
        if (keyIsDown(87) && player.getY() > 0) {
            player.setY(player.getY() - 5);
            p1IsMovingUp = true;
        }
        if (keyIsDown(83) && player.getY() < height - 100) {
            player.setY(player.getY() + 5);
            p1IsMovingDown = true;
        }
        if (keyIsDown(65) && player.getX() > 0) {
            player.setX(player.getX() - 5);
        }
        if (keyIsDown(68) && player.getX() < width - 100) {
            player.setX(player.getX() + 5);
        }
    }

    if (player2Visible && player2.getVidas() > 0) {
        if (keyIsDown(UP_ARROW) && player2.getY() > 0) {
            player2.setY(player2.getY() - 5);
            p2IsMovingUp = true;
        }
        if (keyIsDown(DOWN_ARROW) && player2.getY() < height - 100) {
            player2.setY(player2.getY() + 5);
            p2IsMovingDown = true;
        }
        if (keyIsDown(LEFT_ARROW) && player2.getX() > 0) {
            player2.setX(player2.getX() - 5);
        }
        if (keyIsDown(RIGHT_ARROW) && player2.getX() < width - 100) {
            player2.setX(player2.getX() + 5);
        }
    }

    if (player.getVidas() > 0) {
        if (p1IsMovingUp) {
            player.show(Load.get('mainShipUp'));
        } else if (p1IsMovingDown) {
            player.show(Load.get('mainShipDown'));
        } else {
            player.show(Load.get('mainShipIdle'));
        }
    }

    if (player2Visible && player2.getVidas() > 0) {
        if (p2IsMovingUp) {
            player2.show(Load.get('mainShipUp'));
        } else if (p2IsMovingDown) {
            player2.show(Load.get('mainShipDown'));
        } else {
            player2.show(Load.get('mainShipIdle'));
        }
    }
}
function spawnEnemy() {
    let x = random(50, width - 600);

    let spawnFromTop = random() > 0.5;
    let y = spawnFromTop ? random(-200, -60) : random(height + 60, height + 200);

    let size = random(40, 80);

    let enemy = new Inimigo(x, y, size, size);
    enemy.isExploding = false;
    enemy.explosionTimer = 0;
    enemy.speed = random(1, 3);
    enemy.sprite = Load.get('enemy2');
    enemy.direction = spawnFromTop ? 1 : -1;

    enemies.push(enemy);
}

function spawnEnemiesOverTime() {

    if (bossSpawned && boss && boss.isAlive) return;

    enemySpawnTimer++;

    if (enemySpawnTimer >= enemySpawnRate && enemies.length < 10) {
        spawnEnemy();
        enemySpawnTimer = 0;

        if (enemySpawnRate > 30) {
            enemySpawnRate -= 2;
        }
    }
}

function updateEnemies() {
    for (let i = enemies.length - 1; i >= 0; i--) {
        let enemy = enemies[i];

        if (enemy.isExploding) {
            enemy.show(Load.get('explosionEnemy'));
            enemy.explosionTimer++;

            if (enemy.explosionTimer > 60) {
                enemies.splice(i, 1);
                enemiesKilled++;
                score += 20;

                if (random() < 0.3) {
                    spawnItemAtPosition(enemy.getX(), enemy.getY());
                }
            }
        } else {
            enemy.show(enemy.sprite);

            let moveSpeed = enemy.speed * enemy.direction;
            enemy.setY(enemy.getY() + moveSpeed);

            if (enemy.getY() > height + 100 || enemy.getY() < -100) {
                enemies.splice(i, 1);
            }
        }
    }
}

function enemyShot() {
    for (let i = 0; i < enemies.length; i++) {
        let enemy = enemies[i];

        if (!enemy.isExploding && random() < 0.015) {
            let b = new Bullet(enemy.getX() + enemy.getW() / 2, enemy.getY() + enemy.getH() / 2, true);
            enemyAmmunition.push(b);
        }
    }
}

function bossSpawn() {
    if (!bossSpawned && enemiesKilled >= 20) {
        let x = 30;
        let y = 0;
        boss = new Boss(x, y, 150, 150, 10, 100);
        boss.isExploding = false;
        boss.explosionTimer = 0;
        boss.sprite = Load.get('enemy1');
        boss.isAlive = true;
        bossSpawned = true;
        bossLastShot = millis();

        Load.get('themeSound').stop();
        Load.get('themeBossSound').loop();
    }
}

function updateBoss() {
    if (boss && boss.isAlive) {
        if (boss.ultimate) {
            boss.ultimate.update();
        }

        if (boss.isExploding) {
            boss.show(Load.get('explosionEnemy'));
            boss.explosionTimer++;

            if (boss.explosionTimer > 120) {
                boss.isAlive = false;
                score += 300;
                boss = null;

                Load.get('themeBossSound').stop();

                gameState = 'win';
            }
        } else {
            boss.show(boss.sprite);
            boss.automove(boss.speed, height);
        }
    }
}

function bossShot() {
    if (boss && boss.isAlive && !boss.isExploding) {
        if (boss.ultimate.getIsReady()) {
            if (boss.ultimate.use()) {
                for (let i = 0; i < 5; i++) {
                    let b = new BossBullet(
                        boss.getX() + 75,
                        boss.getY() + 75 + (i * 20),
                        2,
                        boss.ultimate.getPower()
                    );
                    enemyAmmunition.push(b);
                }
                bossLastShot = millis();
            }

            /*
            } else if (random() < 0.05) {
                for (let i = 0; i < 3; i++) {
                    let b = new BossBullet(
                        boss.getX() + 75,
                        boss.getY() + 75 + (i * 30),
                        1,
                        1
                    );
                    enemyAmmunition.push(b);
                }
                  bossLastShot = millis();
            }
            */

        } else if (millis() - bossLastShot >= 500) {
            for (let i = 0; i < 3; i++) {
                let b = new BossBullet(
                    boss.getX() + 75,
                    boss.getY() + 75 + (i * 30),
                    1,
                    1
                );
                enemyAmmunition.push(b);
            }
            bossLastShot = millis();
        }
    }
}


function spawnItemsOverTime() {
    itemSpawnTimer++;

    if (itemSpawnTimer >= itemSpawnRate) {
        let x = random(50, width - 50);
        let y = -50;
        let types = ['health', 'power'];
        let type = random(types);
        let value = type === 'health' ? 1 : 10;

        let item = new Item(x, y, type, value);
        items.push(item);
        itemSpawnTimer = 0;
    }
}

function spawnItemAtPosition(x, y) {
    let types = ['health', 'power'];
    let type = random(types);
    let value = type === 'health' ? 1 : 10;

    let item = new Item(x, y, type, value);
    items.push(item);
}

function updateItems() {
    for (let i = items.length - 1; i >= 0; i--) {
        let item = items[i];

        if (!item.isCollected()) {
            item.show();
            item.automove(2);

            if (player.getVidas() > 0 && item.checkCollision(player.getX(), player.getY(), 100, 100)) {
                collectItem(item, 1);
            }
            else if (player2Visible && player2.getVidas() > 0 && item.checkCollision(player2.getX(), player2.getY(), 100, 100)) {
                collectItem(item, 2);
            }

            if (item.getY() > height + 50) {
                items.splice(i, 1);
            }
        } else {
            items.splice(i, 1);
        }
    }
}

function collectItem(item, playerNumber) {
    let type = item.getType();
    let value = item.getValue();

    switch (type) {
        case 'health':
            if (playerNumber === 1) {
                player.heal(value);
            } else if (playerNumber === 2) {
                player2.heal(value);
            }
            score += 20;
            break;
        case 'power':
            if (playerNumber === 1) {
                playerBulletCount = 2;
            } else if (playerNumber === 2) {
                player2BulletCount = 2;
            }
            score += 50;
            break;
    }
}

function drawBullets() {
    for (let i = playerAmmunition.length - 1; i >= 0; i--) {
        if (playerAmmunition[i].getType() == 1) {
            playerAmmunition[i].show();
            playerAmmunition[i].automove(7, false);
        } else {
            playerAmmunition[i].show();
            playerAmmunition[i].automove(10, false);
        }

        let hitTarget = false;

        if (boss && boss.isAlive && !boss.isExploding) {
            let collision = false;
            if (playerAmmunition[i].getType() == 1) {
                collision = collideRectRect(
                    playerAmmunition[i].getX(), playerAmmunition[i].getY(), 30, 10,
                    boss.getX(), boss.getY(), 150, 150
                );
            } else {
                collision = collideRectRect(
                    playerAmmunition[i].getX(), playerAmmunition[i].getY(), 20, 40,
                    boss.getX(), boss.getY(), 150, 150
                );
            }

            if (collision) {
                let damage = (playerAmmunition[i] instanceof UltimateBullet)
                    ? playerAmmunition[i].getDamage()
                    : 1;
                boss.takeDamage(damage);

                if (boss.getHealth() <= 0) {
                    Load.get('explosionSound').play();
                    boss.isExploding = true;
                    boss.explosionTimer = 0;
                }
                hitTarget = true;
            }
        }

        if (!hitTarget) {
            for (let j = 0; j < enemies.length; j++) {
                let enemy = enemies[j];

                if (enemy.isExploding) continue;

                let collision = false;
                if (playerAmmunition[i].getType() == 1) {
                    collision = collideRectRect(
                        playerAmmunition[i].getX(), playerAmmunition[i].getY(), 30, 10,
                        enemy.getX(), enemy.getY(), enemy.getW(), enemy.getH()
                    );
                } else {
                    collision = collideRectRect(
                        playerAmmunition[i].getX(), playerAmmunition[i].getY(), 20, 40,
                        enemy.getX(), enemy.getY(), enemy.getW(), enemy.getH()
                    );
                }

                if (collision) {
                    Load.get('explosionSound').play();
                    enemy.isExploding = true;
                    enemy.explosionTimer = 0;
                    hitTarget = true;
                    break;
                }
            }
        }

        if (hitTarget || playerAmmunition[i].getX() < -5) {
            playerAmmunition.splice(i, 1);
        }
    }
}

function drawPlayer2Bullets() {
    for (let i = player2Ammunition.length - 1; i >= 0; i--) {
        if (player2Ammunition[i].getType() == 1) {
            player2Ammunition[i].show();
            player2Ammunition[i].automove(7, false);
        } else {
            player2Ammunition[i].show();
            player2Ammunition[i].automove(10, false);
        }

        let hitTarget = false;

        if (boss && boss.isAlive && !boss.isExploding) {
            let collision = false;
            if (player2Ammunition[i].getType() == 1) {
                collision = collideRectRect(
                    player2Ammunition[i].getX(), player2Ammunition[i].getY(), 30, 10,
                    boss.getX(), boss.getY(), 150, 150
                );
            } else {
                collision = collideRectRect(
                    player2Ammunition[i].getX(), player2Ammunition[i].getY(), 20, 40,
                    boss.getX(), boss.getY(), 150, 150
                );
            }

            if (collision) {
                let damage = (player2Ammunition[i] instanceof UltimateBullet)
                    ? player2Ammunition[i].getDamage()
                    : 1;
                boss.takeDamage(damage);

                if (boss.getHealth() <= 0) {
                    Load.get('explosionSound').play();
                    boss.isExploding = true;
                    boss.explosionTimer = 0;
                }
                hitTarget = true;
            }
        }

        if (!hitTarget) {
            for (let j = 0; j < enemies.length; j++) {
                let enemy = enemies[j];

                if (enemy.isExploding) continue;

                let collision = false;
                if (player2Ammunition[i].getType() == 1) {
                    collision = collideRectRect(
                        player2Ammunition[i].getX(), player2Ammunition[i].getY(), 30, 10,
                        enemy.getX(), enemy.getY(), enemy.getW(), enemy.getH()
                    );
                } else {
                    collision = collideRectRect(
                        player2Ammunition[i].getX(), player2Ammunition[i].getY(), 20, 40,
                        enemy.getX(), enemy.getY(), enemy.getW(), enemy.getH()
                    );
                }

                if (collision) {
                    Load.get('explosionSound').play();
                    enemy.isExploding = true;
                    enemy.explosionTimer = 0;
                    hitTarget = true;
                    break;
                }
            }
        }

        if (hitTarget || player2Ammunition[i].getX() < -5) {
            player2Ammunition.splice(i, 1);
        }
    }
}

function drawEnemyBullets() {
    for (let i = enemyAmmunition.length - 1; i >= 0; i--) {
        enemyAmmunition[i].show();
        enemyAmmunition[i].automove(5, true);

        let hitPlayer1 = false;
        if (player.getVidas() > 0) {
            hitPlayer1 = collideRectRect(
                enemyAmmunition[i].getX(),
                enemyAmmunition[i].getY(),
                30, 10,
                player.getX(),
                player.getY(),
                100, 100
            );
        }

        let hitPlayer2 = false;
        if (player2Visible && player2.getVidas() > 0) {
            hitPlayer2 = collideRectRect(
                enemyAmmunition[i].getX(),
                enemyAmmunition[i].getY(),
                30, 10,
                player2.getX(),
                player2.getY(),
                100, 100
            );
        }

        if (hitPlayer1) {
            let damage = 1;
            if (enemyAmmunition[i] instanceof BossBullet) {
                damage = enemyAmmunition[i].getDamage();
            }

            player.takeDamage(damage);
            score -= 10 * damage;
            if (score < 0) score = 0;
            playerBulletCount = 1;

            enemyAmmunition.splice(i, 1);
        } else if (hitPlayer2) {
            let damage = 1;
            if (enemyAmmunition[i] instanceof BossBullet) {
                damage = enemyAmmunition[i].getDamage();
            }

            player2.takeDamage(damage);
            player2BulletCount = 1;

            enemyAmmunition.splice(i, 1);
        } else if (enemyAmmunition[i].getX() > width + 10) {
            enemyAmmunition.splice(i, 1);
        }
    }
}

function gerenciarVidas(vidas) {
    if (player.getVidas() > 0) {
        if (vidas < 0) vidas = 0;
        if (vidas > 10) vidas = 10;

        let cor;
        if (vidas >= 7) {
            cor = "green";
        } else if (vidas >= 4) {
            cor = "yellow";
        } else {
            cor = "red";
        }

        for (let i = 0; i < vidas; i++) {
            fill(cor);
            rect(1100 + i * 30, 55, 28, 20);
        }
        image(Load.get('healthbar'), 1100, 35, 300, 40);

        fill(255);
        textSize(16);
        text("P1", 1120, 25);
    }

    if (player2Visible && player2.getVidas() > 0) {
        let vidas2 = player2.getVidas();
        if (vidas2 < 0) vidas2 = 0;
        if (vidas2 > 10) vidas2 = 10;

        let cor2;
        if (vidas2 >= 7) {
            cor2 = "green";
        } else if (vidas2 >= 4) {
            cor2 = "yellow";
        } else {
            cor2 = "red";
        }

        for (let i = 0; i < vidas2; i++) {
            fill(cor2);
            rect(750 + i * 30, 55, 28, 20);
        }
        image(Load.get('healthbar'), 750, 35, 300, 40);

        fill(255);
        textSize(16);
        text("P2", 770, 25);
    }
}

function drawUltimateBar() {
    if (player.getVidas() > 0) {
        let x1 = 1100;
        let y1 = 80;
        let w = 300;
        let h = 20;

        fill(50);
        rect(x1, y1, w, h);

        if (ultimate.getIsReady()) {
            fill(0, 255, 0);
            rect(x1, y1, w, h);
            fill("black");
            textSize(14);
            textAlign(CENTER, CENTER);
            text("ULTIMATE PRONTA", x1 + w / 2, y1 + h / 2);
        } else {
            let progress = 1 - (ultimate.getRemainingCooldown() / ultimate.getCooldown());
            fill(255, 165, 0);
            rect(x1, y1, w * progress, h);
            fill(255);
            textSize(12);
            textAlign(CENTER, CENTER);
            let remaining = Math.ceil(ultimate.getRemainingCooldown() / 1000);
            text(remaining + "s", x1 + w / 2, y1 + h / 2);
        }
    }

    if (player2Visible && player2.getVidas() > 0) {
        let x2 = 750;
        let y2 = 80;
        let w = 300;
        let h = 20;

        fill(50);
        rect(x2, y2, w, h);

        if (ultimate2.getIsReady()) {
            fill(0, 255, 0);
            rect(x2, y2, w, h);
            fill("black");
            textSize(14);
            textAlign(CENTER, CENTER);
            text("ULTIMATE PRONTA", x2 + w / 2, y2 + h / 2);
        } else {
            let progress2 = 1 - (ultimate2.getRemainingCooldown() / ultimate2.getCooldown());
            fill(255, 165, 0);
            rect(x2, y2, w * progress2, h);
            fill(255);
            textSize(12);
            textAlign(CENTER, CENTER);
            let remaining2 = Math.ceil(ultimate2.getRemainingCooldown() / 1000);
            text(remaining2 + "s", x2 + w / 2, y2 + h / 2);
        }
    }
}

function drawScore() {

    fill(255);
    textSize(20);
    textAlign(RIGHT);
    text("PONTOS: " + score, width - 110, 115);
    //text("ABATES: " + enemiesKilled, width - 110, 140);

    if (bossSpawned && boss && boss.isAlive) {
        let bossBarW = 400;
        let bossBarH = 30;
        let bossBarX = width / 2 - bossBarW / 2;
        let bossBarY = height - 50;

        boss.drawHealthBar(bossBarX, bossBarY, bossBarW, bossBarH);
    }
}

function checkPause() {
    let gp = navigator.getGamepads();

    if (keyIsDown(27) && !lastEscKey) {
        gamePaused = !gamePaused;

        if (gamePaused) {
            if (Load.get('themeSound').isPlaying()) {
                Load.get('themeSound').stop();
            }
            if (Load.get('themeBossSound').isPlaying()) {
                Load.get('themeBossSound').stop();
            }
        } else {
            if (bossSpawned && boss && boss.isAlive) {
                if (!Load.get('themeBossSound').isPlaying()) {
                    Load.get('themeBossSound').loop();
                }
            } else {
                if (!Load.get('themeSound').isPlaying()) {
                    Load.get('themeSound').loop();
                }
            }
        }
        lastEscKey = true;
    } else if (!keyIsDown(27)) {
        lastEscKey = false;
    }

    if (gp[0] && gp[0].buttons[9].pressed && !lastPauseButton) {
        gamePaused = !gamePaused;

        if (gamePaused) {
            if (Load.get('themeSound').isPlaying()) {
                Load.get('themeSound').stop();
            }
            if (Load.get('themeBossSound').isPlaying()) {
                Load.get('themeBossSound').stop();
            }
        } else {
            if (bossSpawned && boss && boss.isAlive) {
                if (!Load.get('themeBossSound').isPlaying()) {
                    Load.get('themeBossSound').loop();
                }
            } else {
                if (!Load.get('themeSound').isPlaying()) {
                    Load.get('themeSound').loop();
                }
            }
        }
        lastPauseButton = true;
    } else if (!gp[0] || !gp[0].buttons[9].pressed) {
        lastPauseButton = false;
    }
}

function drawPauseOverlay() {
    fill(0, 0, 0, 150);
    rect(0, 0, width, height);

    fill(255, 255, 0);
    textSize(80);
    textAlign(CENTER);
    text("PAUSADO", width / 2, height / 2 - 50);

    fill(255);
    textSize(24);
    text("Pressione ESC ou START para continuar", width / 2, height / 2 + 50);
}

function createMenuButtons() {
    let buttonY = height - 100;
    let buttonWidth = 200;
    let buttonHeight = 50;
    let spacing = 20;
    let totalWidth = (buttonWidth * 3) + (spacing * 2);
    let startX = (width - totalWidth) / 2;

    playButton = createButton('JOGAR');
    playButton.position(width / 2 - 100, height - 100);
    playButton.size(buttonWidth, buttonHeight);
    playButton.style('font-size', '24px');
    playButton.style('font-family', 'Minecraft');
    playButton.mousePressed(showInstructions);

    instructionsButton = createButton('PROSSEGUIR');
    instructionsButton.position(width / 2 - 100, height - 100);
    instructionsButton.size(buttonWidth, buttonHeight);
    instructionsButton.style('font-size', '24px');
    instructionsButton.style('font-family', 'Minecraft');
    instructionsButton.mousePressed(startGame);

    creditsButton = createButton('MENU');
    creditsButton.position(width / 2 - 100, height - 100);
    creditsButton.size(buttonWidth, buttonHeight);
    creditsButton.style('font-size', '24px');
    creditsButton.style('font-family', 'Minecraft');
    creditsButton.mousePressed(returnToMenu);

    backButton = createButton('VOLTAR');
    backButton.position(width / 2 - 100, height - 100);
    backButton.size(200, 50);
    backButton.style('font-size', '24px');
    backButton.style('font-family', 'Minecraft');
    backButton.mousePressed(returnToMenu);
    backButton.hide();

    menuButton = createButton('PROSSEGUIR');
    menuButton.position(width / 2 - 100, height / 2 + 70);
    menuButton.size(200, 50);
    menuButton.style('font-size', '24px');
    menuButton.style('font-family', 'Minecraft');
    menuButton.mousePressed(showCredits);
    menuButton.hide();

    winMenuButton = createButton('PROSSEGUIR');
    winMenuButton.position(width / 2 - 100, height / 2 + 120);
    winMenuButton.size(200, 50);
    winMenuButton.style('font-size', '24px');
    winMenuButton.style('font-family', 'Minecraft');
    winMenuButton.mousePressed(showCredits);
    winMenuButton.hide();
}

function menuGamepadControl() {
    let gp = navigator.getGamepads();

    if (gp[0]) {
        if (gp[0].buttons[1].pressed && !lastMenuButton) {
            if (gameState === 'menu') {
                showInstructions();
            } else if (gameState === 'instructions') {
                startGame();
            } else if (gameState === 'credits') {
                returnToMenu();
            } else if (gameState === 'gameover') {
                showCredits();
            } else if (gameState === 'win') {
                showCredits();
            }
            lastMenuButton = true;
        } else if (!gp[0].buttons[1].pressed) {
            lastMenuButton = false;
        }
    }
} function drawMenu() {
    background(Load.get('menuP'));

    menuGamepadControl();

    playButton.show();
    instructionsButton.hide();
    creditsButton.hide();
    menuButton.hide();
    winMenuButton.hide();
}

function drawInstructions() {
    background(Load.get('menu'));

    fill(0, 0, 0, 200);
    rect(0, 0, width, height);

    menuGamepadControl();

    playButton.hide();
    instructionsButton.show();
    creditsButton.hide();
    backButton.hide();
    menuButton.hide();
    winMenuButton.hide();

    fill(255);
    textSize(50);
    textAlign(CENTER);
    text("COMO JOGAR", width / 2, 80);

    textSize(22);
    textAlign(LEFT);

    let col1X = 150;
    let col2X = width / 2 + 100;
    let startY = 140;
    let sectionSpacing = 160;

    fill(100, 150, 255);
    textSize(26);
    text("PLAYER 1", col1X, startY);

    fill(255);
    textSize(16);
    text("Movimento: W A S D", col1X, startY + 30);
    text("Atirar: C", col1X, startY + 50);
    text("Ultimate: V", col1X, startY + 70);
    text("Gamepad: analogico + X/O", col1X, startY + 90);

    fill(255, 100, 100);
    textSize(26);
    text("PLAYER 2", col2X, startY);

    fill(255);
    textSize(16);
    text("Movimento: setas do teclado", col2X, startY + 30);
    text("Atirar: N", col2X, startY + 50);
    text("Ultimate: M", col2X, startY + 70);

    fill(255, 255, 0);
    textSize(26);
    text("POWER-UPS", col1X, startY + sectionSpacing);

    fill(255);
    textSize(16);
    image(Load.get('iconHealth'), col1X, startY + sectionSpacing + 20, 40, 40);
    text("Recupera 1 de vida", col1X + 50, startY + sectionSpacing + 45);

    image(Load.get('iconPowerUp'), col1X, startY + sectionSpacing + 70, 40, 40);
    text("Dispara 2 balas simultaneas", col1X + 50, startY + sectionSpacing + 95);

    fill(255, 255, 0);
    textSize(26);
    text("OBJETIVO", col2X, startY + sectionSpacing);

    fill(255);
    textSize(16);
    text("Destrua 20 inimigos", col2X + 80, startY + sectionSpacing + 50);
    text("para enfrentar o BOSS!", col2X + 80, startY + sectionSpacing + 70);

    image(Load.get('enemy1'), col2X, startY + sectionSpacing + 15, 80, 80);

    fill(255, 255, 0);
    textSize(20);
    textAlign(CENTER);
    text("CONTROLES GERAIS", width / 2, startY + sectionSpacing * 2 + 20);

    fill(255);
    textSize(16);
    text("ESC / START (gamepad): pausar", width / 2, startY + sectionSpacing * 2 + 45);
    text("P: ativar/desativar Player 2", width / 2, startY + sectionSpacing * 2 + 65);

    fill(255, 100, 100);
    textSize(14);
    text("* Ao ser atingido, voce perde o power-up e volta a atirar apenas 1 bala", width / 2, height - 40);
}

function drawCredits() {
    background(Load.get('menu'));

    fill(0, 0, 0, 200);
    rect(0, 0, width, height);

    menuGamepadControl();

    playButton.hide();
    instructionsButton.hide();
    creditsButton.show();
    backButton.hide();
    menuButton.hide();
    winMenuButton.hide();

    fill(255, 215, 0);
    textSize(60);
    textAlign(CENTER);
    text("CREDITOS", width / 2, 120);

    fill(100, 200, 255);
    textSize(24);
    text("Clerton Pinheiro", width / 2, 200);
    text("Kalyandro Fernandes", width / 2, 240);
    text("Vinicius Dantas", width / 2, 280);

    fill(255);
    textSize(22);
    text("___________________________________", width / 2, 320);

    fill(255, 255, 100);
    textSize(24);
    text("Projeto POO - 2025.2", width / 2, 370);
    text("Dr. Rummenigge Rudson Dantas", width / 2, 420);

    fill(255);
    textSize(18);
    text("___________________________________", width / 2, 460);

    fill(200, 200, 200);
    textSize(16);
    text("p5.js | JavaScript", width / 2, 500);
}

function drawGameOver() {
    background(Load.get('bkgd'));

    menuGamepadControl();

    playButton.hide();
    instructionsButton.hide();
    creditsButton.hide();
    backButton.hide();
    winMenuButton.hide();

    menuButton.show();

    fill(255, 0, 0);
    textSize(80);
    textAlign(CENTER);
    text("GAME OVER", width / 2, height / 2 - 50);

    fill(255);
    textSize(30);
    text("Pontuacao: " + score, width / 2, height / 2 + 20);
}

function drawWin() {
    background(Load.get('bkgd'));

    menuGamepadControl();

    playButton.hide();
    instructionsButton.hide();
    creditsButton.hide();
    backButton.hide();
    menuButton.hide();

    winMenuButton.show();

    fill(0, 255, 0, 50);
    rect(0, 0, width, height);

    fill(255, 215, 0);
    textSize(100);
    textAlign(CENTER);
    text("VITORIA!", width / 2, height / 2 - 100);

    fill(255);
    textSize(35);
    text("PONTUACAO FINAL: " + score, width / 2, height / 2 + 30);
}

function startGame() {
    gameState = 'playing';
    initializeGame();

    Load.get('themeBossSound').stop();

    playButton.hide();
    instructionsButton.hide();
    creditsButton.hide();
    backButton.hide();
    menuButton.hide();
    winMenuButton.hide();
}

function showInstructions() {
    gameState = 'instructions';
    lastMenuButton = false;
}

function showCredits() {
    gameState = 'credits';
    lastMenuButton = false;
}

function returnToMenu() {
    gameState = 'menu';
    gameOver = false;
    lastMenuButton = false;
    player2Visible = false;

    Load.get('themeSound').stop();
    Load.get('themeBossSound').stop();
}