// js/game.js - Игровой движок «Путь к Бессмертию» v2.0 (Боевая система, Секты, Аукционы, Циркуляция)

class CultivationGame {
  constructor() {
    this.player = null;
    this.autoMeditateInterval = null;
    this.isAutoMeditating = false;
    this.activeCombat = null;
    this.activeAuction = null;
    this.init();
  }

  init() {
    const saved = localStorage.getItem('cultivation_save_v2');
    if (saved) {
      try {
        this.player = JSON.parse(saved);
        this.ensureV2Properties();
      } catch (e) {
        console.error('Ошибка загрузки сохранения v2, создаем заново', e);
        this.createNewCharacter();
      }
    } else {
      this.createNewCharacter();
    }
  }

  ensureV2Properties() {
    const p = this.player;
    if (!p.learnedTechniques) p.learnedTechniques = ['tech_slash'];
    if (!p.equippedTechniqueId) p.equippedTechniqueId = 'tech_slash';
    if (!p.cultivationMethod) p.cultivationMethod = 'standard';
    if (p.sectRankId === undefined) p.sectRankId = 0;
    if (p.arenaScore === undefined) p.arenaScore = 0;
    if (!p.defeatedOpponents) p.defeatedOpponents = [];
    if (p.bonusAttack === undefined) p.bonusAttack = 0;
    if (p.bonusDefense === undefined) p.bonusDefense = 0;
    if (p.currentHp === undefined) p.currentHp = this.maxHp;
  }

  createNewCharacter(name = 'Хань Ли') {
    const rootRoll = Math.random();
    let root = SPIRIT_ROOTS[0]; // Мусорный по умолчанию
    if (rootRoll > 0.95) root = SPIRIT_ROOTS[5]; // Мутировавший молниеносный
    else if (rootRoll > 0.85) root = SPIRIT_ROOTS[4]; // Небесный огонь
    else if (rootRoll > 0.65) root = SPIRIT_ROOTS[3]; // Двойной чистый
    else if (rootRoll > 0.40) root = SPIRIT_ROOTS[2]; // Истинный 3 стихий
    else if (rootRoll > 0.20) root = SPIRIT_ROOTS[1]; // 4 стихии

    this.player = {
      name: name,
      ageYears: 16,
      ageMonths: 0,
      maxLifespanYears: 70,
      realmIndex: 0,
      spiritRootId: root.id,
      qi: 0,
      currentHp: 100,
      meridianDamage: 0,
      demonsOfHeart: 0,
      breakthroughBonus: 0,
      bonusAttack: 0,
      bonusDefense: 0,
      cultivationMethod: 'standard',
      sectRankId: 0,
      arenaScore: 0,
      defeatedOpponents: [],
      learnedTechniques: ['tech_slash'],
      equippedTechniqueId: 'tech_slash',
      inventory: {
        stone_spirit: 25,
        herb_spirit: 6,
        herb_ginseng: 3,
        herb_lotus: 1,
        pill_qi: 2,
        pill_purify: 1
      },
      stats: {
        meditationsCount: 0,
        successfulBreakthroughs: 0,
        failedBreakthroughs: 0,
        pillsBrewed: 0,
        battlesWon: 0
      },
      log: [
        {
          year: 16,
          month: 1,
          text: `Вам исполнилось 16 лет. При проверке таланта пробудился ${root.name}. Вы приняты чернорабочим слугой в Секту Лазурного Облака!`
        }
      ]
    };
    this.save();
  }

  get currentRealm() {
    return REALMS[this.player.realmIndex] || REALMS[REALMS.length - 1];
  }

  get spiritRoot() {
    return SPIRIT_ROOTS.find(r => r.id === this.player.spiritRootId) || SPIRIT_ROOTS[0];
  }

  get maxHp() {
    return (this.currentRealm.hp || 100) + (this.player.bonusDefense * 2);
  }

  get attack() {
    return (this.currentRealm.attack || 15) + (this.player.bonusAttack || 0);
  }

  get defense() {
    return (this.currentRealm.defense || 5) + (this.player.bonusDefense || 0);
  }

  get currentSectRank() {
    return SECT_RANKS[this.player.sectRankId] || SECT_RANKS[0];
  }

