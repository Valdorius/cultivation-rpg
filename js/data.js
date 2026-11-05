// js/data.js - Базы данных культивации, техник, арены, аукционов и врагов

const REALMS = [
  // Закалка тела
  { id: 'bt_1', name: 'Закалка Тела: 1-й слой', baseQiNeeded: 50, lifespanGain: 0, tribulation: null, hp: 100, attack: 15, defense: 5, color: '#95a5a6' },
  { id: 'bt_2', name: 'Закалка Тела: 2-й слой', baseQiNeeded: 120, lifespanGain: 0, tribulation: null, hp: 130, attack: 22, defense: 8, color: '#95a5a6' },
  { id: 'bt_3', name: 'Закалка Тела: 3-й слой', baseQiNeeded: 220, lifespanGain: 0, tribulation: null, hp: 170, attack: 30, defense: 12, color: '#95a5a6' },
  { id: 'bt_4', name: 'Закалка Тела: 4-й слой', baseQiNeeded: 380, lifespanGain: 0, tribulation: null, hp: 220, attack: 40, defense: 18, color: '#95a5a6' },
  { id: 'bt_5', name: 'Закалка Тела: 5-й слой', baseQiNeeded: 600, lifespanGain: 0, tribulation: null, hp: 280, attack: 52, defense: 25, color: '#95a5a6' },
  { id: 'bt_6', name: 'Закалка Тела: 6-й слой', baseQiNeeded: 900, lifespanGain: 0, tribulation: null, hp: 350, attack: 68, defense: 35, color: '#95a5a6' },
  { id: 'bt_7', name: 'Закалка Тела: 7-й слой', baseQiNeeded: 1300, lifespanGain: 0, tribulation: null, hp: 440, attack: 88, defense: 48, color: '#95a5a6' },
  { id: 'bt_8', name: 'Закалка Тела: 8-й слой', baseQiNeeded: 1800, lifespanGain: 0, tribulation: null, hp: 550, attack: 112, defense: 65, color: '#95a5a6' },
  { id: 'bt_9', name: 'Закалка Тела: Пик (9-й слой)', baseQiNeeded: 2500, lifespanGain: 20, tribulation: null, hp: 700, attack: 145, defense: 85, color: '#bdc3c7' },

  // Конденсация Ци
  { id: 'qc_1', name: 'Конденсация Ци: 1-й слой', baseQiNeeded: 3500, lifespanGain: 10, tribulation: null, hp: 900, attack: 190, defense: 110, color: '#2ecc71' },
  { id: 'qc_2', name: 'Конденсация Ци: 2-й слой', baseQiNeeded: 5000, lifespanGain: 5, tribulation: null, hp: 1150, attack: 245, defense: 140, color: '#2ecc71' },
  { id: 'qc_3', name: 'Конденсация Ци: 3-й слой', baseQiNeeded: 7000, lifespanGain: 5, tribulation: null, hp: 1450, attack: 310, defense: 180, color: '#2ecc71' },
  { id: 'qc_4', name: 'Конденсация Ци: 4-й слой', baseQiNeeded: 10000, lifespanGain: 5, tribulation: null, hp: 1800, attack: 390, defense: 230, color: '#27ae60' },
  { id: 'qc_5', name: 'Конденсация Ци: 5-й слой', baseQiNeeded: 14000, lifespanGain: 5, tribulation: null, hp: 2250, attack: 490, defense: 290, color: '#27ae60' },
  { id: 'qc_6', name: 'Конденсация Ци: 6-й слой', baseQiNeeded: 20000, lifespanGain: 5, tribulation: null, hp: 2800, attack: 610, defense: 370, color: '#27ae60' },
  { id: 'qc_7', name: 'Конденсация Ци: 7-й слой', baseQiNeeded: 28000, lifespanGain: 5, tribulation: null, hp: 3500, attack: 760, defense: 470, color: '#1abc9c' },
  { id: 'qc_8', name: 'Конденсация Ци: 8-й слой', baseQiNeeded: 38000, lifespanGain: 5, tribulation: null, hp: 4400, attack: 950, defense: 600, color: '#1abc9c' },
  { id: 'qc_9', name: 'Конденсация Ци: Великий Пик (9-й слой)', baseQiNeeded: 50000, lifespanGain: 20, tribulation: null, hp: 5600, attack: 1200, defense: 780, color: '#16a085' },

  // Возведение Основания (Первая настоящая Скорбь)
  { id: 'fe_early', name: 'Возведение Основания: Ранняя стадия', baseQiNeeded: 80000, lifespanGain: 120, tribulation: { strikes: 3, baseDamage: 40, name: 'Малая Скорбь Земного Грома' }, hp: 8000, attack: 1800, defense: 1200, color: '#3498db' },
  { id: 'fe_mid', name: 'Возведение Основания: Средняя стадия', baseQiNeeded: 130000, lifespanGain: 30, tribulation: null, hp: 11000, attack: 2600, defense: 1800, color: '#3498db' },
  { id: 'fe_late', name: 'Возведение Основания: Поздняя стадия', baseQiNeeded: 200000, lifespanGain: 30, tribulation: null, hp: 15000, attack: 3700, defense: 2600, color: '#2980b9' },
  { id: 'fe_peak', name: 'Возведение Основания: Пик Основания', baseQiNeeded: 320000, lifespanGain: 50, tribulation: null, hp: 21000, attack: 5200, defense: 3700, color: '#2980b9' },

  // Золотое Ядро
  { id: 'gc_early', name: 'Золотое Ядро: Ранняя стадия', baseQiNeeded: 550000, lifespanGain: 300, tribulation: { strikes: 6, baseDamage: 120, name: 'Скорбь Девяти Облаков и Демон Сердца' }, hp: 35000, attack: 9000, defense: 6500, color: '#f39c12' },
  { id: 'gc_mid', name: 'Золотое Ядро: Средняя стадия', baseQiNeeded: 900000, lifespanGain: 50, tribulation: null, hp: 50000, attack: 14000, defense: 10000, color: '#f39c12' },
  { id: 'gc_late', name: 'Золотое Ядро: Поздняя стадия', baseQiNeeded: 1500000, lifespanGain: 50, tribulation: null, hp: 75000, attack: 2200, defense: 16000, color: '#e67e22' },
  { id: 'gc_peak', name: 'Золотое Ядро: Совершенное Золотое Ядро', baseQiNeeded: 2500000, lifespanGain: 100, tribulation: null, hp: 110000, attack: 35000, defense: 25000, color: '#d35400' },

  // Зарождающаяся Душа
  { id: 'ns_early', name: 'Зарождающаяся Душа: Ранняя стадия', baseQiNeeded: 4500000, lifespanGain: 1000, tribulation: { strikes: 9, baseDamage: 300, name: 'Великая Небесная Кара Пурпурного Грома' }, hp: 200000, attack: 65000, defense: 48000, color: '#9b59b6' },
  { id: 'ns_mid', name: 'Зарождающаяся Душа: Средняя стадия', baseQiNeeded: 7500000, lifespanGain: 200, tribulation: null, hp: 320000, attack: 110000, defense: 80000, color: '#9b59b6' },
  { id: 'ns_late', name: 'Зарождающаяся Душа: Поздняя стадия', baseQiNeeded: 12000000, lifespanGain: 200, tribulation: null, hp: 500000, attack: 180000, defense: 130000, color: '#8e44ad' },
  { id: 'ns_peak', name: 'Зарождающаяся Душа: Пик Бессмертной Души', baseQiNeeded: 20000000, lifespanGain: 500, tribulation: null, hp: 800000, attack: 300000, defense: 220000, color: '#8e44ad' },

  // Вознесение
  { id: 'ascended', name: 'Истинный Бессмертный (Вознесение)', baseQiNeeded: 99999999, lifespanGain: 99999, tribulation: { strikes: 12, baseDamage: 999, name: 'Скорбь Раскрытия Врат Бессмертных' }, hp: 2500000, attack: 999999, defense: 888888, color: '#e74c3c' }
];

