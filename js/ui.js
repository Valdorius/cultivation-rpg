// js/ui.js - Контроллер интерфейса v2.0 (Арена, Боевая система, Методы циркуляции, Аукцион)

class GameUI {
  constructor() {
    this.currentTab = 'cultivation';
    this.selectedOrigin = 'origin_shepherd';
    this.selectedDaoPath = 'dao_orthodox';
    this.initEventListeners();
    if (gameEngine.needsCreation) {
      this.showCreationModal();
    } else {
      this.render();
    }
  }

  attachLongPress(el, onLongPress, onClick) {
    let timer = null;
    let isLongPress = false;
    let startX = 0;
    let startY = 0;

    const start = (e) => {
      isLongPress = false;
      const touch = e.touches ? e.touches[0] : e;
      startX = touch.clientX;
      startY = touch.clientY;
      el.classList.add('holding-press');
      timer = setTimeout(() => {
        isLongPress = true;
        el.classList.remove('holding-press');
        if (navigator.vibrate) navigator.vibrate(35);
        if (onLongPress) onLongPress(e);
      }, 420);
    };

    const clear = () => {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      el.classList.remove('holding-press');
    };

    const move = (e) => {
      const touch = e.touches ? e.touches[0] : e;
      if (Math.abs(touch.clientX - startX) > 12 || Math.abs(touch.clientY - startY) > 12) {
        clear();
      }
    };

    const end = (e) => {
      const wasLong = isLongPress;
      clear();
      if (!wasLong && onClick) {
        onClick(e);
      }
    };

    el.addEventListener('touchstart', start, { passive: true });
    el.addEventListener('touchmove', move, { passive: true });
    el.addEventListener('touchend', end);
    el.addEventListener('touchcancel', clear);

    el.addEventListener('mousedown', start);
    el.addEventListener('mousemove', move);
    el.addEventListener('mouseup', end);
    el.addEventListener('mouseleave', clear);
    el.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  showInspector(title, subtitle, description, detailsHtml = '') {
    const modal = document.getElementById('inspect-modal');
    if (!modal) return;
    document.getElementById('inspect-title').textContent = title;
    document.getElementById('inspect-subtitle').textContent = subtitle;
    document.getElementById('inspect-body').innerHTML = description;
    const det = document.getElementById('inspect-details');
    if (detailsHtml) {
      det.innerHTML = detailsHtml;
      det.style.display = 'block';
    } else {
      det.style.display = 'none';
    }
    sfx.playClick();
    modal.classList.add('active');
  }

  showCreationModal() {
    const modal = document.getElementById('creation-modal');
    if (!modal) return;

    this.selectedOrigin = 'origin_shepherd';
    this.selectedDaoPath = 'dao_orthodox';

    const origContainer = document.getElementById('creation-origins-list');
    if (origContainer) {
      origContainer.innerHTML = '';
      ORIGINS.forEach(o => {
        const active = this.selectedOrigin === o.id;
        const card = document.createElement('div');
        card.className = `method-btn ${active ? 'active' : ''}`;
        card.id = `orig-btn-${o.id}`;
        card.innerHTML = `
          <h5>
            <span>${o.name}</span>
            <span class="hold-hint">Удерживайте ℹ️</span>
          </h5>
          <div style="font-size: 0.68rem; color: var(--text-muted); margin-top: 2px;">
            Тап: выбрать • Зажатие: описание
          </div>
        `;

        this.attachLongPress(
          card,
          () => {
            const stats = `
              <strong>Стартовые бонусы:</strong> ${o.bonusAttack ? `Атака +${o.bonusAttack}, ` : ''}${o.lifespanBonus ? `Долголетие +${o.lifespanBonus} лет, ` : ''}${o.demonBonus ? `Демоны Сердца +${o.demonBonus}, ` : ''}предметы в кольце.
            `;
            this.showInspector(o.name, 'Происхождение и Судьба', o.desc, stats);
          },
          () => this.selectOrigin(o.id)
        );

        origContainer.appendChild(card);
      });
    }

    const pathContainer = document.getElementById('creation-paths-list');
    if (pathContainer) {
      pathContainer.innerHTML = '';
      DAO_PATHS.forEach(p => {
        const active = this.selectedDaoPath === p.id;
        const card = document.createElement('div');
        card.className = `method-btn ${active ? 'active' : ''}`;
        card.id = `path-btn-${p.id}`;
        card.innerHTML = `
          <h5>
            <span>${p.name}</span>
            <span class="hold-hint">Удерживайте ℹ️</span>
          </h5>
          <div style="font-size: 0.68rem; color: var(--text-muted); margin-top: 2px;">
            Тап: выбрать • Зажатие: описание
          </div>
        `;

        this.attachLongPress(
          card,
          () => {
            this.showInspector(p.name, 'Путь Дао', p.desc, 'Определяет ваш стиль культивации, отношение сект и уникальные боевые бонусы.');
          },
          () => this.selectDaoPath(p.id)
        );

        pathContainer.appendChild(card);
      });
    }

    modal.classList.add('active');
  }

  selectOrigin(id) {
    this.selectedOrigin = id;
    document.querySelectorAll('#creation-origins-list .method-btn').forEach(el => el.classList.remove('active'));
    const btn = document.getElementById(`orig-btn-${id}`);
    if (btn) btn.classList.add('active');
    sfx.playClick();
  }

  selectDaoPath(id) {
    this.selectedDaoPath = id;
    document.querySelectorAll('#creation-paths-list .method-btn').forEach(el => el.classList.remove('active'));
    const btn = document.getElementById(`path-btn-${id}`);
    if (btn) btn.classList.add('active');
    sfx.playClick();
  }

  generateRandomName() {
    const surnames = ['Хань', 'Линь', 'Ван', 'Сяо', 'Бай', 'Сунь', 'Чэнь', 'Е', 'Гу', 'Цзян'];
    const names = ['Ли', 'Тянь', 'Мэн', 'Янь', 'Сяочунь', 'Укун', 'Сюань', 'Чэнь', 'Фань', 'Бай'];
    const randomName = surnames[Math.floor(Math.random() * surnames.length)] + ' ' + names[Math.floor(Math.random() * names.length)];
    const input = document.getElementById('creation-name-input');
    if (input) input.value = randomName;
    sfx.playClick();
  }

  confirmCreation() {
    const input = document.getElementById('creation-name-input');
    const name = input && input.value.trim() ? input.value.trim() : 'Хань Ли';
    gameEngine.createCustomCharacter(name, this.selectedOrigin, this.selectedDaoPath, null);
    document.getElementById('creation-modal').classList.remove('active');
    sfx.playBreakthrough();
    this.render();
    this.showToast(`Вы ступили в мир культивации как ${name}!`);
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

    // Медитация
    const btnMeditate = document.getElementById('btn-meditate');
    if (btnMeditate) {
      btnMeditate.addEventListener('click', () => {
        sfx.playMeditation();
        const res = gameEngine.meditate();
        this.render();
        if (res.specialMsg) this.showToast(res.specialMsg);
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
          if (res.specialMsg) this.showToast(res.specialMsg);
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

    // Звук
    const btnSound = document.getElementById('btn-sound-toggle');
    if (btnSound) {
      btnSound.addEventListener('click', () => {
        const state = sfx.toggleSound();
        btnSound.textContent = state ? '🔊' : '🔇';
      });
    }

    // Сброс и выбор новой судьбы
    const btnReset = document.getElementById('btn-reset');
    if (btnReset) {
      btnReset.addEventListener('click', () => {
        if (confirm('Сбросить текущее воплощение и открыть Колесо Реинкарнации для выбора новой судьбы?')) {
          gameEngine.reset();
          this.showCreationModal();
        }
      });
    }

    // Модальное окно закрытие
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
    const sectRank = gameEngine.currentSectRank;

    // Шапка и профиль
    document.getElementById('player-name').textContent = p.name;
    document.getElementById('player-realm').textContent = realm.name;
    document.getElementById('player-realm').style.borderColor = realm.color;
    document.getElementById('player-realm').style.color = realm.color;

    const sectBadge = document.getElementById('player-sect-badge');
    if (sectBadge) sectBadge.textContent = sectRank.title;

    // Долголетие (компактно: 16/70 л)
    const lifespanEl = document.getElementById('stat-lifespan');
    if (lifespanEl) {
      const remaining = p.maxLifespanYears - p.ageYears;
      lifespanEl.textContent = `${p.ageYears}/${p.maxLifespanYears} л`;
      lifespanEl.title = `Осталось жить: ${remaining} лет`;
      lifespanEl.className = remaining <= 5 ? 'stat-value danger' : 'stat-value';
    }

    // Духовный корень (компактно)
    const rootEl = document.getElementById('stat-root');
    if (rootEl) {
      const shortRootName = root.name.replace('Духовный Корень', '').replace('Корень', '').trim();
      rootEl.textContent = shortRootName.length > 12 ? shortRootName.substring(0, 11) + '…' : shortRootName;
      rootEl.style.cursor = 'pointer';
      rootEl.onclick = () => {
        this.showInspector(root.name, 'Духовный Корень', root.description, `
          • Множитель Ци: <span style="color: var(--jade);">${root.qiMultiplier}x</span><br>
          • Бонус прорыва: <span style="color: ${root.breakthroughBonus >= 0 ? 'var(--jade)' : 'var(--crimson)'};">${root.breakthroughBonus >= 0 ? '+' : ''}${Math.round(root.breakthroughBonus * 100)}%</span><br>
          • Редкость таланта: ${root.rarity}
        `);
      };
    }

    // Боевая мощь (Атака / Защита)
    const hpEl = document.getElementById('stat-combat');
    if (hpEl) {
      hpEl.textContent = `${gameEngine.attack} | ${gameEngine.defense}`;
    }

    // Меридианы (компактно)
    const meridianEl = document.getElementById('stat-meridians');
    if (meridianEl) {
      const dmg = p.meridianDamage || 0;
      meridianEl.textContent = dmg > 0 ? `${100 - dmg}% (-${dmg}%)` : '100%';
      meridianEl.className = dmg > 25 ? 'stat-value danger' : 'stat-value jade';
    }

    // Шкала Даньтяня (Ци)
    const qiMax = realm.baseQiNeeded;
    const qiCurrent = p.qi;
    const percent = Math.min(100, (qiCurrent / qiMax) * 100).toFixed(1);

    document.getElementById('qi-text').textContent = `${qiCurrent.toLocaleString()} / ${qiMax.toLocaleString()} Ци (${percent}%)`;
    document.getElementById('qi-fill').style.width = `${percent}%`;

    // Шкала Здоровья (ОЗ)
    const hpMax = gameEngine.maxHp;
    const hpCur = p.currentHp !== undefined ? p.currentHp : hpMax;
    const hpPercent = Math.min(100, (hpCur / hpMax) * 100).toFixed(0);
    const hpTextEl = document.getElementById('hp-text');
    const hpFillEl = document.getElementById('hp-fill');
    if (hpTextEl && hpFillEl) {
      hpTextEl.textContent = `${hpCur} / ${hpMax} ОЗ (${hpPercent}%)`;
      hpFillEl.style.width = `${hpPercent}%`;
    }

    // Шанс прорыва
    const chance = Math.round(gameEngine.calcBreakthroughChance() * 100);
    const chanceEl = document.getElementById('breakthrough-chance');
    if (chanceEl) {
      chanceEl.textContent = `${chance}%`;
      chanceEl.className = chance >= 60 ? 'jade' : (chance < 40 ? 'danger' : 'gold');
    }

    const btnBreakthrough = document.getElementById('btn-breakthrough');
    if (btnBreakthrough) {
      if (qiCurrent >= qiMax) {
        btnBreakthrough.classList.add('btn-breakthrough-ready');
      } else {
        btnBreakthrough.classList.remove('btn-breakthrough-ready');
      }
    }

    // Рендер методов циркуляции
    this.renderCultivationMethods();

    this.renderTabContent(this.currentTab);
  }

  renderCultivationMethods() {
    const container = document.getElementById('methods-selector');
    if (!container) return;

    container.innerHTML = '';
    CULTIVATION_METHODS.forEach(m => {
      const active = gameEngine.player.cultivationMethod === m.id;
      const card = document.createElement('div');
      card.className = `method-btn ${active ? 'active' : ''}`;
      card.id = `method-btn-${m.id}`;
      card.innerHTML = `
        <h5>
          <span>${m.name}</span>
          <span class="hold-hint">ℹ️</span>
        </h5>
        <div style="font-size: 0.68rem; color: var(--jade); display: flex; justify-content: space-between; margin-top: 2px;">
          <span>${m.qiMod}x Ци</span>
          <span style="color: var(--text-muted);">Зажать для инфо</span>
        </div>
      `;

      this.attachLongPress(
        card,
        () => {
          const stats = `
            <strong>Характеристики потока Ци:</strong><br>
            • Множитель Ци: <span style="color: var(--jade);">${m.qiMod}x</span><br>
            • Время шага медитации: ${m.timeMonths} мес.<br>
            ${m.dangerChance ? `• <span style="color: var(--crimson);">Риск травмы меридианов: ${Math.round(m.dangerChance * 100)}%</span><br>` : ''}
            ${m.healChance ? `• <span style="color: var(--jade);">Шанс исцеления травм: ${Math.round(m.healChance * 100)}%</span><br>` : ''}
            ${m.insightChance ? `• <span style="color: var(--gold);">Шанс Озарения Дао (+Атака/+Защита навсегда): ${Math.round(m.insightChance * 100)}%</span>` : ''}
          `;
          this.showInspector(m.name, 'Метод циркуляции Ци', m.desc, stats);
        },
        () => this.selectMethod(m.id)
      );

      container.appendChild(card);
    });
  }

  selectMethod(methodId) {
    gameEngine.player.cultivationMethod = methodId;
    gameEngine.save();
    sfx.playClick();
    this.render();
  }

  renderTabContent(tab) {
    if (tab === 'inventory') this.renderInventory();
    if (tab === 'alchemy') this.renderAlchemy();
    if (tab === 'arena') this.renderArena();
    if (tab === 'market') this.renderMarket();
    if (tab === 'world') this.renderWorld();
    if (tab === 'chronicle') this.renderChronicle();
  }

  // --- АРЕНА И ТУРНИР СЕКТЫ ---
  renderArena() {
    const container = document.getElementById('arena-content');
    if (!container) return;

    const p = gameEngine.player;
    const rank = gameEngine.currentSectRank;
    const nextRank = SECT_RANKS[p.sectRankId + 1];

    let html = `
      <div class="card">
        <div class="card-header">
          <div class="card-title">🏯 Турнир Арены Секты Лазурного Облака</div>
          <span style="font-size: 0.8rem; color: var(--gold); font-weight: 600;">Очки: ${p.arenaScore}</span>
        </div>
        <p style="font-size: 0.82rem; color: var(--text-secondary); margin-bottom: 8px;">
          Ваш статус: <strong style="color: var(--jade);">${rank.title}</strong> (${rank.desc}).
          ${nextRank ? `До ранга «${nextRank.title}»: ${Math.max(0, nextRank.reqScore - p.arenaScore)} очков.` : 'Вы достигли вершины иерархии!'}
        </p>
      </div>

      <div class="card">
        <div class="card-title">⚔️ Соперники на помосте</div>
        <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 10px;">
    `;

    ARENA_OPPONENTS.forEach(opp => {
      const isDefeated = p.defeatedOpponents.includes(opp.id);
      const realmName = REALMS[opp.realmIdx].name;

      html += `
        <div class="item-card">
          <div class="item-details" style="flex: 1; padding-right: 8px;">
            <h4>${opp.name} ${isDefeated ? '⭐' : ''}</h4>
            <p>${realmName} | Атака: ${opp.attack} | ОЗ: ${opp.hp}</p>
            <p style="font-style: italic; color: var(--gold); font-size: 0.7rem;">${opp.quote}</p>
          </div>
          <button class="btn-small" onclick="ui.startArenaDuel('${opp.id}')">
            ${isDefeated ? 'Реванш' : 'Бросить вызов'}
          </button>
        </div>
      `;
    });

    html += `</div></div>`;
    container.innerHTML = html;
  }

  startArenaDuel(oppId) {
    const opp = ARENA_OPPONENTS.find(o => o.id === oppId);
    if (!opp) return;

    gameEngine.startCombat(opp, (result) => {
      this.render();
      if (result.victory) {
        this.showToast(`Вы одолели ${opp.name} на арене секты!`);
      }
    });

    this.openCombatModal();
  }

  // --- БОЕВОЙ МОДАЛЬНЫЙ ЭКРАН ---
  openCombatModal() {
    const modal = document.getElementById('combat-modal');
    if (!modal) return;
    modal.classList.add('active');
    this.renderCombatFrame();
  }

  renderCombatFrame() {
    const c = gameEngine.activeCombat;
    if (!c) {
      document.getElementById('combat-modal').classList.remove('active');
      return;
    }

    const enemy = c.enemy;
    const p = gameEngine.player;
    const tech = TECHNIQUES.find(t => t.id === p.equippedTechniqueId) || TECHNIQUES[0];

    // Боец: Враг
    document.getElementById('combat-enemy-name').textContent = enemy.name;
    const enemyPercent = Math.max(0, Math.min(100, (enemy.currentHp / enemy.maxHp) * 100)).toFixed(0);
    document.getElementById('combat-enemy-hp-text').textContent = `${enemy.currentHp} / ${enemy.maxHp}`;
    document.getElementById('combat-enemy-hp-fill').style.width = `${enemyPercent}%`;

    // Боец: Игрок
    document.getElementById('combat-player-name').textContent = p.name;
    const playerPercent = Math.max(0, Math.min(100, (c.playerHp / gameEngine.maxHp) * 100)).toFixed(0);
    document.getElementById('combat-player-hp-text').textContent = `${c.playerHp} / ${gameEngine.maxHp} (Щит: ${c.playerShield})`;
    document.getElementById('combat-player-hp-fill').style.width = `${playerPercent}%`;

    // Журнал боя
    const logBox = document.getElementById('combat-log-box');
    logBox.innerHTML = c.log.map(l => `<div>• ${l}</div>`).join('');
    logBox.scrollTop = logBox.scrollHeight;

    // Кнопка техники
    document.getElementById('btn-combat-tech').innerHTML = `
      <span>🔮</span> ${tech.name} (${tech.qiCost} Ци)
    `;
  }

  handleCombatAction(action) {
    const res = gameEngine.combatAction(action);
    if (res && res.error) {
      this.showToast(res.error);
      return;
    }
    if (res && res.fled) {
      document.getElementById('combat-modal').classList.remove('active');
      this.render();
      return;
    }
    this.renderCombatFrame();
    if (res && (res.victory || res.victory === false)) {
      setTimeout(() => {
        document.getElementById('combat-modal').classList.remove('active');
        this.render();
      }, 1400);
    }
  }

  // --- РЫНОК И ТАЙНЫЙ АУКЦИОН ---
  renderMarket() {
    const container = document.getElementById('market-content');
    if (!container) return;

    const p = gameEngine.player;

    let html = `
      <div class="card">
        <div class="card-title">🔨 Тайный Аукцион «Павильона Сокровищ»</div>
        <p style="font-size: 0.82rem; color: var(--text-secondary); margin: 6px 0;">
          Здесь выставляются редчайшие свитки боевых техник и снадобья. Молодые мастера древних кланов торгуются до последнего камня!
        </p>
        <div id="auction-container" style="margin-top: 10px;">
          ${this.getAuctionHtml()}
        </div>
      </div>

      <div class="card">
        <div class="card-title">📜 Павильон Боевых Техник Секты</div>
        <p style="font-size: 0.82rem; color: var(--text-secondary); margin: 6px 0;">
          Доступные для покупки свитки техник за духовные камни:
        </p>
        <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 8px;">
    `;

    TECHNIQUES.forEach(t => {
      const learned = p.learnedTechniques.includes(t.id);
      const isEquipped = p.equippedTechniqueId === t.id;
      const canAfford = (p.inventory.stone_spirit || 0) >= t.price;

      html += `
        <div class="item-card">
          <div class="item-details" style="flex: 1; padding-right: 8px;">
            <h4>${t.name} ${isEquipped ? '⚔️ (Экипирована)' : ''}</h4>
            <p>${t.desc}</p>
            <div style="font-size: 0.72rem; color: var(--gold); margin-top: 2px;">
              Стихия: ${t.element} | Расход: ${t.qiCost} Ци
            </div>
          </div>
          <div>
            ${learned 
              ? `<button class="btn-small" onclick="ui.equipTech('${t.id}')">${isEquipped ? 'В бою' : 'Экипировать'}</button>`
              : `<button class="btn-small" ${canAfford ? '' : 'disabled style="opacity: 0.5;"'} onclick="ui.buyTech('${t.id}')">${t.price} камней</button>`
            }
          </div>
        </div>
      `;
    });

    html += `</div></div>`;
    container.innerHTML = html;
  }

  getAuctionHtml() {
    const auc = gameEngine.activeAuction;
    if (!auc) {
      return `
        <button class="btn-primary btn-gold" style="width: 100%;" onclick="ui.startNewAuctionLot()">
          <span>🔨</span> Начать новые торги за лот (Вход: 5 камней)
        </button>
      `;
    }

    const p = gameEngine.player;
    return `
      <div style="background: rgba(0,0,0,0.5); padding: 12px; border-radius: 8px; border: 1px solid var(--gold); text-align: left;">
        <h4 style="color: var(--gold);">${auc.item.name}</h4>
        <p style="font-size: 0.78rem; color: var(--text-secondary); margin: 4px 0;">${auc.item.desc}</p>
        <div style="margin: 8px 0; font-size: 0.85rem;">
          Текущая ставка: <strong style="color: var(--jade);">${auc.currentBid} камней</strong> 
          <br><span style="font-size: 0.75rem; color: var(--text-secondary);">Лидирует: ${auc.highestBidder}</span>
        </div>
        <div style="display: flex; gap: 8px; margin-top: 10px;">
          <button class="btn-primary btn-gold" style="flex: 1;" onclick="ui.bidAuction(15)">
            Поднять (+15 камней)
          </button>
          <button class="btn-primary" style="flex: 1;" onclick="ui.bidAuction(40)">
            Поднять (+40 камней)
          </button>
        </div>
      </div>
    `;
  }

  startNewAuctionLot() {
    if ((gameEngine.player.inventory.stone_spirit || 0) < 5) {
      this.showToast('Недостаточно камней для входа на аукцион (нужно 5 камней)!');
      return;
    }
    gameEngine.player.inventory.stone_spirit -= 5;
    gameEngine.startAuctionLot();
    sfx.playGavel();
    this.render();
  }

  bidAuction(step) {
    const res = gameEngine.placeAuctionBid(step);
    if (res.error) {
      this.showToast(res.error);
    } else if (res.status === 'won') {
      this.showToast(`🎉 Вы победили на аукционе! Получено: ${res.item.name}`);
    } else {
      this.showToast(`Вы подняли ставку до ${res.bid} камней!`);
    }
    this.render();
  }

  buyTech(techId) {
    const tech = TECHNIQUES.find(t => t.id === techId);
    if (!tech) return;
    if ((gameEngine.player.inventory.stone_spirit || 0) < tech.price) {
      this.showToast('Недостаточно духовных камней!');
      return;
    }
    gameEngine.player.inventory.stone_spirit -= tech.price;
    gameEngine.learnTechnique(techId);
    sfx.playAlchemy();
    this.render();
    this.showToast(`Вы приобрели и изучили: ${tech.name}`);
  }

  equipTech(techId) {
    gameEngine.equipTechnique(techId);
    sfx.playClick();
    this.render();
    this.showToast(`Боевая техника выбрана для боя!`);
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
      pill_qi: { title: 'Пилюля Сбора Ци', desc: 'Мгновенно дает +500 Ци / лечит в бою', isConsumable: true },
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
        <button class="btn-primary btn-crimson" style="width: 100%; margin-top: 10px;" onclick="ui.triggerExpedition()">
          <span>🧭</span> Отправиться в экспедицию (1 месяц)
        </button>
      </div>

      <div class="card">
        <div class="card-title">🏯 Павильон Поручений Секты</div>
        <p style="font-size: 0.85rem; color: var(--text-secondary); margin: 8px 0;">
          Выполняйте официальные поручения старейшин за духовные камни.
        </p>
        <button class="btn-primary btn-gold" style="width: 100%; margin-top: 10px;" onclick="ui.doSectDuty()">
          <span>📜</span> Выполнить поручение (+30 камней)
        </button>
      </div>
    `;
  }

  doSectDuty() {
    gameEngine.addTime(1);
    const stones = 30;
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

    if (event.isCombat) {
      gameEngine.startCombat(event.enemy, (result) => {
        this.render();
        if (result.victory) {
          this.showToast(`Вы сокрушили ${event.enemy.name}!`);
        }
      });
      this.openCombatModal();
      return;
    }

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
        Небеса содрогаются! Над головой сгустились грозовые тучи Скорби!
      </p>
      <p style="font-size: 0.9rem; color: var(--text-secondary);">
        Вам предстоит выдержать ${tribulation.strikes} ударов Небесной Молнии. Используйте всю силу культивации!
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
        bottom: 75px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(18, 25, 36, 0.96);
        color: #f3f4f6;
        border: 1px solid var(--gold);
        padding: 9px 16px;
        border-radius: 8px;
        font-size: 0.82rem;
        z-index: 300;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.7);
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
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(err => console.log('SW reg error', err));
  }
});