  calcQiPerMeditation() {
    const base = 15 + (this.player.realmIndex * 14);
    const rootBonus = this.spiritRoot.qiMultiplier;
    const damagePenalty = Math.max(0.2, (100 - (this.player.meridianDamage || 0)) / 100);
    const method = CULTIVATION_METHODS.find(m => m.id === this.player.cultivationMethod) || CULTIVATION_METHODS[0];
    return Math.max(1, Math.round(base * rootBonus * damagePenalty * method.qiMod));
  }

  addTime(months) {
    this.player.ageMonths += months;
    while (this.player.ageMonths >= 12) {
      this.player.ageMonths -= 12;
      this.player.ageYears += 1;
      // Выплата ежегодной/ежемесячной стипендии секты
      const rank = this.currentSectRank;
      if (rank.stipend > 0) {
        this.player.inventory.stone_spirit = (this.player.inventory.stone_spirit || 0) + (rank.stipend * 12);
        this.addLog(`💰 Секта выплатила годовое жалование ранга «${rank.title}»: +${rank.stipend * 12} камней.`);
      }
    }

    if (this.player.ageYears >= this.player.maxLifespanYears) {
      this.handleDeathByOldAge();
      return false;
    }
    return true;
  }

  // Медитация с учетом выбранного метода циркуляции
  meditate() {
    const method = CULTIVATION_METHODS.find(m => m.id === this.player.cultivationMethod) || CULTIVATION_METHODS[0];
    if (!this.addTime(method.timeMonths)) return { died: true };

    const gainedQi = this.calcQiPerMeditation();
    const maxRealmQi = this.currentRealm.baseQiNeeded;

    this.player.qi = Math.min(maxRealmQi, this.player.qi + gainedQi);
    this.player.stats.meditationsCount += method.timeMonths;

    let specialMsg = '';

    // Проверка опасности (Кровавый метод)
    if (method.dangerChance > 0 && Math.random() < method.dangerChance) {
      const dmg = Math.floor(Math.random() * 8) + 4;
      this.player.meridianDamage = Math.min(100, (this.player.meridianDamage || 0) + dmg);
      this.player.demonsOfHeart = Math.min(100, (this.player.demonsOfHeart || 0) + 5);
      specialMsg = ` ⚠️ Кровь вскипела! Ожог меридианов (+${dmg}%) и шепот внутренних демонов.`;
    }

    // Проверка исцеления (Черепаший метод)
    if (method.healChance > 0 && Math.random() < method.healChance) {
      if (this.player.meridianDamage > 0) {
        this.player.meridianDamage = Math.max(0, this.player.meridianDamage - 2);
        specialMsg = ` 🌿 Мягкий поток залечил меридианы (-2%).`;
      }
    }

    // Проверка Озарения (Постижение Дао)
    if (method.insightChance && Math.random() < method.insightChance) {
      if (Math.random() > 0.5) {
        this.player.bonusAttack += 5;
        specialMsg = ` ✨ Озарение под водопадом! Ваше понимание сущности клинка возросло (+5 к базовой Атаке навсегда)!`;
      } else {
        this.player.bonusDefense += 4;
        specialMsg = ` ✨ Озарение Дао! Ваша кожа закалилась подобно нефритовой скале (+4 к базовой Защите навсегда)!`;
      }
      this.addLog(specialMsg);
    }

    // Автоматическое восстановление HP во время медитации
    this.player.currentHp = Math.min(this.maxHp, this.player.currentHp + Math.round(this.maxHp * 0.2));

    this.save();
    return {
      gainedQi,
      specialMsg,
      reachedCap: this.player.qi >= maxRealmQi
    };
  }

  toggleAutoMeditation(onTick) {
    this.isAutoMeditating = !this.isAutoMeditating;
    if (this.isAutoMeditating) {
      this.autoMeditateInterval = setInterval(() => {
        const res = this.meditate();
        if (onTick) onTick(res);
        if (res.died || res.reachedCap) {
          this.stopAutoMeditation();
        }
      }, 750);
    } else {
      this.stopAutoMeditation();
    }
    return this.isAutoMeditating;
  }

  stopAutoMeditation() {
    this.isAutoMeditating = false;
    if (this.autoMeditateInterval) {
      clearInterval(this.autoMeditateInterval);
      this.autoMeditateInterval = null;
    }
  }

