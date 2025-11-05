var gameState = 'menu'; 

var playButton, instructionsButton, creditsButton, backButton, menuButton;

var player, playerAmmunition, enemyAmmunition;
var playerBulletCount = 1;
var ultimate;

var enemies = [];
var boss = null;
var bossSpawned = false;
var enemiesKilled = 0;

var enemySpawnTimer = 0;
var enemySpawnRate = 60;
var itemSpawnTimer = 0;
var itemSpawnRate = 300;

var items = [];
var gameOver = false;
var gameOverTimer = 0;

function preload() {
    Load.preloadAll();
}

function setup() {
    createCanvas(1425, 660);
    textFont(Load.get('pixelFont'));
    
    createMenuButtons();
    
    initializeGame();
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
    enemy.sprite = random() > 0.5 ? Load.get('enemy1') : Load.get('enemy2');
    enemy.direction = spawnFromTop ? 1 : -1; 
    
    enemies.push(enemy);
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
    }
}

function drawGame() {
    background(Load.get('bkgd'));
    
    spawnEnemiesOverTime();
    spawnBossIfNeeded();
    spawnItemsOverTime();
    updateEnemies();
    updateBoss();
    updateItems();
    enemyShot();
    bossShot();
    gamecontrol();
    drawBullets();
    drawEnemyBullets();
    removeBullets();
    
    ultimate.update();
    player.update();
    
    gerenciarVidas(player.getVidas());
    drawUltimateBar();
    drawScore();
    checkGameOver();
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

function spawnBossIfNeeded() {
    if (!bossSpawned && enemiesKilled >= 20) {
        let x = width / 2 - 75;
        let y = 50;
        boss = new Boss(x, y, 150, 150, 6, 100);
        boss.isExploding = false;
        boss.explosionTimer = 0;
        boss.sprite = Load.get('enemy1');
        boss.isAlive = true;
        bossSpawned = true;
        console.log("Boss spawned at:", x, y);
    }
}

function spawnItemsOverTime() {
    itemSpawnTimer++;
    
    if (itemSpawnTimer >= itemSpawnRate) {
        let x = random(50, width - 50);
        let y = -50;
        let types = ['health', 'power', 'shield'];
        let type = random(types);
        let value = type === 'health' ? 1 : 10;
        
        let item = new Item(x, y, type, value);
        items.push(item);
        itemSpawnTimer = 0;
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
                boss = null;
                spawnItemAtPosition(width / 2, height / 2);
            }
        } else {
            boss.show(boss.sprite);
            boss.automove(boss.speed, height);
        }
    }
}

function updateItems() {
    for (let i = items.length - 1; i >= 0; i--) {
        let item = items[i];
        
        if (!item.isCollected()) {
            item.show();
            item.automove(2);
            

            if (item.checkCollision(player.getX(), player.getY(), 100, 100)) {
                collectItem(item);
            }
            

            if (item.y > height + 50) {
                items.splice(i, 1);
            }
        } else {
            items.splice(i, 1);
        }
    }
}

function spawnItemAtPosition(x, y) {
    let types = ['health', 'power'];
    let type = random(types);
    let value = type === 'health' ? 1 : 10;
    
    let item = new Item(x, y, type, value);
    items.push(item);
}

function collectItem(item) {
    let type = item.getType();
    let value = item.getValue();
    
    switch(type) {
        case 'health':
            player.heal(value);
            break;
        case 'power':
            playerBulletCount = 2;
            console.log("Power-up! Agora voce tem 2 balas!");
            break;
    }
}

function checkGameOver() {
    if (player.getVidas() <= 0 && !gameOver) {
        gameOver = true;
        gameOverTimer = 0;
        gameState = 'gameover';
    }
}

function keyPressed() {
    if (player.getVidas() > 0) {
        if (keyCode === 32) {
            if (playerBulletCount === 1) {
                let b = new Bullet(player.getX(), player.getY() + 45, 1);
                playerAmmunition.push(b);
            } else if (playerBulletCount >= 2) {
                let b1 = new Bullet(player.getX(), player.getY() + 25, 1);
                let b2 = new Bullet(player.getX(), player.getY() + 65, 1);
                playerAmmunition.push(b1);
                playerAmmunition.push(b2);
            }
        } else if (keyCode === 13) {
            if (ultimate.use()) {
                let b = new Bullet(player.getX(), player.getY() + 30, 2);
                playerAmmunition.push(b);
                console.log("Ultimate ativado!");
            } else {
                console.log("Ultimate em cooldown: " + 
                    Math.ceil(ultimate.getRemainingCooldown() / 1000) + "s");
            }
        }
    }
}

