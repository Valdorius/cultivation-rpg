// js/game.js - Игровой движок «Путь к Бессмертию»

class CultivationGame {
  constructor() {
    this.player = null;
    this.autoMeditateInterval = null;
    this.isAutoMeditating = false;
    this.activeTribulation = null;
    this.init();
  }

  init() {
    const saved = localStorage.getItem('cultivation_save_v1');
    if (saved) {
      try {
        this.player = JSON.parse(saved);
      } catch (e) {
        console.error('Ошибка загрузки сохранения', e);
        this.createNewCharacter();
      }
    } else {
      this.createNewCharacter();
    }
  }

  createNewCharacter(name = 'Хань Ли') {
    // Случайный выбор корня (в классике Сянься главный герой часто начинает с низким корнем)
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
      meridianDamage: 0, // 0 to 100%
      demonsOfHeart: 0,   // 0 to 100
      breakthroughBonus: 0,
      inventory: {
        stone_spirit: 10,
        herb_spirit: 5,
        herb_ginseng: 3,
        herb_lotus: 1,
        pill_qi: 1
      },
      stats: {
        meditationsCount: 0,
        successfulBreakthroughs: 0,
        failedBreakthroughs: 0,
        pillsBrewed: 0
      },
      log: [
        {
          year: 16,
          month: 1,
          text: `Вам исполнилось 16 лет. Во время испытания в клане у вас пробудился ${root.name}. Вы ступили на тернистый Путь к Бессмертию!`
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

  calcQiPerMeditation() {
    const base = 15 + (this.player.realmIndex * 12);
    const rootBonus = this.spiritRoot.qiMultiplier;
    const damagePenalty = (100 - (this.player.meridianDamage || 0)) / 100;
    return Math.max(1, Math.round(base * rootBonus * damagePenalty));
  }

  addTime(months) {
    this.player.ageMonths += months;
    while (this.player.ageMonths >= 12) {
      this.player.ageMonths -= 12;
      this.player.ageYears += 1;
    }

    // Проверка смерти от старости
    if (this.player.ageYears >= this.player.maxLifespanYears) {
      this.handleDeathByOldAge();
      return false;
    }
    return true;
  }

  meditate(months = 1) {
    if (!this.addTime(months)) return { died: true };

    const gainedQi = this.calcQiPerMeditation() * months;
    const maxRealmQi = this.currentRealm.baseQiNeeded;

    this.player.qi = Math.min(maxRealmQi, this.player.qi + gainedQi);
    this.player.stats.meditationsCount += months;

    // Пассивное медленное исцеление легких травм при спокойной медитации
    if (this.player.meridianDamage > 0 && Math.random() < 0.25) {
      this.player.meridianDamage = Math.max(0, this.player.meridianDamage - 1);
    }

    this.save();
    return {
      gainedQi,
      reachedCap: this.player.qi >= maxRealmQi
    };
  }

  toggleAutoMeditation(onTick) {
    this.isAutoMeditating = !this.isAutoMeditating;
    if (this.isAutoMeditating) {
      this.autoMeditateInterval = setInterval(() => {
        const res = this.meditate(1);
        if (onTick) onTick(res);
        if (res.died || res.reachedCap) {
          this.stopAutoMeditation();
        }
      }, 700);
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
    let base = 0.70; // 70% базовый шанс
    if (this.player.realmIndex >= 9) base = 0.50; // На уровне Конденсации Ци
    if (this.player.realmIndex >= 18) base = 0.35; // На уровне Основания

    const rootBonus = this.spiritRoot.breakthroughBonus || 0;
    const pillBonus = this.player.breakthroughBonus || 0;
    const damagePenalty = (this.player.meridianDamage || 0) * 0.005; // до -50%
    const demonPenalty = (this.player.demonsOfHeart || 0) * 0.004; // до -40%

    let total = base + rootBonus + pillBonus - damagePenalty - demonPenalty;
    return Math.max(0.05, Math.min(0.98, total));
  }

  attemptBreakthrough() {
    const realm = this.currentRealm;
    if (this.player.qi < realm.baseQiNeeded) {
      return { success: false, reason: 'Недостаточно Ци для преодоления узкого места!' };
    }

    // Если на этой ступени предусмотрена Небесная Скорбь
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

    // Сброс бонуса от пилюли после попытки
    this.player.breakthroughBonus = 0;

    if (roll <= chance) {
      // УСПЕХ
      this.player.stats.successfulBreakthroughs += 1;
      this.player.realmIndex += 1;
      this.player.qi = 0;

      const newRealm = this.currentRealm;
      this.player.maxLifespanYears += newRealm.lifespanGain;

      // Успешный прорыв очищает немного скверны
      this.player.meridianDamage = Math.max(0, this.player.meridianDamage - 15);
      this.player.demonsOfHeart = Math.max(0, this.player.demonsOfHeart - 10);

      this.addLog(`⚡ ВЕЛИКИЙ ПРОРЫВ! Ваши меридианы расширились, вы достигли ступени: «${newRealm.name}»! Срок жизни увеличен на +${newRealm.lifespanGain} лет!`);
      this.save();
      return { success: true, newRealm, chance };
    } else {
      // ПРОВАЛ
      this.player.stats.failedBreakthroughs += 1;
      this.player.qi = Math.round(this.player.qi * 0.6); // потеря 40% Ци
      const addedDamage = Math.floor(Math.random() * 20) + 10;
      const addedDemons = Math.floor(Math.random() * 15) + 5;

      this.player.meridianDamage = Math.min(100, (this.player.meridianDamage || 0) + addedDamage);
      this.player.demonsOfHeart = Math.min(100, (this.player.demonsOfHeart || 0) + addedDemons);

      this.addLog(`💥 НЕУДАЧА ПРОРЫВА! Потоки Ци вышли из-под контроля. Получена травма меридианов (+${addedDamage}%) и выросли Демоны Сердца (+${addedDemons}).`);
      this.save();
      return { success: false, addedDamage, addedDemons, chance };
    }
  }

  // Алхимия
  brewPill(recipeId) {
    const recipe = ALCHEMY_RECIPES.find(r => r.id === recipeId);
    if (!recipe) return { success: false, msg: 'Неизвестный рецепт' };

    // Проверка ингредиентов
    for (const [item, qty] of Object.entries(recipe.ingredients)) {
      if ((this.player.inventory[item] || 0) < qty) {
        return { success: false, msg: 'Недостаточно ингредиентов в пространственном кольце!' };
      }
    }

    // Списание ингредиентов
    for (const [item, qty] of Object.entries(recipe.ingredients)) {
      this.player.inventory[item] -= qty;
    }

    this.addTime(1); // Варка пилюли занимает 1 месяц

    const roll = Math.random();
    if (roll <= recipe.successRate) {
      this.player.stats.pillsBrewed += 1;
      this.player.inventory[recipe.id] = (this.player.inventory[recipe.id] || 0) + 1;
      this.addLog(`🧪 Успех алхимии! Из котла извлечена сияющая «${recipe.name}».`);
      this.save();
      return { success: true, pill: recipe };
    } else {
      // Взрыв котла
      this.player.meridianDamage = Math.min(100, (this.player.meridianDamage || 0) + 5);
      this.addLog(`💥 Взрыв алхимического котла! Травы обратились в пепел, легкое отравление ядовитым дымом.`);
      this.save();
      return { success: false, exploded: true };
    }
  }

  // Использование предмета
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
    // Ограничение длины лога до 100 записей
    if (this.player.log.length > 100) {
      this.player.log.pop();
    }
  }

  save() {
    localStorage.setItem('cultivation_save_v1', JSON.stringify(this.player));
  }

  reset() {
    this.stopAutoMeditation();
    localStorage.removeItem('cultivation_save_v1');
    this.createNewCharacter();
  }
}

const gameEngine = new CultivationGame();