  calcBreakthroughChance() {
    let base = 0.70;
    if (this.player.realmIndex >= 9) base = 0.50;
    if (this.player.realmIndex >= 18) base = 0.35;

    const rootBonus = this.spiritRoot.breakthroughBonus || 0;
    const pillBonus = this.player.breakthroughBonus || 0;
    const damagePenalty = (this.player.meridianDamage || 0) * 0.005;
    const demonPenalty = (this.player.demonsOfHeart || 0) * 0.004;

    let total = base + rootBonus + pillBonus - damagePenalty - demonPenalty;
    return Math.max(0.05, Math.min(0.98, total));
  }

  attemptBreakthrough() {
    const realm = this.currentRealm;
    if (this.player.qi < realm.baseQiNeeded) {
      return { success: false, reason: 'Недостаточно Ци для преодоления узкого места!' };
    }

    if (realm.tribulation) {
      return {
        needsTribulation: true,
        tribulation: realm.tribulation,
        chance: this.calcBreakthroughChance()
      };
    }

    return this.executeBreakthroughResult();
  }

  executeBreakthroughResult() {
    const chance = this.calcBreakthroughChance();
    const roll = Math.random();
    this.player.breakthroughBonus = 0;

    if (roll <= chance) {
      this.player.stats.successfulBreakthroughs += 1;
      this.player.realmIndex += 1;
      this.player.qi = 0;

      const newRealm = this.currentRealm;
      this.player.maxLifespanYears += newRealm.lifespanGain;
      this.player.currentHp = this.maxHp;
      this.player.meridianDamage = Math.max(0, this.player.meridianDamage - 15);
      this.player.demonsOfHeart = Math.max(0, this.player.demonsOfHeart - 10);

      this.addLog(`⚡ ВЕЛИКИЙ ПРОРЫВ! Меридианы расширились до ступени: «${newRealm.name}»! Срок жизни увеличен на +${newRealm.lifespanGain} лет!`);
      this.save();
      return { success: true, newRealm, chance };
    } else {
      this.player.stats.failedBreakthroughs += 1;
      this.player.qi = Math.round(this.player.qi * 0.6);
      const addedDamage = Math.floor(Math.random() * 20) + 10;
      const addedDemons = Math.floor(Math.random() * 15) + 5;

      this.player.meridianDamage = Math.min(100, (this.player.meridianDamage || 0) + addedDamage);
      this.player.demonsOfHeart = Math.min(100, (this.player.demonsOfHeart || 0) + addedDemons);

      this.addLog(`💥 НЕУДАЧА ПРОРЫВА! Потоки Ци вышли из-под контроля. Получена травма меридианов (+${addedDamage}%) и выросли Демоны Сердца (+${addedDemons}).`);
      this.save();
      return { success: false, addedDamage, addedDemons, chance };
    }
  }

  // --- БОЕВАЯ СИСТЕМА ---
  startCombat(enemy, onEndCallback) {
    this.stopAutoMeditation();
    this.activeCombat = {
      enemy: { ...enemy, maxHp: enemy.hp, currentHp: enemy.hp },
      playerHp: this.player.currentHp || this.maxHp,
      playerShield: 0,
      enemyShield: 0,
      turn: 1,
      isDodgeActive: false,
      log: [`Бой начался! Перед вами стоит: ${enemy.name}!`],
      onEnd: onEndCallback
    };
    return this.activeCombat;
  }