// Происхождения персонажа (выбор судьбы при старте)
const ORIGINS = [
  {
    id: 'origin_shepherd',
    name: '🌿 Пастух с Таинственным Зеленым Флаконом',
    desc: 'Бедный крестьянский юноша, случайно нашедший в ущелье артефакт, ускоряющий рост трав. Стартовый бонус: +10 трав, 3 пилюли и талант к алхимии.',
    bonusInventory: { herb_spirit: 10, herb_ginseng: 6, herb_lotus: 3, pill_qi: 3, stone_spirit: 30 },
    bonusTechniques: ['tech_slash'],
    lifespanBonus: 0,
    demonBonus: 0
  },
  {
    id: 'origin_noble',
    name: '⚔️ Опальный Наследник Клана Мечников',
    desc: 'Ваш клан был уничтожен врагами, но вы унаследовали фамильный клинок и родовые секреты. Стартовый бонус: 80 духовных камней, +25 к базовой Атаке и техника «Лазурный Клинок».',
    bonusInventory: { stone_spirit: 80, pill_qi: 2, pill_purify: 1 },
    bonusTechniques: ['tech_slash', 'tech_shield'],
    bonusAttack: 25,
    lifespanBonus: 0,
    demonBonus: 0
  },
  {
    id: 'origin_demon',
    name: '💀 Перерожденный Демонический Старейшина',
    desc: 'Ваша прошлая оболочка погибла от небесной кары, но душа захватила новое молодое тело. Стартовый бонус: Запретная техника «Пожирание Крови» и +50 к сбору Ци, но груз темной кармы (+25 к Демонам Сердца).',
    bonusInventory: { stone_spirit: 50, herb_spirit: 5, pill_qi: 2 },
    bonusTechniques: ['tech_blood_drain', 'tech_slash'],
    bonusAttack: 40,
    lifespanBonus: -10,
    demonBonus: 25
  },
  {
    id: 'origin_monk',
    name: '🧘 Смиренный Странствующий Монах',
    desc: 'Годы медитаций на горных вершинах закалили ваш дух и продлили годы жизни. Стартовый бонус: +35 лет к максимальному долголетию, кристально чистые меридианы и сопротивление Скорби.',
    bonusInventory: { stone_spirit: 40, herb_lotus: 4, pill_heart_calm: 2 },
    bonusTechniques: ['tech_slash', 'tech_shield'],
    lifespanBonus: 35,
    bonusDefense: 20,
    demonBonus: 0
  }
];

