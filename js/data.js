// js/data.js - Игровые базы данных культивации (Сянься)

const REALMS = [
  // Закалка тела
  { id: 'bt_1', name: 'Закалка Тела: 1-й слой', baseQiNeeded: 50, lifespanGain: 0, tribulation: null, color: '#95a5a6' },
  { id: 'bt_2', name: 'Закалка Тела: 2-й слой', baseQiNeeded: 120, lifespanGain: 0, tribulation: null, color: '#95a5a6' },
  { id: 'bt_3', name: 'Закалка Тела: 3-й слой', baseQiNeeded: 220, lifespanGain: 0, tribulation: null, color: '#95a5a6' },
  { id: 'bt_4', name: 'Закалка Тела: 4-й слой', baseQiNeeded: 380, lifespanGain: 0, tribulation: null, color: '#95a5a6' },
  { id: 'bt_5', name: 'Закалка Тела: 5-й слой', baseQiNeeded: 600, lifespanGain: 0, tribulation: null, color: '#95a5a6' },
  { id: 'bt_6', name: 'Закалка Тела: 6-й слой', baseQiNeeded: 900, lifespanGain: 0, tribulation: null, color: '#95a5a6' },
  { id: 'bt_7', name: 'Закалка Тела: 7-й слой', baseQiNeeded: 1300, lifespanGain: 0, tribulation: null, color: '#95a5a6' },
  { id: 'bt_8', name: 'Закалка Тела: 8-й слой', baseQiNeeded: 1800, lifespanGain: 0, tribulation: null, color: '#95a5a6' },
  { id: 'bt_9', name: 'Закалка Тела: Пик (9-й слой)', baseQiNeeded: 2500, lifespanGain: 20, tribulation: null, color: '#bdc3c7' },

  // Конденсация Ци
  { id: 'qc_1', name: 'Конденсация Ци: 1-й слой', baseQiNeeded: 3500, lifespanGain: 10, tribulation: null, color: '#2ecc71' },
  { id: 'qc_2', name: 'Конденсация Ци: 2-й слой', baseQiNeeded: 5000, lifespanGain: 5, tribulation: null, color: '#2ecc71' },
  { id: 'qc_3', name: 'Конденсация Ци: 3-й слой', baseQiNeeded: 7000, lifespanGain: 5, tribulation: null, color: '#2ecc71' },
  { id: 'qc_4', name: 'Конденсация Ци: 4-й слой', baseQiNeeded: 10000, lifespanGain: 5, tribulation: null, color: '#27ae60' },
  { id: 'qc_5', name: 'Конденсация Ци: 5-й слой', baseQiNeeded: 14000, lifespanGain: 5, tribulation: null, color: '#27ae60' },
  { id: 'qc_6', name: 'Конденсация Ци: 6-й слой', baseQiNeeded: 20000, lifespanGain: 5, tribulation: null, color: '#27ae60' },
  { id: 'qc_7', name: 'Конденсация Ци: 7-й слой', baseQiNeeded: 28000, lifespanGain: 5, tribulation: null, color: '#1abc9c' },
  { id: 'qc_8', name: 'Конденсация Ци: 8-й слой', baseQiNeeded: 38000, lifespanGain: 5, tribulation: null, color: '#1abc9c' },
  { id: 'qc_9', name: 'Конденсация Ци: Великий Пик (9-й слой)', baseQiNeeded: 50000, lifespanGain: 20, tribulation: null, color: '#16a085' },

  // Возведение Основания (Первая настоящая Скорбь)
  { id: 'fe_early', name: 'Возведение Основания: Ранняя стадия', baseQiNeeded: 80000, lifespanGain: 120, tribulation: { strikes: 3, baseDamage: 40, name: 'Малая Скорбь Земного Грома' }, color: '#3498db' },
  { id: 'fe_mid', name: 'Возведение Основания: Средняя стадия', baseQiNeeded: 130000, lifespanGain: 30, tribulation: null, color: '#3498db' },
  { id: 'fe_late', name: 'Возведение Основания: Поздняя стадия', baseQiNeeded: 200000, lifespanGain: 30, tribulation: null, color: '#2980b9' },
  { id: 'fe_peak', name: 'Возведение Основания: Пик Основания', baseQiNeeded: 320000, lifespanGain: 50, tribulation: null, color: '#2980b9' },

  // Золотое Ядро
  { id: 'gc_early', name: 'Золотое Ядро: Ранняя стадия', baseQiNeeded: 550000, lifespanGain: 300, tribulation: { strikes: 6, baseDamage: 120, name: 'Скорбь Девяти Облаков и Демон Сердца' }, color: '#f39c12' },
  { id: 'gc_mid', name: 'Золотое Ядро: Средняя стадия', baseQiNeeded: 900000, lifespanGain: 50, tribulation: null, color: '#f39c12' },
  { id: 'gc_late', name: 'Золотое Ядро: Поздняя стадия', baseQiNeeded: 1500000, lifespanGain: 50, tribulation: null, color: '#e67e22' },
  { id: 'gc_peak', name: 'Золотое Ядро: Совершенное Золотое Ядро', baseQiNeeded: 2500000, lifespanGain: 100, tribulation: null, color: '#d35400' },

  // Зарождающаяся Душа
  { id: 'ns_early', name: 'Зарождающаяся Душа: Ранняя стадия', baseQiNeeded: 4500000, lifespanGain: 1000, tribulation: { strikes: 9, baseDamage: 300, name: 'Великая Небесная Кара Пурпурного Грома' }, color: '#9b59b6' },
  { id: 'ns_mid', name: 'Зарождающаяся Душа: Средняя стадия', baseQiNeeded: 7500000, lifespanGain: 200, tribulation: null, color: '#9b59b6' },
  { id: 'ns_late', name: 'Зарождающаяся Душа: Поздняя стадия', baseQiNeeded: 12000000, lifespanGain: 200, tribulation: null, color: '#8e44ad' },
  { id: 'ns_peak', name: 'Зарождающаяся Душа: Пик Бессмертной Души', baseQiNeeded: 20000000, lifespanGain: 500, tribulation: null, color: '#8e44ad' },

  // Вознесение
  { id: 'ascended', name: 'Истинный Бессмертный (Вознесение в Высшие Миры)', baseQiNeeded: 99999999, lifespanGain: 99999, tribulation: { strikes: 12, baseDamage: 999, name: 'Скорбь Раскрытия Врат Бессмертных' }, color: '#e74c3c' }
];