  combatAction(actionType) {
    if (!this.activeCombat) return null;
    const c = this.activeCombat;
    const enemy = c.enemy;

    let playerDmg = 0;
    let actionLog = '';

    // 1. Ход игрока
    if (actionType === 'attack') {
      sfx.playSwordSlash();
      const baseDmg = Math.max(5, this.attack - Math.floor(enemy.defense * 0.6));
      playerDmg = Math.round(baseDmg * (0.85 + Math.random() * 0.3));
      enemy.currentHp = Math.max(0, enemy.currentHp - playerDmg);
      actionLog = `Вы нанесли удар духовным клинком, причинив ${playerDmg} урона!`;
    } 
    else if (actionType === 'technique') {
      const tech = TECHNIQUES.find(t => t.id === this.player.equippedTechniqueId) || TECHNIQUES[0];
      if (this.player.qi < tech.qiCost) {
        return { error: `Недостаточно Ци! Требуется ${tech.qiCost} Ци.` };
      }
      this.player.qi -= tech.qiCost;
      sfx.playTechniqueCast();

      if (tech.isShield) {
        c.playerShield = Math.round(this.defense * 2.5);
        actionLog = `Вы активировали ${tech.name}! Вокруг засиял нефритовый барьер (+${c.playerShield} защиты).`;
      } else if (tech.isDodge) {
        c.isDodgeActive = true;
        playerDmg = Math.round(this.attack * tech.multiplier);
        enemy.currentHp = Math.max(0, enemy.currentHp - playerDmg);
        actionLog = `Вы применили ${tech.name}! Мгновенный теневой выпад нанес ${playerDmg} урона, силуэт готов к уклонению!`;
      } else {
        const baseDmg = Math.max(10, Math.round(this.attack * tech.multiplier) - enemy.defense);
        playerDmg = Math.round(baseDmg * (0.9 + Math.random() * 0.3));
        enemy.currentHp = Math.max(0, enemy.currentHp - playerDmg);
        actionLog = `Вы высвободили ${tech.name}! Вспышка энергии сокрушила защиту врага на ${playerDmg} урона!`;

        if (tech.drainPercent) {
          const heal = Math.round(playerDmg * tech.drainPercent);
          c.playerHp = Math.min(this.maxHp, c.playerHp + heal);
          this.player.demonsOfHeart = Math.min(100, this.player.demonsOfHeart + (tech.demonCost || 5));
          actionLog += ` Поглощено ${heal} жизненной силы (+${tech.demonCost} к Демонам Сердца).`;
        }
      }
    }
    else if (actionType === 'pill') {
      if ((this.player.inventory.pill_qi || 0) <= 0) {
        return { error: 'В кольце нет Пилюль Сбора Ци!' };
      }
      this.player.inventory.pill_qi -= 1;
      sfx.playAlchemy();
      const heal = Math.round(this.maxHp * 0.4);
      c.playerHp = Math.min(this.maxHp, c.playerHp + heal);
      this.player.qi = Math.min(this.currentRealm.baseQiNeeded, this.player.qi + 300);
      actionLog = `Вы проглотили пилюлю в пылу боя! Восстановлено ${heal} ОЗ и 300 Ци!`;
    }
    else if (actionType === 'flee') {
      sfx.playClick();
      this.player.currentHp = Math.max(1, c.playerHp);
      this.activeCombat = null;
      this.addLog(`Вы рассеяли Ци и спешно отступили из боя.`);
      this.save();
      return { fled: true };
    }

    c.log.push(actionLog);

    // Проверка победы игрока
    if (enemy.currentHp <= 0) {
      sfx.playBreakthrough();
      this.player.stats.battlesWon += 1;
      this.player.currentHp = c.playerHp;

      const stones = enemy.rewardStones || 20;
      this.player.inventory.stone_spirit = (this.player.inventory.stone_spirit || 0) + stones;

      if (enemy.rewardHerbs) {
        for (const [k, v] of Object.entries(enemy.rewardHerbs)) {
          this.player.inventory[k] = (this.player.inventory[k] || 0) + v;
        }
      }

      if (enemy.score) {
        this.player.arenaScore = (this.player.arenaScore || 0) + enemy.score;
        if (!this.player.defeatedOpponents.includes(enemy.id)) {
          this.player.defeatedOpponents.push(enemy.id);
        }
        this.checkSectRankPromotion();
      }

      const victoryText = `🎉 Победа! ${enemy.name} повержен! Получено: +${stones} духовных камней.`;
      c.log.push(victoryText);
      this.addLog(victoryText);
      this.save();

      const cb = c.onEnd;
      this.activeCombat = null;
      if (cb) cb({ victory: true, enemy });
      return { victory: true, enemy, stones };
    }

    // 2. Ответный ход врага
    let enemyDmg = 0;
    let enemyLog = '';

    if (c.isDodgeActive && Math.random() < 0.85) {
      c.isDodgeActive = false;
      enemyLog = `${enemy.name} нанес сокрушительный удар, но рассек лишь остаточный фантом вашей Тени!`;
    } else {
      c.isDodgeActive = false;
      const rawDmg = Math.max(5, enemy.attack - this.defense);
      let incoming = Math.round(rawDmg * (0.85 + Math.random() * 0.3));

      if (c.playerShield > 0) {
        const absorb = Math.min(incoming, c.playerShield);
        c.playerShield -= absorb;
        incoming -= absorb;
        sfx.playShieldBlock();
        enemyLog = `Барьер поглотил ${absorb} урона! `;
      }

      c.playerHp = Math.max(0, c.playerHp - incoming);
      sfx.playSwordSlash();
      enemyLog += `${enemy.name} атаковал вас, причинив ${incoming} урона!`;
    }

    c.log.push(enemyLog);

    // Проверка поражения игрока
    if (c.playerHp <= 0) {
      sfx.playFailure();
      this.player.currentHp = Math.round(this.maxHp * 0.15); // Тяжело ранен
      this.player.meridianDamage = Math.min(100, (this.player.meridianDamage || 0) + 20);
      this.player.demonsOfHeart = Math.min(100, (this.player.demonsOfHeart || 0) + 10);
      const defeatText = `💀 Поражение! ${enemy.name} сокрушил вашу защиту. Вы едва спаслись бегством (+20% травм меридианов).`;
      this.addLog(defeatText);
      this.save();

      const cb = c.onEnd;
      this.activeCombat = null;
      if (cb) cb({ victory: false, enemy });
      return { victory: false, enemy };
    }

    c.turn += 1;
    this.player.currentHp = c.playerHp;
    this.save();
    return { ongoing: true, combat: c };
  }