// Выбор Пути Дао
const DAO_PATHS = [
  {
    id: 'dao_orthodox',
    name: '🕊️ Праведное Дао (Ортодокс)',
    desc: 'Следование законам Неба, гармония с природой. +15% к шансу прорывов, снижение урона от Небесной Скорби на 20%.'
  },
  {
    id: 'dao_demonic',
    name: '🩸 Демоническое Дао (Путь Крови)',
    desc: 'Презрение к законам смертных и старейшин. +35% к урону всех боевых техник, вампиризм в бою, но повышенный риск встретить Демонов Сердца.'
  },
  {
    id: 'dao_neutral',
    name: '☯️ Дао Равновесия (Свободный Отшельник)',
    desc: 'Баланс Инь и Ян, независимость от сект. +40% к наградам в экспедициях и на тайных аукционах.'
  }
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

// Методы циркуляции Ци в меридианах (стратегии культивации)
const CULTIVATION_METHODS = [
  {
    id: 'standard',
    name: '«Великий Небесный Круг» (Базовый)',
    desc: 'Классическая равномерная циркуляция. Сбалансированный сбор Ци без побочных эффектов.',
    qiMod: 1.0,
    timeMonths: 1,
    dangerChance: 0.0,
    healChance: 0.1
  },
  {
    id: 'turtle',
    name: '«Дыхание Спящей Черепахи» (Осторожное Дао)',
    desc: 'Глубокое замедление сердцебиения. Мало Ци, но исцеляет меридианы и расходует меньше жизненных сил.',
    qiMod: 0.6,
    timeMonths: 1,
    dangerChance: 0.0,
    healChance: 0.45
  },
  {
    id: 'blood',
    name: '«Кровавый Метод Демона» (Форсированный)',
    desc: 'Разгон крови и принудительное раскрытие пор. Дает в 2.5 раза больше Ци, но высок риск ожога меридианов и роста Демонов Сердца!',
    qiMod: 2.5,
    timeMonths: 1,
    dangerChance: 0.25,
    healChance: 0.0
  },
  {
    id: 'comprehension',
    name: '«Озарение под Водопадом» (Постижение Дао)',
    desc: 'Попытка уловить законы Неба. Сбор Ци замедлен, но есть шанс получить постоянное Озарение (+к урону или защите).',
    qiMod: 0.7,
    timeMonths: 2,
    dangerChance: 0.05,
    healChance: 0.15,
    insightChance: 0.20
  }
];

// Боевые техники Дао
const TECHNIQUES = [
  {
    id: 'tech_slash',
    name: '«Лазурный Клинок Ветра»',
    element: 'Ветер',
    qiCost: 40,
    multiplier: 1.6,
    desc: 'Быстрый удар сконцентрированным лезвием ветра. Наносит 160% урона.',
    price: 30
  },
  {
    id: 'tech_fireball',
    name: '«Пламя Золотого Ворона»',
    element: 'Огонь',
    qiCost: 80,
    multiplier: 2.2,
    desc: 'Сгусток ревущего духовного огня. Наносит 220% урона и поджигает врага.',
    price: 100
  },
  {
    id: 'tech_shield',
    name: '«Нефритовый Барьер Пяти Элементов»',
    element: 'Земля',
    qiCost: 60,
    multiplier: 0.5,
    isShield: true,
    desc: 'Призывает защитный купол из духовной энергии, поглощающий 60% урона в следующем раунде.',
    price: 80
  },
  {
    id: 'tech_ghost_step',
    name: '«Призрачная Поступь Тени»',
    element: 'Инь',
    qiCost: 90,
    multiplier: 1.4,
    isDodge: true,
    desc: 'Мгновенное размытие тела в воздухе. Дает 85% шанс уклониться от вражеской атаки + контратака.',
    price: 250
  },
  {
    id: 'tech_blood_drain',
    name: '«Искусство Пожирания Крови»',
    element: 'Демонический',
    qiCost: 120,
    multiplier: 2.0,
    drainPercent: 0.5,
    demonCost: 10,
    desc: 'Запретная демоническая техника. Наносит 200% урона и лечит вас на 50% от нанесенного урона, но пробуждает Демонов Сердца (+10).',
    price: 400
  }
];

// Иерархия в Секте
const SECT_RANKS = [
  { id: 0, title: 'Чернорабочий / Слуга', stipend: 5, reqScore: 0, desc: 'Колет дрова, носит воду. Старейшины смотрят как на пыль.' },
  { id: 1, title: 'Внешний Ученик', stipend: 25, reqScore: 100, desc: 'Официальный адепт. Допуск к павильону боевых искусств.' },
  { id: 2, title: 'Внутренний Ученик', stipend: 80, reqScore: 300, desc: 'Уважаемый практик. Получает личную обитель и пилюли.' },
  { id: 3, title: 'Основной Ученик (Core Disciple)', stipend: 200, reqScore: 700, desc: 'Элита секты. Правая рука старейшин, доступ к сокровищнице.' },
  { id: 4, title: 'Наследующий Преемник (True Disciple)', stipend: 500, reqScore: 1500, desc: 'Будущий Глава Секты. Никто не смеет перечить вам!' }
];

// Противники на Арене Секты
const ARENA_OPPONENTS = [
  { id: 'opp_1', name: 'Ученик Чжао (Внешний двор)', realmIdx: 2, hp: 200, attack: 35, defense: 10, rewardStones: 15, score: 30, quote: '«Ничтожество вроде тебя посмело бросить мне вызов?!»' },
  { id: 'opp_2', name: 'Ван Мэн (Железный Кулак)', realmIdx: 4, hp: 380, attack: 65, defense: 30, rewardStones: 30, score: 50, quote: '«Мои кости крепче горной породы!»' },
  { id: 'opp_3', name: 'Ши Цинсюань (Ледяная Дева)', realmIdx: 6, hp: 600, attack: 110, defense: 45, rewardStones: 60, score: 90, quote: '«Твое дыхание Ци слишком нечисто.»' },
  { id: 'opp_4', name: 'Молодой Господин Сун', realmIdx: 8, hp: 950, attack: 180, defense: 75, rewardStones: 120, score: 150, quote: '«Мой дядя — Старейшина Зала Наказаний! Сдайся сам!»' },
  { id: 'opp_5', name: 'Ху Ли (Лисий Клинок)', realmIdx: 10, hp: 1500, attack: 280, defense: 120, rewardStones: 220, score: 240, quote: '«В бою нет места жалости, только клинки и кровь.»' },
  { id: 'opp_6', name: 'Бай Чэнь (Гений Меча)', realmIdx: 12, hp: 2800, attack: 520, defense: 220, rewardStones: 400, score: 400, quote: '«Узри истинную суть Пути Меча Лазурного Облака!»' },
  { id: 'opp_7', name: 'Старший Брат Фэн (Пик Основания)', realmIdx: 14, hp: 5500, attack: 1100, defense: 450, rewardStones: 800, score: 700, quote: '«Покажи мне, достоин ли ты войти в элиту секты!»' }
];

// Лоты для Тайного Аукциона
const AUCTION_ITEMS = [
  {
    id: 'auc_tech_fire',
    name: 'Свиток «Пламя Золотого Ворона»',
    desc: 'Древняя техника атакующего пламени.',
    type: 'technique',
    techId: 'tech_fireball',
    startBid: 60,
    rivalMaxBid: 160
  },
  {
    id: 'auc_tech_ghost',
    name: 'Свиток «Призрачная Поступь Тени»',
    desc: 'Редчайшее искусство уклонения клана Призраков.',
    type: 'technique',
    techId: 'tech_ghost_step',
    startBid: 150,
    rivalMaxBid: 320
  },
  {
    id: 'auc_pill_foundation',
    name: 'Высшая Пилюля Возведения Основания с Золотыми Узорами',
    desc: 'Идеальная пилюля без примесей токсинов. Дает +35% к шансу прорыва.',
    type: 'pill',
    pillId: 'pill_foundation',
    startBid: 50,
    rivalMaxBid: 140
  },
  {
    id: 'auc_lotus',
    name: 'Тысячелетний Снежный Лотос',
    desc: 'Легендарное сокровище, очищающее сразу 30% травм меридианов и Демонов Сердца.',
    type: 'special',
    effect: 'lotus_legend',
    startBid: 80,
    rivalMaxBid: 210
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
    id: 'beast_ambush',
    title: 'Засада Духовного Зверя',
    text: 'Из зарослей железного бамбука с ревом выскакивает Двуглавый Громовой Волк! Его клыки искрятся электричеством!',
    isCombat: true,
    enemy: {
      name: 'Двуглавый Громовой Волк',
      hp: 320,
      attack: 55,
      defense: 20,
      rewardStones: 35,
      rewardHerbs: { herb_spirit: 4, herb_ginseng: 2 }
    }
  },
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
    id: 'dying_cultivator',
    title: 'Умирающий Демонический Практик (Моральный выбор)',
    text: 'У корней древней сосны лежит тяжелораненый старик в черной мантии. Он сжимает в руке темный нефритовый свиток и шепчет: «Помоги мне... доставь пилюлю исцеления, и я обучу тебя тайне... или ты жаждешь добить меня, как эти лицемеры из праведных сект?»',
    choices: [
      {
        text: 'Спасти старика (Отдать 1 Пилюлю Очищения)',
        action: (game) => {
          if ((game.inventory.pill_purify || 0) >= 1) {
            game.inventory.pill_purify -= 1;
            game.learnTechnique('tech_blood_drain');
            return 'Старик проглотил пилюлю, его глаза блеснули алым: «В тебе есть понимание природы мира. Возьми этот свиток Запретного Демонического Пожирания!»';
          } else {
            return 'У вас не оказалось Пилюли Очищения в кольце. Старик испустил последний вздох, его свиток рассыпался в прах.';
          }
        }
      },
      {
        text: 'Добить культиватора и забрать сокровища (Демоническое Дао)',
        action: (game) => {
          const stones = 80;
          game.inventory.stone_spirit = (game.inventory.stone_spirit || 0) + stones;
          game.demonsOfHeart += 15;
          return `Вы без колебаний оборвали его жизнь. В его кольце нашлось ${stones} камней, но в вашей душе поселилась темная рябь (+15 к Демонам Сердца).`;
        }
      },
      {
        text: 'Пройти мимо, не вмешиваясь в карму',
        action: (game) => {
          return 'Вы не стали вмешиваться в чужую судьбу и продолжили путь чистым от кармических уз.';
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
            game.inventory.stone_spirit = (game.inventory.stone_spirit || 0) + 60;
            game.inventory.herb_lotus = (game.inventory.herb_lotus || 0) + 2;
            return 'Формация с тихим звоном рассеялась! Внутри вы нашли каменную шкатулку: 60 духовных камней и 2 Лотоса Чистого Сердца!';
          } else {
            game.meridianDamage = Math.min(100, (game.meridianDamage || 0) + 12);
            return 'Защитная руна сдетонировала остаточным зарядом молнии! Вы получили ожог меридианов (+12% травм).';
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