function gamecontrol() {
    let isMovingUp = false;
    let isMovingDown = false;

    if ((keyIsDown(87) || keyIsDown(UP_ARROW)) && player.getY() > 0) {
        player.setY(player.getY() - 5);
        isMovingUp = true;
    }
    if ((keyIsDown(83) || keyIsDown(DOWN_ARROW)) && player.getY() < height - 100) {
        player.setY(player.getY() + 5);
        isMovingDown = true;
    }
    if ((keyIsDown(65) || keyIsDown(LEFT_ARROW)) && player.getX() > 0) {
        player.setX(player.getX() - 5);
    }
    if ((keyIsDown(68) || keyIsDown(RIGHT_ARROW)) && player.getX() < width - 100) {
        player.setX(player.getX() + 5);
    }

    if (isMovingUp) {
        player.show(Load.get('mainShipUp'));
    } else if (isMovingDown) {
        player.show(Load.get('mainShipDown'));
    } else if (player.getVidas() > 0) {
        player.show(Load.get('mainShipIdle'));
    }
}

function enemyShot() {
    for (let i = 0; i < enemies.length; i++) {
        let enemy = enemies[i];
        
        if (!enemy.isExploding && random() < 0.015) {
            let b = new Bullet(enemy.getX() + enemy.getW() / 2, enemy.getY() + enemy.getH() / 2, 1);
            enemyAmmunition.push(b);
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
                        4
                    );
                    enemyAmmunition.push(b);
                }
            }
        } else if (random() < 0.08) {
            for (let i = 0; i < 3; i++) {
                let b = new BossBullet(
                    boss.getX() + 75, 
                    boss.getY() + 75 + (i * 30), 
                    1, 
                    1
                );
                enemyAmmunition.push(b);
            }
        }
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
                console.log("Boss atingido!");
                let damage = (playerAmmunition[i].getType() === 2) ? 4 : 1;
                boss.takeDamage(damage);
                
                if (boss.getHealth() <= 0) {
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
                    console.log("Inimigo atingido!");
                    enemy.isExploding = true;
                    enemy.explosionTimer = 0;
                    hitTarget = true;
                    break;
                }
            }
        }
        
        if (hitTarget) {
            playerAmmunition.splice(i, 1);
        }
    }
}

function drawEnemyBullets() {
    for (let i = enemyAmmunition.length - 1; i >= 0; i--) {
        enemyAmmunition[i].show();
        enemyAmmunition[i].automove(7, true);

        let hitPlayer = collideRectRect(
            enemyAmmunition[i].getX(),
            enemyAmmunition[i].getY(),
            30, 10,
            player.getX(),
            player.getY(),
            100, 100
        );

        if (hitPlayer) {

            let damage = 1;
            if (enemyAmmunition[i] instanceof BossBullet) {
                damage = enemyAmmunition[i].getDamage();
            }
            
            player.takeDamage(damage);
            

            playerBulletCount = 1;
            console.log("Voce foi atingido! Voltou para 1 bala.");
            
            enemyAmmunition.splice(i, 1);
        } else if (enemyAmmunition[i].getX() > width + 10) {
            enemyAmmunition.splice(i, 1);
        }
    }
}

function gerenciarVidas(vidas) {
    if (vidas < 0) vidas = 0;
    if (vidas > 6) vidas = 6;
    
    let cor;
    if (vidas >= 5) {
        cor = "green";
    } else if (vidas >= 3) {
        cor = "yellow";
    } else {
        cor = "red";
    }
    
    for (let i = 0; i < vidas; i++) {
        fill(cor);
        rect(1240 + i * 30, 55, 28, 20);
    }
    image(Load.get('healthbar'), 1240, 35, 180, 40);
}

function removeBullets() {
    for (let i = 0; i < playerAmmunition.length; i++) {
        if (playerAmmunition[i].getX() < -5) {
            playerAmmunition.splice(i, 1);
        }
    }
}

