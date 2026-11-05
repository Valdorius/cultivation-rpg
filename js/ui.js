// js/ui.js - Управление пользовательским интерфейсом и визуализациями

class GameUI {
  constructor() {
    this.currentTab = 'cultivation';
    this.initEventListeners();
    this.render();
  }

  initEventListeners() {
    // Навигация по вкладкам
    document.querySelectorAll('.nav-item').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tab = e.currentTarget.dataset.tab;
        this.switchTab(tab);
        sfx.playClick();
      });
    });

    // Кнопка медитации
    const btnMeditate = document.getElementById('btn-meditate');
    if (btnMeditate) {
      btnMeditate.addEventListener('click', () => {
        sfx.playMeditation();
        const res = gameEngine.meditate(1);
        this.render();
        if (res.reachedCap) {
          this.showToast('Даньтянь полон! Настало время прорыва через узкое место!');
        }
      });
    }

    // Авто-медитация
    const btnAuto = document.getElementById('btn-auto-meditate');
    if (btnAuto) {
      btnAuto.addEventListener('click', () => {
        sfx.playClick();
        const isRunning = gameEngine.toggleAutoMeditation((res) => {
          sfx.playMeditation();
          this.render();
        });
        btnAuto.classList.toggle('btn-auto-active', isRunning);
        btnAuto.innerHTML = isRunning 
          ? '<span>🧘</span> Остановить поток' 
          : '<span>⚡</span> Авто-поток Ци';
      });
    }

    // Прорыв
    const btnBreakthrough = document.getElementById('btn-breakthrough');
    if (btnBreakthrough) {
      btnBreakthrough.addEventListener('click', () => {
        this.handleBreakthroughClick();
      });
    }

    // Переключатель звука
    const btnSound = document.getElementById('btn-sound-toggle');
    if (btnSound) {
      btnSound.addEventListener('click', () => {
        const state = sfx.toggleSound();
        btnSound.textContent = state ? '🔊' : '🔇';
      });
    }

    // Рестарт / Новая жизнь
    const btnReset = document.getElementById('btn-reset');
    if (btnReset) {
      btnReset.addEventListener('click', () => {
        if (confirm('Сбросить текущее воплощение и начать новую реинкарнацию в колесе Сансары?')) {
          gameEngine.reset();
          this.render();
          this.showToast('Вы возродились новым смертным в смертном мире!');
        }
      });
    }

    // Закрытие модального окна
    const modalClose = document.getElementById('modal-close');
    if (modalClose) {
      modalClose.addEventListener('click', () => {
        document.getElementById('game-modal').classList.remove('active');
      });
    }
  }

  switchTab(tabName) {
    this.currentTab = tabName;
    document.querySelectorAll('.tab-pane').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));

    const activePane = document.getElementById(`tab-${tabName}`);
    if (activePane) activePane.classList.add('active');

    const activeBtn = document.querySelector(`.nav-item[data-tab="${tabName}"]`);
    if (activeBtn) activeBtn.classList.add('active');

    this.renderTabContent(tabName);
  }

  render() {
    const p = gameEngine.player;
    if (!p) return;

    const realm = gameEngine.currentRealm;
    const root = gameEngine.spiritRoot;

    // Шапка и профиль
    document.getElementById('player-name').textContent = p.name;
    document.getElementById('player-realm').textContent = realm.name;
    document.getElementById('player-realm').style.borderColor = realm.color;
    document.getElementById('player-realm').style.color = realm.color;

    // Возраст и продолжительность жизни
    const lifespanEl = document.getElementById('stat-lifespan');
    if (lifespanEl) {
      const remaining = p.maxLifespanYears - p.ageYears;
      lifespanEl.textContent = `${p.ageYears} лет / макс. ${p.maxLifespanYears} (${remaining} осталось)`;
      if (remaining <= 5) lifespanEl.className = 'stat-value danger';
      else lifespanEl.className = 'stat-value';
    }

    // Духовный корень
    const rootEl = document.getElementById('stat-root');
    if (rootEl) {
      rootEl.textContent = root.name;
      rootEl.title = root.description;
    }

    // Меридианы и Демоны
    const meridianEl = document.getElementById('stat-meridians');
    if (meridianEl) {
      meridianEl.textContent = `${100 - (p.meridianDamage || 0)}% (Травмы: ${p.meridianDamage || 0}%)`;
      meridianEl.className = p.meridianDamage > 25 ? 'stat-value danger' : 'stat-value jade';
    }

    const demonsEl = document.getElementById('stat-demons');
    if (demonsEl) {
      demonsEl.textContent = `${p.demonsOfHeart || 0} / 100`;
      demonsEl.className = p.demonsOfHeart > 40 ? 'stat-value danger' : 'stat-value';
    }

    // Шкала Даньтяня (Ци)
    const qiMax = realm.baseQiNeeded;
    const qiCurrent = p.qi;
    const percent = Math.min(100, (qiCurrent / qiMax) * 100).toFixed(1);

    document.getElementById('qi-text').textContent = `${qiCurrent.toLocaleString()} / ${qiMax.toLocaleString()} Ци (${percent}%)`;
    document.getElementById('qi-fill').style.width = `${percent}%`;

    // Шанс прорыва
    const chance = Math.round(gameEngine.calcBreakthroughChance() * 100);
    const chanceEl = document.getElementById('breakthrough-chance');
    if (chanceEl) {
      chanceEl.textContent = `${chance}%`;
      chanceEl.className = chance >= 60 ? 'jade' : (chance < 40 ? 'danger' : 'gold');
    }

    this.renderTabContent(this.currentTab);
  }

  renderTabContent(tab) {
    if (tab === 'inventory') this.renderInventory();
    if (tab === 'alchemy') this.renderAlchemy();
    if (tab === 'world') this.renderWorld();
    if (tab === 'chronicle') this.renderChronicle();
  }

  renderInventory() {
    const p = gameEngine.player;
    const container = document.getElementById('inventory-list');
    if (!container) return;

    const names = {
      stone_spirit: { title: 'Духовные Камни', desc: 'Универсальная валюта и источник чистой Ци' },
      herb_spirit: { title: 'Духовная Трава', desc: 'Базовый ингредиент для сбора Ци' },
      herb_ginseng: { title: 'Тысячелетний Женьшень', desc: 'Ценный корень, восстанавливает меридианы' },
      herb_lotus: { title: 'Снежный Лотос Чистого Сердца', desc: 'Очищает разум от Демонов Сердца' },
      pill_qi: { title: 'Пилюля Сбора Ци', desc: 'Мгновенно дает +500 Ци', isConsumable: true },
      pill_purify: { title: 'Пилюля Очищения Меридианов', desc: 'Исцеляет 30% травм', isConsumable: true },
      pill_foundation: { title: 'Пилюля Возведения Основания', desc: '+25% к шансу прорыва', isConsumable: true },
      pill_heart_calm: { title: 'Пилюля Спокойствия Сердца', desc: '-40 к Демонам Сердца', isConsumable: true },
      pill_golden_core: { title: 'Пилюля Золотого Ядра', desc: '+35% к шансу прорыва Золотого Ядра', isConsumable: true }
    };

    let html = '';
    let hasItems = false;

    for (const [key, qty] of Object.entries(p.inventory)) {
      if (qty > 0) {
        hasItems = true;
        const info = names[key] || { title: key, desc: 'Таинственный предмет' };
        html += `
          <div class="item-card">
            <div class="item-details">
              <h4>${info.title} × ${qty}</h4>
              <p>${info.desc}</p>
            </div>
            ${info.isConsumable ? `<button class="btn-small" onclick="ui.handleUseItem('${key}')">Использовать</button>` : ''}
          </div>
        `;
      }
    }

    if (!hasItems) {
      html = '<p style="color: var(--text-muted); text-align: center; padding: 20px;">Пространственное кольцо пусто.</p>';
    }

    container.innerHTML = html;
  }

  handleUseItem(itemId) {
    const res = gameEngine.useItem(itemId);
    if (res.success) {
      sfx.playAlchemy();
      this.render();
      this.showToast(res.msg);
    }
  }

  renderAlchemy() {
    const container = document.getElementById('alchemy-list');
    if (!container) return;

    let html = '';
    ALCHEMY_RECIPES.forEach(recipe => {
      const p = gameEngine.player;
      let canCraft = true;
      const ingParts = [];

      for (const [item, qty] of Object.entries(recipe.ingredients)) {
        const owned = p.inventory[item] || 0;
        const hasEnough = owned >= qty;
        if (!hasEnough) canCraft = false;
        ingParts.push(`<span style="color: ${hasEnough ? 'var(--jade)' : 'var(--crimson)'}">${item} ${owned}/${qty}</span>`);
      }

      html += `
        <div class="item-card">
          <div class="item-details" style="flex: 1; padding-right: 10px;">
            <h4>🧪 ${recipe.name}</h4>
            <p>${recipe.description}</p>
            <div style="font-size: 0.72rem; margin-top: 4px;">Ингредиенты: ${ingParts.join(', ')}</div>
            <div style="font-size: 0.72rem; color: var(--gold); margin-top: 2px;">Шанс успеха: ${Math.round(recipe.successRate * 100)}%</div>
          </div>
          <button class="btn-small" ${canCraft ? '' : 'disabled style="opacity: 0.5;"'} onclick="ui.handleBrewPill('${recipe.id}')">
            Сварить
          </button>
        </div>
      `;
    });

    container.innerHTML = html;
  }

  handleBrewPill(recipeId) {
    const res = gameEngine.brewPill(recipeId);
    if (res.success) {
      sfx.playAlchemy();
      this.render();
      this.showToast(`Успех! Сварена: ${res.pill.name}`);
    } else {
      sfx.playFailure();
      this.render();
      this.showToast(res.exploded ? 'Взрыв котла! Травы сгорели.' : res.msg);
    }
  }

  renderWorld() {
    const container = document.getElementById('world-content');
    if (!container) return;

    container.innerHTML = `
      <div class="card">
        <div class="card-title">⛰️ Ущелье Спящего Дракона</div>
        <p style="font-size: 0.85rem; color: var(--text-secondary); margin: 8px 0;">
          Опасное ущелье, наполненное туманом, дикими духовными зверями и полянами редких трав.
        </p>
        <button class="btn-primary" style="width: 100%; margin-top: 10px;" onclick="ui.triggerExpedition()">
          <span>🧭</span> Отправиться в экспедицию (1 месяц)
        </button>
      </div>

      <div class="card">
        <div class="card-title">🏯 Секта Лазурного Облака</div>
        <p style="font-size: 0.85rem; color: var(--text-secondary); margin: 8px 0;">
          Вы числитесь внешним учеником секты. Выполняйте поручения старейшин за духовные камни.
        </p>
        <button class="btn-primary btn-gold" style="width: 100%; margin-top: 10px;" onclick="ui.doSectDuty()">
          <span>📜</span> Выполнить поручение секты (+20 камней)
        </button>
      </div>
    `;
  }

  doSectDuty() {
    gameEngine.addTime(1);
    const stones = 20;
    gameEngine.player.inventory.stone_spirit = (gameEngine.player.inventory.stone_spirit || 0) + stones;
    gameEngine.addLog(`Вы выполнили поручение павильона миссий и получили ${stones} духовных камней.`);
    sfx.playClick();
    this.render();
    this.showToast(`Получено +${stones} духовных камней!`);
  }

  triggerExpedition() {
    gameEngine.addTime(1);
    const event = EXPEDITION_EVENTS[Math.floor(Math.random() * EXPEDITION_EVENTS.length)];
    sfx.playClick();

    const modal = document.getElementById('game-modal');
    const title = document.getElementById('modal-title');
    const body = document.getElementById('modal-body');
    const actions = document.getElementById('modal-actions');

    title.textContent = event.title;
    body.innerHTML = `<p style="font-size: 0.9rem; line-height: 1.6;">${event.text}</p>`;

    actions.innerHTML = '';
    event.choices.forEach(ch => {
      const b = document.createElement('button');
      b.className = 'btn-primary';
      b.style.width = '100%';
      b.style.marginBottom = '8px';
      b.textContent = ch.text;
      b.onclick = () => {
        const resultText = ch.action(gameEngine);
        gameEngine.addLog(resultText);
        modal.classList.remove('active');
        this.render();
        this.showToast(resultText);
      };
      actions.appendChild(b);
    });

    modal.classList.add('active');
  }

  handleBreakthroughClick() {
    const realm = gameEngine.currentRealm;
    if (gameEngine.player.qi < realm.baseQiNeeded) {
      sfx.playFailure();
      this.showToast('Даньтянь еще не полон! Медитируйте дальше.');
      return;
    }

    const check = gameEngine.attemptBreakthrough();
    if (check.needsTribulation) {
      this.startTribulationSequence(check.tribulation);
    } else {
      if (check.success) {
        sfx.playBreakthrough();
        this.showToast(`✨ Прорыв удался! Ступень: ${check.newRealm.name}`);
      } else {
        sfx.playFailure();
        this.showToast(`💥 Прорыв провален! Меридианы повреждены.`);
      }
      this.render();
    }
  }

  startTribulationSequence(tribulation) {
    sfx.playThunder();
    document.body.classList.add('tribulation-flash');
    setTimeout(() => document.body.classList.remove('tribulation-flash'), 500);

    const modal = document.getElementById('game-modal');
    const title = document.getElementById('modal-title');
    const body = document.getElementById('modal-body');
    const actions = document.getElementById('modal-actions');

    title.textContent = `⚡ ${tribulation.name}`;
    body.innerHTML = `
      <p style="color: var(--lightning); font-size: 1.1rem; font-weight: 700; margin-bottom: 10px;">
        Небеса содрогаются! Над вашей головой сгустились грозовые тучи Скорби!
      </p>
      <p style="font-size: 0.9rem; color: var(--text-secondary);">
        Вам предстоит выдержать ${tribulation.strikes} ударов Небесной Молнии. Используйте всю силу культивации, чтобы не быть испепеленным в пыль!
      </p>
    `;

    actions.innerHTML = `
      <button class="btn-primary btn-gold" style="width: 100%;" onclick="ui.resolveTribulation()">
        Принять Небесную Скорбь!
      </button>
    `;

    modal.classList.add('active');
  }

  resolveTribulation() {
    document.getElementById('game-modal').classList.remove('active');
    sfx.playThunder();

    const res = gameEngine.executeBreakthroughResult();
    if (res.success) {
      sfx.playBreakthrough();
      this.showToast(`⚡ Вы рассекли Небесную Молнию и совершили Прорыв!`);
    } else {
      sfx.playFailure();
      this.showToast(`💥 Удар молнии опалил меридианы! Прорыв сорван.`);
    }
    this.render();
  }

  renderChronicle() {
    const container = document.getElementById('chronicle-list');
    if (!container) return;

    let html = '';
    gameEngine.player.log.forEach(item => {
      html += `
        <div class="log-entry">
          <div class="log-meta">Год ${item.year}, месяц ${item.month}</div>
          <div>${item.text}</div>
        </div>
      `;
    });
    container.innerHTML = html;
  }

  showToast(msg) {
    let toast = document.getElementById('toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast';
      toast.style.cssText = `
        position: fixed;
        bottom: 85px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(18, 25, 36, 0.95);
        color: #f3f4f6;
        border: 1px solid var(--gold);
        padding: 10px 18px;
        border-radius: 8px;
        font-size: 0.85rem;
        z-index: 300;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.6);
        pointer-events: none;
        max-width: 90%;
        text-align: center;
        transition: opacity 0.3s;
      `;
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.style.opacity = '1';
    clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      toast.style.opacity = '0';
    }, 2800);
  }
}

let ui = null;
window.addEventListener('DOMContentLoaded', () => {
  ui = new GameUI();
  // Регистрация Service Worker для PWA
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(err => console.log('SW reg error', err));
  }
});
