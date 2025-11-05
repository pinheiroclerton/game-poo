# Herança
1. 3 Classes que herdam (OK)
   - Inimigo extends Nave ✅
   - Boss extends Inimigo ✅
   - BossBullet extends Bullet ✅
   - BossLife extends Life ✅
2. Cada classe filho deve ter um novo atributo (OK)
   - Inimigo: w, h ✅
   - Boss: health, phase, attackPattern ✅
   - BossBullet: damage, color, size ✅
   - BossLife: shields, hasShield, regenerating ✅

# Estatico
1. 3 metodos estáticos (OK)
   - LoadMedia.preloadImages() ✅
   - LoadMedia.preloadSounds() ✅
   - LoadMedia.preloadAll() ✅
   - LoadMedia.get() ✅
   - LoadMedia.getAll() ✅

# Polimorfismo
1. 3 usos dos metodos this() (OK)
2. 3 usos dos metodos super() (OK)
   - Boss: super(x, y, l, a) no constructor ✅
   - Boss: super.show(img) ✅
   - Boss: super.automove(speed * 0.5, limit) ✅
   - BossLife: super(maxLives) no constructor ✅
   - BossLife: super.takeDamage(overflow) ✅

# Private
1. 3 atributos private em 3 classes distintas (OK)
   - Boss: #health, #phase ✅
   - BossBullet: #damage ✅
   - Ultimate: #cooldown, #isReady ✅
   - Life: #currentLives, #maxLives ✅
   - BossLife: #shields ✅
   - Item: #type, #value ✅
   - Music: #volume, #isPlaying ✅
2. 3 pares de metodos get() e set() (OK)

# Classes por integrante
1. 3 classes por integrante do grupo (OK)
    1.1. ship.js ✅
    1.2. enemy.js (h) ✅
    1.3. boss.js (h) ✅
    1.4. bullet.js ✅
    1.5. bossBullet.js (h) ✅
    1.6. ultimate.js ✅
    1.7. life.js ✅
    1.8. bossLife.js (h) ✅
    1.9. item.js ✅
    1.10. loadMedia.js ✅
    1.11. music.js ✅