  checkSectRankPromotion() {
    const curRank = this.player.sectRankId || 0;
    const nextRank = SECT_RANKS[curRank + 1];
    if (nextRank && this.player.arenaScore >= nextRank.reqScore) {
      this.player.sectRankId = curRank + 1;
      this.addLog(`🎖️ ВЕЛИКОЕ ПОВЫШЕНИЕ В СЕКТЕ! Вы заслужили ранг «${nextRank.title}»! Ежемесячное жалование увеличено до ${nextRank.stipend} камней!`);
    }
  }

  learnTechnique(techId) {
    if (!this.player.learnedTechniques.includes(techId)) {
      this.player.learnedTechniques.push(techId);
      const tech = TECHNIQUES.find(t => t.id === techId);
      this.addLog(`📜 Вы постигли новую технику Дао: «${tech ? tech.name : techId}»!`);
      this.save();
      return true;
    }
    return false;
  }

  equipTechnique(techId) {
    if (this.player.learnedTechniques.includes(techId)) {
      this.player.equippedTechniqueId = techId;
      this.save();
      return true;
    }
    return false;
  }

  // --- АУКЦИОН ---
  startAuctionLot() {
    const item = AUCTION_ITEMS[Math.floor(Math.random() * AUCTION_ITEMS.length)];
    this.activeAuction = {
      item,
      currentBid: item.startBid,
      highestBidder: 'Молодой Господин клана Ван',
      playerBid: 0,
      round: 1,
      rivalMax: item.rivalMaxBid + Math.floor(Math.random() * 40)
    };
    return this.activeAuction;
  }

  placeAuctionBid(step = 15) {
    if (!this.activeAuction) return { error: 'Аукцион не идет' };
    const auc = this.activeAuction;
    const newBid = auc.currentBid + step;

    if ((this.player.inventory.stone_spirit || 0) < newBid) {
      return { error: `Недостаточно духовных камней! Требуется ${newBid} камней.` };
    }

    sfx.playGavel();
    auc.currentBid = newBid;
    auc.highestBidder = this.player.name;
    auc.playerBid = newBid;

    // Реакция соперника
    if (newBid < auc.rivalMax) {
      const rivalCounter = newBid + Math.floor(Math.random() * 15) + 10;
      setTimeout(() => {
        auc.currentBid = rivalCounter;
        auc.highestBidder = 'Высокомерный Старейшина Секты Призраков';
        sfx.playGavel();
        if (ui) ui.renderAuction();
      }, 700);
      return { status: 'counter', bid: newBid };
    } else {
      // Игрок победил в торгах!
      this.player.inventory.stone_spirit -= newBid;
      this.awardAuctionItem(auc.item);
      const wonItem = auc.item;
      this.activeAuction = null;
      sfx.playBreakthrough();
      this.addLog(`🔨 Аукцион завершен! Вы выиграли лот «${wonItem.name}» за ${newBid} камней!`);
      this.save();
      return { status: 'won', item: wonItem, cost: newBid };
    }
  }

