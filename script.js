var player, ammunition, enemyAmmunition;
var enemies = [];
var timer2Bala = 0;
var cooldown2Bala = 3000;
var gameOver = false;
var gameOverTimer = 0;
var restartButton;
var enemySpawnTimer = 0;
var enemySpawnRate = 120;

function preload() {
    LoadMedia.preloadAll();
}

function setup() {
    createCanvas(1425, 660);
    player = new Nave(width / 2, height / 2);
    playerAmmunition = [];
    enemyAmmunition = [];
    enemies = [];
    enemySpawnTimer = 0;
    
    spawnEnemy();
    spawnEnemy();
}

function spawnEnemy() {
    let x = random(50, width - 600);
    let y = random(-200, -60);
    
    let size = random(40, 80);
    
    let enemy = new Inimigo(x, y, size, size);
    enemy.isExploding = false;
    enemy.explosionTimer = 0;
    enemy.speed = random(1, 3);
    enemy.sprite = random() > 0.5 ? LoadMedia.get('enemy1') : LoadMedia.get('enemy2');
    
    enemies.push(enemy);
}

function draw() {
    background(LoadMedia.get('bkgd'));
    
    if (!gameOver) {
        spawnEnemiesOverTime();
        updateEnemies();
        enemyShot();
        gamecontrol();
        drawBullets();
        drawEnemyBullets();
        removeBullets();
        gerenciarVidas(player.getVidas());
        checkGameOver();
    } else {
        handleGameOver();
    }
}

function spawnEnemiesOverTime() {
    enemySpawnTimer++;
    
    if (enemySpawnTimer >= enemySpawnRate && enemies.length < 5) {
        spawnEnemy();
        enemySpawnTimer = 0;
        
        if (enemySpawnRate > 60) {
            enemySpawnRate -= 2;
        }
    }
}

function updateEnemies() {
    for (let i = enemies.length - 1; i >= 0; i--) {
        let enemy = enemies[i];
        
        if (enemy.isExploding) {
            enemy.show(LoadMedia.get('explosionEnemy'));
            enemy.explosionTimer++;
            
            if (enemy.explosionTimer > 60) {
                enemies.splice(i, 1);
            }
        } else {
            enemy.show(enemy.sprite);
            enemy.automove(enemy.speed, height);
            
            if (enemy.getY() > height + 100) {
                enemies.splice(i, 1);
            }
        }
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
        player.show(LoadMedia.get('explosion'));
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
        
        fill(255);
        textSize(30);
        textStyle(NORMAL);
        text("Você foi derrotado!", width / 2, height / 2);
        
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
            //tiro.play();
            let b1 = new Bullet(player.getX(), player.getY() + 25, 1); //bala tipo 1
            let b2 = new Bullet(player.getX(), player.getY() + 65, 1); //bala tipo 1
            playerAmmunition.push(b1);
            playerAmmunition.push(b2);
        } else if (keyCode === 13) {
            let currentTime = millis();
            if (currentTime - timer2Bala >= cooldown2Bala) {
                let b = new Bullet(player.getX(), player.getY() + 30, 2); //bala tipo 2
                playerAmmunition.push(b);
                timer2Bala = currentTime; // Atualizar o tempo do último disparo
            }
        }
    }
}

function gamecontrol() {
    let isMovingUp = false;
    let isMovingDown = false;

    if (keyIsDown(87) || keyIsDown(UP_ARROW)) {
        player.setY(player.getY() - 5);
        isMovingUp = true;
    }
    if (keyIsDown(83) || keyIsDown(DOWN_ARROW)) {
        player.setY(player.getY() + 5);
        isMovingDown = true;
    }
    if (keyIsDown(65) || keyIsDown(LEFT_ARROW)) {
        player.setX(player.getX() - 5);
    }
    if (keyIsDown(68) || keyIsDown(RIGHT_ARROW)) {
        player.setX(player.getX() + 5);
    }

    if (isMovingUp) {
        player.show(LoadMedia.get('mainShipUp'));
    } else if (isMovingDown) {
        player.show(LoadMedia.get('mainShipDown'));
    } else if (player.getVidas() > 0) {
        player.show(LoadMedia.get('mainShipIdle'));
    }
}

function enemyShot() {
    for (let i = 0; i < enemies.length; i++) {
        let enemy = enemies[i];
        
        if (!enemy.isExploding && random() < 0.015) { // 1.5% chance por frame
            let b = new Bullet(enemy.getX() + enemy.getW() / 2, enemy.getY() + enemy.getH() / 2, 1);
            enemyAmmunition.push(b);
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

        let hitEnemy = false;
        
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
                hitEnemy = true;
                break;
            }
        }
        
        if (hitEnemy) {
            playerAmmunition.splice(i, 1);
        }
    }
}

function drawEnemyBullets() {
    for (let i = 0; i < enemyAmmunition.length; i++) {
        enemyAmmunition[i].show();
        enemyAmmunition[i].automove(7, true);

        let hitPlayer = collideRectRect(
            enemyAmmunition[i].getX(),
            enemyAmmunition[i].getY(),
            30, 10,
            player.getX(),
            player.getY(),
            60, 60
        );

        if (hitPlayer) {
            player.setVidas(player.getVidas() - 1);
            enemyAmmunition.splice(i, 1);
            //i--;
        } else if (enemyAmmunition[i].getX() > width + 10) {
            enemyAmmunition.splice(i, 1);
            //i--;
        }
    }
}

function gerenciarVidas(vidas) {
    if (vidas < 0) vidas = 0;
    if (vidas > 3) vidas = 3;
    for (let i = 0; i < vidas; i++) {
        if (vidas == 3) {
            fill("green");
        } else if (vidas == 2) {
            fill("yellow");
        } else {
            fill("red");
        }
        rect(1240 + i * 50, 55, 50, 20);
    }
    image(LoadMedia.get('healthbar'), 1240, 35, 150, 40);
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

function restartGame() {
    gameOver = false;
    gameOverTimer = 0;
    
    player = new Nave(width / 2, height / 2);
    
    playerAmmunition = [];
    enemyAmmunition = [];
    
    enemies = [];
    enemySpawnTimer = 0;
    enemySpawnRate = 120;

    spawnEnemy();
    spawnEnemy();
    
    timer2Bala = 0;
    
    cursor(ARROW);
}