const SPIRIT_ROOTS = [
  {
    id: 'trash',
    name: 'Мусорный Духовный Корень (5 Стихий)',
    description: 'Хаотичное смешение 5 стихий. Поглощение Ци крайне затруднено, прорывы мучительны. Классический удел отверженных.',
    qiMultiplier: 0.75,
    breakthroughBonus: -0.15,
    rarity: 'Обычный (90% смертных)'
  },
  {
    id: 'pseudo',
    name: 'Четырехэлементный Корень',
    description: 'Четыре стихии переплетены. Медленный прогресс, частые засоры меридианов.',
    qiMultiplier: 0.95,
    breakthroughBonus: -0.05,
    rarity: 'Заурядный'
  },
  {
    id: 'true',
    name: 'Истинный Духовный Корень (3 Стихии)',
    description: 'Баланс трех элементов (Дерево-Огонь-Земля). Стандартный фундамент большинства учеников сект.',
    qiMultiplier: 1.25,
    breakthroughBonus: 0.05,
    rarity: 'Хороший'
  },
  {
    id: 'pure_dual',
    name: 'Двойной Чистый Корень (Инь-Ян)',
    description: 'Две гармоничные стихии. Быстрый сбор духовной энергии, светлое будущее в секте.',
    qiMultiplier: 1.8,
    breakthroughBonus: 0.15,
    rarity: 'Редкий Гений'
  },
  {
    id: 'heavenly_fire',
    name: 'Небесный Корень Чистого Пламени',
    description: 'Единственная стихия Небесного Огня. Ци очищается мгновенно, талант к алхимии легендарного уровня!',
    qiMultiplier: 2.6,
    breakthroughBonus: 0.25,
    rarity: 'Избранник Небес'
  },
  {
    id: 'mutated_lightning',
    name: 'Мутировавший Корень Небесной Молнии',
    description: 'Рожденный под грозовым небом. Молния закаляет меридианы и снижает урон от Небесной Скорби на 50%!',
    qiMultiplier: 3.2,
    breakthroughBonus: 0.35,
    tribulationResistance: 0.5,
    rarity: 'Мифический'
  }
];

const ALCHEMY_RECIPES = [
  {
    id: 'pill_qi',
    name: 'Пилюля Сбора Ци',
    description: 'Мгновенно насыщает даньтянь чистой Ци (+500 Ци) и очищает меридианы.',
    ingredients: { herb_spirit: 2, herb_ginseng: 1 },
    effect: { type: 'instant_qi', value: 500 },
    successRate: 0.85
  },
  {
    id: 'pill_purify',
    name: 'Пилюля Очищения Меридианов',
    description: 'Исцеляет повреждения меридианов и снимает негативные последствия неудачных прорывов.',
    ingredients: { herb_ginseng: 3, herb_lotus: 1 },
    effect: { type: 'heal_meridians', value: 30 },
    successRate: 0.75
  },
  {
    id: 'pill_foundation',
    name: 'Пилюля Возведения Основания',
    description: 'Легендарное снадобье для защиты даньтяня при прорыве на стадию Основания (+25% к шансу прорыва).',
    ingredients: { herb_spirit: 5, herb_ginseng: 4, herb_lotus: 2, stone_spirit: 20 },
    effect: { type: 'breakthrough_buff', value: 0.25 },
    successRate: 0.60
  },
  {
    id: 'pill_heart_calm',
    name: 'Пилюля Спокойствия Сердца',
    description: 'Успокаивает взбунтовавшуюся Ци и подавляет Демонов Сердца (-40 к Демонам Сердца).',
    ingredients: { herb_lotus: 3, stone_spirit: 10 },
    effect: { type: 'calm_demons', value: 40 },
    successRate: 0.70
  },
  {
    id: 'pill_golden_core',
    name: 'Пилюля Девяти Оборотов Золотого Ядра',
    description: 'Концентрирует духовную суть для формирования истинного неразрушимого Золотого Ядра (+35% к шансу).',
    ingredients: { herb_spirit: 10, herb_ginseng: 8, herb_lotus: 5, stone_spirit: 100 },
    effect: { type: 'breakthrough_buff', value: 0.35 },
    successRate: 0.45
  }
];