function drawUltimateBar() {

    let x = 1240;
    let y = 90;
    let w = 180;
    let h = 20;
    

    fill(50);
    rect(x, y, w, h);
    

    if (ultimate.getIsReady()) {
        fill(0, 255, 0);
        rect(x, y, w, h);
        

        fill("black");
        textSize(14);
        textAlign(CENTER, CENTER);
        text("ULTIMATE PRONTA", x + w / 2, y + h / 2);
    } else {
        let progress = 1 - (ultimate.getRemainingCooldown() / ultimate.getCooldown());
        fill(255, 165, 0);
        rect(x, y, w * progress, h);
        

        fill(255);
        textSize(12);
        textAlign(CENTER, CENTER);
        let remaining = Math.ceil(ultimate.getRemainingCooldown() / 1000);
        text(remaining + "s", x + w / 2, y + h / 2);
    }
}

function drawScore() {

    fill(255);
    textSize(20);
    textAlign(RIGHT);
    text("ABATES: " + enemiesKilled, width - 70, 130);
    
    if (bossSpawned && boss && boss.isAlive) {
        let bossBarW = 400;
        let bossBarH = 30;
        let bossBarX = width / 2 - bossBarW / 2;
        let bossBarY = height - 50;
        
        fill(50);
        rect(bossBarX, bossBarY, bossBarW, bossBarH);
        
        let healthPercent = boss.getHealth() / 6;
        fill(255, 0, 0);
        rect(bossBarX, bossBarY, bossBarW * healthPercent, bossBarH);
        
        if (boss.getHasShield()) {
            let shieldPercent = boss.getShields() / 100;
            fill(0, 150, 255, 150);
            rect(bossBarX, bossBarY, bossBarW * shieldPercent, bossBarH);
        }
        
        fill(255);
        textSize(14);
        textAlign(CENTER);
        text("BOSS - HP: " + boss.getHealth() + " | Shield: " + (boss.getHasShield() ? boss.getShields() : "DOWN"), width / 2, bossBarY - 10);
    }
}

function createMenuButtons() {
    let buttonY = height - 100;
    let buttonWidth = 200;
    let buttonHeight = 50;
    let spacing = 20;
    let totalWidth = (buttonWidth * 3) + (spacing * 2);
    let startX = (width - totalWidth) / 2;
    
    playButton = createButton('JOGAR');
    playButton.position(startX, buttonY);
    playButton.size(buttonWidth, buttonHeight);
    playButton.style('font-size', '24px');
    playButton.style('font-family', 'Minecraft');
    playButton.mousePressed(startGame);
    
    instructionsButton = createButton('INSTRUCOES');
    instructionsButton.position(startX + buttonWidth + spacing, buttonY);
    instructionsButton.size(buttonWidth, buttonHeight);
    instructionsButton.style('font-size', '24px');
    instructionsButton.style('font-family', 'Minecraft');
    instructionsButton.mousePressed(showInstructions);
    
    creditsButton = createButton('CREDITOS');
    creditsButton.position(startX + (buttonWidth + spacing) * 2, buttonY);
    creditsButton.size(buttonWidth, buttonHeight);
    creditsButton.style('font-size', '24px');
    creditsButton.style('font-family', 'Minecraft');
    creditsButton.mousePressed(showCredits);
    
    backButton = createButton('VOLTAR');
    backButton.position(width/2 - 100, height - 100);
    backButton.size(200, 50);
    backButton.style('font-size', '24px');
    backButton.style('font-family', 'Minecraft');
    backButton.mousePressed(returnToMenu);
    backButton.hide();
    
    menuButton = createButton('MENU');
    menuButton.position(width/2 - 100, height/2 + 70);
    menuButton.size(200, 50);
    menuButton.style('font-size', '24px');
    menuButton.style('font-family', 'Minecraft');
    menuButton.mousePressed(returnToMenu);
    menuButton.hide();
}

function drawMenu() {
    background(Load.get('menuP'));
    
    playButton.show();
    instructionsButton.show();
    creditsButton.show();
    backButton.hide();
    menuButton.hide();
}

