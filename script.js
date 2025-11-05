var player, ammunition, enemyAmmunition;
var enemies = [];
var boss = null;
var items = [];
var ultimate;
var itemSpawnTimer = 0;
var itemSpawnRate = 300;
var bossSpawned = false;
var enemiesKilled = 0;
var gameOver = false;
var gameOverTimer = 0;
var restartButton;
var enemySpawnTimer = 0;
var enemySpawnRate = 60;
var playerBulletCount = 1;

function preload() {
    Load.preloadAll();
}

function setup() {
    createCanvas(1425, 660);
    
    textFont(Load.get('pixelFont'));

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
    
    ultimate = new Ultimate(10000);
    
    spawnEnemy();
    spawnEnemy();
}

function spawnEnemy() {
    let x = random(50, width - 600);
    
    // 50% de chance de spawnar em cima ou embaixo
    let spawnFromTop = random() > 0.5;
    let y = spawnFromTop ? random(-200, -60) : random(height + 60, height + 200);
    
    let size = random(40, 80);
    
    let enemy = new Inimigo(x, y, size, size);
    enemy.isExploding = false;
    enemy.explosionTimer = 0;
    enemy.speed = random(1, 3);
    enemy.sprite = random() > 0.5 ? Load.get('enemy1') : Load.get('enemy2');
    enemy.direction = spawnFromTop ? 1 : -1; // 1 = desce, -1 = sobe
    
    enemies.push(enemy);
}

function draw() {
    background(Load.get('bkgd'));
    
    if (!gameOver) {
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
    } else {
        handleGameOver();
    }
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
            
            // Move o inimigo na direção correta
            let moveSpeed = enemy.speed * enemy.direction;
            enemy.setY(enemy.getY() + moveSpeed);
            
            // Remove inimigos que saíram da tela (tanto em cima quanto embaixo)
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
            console.log("Power-up! Agora você tem 2 balas!");
            break;
    }
}

function checkGameOver() {
    if (player.getVidas() <= 0 && !gameOver) {
        gameOver = true;
        gameOverTimer = 0;
    }
}

function handleGameOver() {
    gameOverTimer++;
    
    if (gameOverTimer <= 60) {
        player.show(Load.get('explosion'));
        for (let i = 0; i < enemies.length; i++) {
            if (!enemies[i].isExploding) {
                enemies[i].show(enemies[i].sprite);
            }
        }
    }
    else {
        fill(0, 0, 0, 200);
        rect(0, 0, width, height);
        
        fill(255, 0, 0);
        textSize(120);
        textAlign(CENTER, CENTER);
        textStyle(BOLD);
        text("GAME OVER", width / 2, height / 2 - 100);
        
        drawRestartButton();
    }
}

function drawRestartButton() {
    let btnX = width / 2 - 100;
    let btnY = height / 2 + 80;
    let btnW = 200;
    let btnH = 60;
    
    let isHover = mouseX > btnX && mouseX < btnX + btnW && 
                  mouseY > btnY && mouseY < btnY + btnH;
    
    if (isHover) {
        fill(100, 200, 100);
        cursor(HAND);
    } else {
        fill(50, 150, 50);
        cursor(ARROW);
    }
    
    stroke(255);
    strokeWeight(3);
    rect(btnX, btnY, btnW, btnH, 10);
    
    fill(255);
    noStroke();
    textSize(28);
    textAlign(CENTER, CENTER);
    text("RESTART", width / 2, btnY + btnH / 2);
    
    restartButton = {x: btnX, y: btnY, w: btnW, h: btnH};
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
            console.log("Você foi atingido! Voltou para 1 bala.");
            
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

function mousePressed() {
    if (gameOver && restartButton) {
        if (mouseX > restartButton.x && mouseX < restartButton.x + restartButton.w &&
            mouseY > restartButton.y && mouseY < restartButton.y + restartButton.h) {
            restartGame();
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
        
        // Fundo da barra
        fill(50);
        rect(bossBarX, bossBarY, bossBarW, bossBarH);
        
        // Barra de vida
        let healthPercent = boss.getHealth() / 6;
        fill(255, 0, 0);
        rect(bossBarX, bossBarY, bossBarW * healthPercent, bossBarH);
        
        // Barra de shield (se tiver)
        if (boss.getHasShield()) {
            let shieldPercent = boss.getShields() / 100;
            fill(0, 150, 255, 150);
            rect(bossBarX, bossBarY, bossBarW * shieldPercent, bossBarH);
        }
        
        // Texto informativo
        fill(255);
        textSize(14);
        textAlign(CENTER);
        text("BOSS - HP: " + boss.getHealth() + " | Shield: " + (boss.getHasShield() ? boss.getShields() : "DOWN"), width / 2, bossBarY - 10);
    }
}

function restartGame() {
    gameOver = false;
    gameOverTimer = 0;
    
    player = new Nave(width / 2, height / 2);
    
    playerAmmunition = [];
    enemyAmmunition = [];
    
    enemies = [];
    items = [];
    boss = null;
    bossSpawned = false;
    enemiesKilled = 0;
    enemySpawnTimer = 0;
    enemySpawnRate = 60;
    itemSpawnTimer = 0;
    playerBulletCount = 1;
    
    ultimate = new Ultimate(10000);

    spawnEnemy();
    spawnEnemy();
    
    cursor(ARROW);
}