const EXPEDITION_EVENTS = [
  {
    id: 'find_herbs',
    title: 'Поляна Духовных Трав',
    text: 'Блуждая в густом тумане Ущелья Спящего Дракона, вы натыкаетесь на заросшую поляну, где пульсируют стебли Духовного Женьшеня.',
    choices: [
      {
        text: 'Бережно собрать травы',
        action: (game) => {
          game.inventory.herb_spirit = (game.inventory.herb_spirit || 0) + 3;
          game.inventory.herb_ginseng = (game.inventory.herb_ginseng || 0) + 2;
          return 'Вы аккуратно собрали 3 ед. Духовной Травы и 2 ед. Духовного Женьшеня, не повредив корни.';
        }
      },
      {
        text: 'Медитировать на месте силы (+Ци)',
        action: (game) => {
          const qiGained = Math.round(game.calcQiPerMeditation() * 8);
          game.qi += qiGained;
          return `Вы поглотили концентрированную природную Ци поляны (+${qiGained} Ци).`;
        }
      }
    ]
  },
  {
    id: 'arrogant_young_master',
    title: 'Встреча с Молодым Господином',
    text: 'Навстречу вам идет юноша в расшитых шелковых одеждах клана Ван. Позади него — два свирепых телохранителя. «Эй, ничтожество! Отдай свое пространственное кольцо и поклонись десять раз, тогда я сохраню твой труп целым!»',
    choices: [
      {
        text: 'Показать свою культивацию и дать отпор',
        action: (game) => {
          if (game.realmIndex >= 9) { // С Конденсации Ци
            const stones = Math.floor(Math.random() * 30) + 20;
            game.inventory.stone_spirit = (game.inventory.stone_spirit || 0) + stones;
            return `Вы холодно хмыкнули и выпустили ауру своего уровня. Молодой господин побледнел, споткнулся и с криками бросился бежать, выронив кошель с ${stones} духовными камнями!`;
          } else {
            const dmg = 25;
            game.meridianDamage = Math.min(100, (game.meridianDamage || 0) + 15);
            game.demonsOfHeart += 10;
            return `Ваша сила оказалась недостаточной! Телохранители нанесли удар в грудь. Вы сумели скрыться в тумане, но меридианы повреждены (+15% травм), а в душе поселилась обида (+10 к Демонам Сердца).`;
          }
        }
      },
      {
        text: 'Отступить в тени скал (Осторожное Дао)',
        action: (game) => {
          return 'Вы благоразумно скрыли дыхание Ци и проскользнули мимо глупцов. Истинный культиватор знает, когда нужно терпеть.';
        }
      }
    ]
  },
  {
    id: 'ancient_cave',
    title: 'Запечатанная Пещера Древнего Бессмертного',
    text: 'Среди трещин в утесе мерцают остатки древней защитной формации. Внутри чувствуются отголоски могущественного артефакта.',
    choices: [
      {
        text: 'Попытаться взломать формацию силой разума',
        action: (game) => {
          const success = Math.random() > 0.4;
          if (success) {
            game.inventory.stone_spirit = (game.inventory.stone_spirit || 0) + 50;
            game.inventory.herb_lotus = (game.inventory.herb_lotus || 0) + 2;
            return 'Формация с тихим звоном рассеялась! Внутри вы нашли каменную шкатулку: 50 духовных камней и 2 Лотоса Чистого Сердца!';
          } else {
            game.meridianDamage = Math.min(100, (game.meridianDamage || 0) + 10);
            return 'Защитная руна сдетонировала остаточным зарядом молнии! Вы получили ожог меридианов (+10% травм).';
          }
        }
      },
      {
        text: 'Оставить знак и уйти',
        action: (game) => {
          return 'Вы не стали рисковать жизнью ради неизведанного и продолжили свой путь.';
        }
      }
    ]
  }
];