function drawInstructions() {
    background(Load.get('menu'));
    
    fill(0, 0, 0, 200);
    rect(0, 0, width, height);
    
    playButton.hide();
    instructionsButton.hide();
    creditsButton.hide();
    backButton.show();
    menuButton.hide();
    
    fill(255);
    textSize(50);
    textAlign(CENTER);
    text("COMO JOGAR", width/2, 80);
    
    textSize(22);
    textAlign(LEFT);
    
    let col1X = 150;
    let col2X = width/2 + 100;
    let startY = 160;
    let sectionSpacing = 180;
    
    fill(255, 255, 0);
    textSize(26);
    text("MOVIMENTACAO", col1X, startY);
    
    fill(255);
    textSize(18);
    image(Load.get('setas'), col1X, startY + 35, 120, 90);
    image(Load.get('wasd'), col1X + 140, startY + 35, 120, 90);
    
    fill(255, 255, 0);
    textSize(26);
    text("ATAQUES", col2X, startY);
    
    fill(255);
    textSize(18);
    text("Atirar", col2X + 25, startY + 35);
    image(Load.get('spacebar'), col2X, startY + 55, 100, 70);
    
    text("Ultimate", col2X + 115, startY + 35);
    image(Load.get('enter'), col2X + 100, startY + 40, 100, 100);
    
    fill(255, 255, 0);
    textSize(26);
    text("POWER-UPS", col1X, startY + sectionSpacing);
    
    fill(255);
    textSize(18);
    image(Load.get('iconHealth'), col1X, startY + sectionSpacing + 20, 40, 40);
    text("Vida: Recupera 1 coracao", col1X + 50, startY + sectionSpacing + 45);
    
    image(Load.get('iconPowerUp'), col1X, startY + sectionSpacing + 70, 40, 40);
    text("Poder: Dispara 2 balas simultaneas", col1X + 50, startY + sectionSpacing + 95);
    
    fill(255, 255, 0);
    textSize(26);
    text("OBJETIVO", col2X, startY + sectionSpacing);
    
    fill(255);
    textSize(18);
    text("Destrua 20 inimigos", col2X + 80, startY + sectionSpacing + 50);
    text("para enfrentar o BOSS!", col2X + 80, startY + sectionSpacing + 75);
    
    image(Load.get('enemy1'), col2X, startY + sectionSpacing + 15, 80, 80);
    
    fill(255, 100, 100);
    textSize(16);
    textAlign(CENTER);
    text("* Ao ser atingido, voce perde o power-up e volta a atirar apenas 1 bala", width/2, height - 160);
}

function drawCredits() {
    background(Load.get('menu'));
    
    fill(0, 0, 0, 200);
    rect(0, 0, width, height);
    
    playButton.hide();
    instructionsButton.hide();
    creditsButton.hide();
    backButton.show();
    menuButton.hide();
    
    fill(255, 215, 0);
    textSize(60);
    textAlign(CENTER);
    text("CREDITOS", width/2, 120);
    
    fill(100, 200, 255);
    textSize(24);
    text("Clerton Pinheiro", width/2, 200);
    text("Kalyandro Fernandes", width/2, 240);
    text("Vinicius Dantas", width/2, 280);
    
    fill(255);
    textSize(22);
    text("___________________________________", width/2, 320);
    
    fill(255, 255, 100);
    textSize(24);
    text("Projeto POO - 2025.2", width/2, 370);
    text("Dr. Rummenigge Rudson Dantas", width/2, 420);
    
    fill(255);
    textSize(18);
    text("___________________________________", width/2, 460);
    
    fill(200, 200, 200);
    textSize(16);
    text("p5.js | JavaScript", width/2, 500);
}

function drawGameOver() {
    background(Load.get('bkgd'));
    
    playButton.hide();
    instructionsButton.hide();
    creditsButton.hide();
    backButton.hide();
    
    menuButton.show();
    
    fill(255, 0, 0);
    textSize(80);
    textAlign(CENTER);
    text("GAME OVER", width / 2, height / 2 - 50);
    
    fill(255);
    textSize(30);
    text("Inimigos eliminados: " + enemiesKilled, width / 2, height / 2 + 20);
}

function startGame() {
    gameState = 'playing';
    initializeGame();
    
    playButton.hide();
    instructionsButton.hide();
    creditsButton.hide();
    backButton.hide();
    menuButton.hide();
}

function showInstructions() {
    gameState = 'instructions';
}

function showCredits() {
    gameState = 'credits';
}

function returnToMenu() {
    gameState = 'menu';
    gameOver = false;
}

function initializeGame() {
    player = new Nave(width / 2, height / 2);
    playerAmmunition = [];
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
    gameOverTimer = 0;
    
    ultimate = new Ultimate(10000);
    
    spawnEnemy();
    spawnEnemy();
}