  awardAuctionItem(item) {
    if (item.type === 'technique') {
      this.learnTechnique(item.techId);
    } else if (item.type === 'pill') {
      this.player.inventory[item.pillId] = (this.player.inventory[item.pillId] || 0) + 1;
    } else if (item.type === 'special') {
      this.player.meridianDamage = Math.max(0, this.player.meridianDamage - 30);
      this.player.demonsOfHeart = Math.max(0, this.player.demonsOfHeart - 30);
    }
  }

  brewPill(recipeId) {
    const recipe = ALCHEMY_RECIPES.find(r => r.id === recipeId);
    if (!recipe) return { success: false, msg: 'Неизвестный рецепт' };

    for (const [item, qty] of Object.entries(recipe.ingredients)) {
      if ((this.player.inventory[item] || 0) < qty) {
        return { success: false, msg: 'Недостаточно ингредиентов в пространственном кольце!' };
      }
    }

    for (const [item, qty] of Object.entries(recipe.ingredients)) {
      this.player.inventory[item] -= qty;
    }

    this.addTime(1);

    const roll = Math.random();
    if (roll <= recipe.successRate) {
      this.player.stats.pillsBrewed += 1;
      this.player.inventory[recipe.id] = (this.player.inventory[recipe.id] || 0) + 1;
      this.addLog(`🧪 Успех алхимии! Из котла извлечена сияющая «${recipe.name}».`);
      this.save();
      return { success: true, pill: recipe };
    } else {
      this.player.meridianDamage = Math.min(100, (this.player.meridianDamage || 0) + 5);
      this.addLog(`💥 Взрыв алхимического котла! Травы обратились в пепел, легкое отравление ядовитым дымом.`);
      this.save();
      return { success: false, exploded: true };
    }
  }

  useItem(itemId) {
    if (!this.player.inventory[itemId] || this.player.inventory[itemId] <= 0) {
      return { success: false, msg: 'Предмета нет в инвентаре' };
    }

    this.player.inventory[itemId] -= 1;
    let msg = '';

    if (itemId === 'pill_qi') {
      const added = 500;
      this.player.qi = Math.min(this.currentRealm.baseQiNeeded, this.player.qi + added);
      msg = `Вы проглотили Пилюлю Сбора Ци. Поток теплой энергии заполнил даньтянь (+${added} Ци).`;
    } else if (itemId === 'pill_purify') {
      this.player.meridianDamage = Math.max(0, this.player.meridianDamage - 30);
      msg = `Целебный сок пилюли залечил повреждения меридианов (-30% травм).`;
    } else if (itemId === 'pill_foundation') {
      this.player.breakthroughBonus = (this.player.breakthroughBonus || 0) + 0.25;
      msg = `Вы приняли Пилюлю Возведения Основания. Сила защитной ауры готова к следующему прорыву (+25% к шансу).`;
    } else if (itemId === 'pill_heart_calm') {
      this.player.demonsOfHeart = Math.max(0, this.player.demonsOfHeart - 40);
      msg = `Рассудок очистился от скверных иллюзий (-40 к Демонам Сердца).`;
    } else if (itemId === 'pill_golden_core') {
      this.player.breakthroughBonus = (this.player.breakthroughBonus || 0) + 0.35;
      msg = `Суть Золотого Ядра окутала ваш даньтянь (+35% к шансу прорыва).`;
    }

    this.addLog(msg);
    this.save();
    return { success: true, msg };
  }

  handleDeathByOldAge() {
    this.stopAutoMeditation();
    this.addLog(`☠️ Ваша плоть иссохла, а срок жизни подошел к концу. Не успев совершить прорыв, ваша душа растворилась в колесе Сансары.`);
    this.player.isDead = true;
    this.save();
  }

  addLog(text) {
    this.player.log.unshift({
      year: this.player.ageYears,
      month: this.player.ageMonths + 1,
      text: text
    });
    if (this.player.log.length > 100) this.player.log.pop();
  }

  save() {
    localStorage.setItem('cultivation_save_v2', JSON.stringify(this.player));
  }

  reset() {
    this.stopAutoMeditation();
    this.activeCombat = null;
    this.activeAuction = null;
    localStorage.removeItem('cultivation_save_v2');
    this.createNewCharacter();
  }
}

const gameEngine = new CultivationGame();
