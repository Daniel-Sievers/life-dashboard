const STORAGE_KEY = "modularLifeDashboardPublicData";
const SAVE_VERSION = "public-v26-launch-demo-empty-state";
const EMERGENCY_BACKUP_KEY = "modularLifeDashboardPublicEmergencyBackup";
const PUBLIC_BACKUP_SCHEMA = "life-dashboard-public-backup";
const PUBLIC_BACKUP_SCHEMA_VERSION = 1;
const MINDFULNESS_HEIGHTS_KEY = "modularLifeDashboardPublicMindfulnessTextareaHeights";
const LEGACY_STORAGE_KEYS = [];

const defaultWeights = {
  finance: 12,
  fitness: 16,
  health: 16,
  life: 16,
  goals: 10,
  emotion: 12,
  mind: 10,
  discipline: 8
};

const defaultDisciplineWeights = {
  skillActivity: 10,
  training: 10,
  yoga: 10,
  breath: 10,
  cold: 10,
  bodyCare: 10,
  outing: 10,
  meditation: 10,
  social: 10,
  mediaFrame: 10
};

const defaultData = {
  activeTab: "note",
  noteContent: "Schreibe hier deine Notiz...",
  noteContent2: "Schreibe hier deine Notiz...",
  noteLineHeight: "normal",
  noteLineHeight2: "normal",
  settings: {
    deviceName: "",
    lastSavedAt: null,
    lastBackupExportAt: null,
    lastBackupImportAt: null,
    lastMigrationFrom: null,
    cloudLoadedAt: null,
    lastSyncDecision: "",
    lastSyncDecisionAt: null
  },
  quickEntry: {
    weeklyNoteHtml: "",
    weeklyNoteHeight: null,
    protocolStartDate: null,
    protocolEditMode: false,
    protocolManualSkills: { "1": [], "2": [], "3": [], "4": [], "5": [] }
  },
  finance: {
    fiat: 0,
    btcAmount: 0,
    btcPrice: 0,
    invested: 0,
    ltcAmount: 0,
    ltcPrice: 0,
    ltcInvested: 0,
    financeCheckedAt: null,
    btcPriceLoadedAt: null,
    ltcPriceLoadedAt: null,
    periodLastMonth: "",
    incomeLastMonth: 0,
    expensesLastMonth: 0,
    periodBeforeLastMonth: "",
    incomeBeforeLastMonth: 0,
    expensesBeforeLastMonth: 0,
    workGrossHourly: 0,
    workDeductionRate: 0,
    workNetHourly: 0,
    workHours: 0,
    workEntries: [],
    workDates: [],
    debts: [],
    portfolioAssets: [],
    assetDraftType: "ETF"
  },
  fitness: {
    note: "",
    noteHeight: null,
    benchKg: 0,
    deadliftKg: 0,
    squatKg: 0,
    pullups: 0,
    runKm: 0,
    yogaTarget28: 12,
    trainingTarget28: 12,
    breathTarget28: 12,
    coldTarget28: 12,
    bodyCareTarget28: 20,
    yogaDates: [],
    trainingDates: [],
    breathDates: [],
    coldDates: [],
    bodyCareDates: [],
    organizationDates: [],
    outingTarget28: 12,
    outingDates: []
  },
  health: {
    schlaf: 0,
    energie: 0,
    beschwerdefreiheit: 0,
    ernaehrung: 0,
    regeneration: 0,
    vitalitaet: 0
  },
  life: {
    arbeitssituation: 0,
    selbstvermarktung: 0,
    wohnen: 0,
    mobilitaet: 0,
    sprachlicheReichweite: 0,
    perspektive: 0
  },
  emotion: {
    note: "",
    noteHeight: null,
    base: {
      kommunikation: 0,
      konfliktfaehigkeit: 0,
      verletzlichkeit: 0,
      naeheZulassen: 0,
      grenzenSetzen: 0,
      selbstregulation: 0,
      initiative: 0
    },
    socialTarget28: 20,
    socialBudgetMonthly: 50,
    socialLog: []
  },
  mind: {
    note: "",
    noteHeight: null,
    weltbild: 0,
    perspektivenfaehigkeit: 0,
    intuition: 0,
    loslassen: 0,
    klarheit: 0,
    meditationTarget28: 12,
    meditationDates: [],
    outingTarget28: 12,
    outingDates: [],
    orderDetails: {
      desktop: [],
      tabs: [],
      files: [],
      room: [],
      lists: []
    }
  },
  mindfulness: {
    presenceLevel: 0,
    monthlyIntention: "",
    todayInsight: "",
    allowed: "",
    emergence: "",
    momentNote: "",
    textareaHeights: {},
    log: []
  },
  gaming: {
    weekStart: "",
    weekFrameHours: 12,
    actualHours: 0,
    actualEntries: [],
    weekHistory: [],
    showEarlyHours: false,
    showLateHours: false,
    selectedDay: null,
    selectedSlot: null,
    editingBlockId: null,
    blocks: []
  },
  mindPlanner: {
    weekStart: "",
    showEarlyHours: false,
    showLateHours: false,
    selectedDay: null,
    selectedSlot: null,
    editingBlockId: null,
    blocks: []
  },
  attractionWeights: structuredClone(defaultWeights),
  disciplineWeights: structuredClone(defaultDisciplineWeights),
  goals: []
};

const money = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR"
});

const supportedCurrencies = ["EUR", "USD", "CHF", "GBP"];

function formatCurrencyValue(value, currency = "EUR") {
  try {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: supportedCurrencies.includes(currency) ? currency : "EUR"
    }).format(Number(value || 0));
  } catch {
    return `${roundTwo(value)} ${currency || "EUR"}`;
  }
}

function getDefaultFxToEUR(currency = "EUR") {
  const normalized = String(currency || "EUR").toUpperCase();
  if (normalized === "EUR") return 1;
  if (normalized === "USD") return 0.92;
  if (normalized === "CHF") return 1.03;
  if (normalized === "GBP") return 1.17;
  return 1;
}

function normalizeCurrency(currency = "EUR") {
  const normalized = String(currency || "EUR").toUpperCase();
  return supportedCurrencies.includes(normalized) ? normalized : "EUR";
}

function getFxToEUR(currency = "EUR", fxToEUR = null) {
  const normalized = normalizeCurrency(currency);
  if (normalized === "EUR") return 1;
  const numeric = Number(fxToEUR || 0);
  return numeric > 0 ? numeric : getDefaultFxToEUR(normalized);
}

function roundFxRate(value) {
  const numeric = Number(value || 0);
  return Number.isFinite(numeric) && numeric > 0 ? Number(numeric.toFixed(4)) : 1;
}

function getFxRateCache() {
  try {
    return JSON.parse(localStorage.getItem(FX_RATE_CACHE_STORAGE) || "{}");
  } catch {
    return {};
  }
}

function setFxRateCache(cache) {
  try {
    localStorage.setItem(FX_RATE_CACHE_STORAGE, JSON.stringify(cache || {}));
  } catch {}
}

async function loadCurrentFxToEUR(currency = "EUR", options = {}) {
  const normalized = normalizeCurrency(currency);
  if (normalized === "EUR") return { rate: 1, source: "fixed-eur", date: todayISO(), cached: false };

  const cache = getFxRateCache();
  const cached = cache[normalized];
  if (options.useCache !== false && cached?.date === todayISO() && Number(cached.rate) > 0) {
    return { ...cached, cached: true };
  }

  const urls = [
    `https://api.frankfurter.dev/v1/latest?base=${encodeURIComponent(normalized)}&symbols=EUR`,
    `https://api.frankfurter.app/latest?from=${encodeURIComponent(normalized)}&to=EUR`
  ];

  let lastError = null;
  for (const url of urls) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`FX-Quelle nicht erreichbar (${response.status})`);
      const result = await response.json();
      const rate = Number(result?.rates?.EUR ?? result?.data?.EUR ?? result?.rate);
      if (!rate || Number.isNaN(rate)) throw new Error("Kein EUR-Umrechnungskurs im Ergebnis gefunden.");
      const entry = { rate: roundFxRate(rate), source: "Frankfurter", date: result?.date || todayISO(), updatedAt: nowISO() };
      cache[normalized] = entry;
      setFxRateCache(cache);
      return { ...entry, cached: false };
    } catch (error) {
      lastError = error;
    }
  }

  if (cached?.rate) return { ...cached, cached: true, fallback: true };
  throw lastError || new Error("FX-Kurs konnte nicht geladen werden.");
}

async function updateFxInputForCurrency(currency, input, options = {}) {
  if (!input) return null;
  const normalized = normalizeCurrency(currency);
  input.value = getDefaultFxToEUR(normalized);
  input.title = normalized === "EUR" ? "EUR = 1" : "Fallback-Wert, bis ein aktueller FX-Kurs geladen wurde.";

  if (normalized === "EUR") return { rate: 1, source: "fixed-eur" };

  try {
    const result = await loadCurrentFxToEUR(normalized, options);
    input.value = result.rate;
    input.title = `FX ${normalized} → EUR: ${result.rate} · ${result.source}${result.date ? ` · ${result.date}` : ""}${result.cached ? " · Cache" : ""}`;
    return result;
  } catch (error) {
    input.title = `Aktueller FX-Kurs nicht geladen. Fallback: ${input.value}`;
    if (options.toast !== false) showToast(`FX ${normalized} → EUR nicht geladen, Fallback bleibt aktiv`);
    console.warn("FX-Kurs konnte nicht geladen werden", error);
    return null;
  }
}

async function updateAssetFxFieldForCurrency(currency, options = {}) {
  const input = document.getElementById("assetFxToEUR");
  const result = await updateFxInputForCurrency(currency, input, options);
  if (result && options.toast !== false && normalizeCurrency(currency) !== "EUR") {
    showToast(`FX ${normalizeCurrency(currency)} → EUR aktualisiert: ${result.rate}`);
  }
  return result;
}


var cloudState = {
  enabled: false,
  loaded: false,
  loading: false,
  saving: false,
  pendingSave: false,
  saveTimer: null,
  lastCloudSavedAt: null,
  lastLocalChangeAt: null,
  lastSaveAttemptAt: null,
  lastCloudCheckAt: null,
  cloudCheckTimer: null,
  syncInProgress: false,
  flushInProgress: false,
  sessionDirtySections: new Set(),
  cloudReady: false,
  userInteractionStarted: false,
  suppressAutoCloudSave: true,
  uiReady: false,
  autoLoadAfterInit: false
};


// V89 FIX: fehlende Ladefunktion wiederhergestellt.
// Diese Funktion muss vor `let data = loadData()` verfügbar sein.
function loadData() {
  try {
    const stableSave = localStorage.getItem(STORAGE_KEY);

    if (stableSave) {
      const parsed = JSON.parse(stableSave);
      return mergeDeep(structuredClone(defaultData), extractImportedData(parsed));
    }

    for (const legacyKey of LEGACY_STORAGE_KEYS) {
      const legacySave = localStorage.getItem(legacyKey);
      if (!legacySave) continue;

      const parsedLegacy = JSON.parse(legacySave);
      const migrated = mergeDeep(structuredClone(defaultData), extractImportedData(parsedLegacy));
      migrated.settings = migrated.settings || {};
      migrated.settings.lastMigrationFrom = legacyKey;
      migrated.settings.lastSavedAt = nowISO();

      localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
      return migrated;
    }

    return structuredClone(defaultData);
  } catch (error) {
    console.warn("Lokales Laden fehlgeschlagen", error);
    return structuredClone(defaultData);
  }
}

function extractImportedData(imported) {
  if (imported && imported.data) return imported.data;
  return imported;
}

function mergeDeep(target, source) {
  if (!source || typeof source !== "object") return target;

  for (const key in source) {
    if (source[key] && typeof source[key] === "object" && !Array.isArray(source[key])) {
      target[key] = mergeDeep(target[key] || {}, source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function nowISO() {
  return new Date().toISOString();
}


let data = loadData();

function normalizeDataModel() {
  if (!data.mind) data.mind = {};
  if (!data.mind.orderDetails || typeof data.mind.orderDetails !== "object" || Array.isArray(data.mind.orderDetails)) data.mind.orderDetails = {};
  ["desktop", "tabs", "files", "room", "lists"].forEach(key => {
    const current = data.mind.orderDetails[key];
    if (Array.isArray(current)) {
      data.mind.orderDetails[key] = [...new Set(current.filter(Boolean))];
    } else if (typeof current === "string" && current) {
      data.mind.orderDetails[key] = [current];
    } else {
      data.mind.orderDetails[key] = [];
    }
  });
  data.settings = data.settings || {};
  data.settings.financeCollapsed = Boolean(data.settings.financeCollapsed);

  if (!data.finance) data.finance = {};
  // Public release cleanup: remove legacy finance note fields from older private backups.
  delete data.finance.btcNote;
  delete data.finance.ltcNote;
  if (!Array.isArray(data.finance.workDates)) data.finance.workDates = [];
  if (!Array.isArray(data.finance.workEntries)) data.finance.workEntries = [];
  ["workGrossHourly", "workDeductionRate", "workNetHourly", "workHours"].forEach(field => {
    if (!Number.isFinite(Number(data.finance[field]))) data.finance[field] = 0;
  });

  if (!Array.isArray(data.goals)) data.goals = [];
  data.goals.forEach(goal => {
    const clicks = Number(goal.dailyRequiredClicks || 1);
    goal.dailyRequiredClicks = Number.isFinite(clicks) && clicks > 0 ? Math.max(1, Math.round(clicks)) : 1;
    if (!Array.isArray(goal.todayAdds)) goal.todayAdds = [];
  });

  if (!data.mind) data.mind = {};
  if (!Array.isArray(data.mind.outingDates)) data.mind.outingDates = [];
  if (!Number.isFinite(Number(data.mind.outingTarget28))) data.mind.outingTarget28 = 12;

  const legacyOutingDates = Array.isArray(data.fitness?.outingDates) ? data.fitness.outingDates : [];
  const legacyOutingTarget = Number(data.fitness?.outingTarget28 || 0);

  if (data.mind.outingDates.length === 0 && legacyOutingDates.length > 0) {
    data.mind.outingDates = [...legacyOutingDates];
  }

  if ((!data.mind.outingTarget28 || Number(data.mind.outingTarget28) <= 0) && legacyOutingTarget > 0) {
    data.mind.outingTarget28 = legacyOutingTarget;
  }
}

normalizeDataModel();
saveData();

let scores = {
  finance: 0,
  fitness: 0,
  health: 0,
  life: 0,
  goals: 0,
  emotion: 0,
  mind: 0,
  discipline: 0,
  attraction: 0,
  yoga: 0,
  training: 0,
  breath: 0,
  cold: 0,
  bodyCare: 0,
  outing: 0,
  mediaFrame: 0,
  meditation: 0,
  social: 0,
  skillActivity: 0
};

const financeLevels = [
  { value: 0, name: "kein nennenswertes Vermögen", amount: 0 },
  { value: 1, name: "erster Puffer", amount: 10000 },
  { value: 2, name: "solide Rücklage", amount: 30000 },
  { value: 3, name: "starke Sicherheit", amount: 80000 },
  { value: 4, name: "finanziell stabil", amount: 200000 },
  { value: 5, name: "halbe Million", amount: 500000 },
  { value: 6, name: "Millionär", amount: 1000000 },
  { value: 7, name: "mehrfache Freiheit", amount: 3000000 },
  { value: 8, name: "große Freiheit", amount: 10000000 },
  { value: 9, name: "sehr hohes Vermögen", amount: 20000000 },
  { value: 10, name: "extreme finanzielle Freiheit", amount: 100000000 }
];

const fitnessNames = [
  "inaktiv", "Einstieg", "Grundbewegung", "Regelmäßigkeit", "solide Fitness",
  "stabiler Rhythmus", "athletische Basis", "sehr fit", "leistungsstark",
  "hochperformant", "Elite-Level"
];

const healthNames = [
  "akut belastet", "stark eingeschränkt", "instabil", "Grundversorgung",
  "Verbesserungsphase", "funktional gesund", "stabil", "vital",
  "sehr vital", "robust", "optimale Gesundheit"
];

const lifeNames = [
  "blockiert", "stark abhängig", "eingeschränkt", "stabilisierend",
  "grundlegend flexibel", "arbeitsfähig & stabil", "solide Perspektive",
  "gut aufgestellt", "sehr beweglich", "unabhängig handlungsfähig",
  "maximale materielle Freiheit"
];

const emotionNames = [
  "verschlossen", "erste Wahrnehmung", "vorsichtige Öffnung", "Kontakt im Ansatz",
  "soziale Aktivierung", "beziehungsfähige Basis", "klarer Ausdruck",
  "konfliktfähiger Kontakt", "verletzlich & stabil", "emotional souverän",
  "tiefe Beziehungskompetenz"
];

const mindNames = [
  "geistig blockiert", "erste Orientierung", "suchend", "erste Klarheit",
  "reflektierend", "geordnet", "perspektivisch", "tiefgehend",
  "sehr klar", "weise werdend", "integrierte Gedankenwelt"
];

const disciplineNames = [
  "keine Umsetzung", "erste Impulse", "unregelmäßig", "anfangende Struktur",
  "teilweise stabil", "funktionale Disziplin", "solide Umsetzung",
  "verlässlich", "sehr konstant", "hoch diszipliniert", "extrem stabil"
];

const attractionNames = [
  "Fundament fehlt noch", "erste Stabilisierung", "Basis im Aufbau", "sichtbare Entwicklung",
  "solider werdend", "stabile Ausstrahlung", "attraktive Grunddynamik",
  "stark aufgestellt", "sehr starke Lebenswirkung", "außergewöhnlich stabil",
  "maximale Ausstrahlung"
];

const socialActions = {
  noticed: {
    label: "Gelegenheit bemerkt",
    points: 0.1,
    category: "Wahrnehmen",
    description: "Du bemerkst eine reale Kontaktmöglichkeit, auch wenn du noch nicht handelst."
  },
  smile: {
    label: "Blickkontakt / Lächeln",
    points: 0.2,
    category: "Kontakt",
    description: "Ein kleiner, sichtbarer Kontaktmoment ohne Gesprächsdruck."
  },
  question: {
    label: "Kurze Frage gestellt",
    points: 0.4,
    category: "Kontakt",
    description: "Du öffnest kurz den sozialen Raum, ohne daraus etwas machen zu müssen."
  },
  chat: {
    label: "Chatten / Sprachnachricht",
    points: 0.3,
    category: "Kontaktpflege",
    description: "Kurzer schriftlicher Kontakt oder eine Sprachnachricht. Mehr als ein Impuls, aber noch niedrigschwellig."
  },
  call: {
    label: "Telefoniert",
    points: 0.5,
    category: "Direkter Kontakt",
    description: "Ein Telefonat oder direkter Sprachkontakt. Verbindlicher und lebendiger als Chat, aber noch unter bewusst genommener Zeit."
  },
  free: {
    label: "Freier Kontaktimpuls",
    points: 0.7,
    category: "Mut / absichtslos",
    description: "Ein guter Wunsch, humorvoller Satz oder kurzer absichtsloser Kontaktmoment — ohne etwas vom anderen zu wollen."
  },
  time: {
    label: "Zeit für jemanden genommen",
    points: 1.0,
    category: "Zuwendung",
    description: "Du hast dir bewusst Zeit für jemanden genommen, warst präsent oder hast jemandem Raum gegeben."
  },
  help: {
    label: "Jemandem geholfen",
    points: 0.8,
    category: "Hilfsbereitschaft",
    description: "Eine konkrete kleine Hilfe: Tür aufhalten, Tasche tragen, unterstützen oder praktisch entlasten."
  },
  conversation: {
    label: "Gespräch begonnen",
    points: 0.8,
    category: "Gespräch",
    description: "Du startest ein echtes Gespräch oder hältst einen Kontaktmoment bewusst offen."
  },
  personal: {
    label: "Persönliches Detail geteilt",
    points: 1.0,
    category: "Offenheit",
    description: "Du zeigst etwas Persönliches, ohne dich zu verstecken."
  },
  event: {
    label: "Event besucht",
    points: 1.5,
    category: "Umfeld",
    description: "Du bringst dich in einen sozialen Raum, in dem Begegnung möglich wird."
  },
  dating: {
    label: "Dating-/soziale Initiative",
    points: 2.0,
    category: "Initiative",
    description: "Du gehst aktiv auf Verbindung, Dating oder eine bewusst soziale Öffnung zu."
  },
  surrender: {
    label: "Hingabe / Flow",
    points: 5.0,
    category: "Hingabe",
    description: "Du vergisst dich und deine Umgebung, gehst in einen Flow hinein und gibst dich dem Moment ganz hin."
  },
  boundary: {
    label: "Grenze/Wunsch ausgesprochen",
    points: 1.5,
    category: "Klarheit",
    description: "Du formulierst klar, was du möchtest oder nicht möchtest."
  }
};


const mindfulnessDescriptions = [
  "vollständig identifiziert — Gedanken und Angst wirken wie Realität",
  "erste Momente des Bemerkens",
  "Gedanken werden manchmal als Gedanken erkannt",
  "Angst darf gelegentlich da sein, ohne sofort zu handeln",
  "Loslassen wird in kleinen Momenten möglich",
  "innerer Raum entsteht",
  "Impulse werden weniger erzwungen",
  "Vertrauen in Innen → Außen wächst",
  "Leben wirkt spürbar durch mich hindurch",
  "tiefe Gelassenheit und Mut werden verfügbar",
  "stabile Präsenz — Sein vor Tun"
];

const mindfulnessActions = {
  identity: { label: "Identifikation bemerkt", kind: "moment" },
  fear: { label: "Angst da sein lassen", kind: "courage" },
  control: { label: "Kontrolle losgelassen", kind: "release" },
  impulse: { label: "Impuls losgelassen", kind: "release" },
  natural: { label: "Natürlich gehandelt", kind: "natural" }
};

const healthDescriptions = {
  schlaf: ["massiv gestört", "kaum erholsam", "häufig schlecht", "unruhig", "wechselhaft", "ausreichend", "meistens okay", "stabil erholsam", "sehr gut", "hervorragend", "optimal regenerierend"],
  energie: ["erschöpft", "kaum belastbar", "sehr niedrig", "träge", "schwankend", "funktional", "solide", "aktiv", "kraftvoll", "sehr lebendig", "voller Energie"],
  beschwerdefreiheit: ["starke Beschwerden", "stark eingeschränkt", "deutlich belastet", "häufig spürbar", "leicht eingeschränkt", "alltagstauglich", "meist beschwerdearm", "stabil beschwerdearm", "fast beschwerdefrei", "sehr frei", "vollständig beschwerdefrei"],
  ernaehrung: ["chaotisch", "sehr unausgewogen", "häufig problematisch", "instabil", "verbesserungswürdig", "funktional", "meist solide", "bewusst", "sehr gut", "konsequent nährend", "optimal unterstützend"],
  regeneration: ["keine Erholung", "ständig überlastet", "kaum Erholung", "zu wenig Pause", "wechselhaft", "ausreichend", "meist erholt", "stabil regeneriert", "sehr gut erholt", "hervorragende Erholung", "maximal regenerativ"],
  vitalitaet: ["leer", "sehr matt", "niedrig", "gedämpft", "schwankend", "funktional", "lebendig", "vital", "sehr vital", "robust lebendig", "volle Vitalität"]
};

const lifeDescriptions = {
  arbeitssituation: ["keine Arbeit, keine Struktur", "ausbeuterisch oder extrem instabil", "unpassende Arbeit mit hoher Belastung", "kurzfristig stabilisierend", "einfache Einkommensquelle", "verlässliche Arbeit", "solide, aber begrenzt", "passend und entwicklungsfähig", "erfüllend und gut bezahlt", "sehr frei gestaltbar", "Berufung oder finanzielle Unabhängigkeit"],
  selbstvermarktung: ["nichts vorbereitet", "chaotisch oder veraltet", "grob vorhanden", "nutzbar, aber schwach", "solide Grundfassung", "aktuell und verwendbar", "gut strukturiert", "überzeugend", "professionell", "sehr stark positioniert", "exzellente persönliche Marke"],
  wohnen: ["akut unsicher", "belastend oder instabil", "stark einschränkend", "funktional, aber unpassend", "okay als Übergang", "stabil und bezahlbar", "angenehm und tragfähig", "gut passend", "sehr gute Basis", "frei gewählt und stärkend", "ideale Wohnsituation"],
  mobilitaet: ["kaum beweglich", "stark ortsgebunden", "eingeschränkt mobil", "lokal mobil", "regional beweglich", "zuverlässig mobil", "deutschlandweit flexibel", "europaweit handlungsfähig", "international beweglich", "ortsunabhängig", "weltweit frei beweglich"],
  sprachlicheReichweite: ["kaum nutzbar", "nur Muttersprache in engem Rahmen", "einfache Fremdsprachenbasis", "Alltag in einer Fremdsprache", "einfache berufliche Nutzung", "solide Englischbasis", "Englisch beruflich nutzbar", "Englisch stark plus zweite Sprache Basis", "mehrere Sprachen nutzbar", "international souverän", "mehrsprachig professionell"],
  perspektive: ["keine erkennbare Richtung", "blockiert", "sehr unklar", "erste Optionen", "grobe Richtung", "realistische Perspektive", "konkrete nächste Schritte", "gute Entwicklungschancen", "starke Optionen", "sehr offene Zukunft", "frei wählbare Lebenspfade"]
};

const emotionDescriptions = {
  kommunikation: ["verstummt", "sehr gehemmt", "unsicher", "reaktiv", "erste Klarheit", "verständlich", "klarer Ausdruck", "gutes Zuhören", "souverän", "sehr verbindend", "außergewöhnlich klar"],
  konfliktfaehigkeit: ["vermeidend", "erstarrend", "stark unsicher", "leicht defensiv", "erste Grenzen", "ansprechbar", "klarer werdend", "konfliktfähig", "stabil unter Spannung", "sehr souverän", "reif und direkt"],
  verletzlichkeit: ["verschlossen", "stark geschützt", "kaum zeigend", "vorsichtig", "erste Offenheit", "punktuell ehrlich", "spürbar offen", "verletzlich & stabil", "tiefe Echtheit", "sehr authentisch", "radikal ehrlich"],
  naeheZulassen: ["abgeschnitten", "stark distanziert", "misstrauisch", "vorsichtig", "erste Nähe", "situativ offen", "zunehmend stabil", "Nähe möglich", "tiefe Verbindung möglich", "sehr beziehungsfähig", "intime Stabilität"],
  grenzenSetzen: ["keine Grenzen", "übergehend", "unklar", "spät reagierend", "erste Nein-Fähigkeit", "situativ klar", "meist klar", "stabil begrenzend", "ruhig deutlich", "sehr souverän", "klar und liebevoll"],
  selbstregulation: ["überflutet", "kaum reguliert", "stark schwankend", "reaktiv", "erste Stabilisierung", "funktional", "meist reguliert", "stabil", "sehr belastbar", "souverän", "ruhig unter Druck"],
  initiative: ["Impuls bleibt innen", "kaum bemerkbar", "bemerkt, aber blockiert", "innerlich vorbereitet", "selten ausgedrückt", "gelegentlich umgesetzt", "kleine Impulse werden handlungsfähig", "regelmäßig initiierend", "kreativ im Kontakt", "stark ausdrucksfähig", "lebendige schöpferische Initiative"]
};

const mindDescriptions = {
  weltbild: ["unreflektiert", "sehr eng", "einseitig", "erste Fragen", "differenzierend", "reflektiert", "mehrperspektivisch", "komplex", "sehr umfassend", "tief integriert", "weites, tragfähiges Weltbild"],
  perspektivenfaehigkeit: ["kaum Perspektivwechsel", "stark ichbezogen", "schwer beweglich", "erste andere Sichtweisen", "situativ offen", "mehrere Perspektiven möglich", "differenziert", "empathisch denkend", "sehr beweglich", "hoch integrativ", "außergewöhnlich perspektivisch"],
  intuition: ["abgeschnitten", "kaum wahrnehmbar", "unsicher", "erste Signale", "gelegentlich spürbar", "nutzbar", "zunehmend klar", "vertrauenswürdig", "stark", "sehr fein", "tiefe intuitive Führung"],
  loslassen: ["stark festhaltend", "kontrollierend", "verhärtet", "schwer lösbar", "erste Weichheit", "situativ möglich", "zunehmend frei", "gut loslassend", "sehr gelöst", "tiefes Vertrauen", "frei fließend"],
  klarheit: ["vernebelt", "chaotisch", "unfokussiert", "erste Ordnung", "teilweise klar", "funktional klar", "gut sortiert", "fokussiert", "sehr klar", "präzise", "glasklar"]
};

// ONLINE_READY_NOTE:
 // Paket 3 speichert weiterhin lokal und synchronisiert zusätzlich mit Supabase, wenn Login aktiv ist.
function saveData({ skipCloud = false, sections = null, userAction = false } = {}) {
  if (userAction) markUserInteraction();

  if (data && data.settings && !skipCloud) {
    data.settings.lastSavedAt = nowISO();
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  updateBackupStatus();

  if (!skipCloud && canAutoSaveToCloud()) {
    markDirtySections(sections);
    cloudState.lastLocalChangeAt = nowISO();
    setCloudStatus("Nutzeränderung · Cloud-Speichern geplant");
  } else if (!skipCloud && authState?.user && cloudState.enabled && !canAutoSaveToCloud()) {
    setCloudStatus("Cloud ist Quelle · lokaler Altstand wird nicht automatisch hochgeladen");
  }

  if (!skipCloud && canAutoSaveToCloud() && typeof scheduleCloudSave === "function") {
    try {
      scheduleCloudSave();
    } catch (error) {
      console.warn("Cloud-Sync konnte nicht geplant werden", error);
    }
  }
}

function mergeDeep(target, source) {
  for (const key in source) {
    if (source[key] && typeof source[key] === "object" && !Array.isArray(source[key])) {
      target[key] = mergeDeep(target[key] || {}, source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function nowISO() {
  return new Date().toISOString();
}

function isSameDayISO(dateString, isoDay) {
  if (!dateString) return false;
  return String(dateString).slice(0, 10) === isoDay;
}

function formatDateTimeDE(dateString) {
  if (!dateString) return "nie";

  try {
    return new Intl.DateTimeFormat("de-DE", {
      dateStyle: "medium",
      timeStyle: "short"
    }).format(new Date(dateString));
  } catch {
    return dateString;
  }
}

function daysSince(dateString) {
  if (!dateString) return Infinity;
  const today = new Date(todayISO());
  const date = new Date(dateString);
  return Math.floor((today - date) / (1000 * 60 * 60 * 24));
}

function lastNDaysISO(days) {
  const result = [];
  const now = new Date();

  for (let i = 0; i < days; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    result.push(d.toISOString().slice(0, 10));
  }

  return result;
}

function countDatesInLastDays(dates, days) {
  const allowed = new Set(lastNDaysISO(days));
  return [...new Set(dates)].filter(date => allowed.has(date)).length;
}

function countDatesInMonth(dates, offset = 0) {
  const now = new Date();
  const target = new Date(now.getFullYear(), now.getMonth() + offset, 1);
  const year = target.getFullYear();
  const month = String(target.getMonth() + 1).padStart(2, "0");
  const prefix = `${year}-${month}`;
  return dates.filter(date => date.startsWith(prefix)).length;
}

function countDatesCurrentAndLastMonth(dates) {
  return countDatesInMonth(dates, 0) + countDatesInMonth(dates, -1);
}

function countDatesInRollingDays(dates = [], days = 56) {
  const allowed = new Set(lastNDaysISO(days));
  return (dates || []).filter(date => allowed.has(date)).length;
}

function scoreDatesRolling56(dates, target28) {
  const count = countDatesInRollingDays(dates, 56);
  const target = Math.max(Number(target28 || 12) * 2, 1);
  const percent = clamp((count / target) * 100, 0, 100);
  return percentToLevel(percent);
}

function scoreDatesCurrentAndLastMonth(dates, target28) {
  return scoreDatesRolling56(dates, target28);
}

function filterLogInLastDays(log, days) {
  const allowed = new Set(lastNDaysISO(days));
  return log.filter(entry => allowed.has(entry.date));
}

function filterLogInMonth(log, offset = 0) {
  const now = new Date();
  const target = new Date(now.getFullYear(), now.getMonth() + offset, 1);
  const year = target.getFullYear();
  const month = String(target.getMonth() + 1).padStart(2, "0");
  const prefix = `${year}-${month}`;
  return log.filter(entry => entry.date.startsWith(prefix));
}

function scoreSocialCurrentAndLastMonth() {
  const recent = filterLogInLastDays(data.emotion.socialLog || [], 56);

  const points = recent.reduce((sum, entry) => {
    return sum + Number(entry.points || 0);
  }, 0);

  const target = Math.max(Number(data.emotion.socialTarget28 || 20) * 2, 1);
  const percent = clamp((points / target) * 100, 0, 100);

  return percentToLevel(percent);
}

function addDateOnce(list, date) {
  if (list.includes(date)) return false;
  list.push(date);
  return true;
}

function removeDate(list, date) {
  return list.filter(item => item !== date);
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function average(values) {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + Number(value), 0) / values.length;
}

function weightedAverage(values, weights) {
  const totalWeight = Object.values(weights).reduce((sum, value) => sum + Number(value || 0), 0);

  if (totalWeight <= 0) return average(Object.values(values));

  const weightedSum = Object.entries(values).reduce((sum, [key, value]) => {
    return sum + Number(value || 0) * Number(weights[key] || 0);
  }, 0);

  return weightedSum / totalWeight;
}

function roundOne(value) {
  return Math.round(value * 10) / 10;
}

function percentToLevel(percent) {
  return clamp(roundOne(percent / 10), 0, 10);
}

function formatPercent(value) {
  const number = Number(value || 0);
  if (Number.isInteger(number)) return `${number}%`;

  let fixed = number.toFixed(4);
  fixed = fixed.replace(/0+$/, "");

  const decimals = fixed.split(".")[1] || "";
  if (decimals.length < 2) fixed = number.toFixed(2);

  return `${fixed.replace(".", ",")}%`;
}

function formatPercentTwoDecimals(value) {
  return `${Number(value || 0).toFixed(2).replace(".", ",")}%`;
}

function makePublicBackupData(source = data) {
  const backupData = structuredClone(source || defaultData);

  // Keep public backups aligned with the current demo data model.
  // Legacy fields from the private dashboard are intentionally not exported.
  if (backupData.finance && typeof backupData.finance === "object") {
    delete backupData.finance.btcNote;
    delete backupData.finance.ltcNote;
  }

  if (backupData.settings && typeof backupData.settings === "object") {
    delete backupData.settings.cloudLoadedAt;
    delete backupData.settings.lastSyncDecision;
    delete backupData.settings.lastSyncDecisionAt;
    delete backupData.settings.lastMigrationFrom;
  }

  return backupData;
}

function makeSaveEnvelope() {
  return {
    schema: PUBLIC_BACKUP_SCHEMA,
    schemaVersion: PUBLIC_BACKUP_SCHEMA_VERSION,
    appName: "Life Dashboard",
    saveVersion: SAVE_VERSION,
    savedAt: nowISO(),
    storageKey: STORAGE_KEY,
    publicDemo: true,
    data: makePublicBackupData(data)
  };
}

function extractImportedData(imported) {
  if (imported && imported.data) return imported.data;
  return imported;
}

function readableKey(key) {
  const names = {
    schlaf: "Schlaf",
    energie: "Energie",
    beschwerdefreiheit: "Beschwerdefreiheit",
    ernaehrung: "Ernährung",
    regeneration: "Regeneration",
    vitalitaet: "Vitalität",
    arbeitssituation: "Arbeitssituation",
    selbstvermarktung: "Selbstvermarktung",
    wohnen: "Wohnsituation",
    mobilitaet: "Mobilität",
    sprachlicheReichweite: "Sprachliche Reichweite",
    perspektive: "Perspektive",
    kommunikation: "Kommunikation",
    konfliktfaehigkeit: "Konfliktfähigkeit",
    verletzlichkeit: "Verletzlichkeit",
    naeheZulassen: "Nähe zulassen",
    grenzenSetzen: "Grenzen setzen",
    selbstregulation: "Selbstregulation",
    initiative: "Initiative",
    weltbild: "Weltbild",
    perspektivenfaehigkeit: "Perspektivenfähigkeit",
    intuition: "Intuition",
    loslassen: "Loslassen",
    klarheit: "Klarheit"
  };
  return names[key] || key;
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(showToast.timeoutId);
  showToast.timeoutId = setTimeout(() => {
    toast.classList.remove("show");
  }, 1800);
}

function focusEditor(editorId) {
  const editor = document.getElementById(editorId);
  editor.focus();
}

function formatText(command, editorId) {
  focusEditor(editorId);
  document.execCommand(command, false, null);
  saveNotes();
}

function applyColor(editorId, colorId) {
  const color = document.getElementById(colorId).value;
  focusEditor(editorId);
  document.execCommand("foreColor", false, color);
  saveNotes();
}

function insertTable(editorId) {
  const rows = clamp(Number(prompt("Wie viele Zeilen?", "3") || 3), 1, 20);
  const cols = clamp(Number(prompt("Wie viele Spalten?", "3") || 3), 1, 12);

  let html = "<table><tbody>";

  for (let r = 0; r < rows; r++) {
    html += "<tr>";
    for (let c = 0; c < cols; c++) {
      html += "<td><br></td>";
    }
    html += "</tr>";
  }

  html += "</tbody></table><p><br></p>";

  focusEditor(editorId);
  document.execCommand("insertHTML", false, html);
  saveNotes();
}

function applyLineHeight(editorId, value) {
  const editor = document.getElementById(editorId);
  editor.classList.remove("line-compact", "line-normal", "line-loose");
  editor.classList.add(`line-${value}`);
}

function saveNotes() {
  data.noteContent = document.getElementById("editor").innerHTML;
  data.noteContent2 = document.getElementById("editor2").innerHTML;
  data.noteLineHeight = document.getElementById("lineHeight1").value;
  data.noteLineHeight2 = document.getElementById("lineHeight2").value;
  saveData();
}

const LAST_ACTIVE_TAB_KEY = "modularLifeDashboardPublicLastActiveTab";
const DEMO_PROFILE_KEY = "modularLifeDashboardPublicDemoProfile";
const ALPHA_VANTAGE_KEY_STORAGE = "modularLifeDashboardPublicAlphaVantageKey";
const FX_RATE_CACHE_STORAGE = "modularLifeDashboardPublicFxRates";

function openDashboardTab(tabId, options = {}) {
  const { persist = true, save = true } = options;
  const tab = document.querySelector(`.tab[data-tab="${tabId}"]`);
  const view = document.getElementById(tabId);
  if (!tab || !view) return false;

  document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
  document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));

  tab.classList.add("active");
  view.classList.add("active");

  data.activeTab = tabId;
  if (persist) {
    try { localStorage.setItem(LAST_ACTIVE_TAB_KEY, tabId); } catch {}
  }
  syncMobileMenuActiveTab?.(tabId);
  if (save) saveData();
  updateProtocolTable();
  return true;
}

function getStoredActiveTab() {
  try {
    const localTab = localStorage.getItem(LAST_ACTIVE_TAB_KEY);
    if (localTab && document.getElementById(localTab)) return localTab;
  } catch {}
  if (data.activeTab && document.getElementById(data.activeTab)) return data.activeTab;
  return "note";
}



function getDemoBaseProfile() {
  const today = todayISO();
  return {
    activeTab: "dashboard",
    noteContent: `
      <h2>Life Dashboard Demo</h2>
      <p><strong>Ausgangsidee:</strong> Viele verstreute Listen, Tabellen, Notizen und Routinen werden in einem local-first Dashboard gebündelt.</p>
      <p>Dieses fiktive Profil zeigt, wie die App im Alltag genutzt werden könnte: Wochenplanung, Finanzen, Portfolio, Routinen, Reflexion und Ziele an einem Ort.</p>
      <table>
        <tbody>
          <tr><td><strong>Fokus der Woche</strong></td><td>Routinen stabilisieren und Portfolio-Modul testen</td></tr>
          <tr><td><strong>Nächster Schritt</strong></td><td>Public Demo deployen und README mit Screenshots ergänzen</td></tr>
          <tr><td><strong>Prinzip</strong></td><td>Local-first, übersichtlich, modular, erweiterbar</td></tr>
        </tbody>
      </table>
    `,
    noteContent2: `
      <h2>Projekt-Notizen</h2>
      <ul>
        <li>Demo-Daten sollen wie ein echtes Beispielprofil wirken.</li>
        <li>Portfolio-Assets sollen später Presets, Käufe und Kursupdates bekommen.</li>
        <li>README, Architekturdiagramm und Deployment-Link bilden die öffentliche Präsentationsschicht.</li>
      </ul>
    `,
    noteLineHeight: "normal",
    noteLineHeight2: "normal",
    quickEntry: {
      weeklyNoteHtml: [
        `<div class="quick-note-task" contenteditable="false"><span class="quick-note-arrow">▶</span><span class="quick-note-task-text" contenteditable="true">Public Demo auf Vercel veröffentlichen</span><button type="button" class="quick-note-check" contenteditable="false">☐</button></div>`,
        `<div class="quick-note-task" contenteditable="false"><span class="quick-note-arrow">▶</span><span class="quick-note-task-text" contenteditable="true">Portfolio-Presets für ETF, Aktie, Krypto und Gold testen</span><button type="button" class="quick-note-check" contenteditable="false">☐</button></div>`,
        `<div class="quick-note-task" contenteditable="false"><span class="quick-note-arrow">▶</span><span class="quick-note-task-text" contenteditable="true">Screenshots für README vorbereiten</span><button type="button" class="quick-note-check" contenteditable="false">☐</button></div>`,
        `<div class="quick-note-task" contenteditable="false"><span class="quick-note-arrow">▶</span><span class="quick-note-task-text" contenteditable="true">Smoke-Test-Checkliste durchgehen</span><button type="button" class="quick-note-check" contenteditable="false">☐</button></div>`,
        `<div class="quick-note-line" contenteditable="false"><span class="quick-note-arrow">▶</span><span class="quick-note-text" contenteditable="true">README final prüfen und Vercel-Link testen</span></div>`
      ].join(""),
      weeklyNotePriorityMode: true,
      protocolStartDate: addDaysISO(today, -55)
    },
    mindfulness: {
      presenceLevel: 6,
      monthlyIntention: "Ruhig, klar und iterativ arbeiten.",
      todayInsight: "Ein gutes Produkt entsteht durch viele kleine, überprüfbare Verbesserungen.",
      allowed: "Nicht alles muss sofort perfekt sein.",
      emergence: "Erst trennen, dann vereinfachen, dann präsentieren.",
      actions: [
        { id: "demo-mindful-1", date: today, type: "presence", label: "Präsenzmoment", points: 1, createdAt: nowISO() }
      ]
    }
  };
}

function makeDemoPurchase(id, date, investedAmount, price, note = "Demo-Kauf") {
  return {
    id,
    date,
    investedAmount,
    price,
    units: price ? roundEight(Number(investedAmount || 0) / Number(price || 1)) : 0,
    note
  };
}

function demoDatePattern(days = 56, every = 2, offset = 0) {
  return lastNDaysISO(days).filter((_, index) => (index + offset) % every === 0);
}

function demoHashPercent(seed) {
  let hash = 0;
  const text = String(seed || "demo");
  for (let i = 0; i < text.length; i++) {
    hash = ((hash << 5) - hash + text.charCodeAt(i)) | 0;
  }
  return Math.abs(hash % 1000) / 1000;
}

function makeDemoDateSeries(prefix, density = 0.4, days = 56, offset = 0) {
  const normalizedDensity = Math.max(0, Math.min(1, Number(density || 0)));
  return lastNDaysISO(days).filter((date, index) => {
    if (index === 0 && normalizedDensity >= 0.18) return true;
    const score = demoHashPercent(`${prefix}-${date}-${index + offset}`);
    return score < normalizedDensity;
  });
}

function makeDemoSkillMap(prefix, density = 0.25, days = 56) {
  return {
    "1": makeDemoDateSeries(`${prefix}-skill-1`, density * 0.75, days, 1),
    "2": makeDemoDateSeries(`${prefix}-skill-2`, density * 0.95, days, 2),
    "3": makeDemoDateSeries(`${prefix}-skill-3`, density * 1.15, days, 3),
    "4": makeDemoDateSeries(`${prefix}-skill-4`, density * 0.65, days, 4),
    "5": makeDemoDateSeries(`${prefix}-skill-5`, density * 0.85, days, 5)
  };
}

function makeDemoSocialSeries(prefix, days = 56, densityOrEvery = 4) {
  const actions = [
    { action: "chat", label: "Chatten / Sprachnachricht", points: 0.3, cost: 0 },
    { action: "conversation", label: "Gespräch begonnen", points: 0.8, cost: 0 },
    { action: "call", label: "Telefoniert", points: 0.5, cost: 0 },
    { action: "help", label: "Jemandem geholfen", points: 0.8, cost: 0 },
    { action: "event", label: "Event besucht", points: 1.5, cost: 12 }
  ];

  return lastNDaysISO(days)
    .filter((date, index) => {
      if (densityOrEvery <= 1) return demoHashPercent(`${prefix}-social-${date}-${index}`) < densityOrEvery;
      return index % densityOrEvery === 0;
    })
    .map((date, index) => {
      const template = actions[index % actions.length];
      return {
        id: `${prefix}-${index + 1}`,
        date,
        createdAt: date,
        ...template
      };
    });
}

function applyDemoProtocolDensity(demo, profileKey = "stable") {
  const protocolProfiles = {
    starter: { prefix: "starter", fitness: 0.26, breath: 0.34, cold: 0.12, care: 0.46, organization: 0.18, outing: 0.22, work: 0.30, social: 0.22, meditation: 0.22, skills: 0.16 },
    stable: { prefix: "stable", fitness: 0.44, breath: 0.54, cold: 0.28, care: 0.68, organization: 0.38, outing: 0.36, work: 0.48, social: 0.36, meditation: 0.42, skills: 0.30 },
    wealthy: { prefix: "wealthy", fitness: 0.66, breath: 0.78, cold: 0.44, care: 0.86, organization: 0.58, outing: 0.54, work: 0.58, social: 0.52, meditation: 0.62, skills: 0.48 }
  };
  const settings = protocolProfiles[profileKey] || protocolProfiles.stable;

  if (!settings) return demo;
  const p = settings.prefix;
  demo.quickEntry = demo.quickEntry || {};
  demo.quickEntry.protocolStartDate = addDaysISO(todayISO(), -55);
  demo.quickEntry.protocolManualSkills = makeDemoSkillMap(`${p}-protocol`, settings.skills, 56);

  demo.finance = demo.finance || {};
  demo.finance.workDates = makeDemoDateSeries(`${p}-work`, settings.work);

  demo.fitness = demo.fitness || {};
  demo.fitness.yogaDates = makeDemoDateSeries(`${p}-yoga`, settings.fitness);
  demo.fitness.trainingDates = makeDemoDateSeries(`${p}-training`, Math.max(0, settings.fitness - 0.04));
  demo.fitness.breathDates = makeDemoDateSeries(`${p}-breath`, settings.breath);
  demo.fitness.coldDates = makeDemoDateSeries(`${p}-cold`, settings.cold);
  demo.fitness.bodyCareDates = makeDemoDateSeries(`${p}-body-care`, settings.care);
  demo.fitness.organizationDates = makeDemoDateSeries(`${p}-organization`, settings.organization);
  demo.fitness.outingDates = makeDemoDateSeries(`${p}-fitness-outing`, settings.outing);

  demo.emotion = demo.emotion || {};
  demo.emotion.socialLog = makeDemoSocialSeries(`${p}-social`, 56, settings.social);

  demo.mind = demo.mind || {};
  demo.mind.meditationDates = makeDemoDateSeries(`${p}-meditation`, settings.meditation);
  demo.mind.outingDates = makeDemoDateSeries(`${p}-mind-outing`, settings.outing);
  demo.mind.orderDetails = {
    desktop: makeDemoDateSeries(`${p}-order-desktop`, settings.organization),
    tabs: makeDemoDateSeries(`${p}-order-tabs`, settings.organization * 0.9),
    files: makeDemoDateSeries(`${p}-order-files`, settings.organization * 0.75),
    room: makeDemoDateSeries(`${p}-order-room`, settings.organization * 0.55),
    lists: makeDemoDateSeries(`${p}-order-lists`, settings.organization * 0.95)
  };

  return demo;
}

function makeDemoMediaEntries(prefix, days = 28, every = 4, hours = 1) {
  return lastNDaysISO(days)
    .filter((_, index) => index % every === 0)
    .map((date, index) => ({
      id: `${prefix}-${index + 1}`,
      date,
      hours,
      createdAt: nowISO()
    }));
}


function getStarterDemoProfile(today) {
  return {
    finance: {
      fiat: 780,
      portfolioAssets: [
        {
          id: "starter-msci-world",
          name: "MSCI World ETF",
          type: "ETF",
          symbol: "IWDA",
          providerSymbol: "IWDA.LON",
          units: 3.2,
          price: 92.4,
          currency: "USD",
          fxToEUR: 0.92,
          priceSource: "alpha-vantage",
          targetAllocation: 70,
          note: "Kleiner ETF-Start",
          purchases: [
            makeDemoPurchase("starter-buy-msci-1", addDaysISO(today, -40), 180, 86.5),
            makeDemoPurchase("starter-buy-msci-2", addDaysISO(today, -10), 110, 91.1)
          ]
        },
        {
          id: "starter-bitcoin",
          name: "Bitcoin",
          type: "Krypto",
          symbol: "BTC",
          units: 0.0021,
          price: 95000,
          targetAllocation: 10,
          note: "Kleiner Krypto-Anteil",
          purchases: [
            makeDemoPurchase("starter-buy-btc-1", addDaysISO(today, -20), 180, 86000)
          ]
        }
      ],
      incomeLastMonth: 1450,
      expensesLastMonth: 1320,
      incomeBeforeLastMonth: 1300,
      expensesBeforeLastMonth: 1280,
      periodLastMonth: "letzter Monat",
      periodBeforeLastMonth: "vorletzter Monat",
      debts: []
    },
    health: {
      schlaf: 4,
      energie: 4,
      beschwerdefreiheit: 6,
      ernaehrung: 4,
      regeneration: 4,
      vitalitaet: 5
    },
    life: {
      arbeitssituation: 4,
      selbstvermarktung: 3,
      wohnen: 5,
      mobilitaet: 4,
      sprachlicheReichweite: 5,
      perspektive: 4
    },
    fitness: {
      note: "Aufbau-Profil: Routinen entstehen gerade erst.",
      benchKg: 35,
      deadliftKg: 50,
      squatKg: 45,
      pullups: 1,
      runKm: 3,
      yogaTarget28: 8,
      trainingTarget28: 8,
      breathTarget28: 8,
      coldTarget28: 4,
      bodyCareTarget28: 16,
      outingTarget28: 8,
      yogaDates: [addDaysISO(today, -2)],
      trainingDates: [addDaysISO(today, -4)],
      breathDates: [today, addDaysISO(today, -3)],
      coldDates: [],
      bodyCareDates: [today, addDaysISO(today, -2)],
      organizationDates: [],
      outingDates: []
    },
    emotion: {
      note: "Aufbau-Profil: soziale Praxis ist niedrigschwellig.",
      socialTarget28: 10,
      socialBudgetMonthly: 40,
      base: {
        kommunikation: 4,
        konfliktfaehigkeit: 3,
        verletzlichkeit: 4,
        naeheZulassen: 4,
        grenzenSetzen: 4,
        selbstregulation: 5,
        initiative: 3
      },
      socialLog: [
        { id: "starter-social-1", date: today, action: "chat", label: "Chatten / Sprachnachricht", points: 0.3, cost: 0, createdAt: today },
        { id: "starter-social-2", date: addDaysISO(today, -3), action: "smile", label: "Blickkontakt / Lächeln", points: 0.2, cost: 0, createdAt: addDaysISO(today, -3) }
      ]
    },
    mind: {
      note: "Aufbau-Profil: erste Ordnung und Reflexion.",
      weltbild: 4,
      perspektivenfaehigkeit: 4,
      intuition: 4,
      loslassen: 3,
      klarheit: 4,
      meditationTarget28: 8,
      meditationDates: [addDaysISO(today, -2)],
      outingTarget28: 8,
      outingDates: [today],
      orderDetails: { desktop: [today], tabs: [], files: [], room: [], lists: [] }
    },
    gaming: {
      weekFrameHours: 10,
      actualHours: 7,
      actualEntries: [
        { id: "starter-media-1", date: today, hours: 2, createdAt: nowISO() },
        { id: "starter-media-2", date: addDaysISO(today, -1), hours: 3, createdAt: nowISO() },
        { id: "starter-media-3", date: addDaysISO(today, -3), hours: 2, createdAt: nowISO() }
      ],
      blocks: []
    },
    goals: [
      makeDemoGoal("starter-goal-1", "Morgenroutine etablieren", 20, 5, 1, today, true),
      makeDemoGoal("starter-goal-2", "ETF-Sparplan verstehen", 15, 5, 2, addDaysISO(today, -2), true),
      makeDemoGoal("starter-goal-3", "README-Grundstruktur lesen", 30, 10, 3, today, true)
    ]
  };
}

function getStableDemoProfile(today) {
  return {
    finance: {
      fiat: 2450,
      portfolioAssets: [
        {
          id: "demo-msci-world",
          name: "MSCI World ETF",
          type: "ETF",
          symbol: "IWDA",
          providerSymbol: "IWDA.LON",
          units: 18,
          price: 92.4,
          currency: "USD",
          fxToEUR: 0.92,
          priceSource: "alpha-vantage",
          targetAllocation: 50,
          note: "Breiter Aktienmarkt als Demo-Asset",
          purchases: [
            makeDemoPurchase("demo-buy-msci-1", addDaysISO(today, -80), 900, 84.5),
            makeDemoPurchase("demo-buy-msci-2", addDaysISO(today, -30), 600, 90.2, "Demo-Sparrate")
          ]
        },
        {
          id: "demo-sp500",
          name: "S&P 500 ETF",
          type: "ETF",
          symbol: "VUAA",
          providerSymbol: "VUAA.LON",
          units: 9,
          price: 86.2,
          currency: "USD",
          fxToEUR: 0.92,
          priceSource: "alpha-vantage",
          targetAllocation: 20,
          note: "US-Aktien-Beispiel",
          purchases: [
            makeDemoPurchase("demo-buy-sp500-1", addDaysISO(today, -60), 700, 82.5)
          ]
        },
        {
          id: "demo-bitcoin",
          name: "Bitcoin",
          type: "Krypto",
          symbol: "BTC",
          units: 0.018,
          price: 95000,
          targetAllocation: 15,
          note: "Krypto als optionale Portfolio-Komponente",
          purchases: [
            makeDemoPurchase("demo-buy-btc-1", addDaysISO(today, -120), 800, 72000),
            makeDemoPurchase("demo-buy-btc-2", addDaysISO(today, -20), 500, 92000, "Demo-Sparrate")
          ]
        },
        {
          id: "demo-gold",
          name: "Gold",
          type: "Edelmetall",
          symbol: "XAU",
          units: 0.42,
          price: 2150,
          currency: "USD",
          fxToEUR: 0.92,
          priceSource: "gold-api",
          targetAllocation: 10,
          note: "Stabilitätsbaustein im Beispielportfolio",
          purchases: [
            makeDemoPurchase("demo-buy-gold-1", addDaysISO(today, -45), 750, 2050)
          ]
        },
        {
          id: "demo-cash-reserve",
          name: "Notfallreserve",
          type: "Cash",
          symbol: "EUR",
          units: 1,
          price: 750,
          targetAllocation: 5,
          note: "Separater Cash-Baustein im Portfolio",
          purchases: []
        }
      ],
      incomeLastMonth: 2400,
      expensesLastMonth: 1720,
      incomeBeforeLastMonth: 2100,
      expensesBeforeLastMonth: 1810,
      periodLastMonth: "01.05.2026 – 31.05.2026",
      periodBeforeLastMonth: "01.04.2026 – 30.04.2026",
      debts: [
        { id: "demo-student-loan", name: "Beispiel-Rückzahlung", amount: 1200, startDate: "2027", monthlyRate: 80, note: "Demo-Eintrag für spätere Verbindlichkeit", createdAt: nowISO() }
      ]
    },
    health: {
      schlaf: 6,
      energie: 6,
      beschwerdefreiheit: 7,
      ernaehrung: 6,
      regeneration: 5,
      vitalitaet: 6
    },
    life: {
      arbeitssituation: 5,
      selbstvermarktung: 4,
      wohnen: 6,
      mobilitaet: 5,
      sprachlicheReichweite: 6,
      perspektive: 6
    },
    fitness: {
      note: "Stabiles Profil: moderate Trainingswoche mit Fokus auf Konstanz.",
      benchKg: 55,
      deadliftKg: 70,
      squatKg: 60,
      pullups: 5,
      runKm: 6,
      yogaTarget28: 12,
      trainingTarget28: 10,
      breathTarget28: 12,
      coldTarget28: 8,
      bodyCareTarget28: 20,
      outingTarget28: 12,
      yogaDates: demoDatePattern(56, 5),
      trainingDates: demoDatePattern(56, 6, 1),
      breathDates: demoDatePattern(56, 4),
      coldDates: demoDatePattern(56, 7, 2),
      bodyCareDates: demoDatePattern(56, 3),
      organizationDates: demoDatePattern(56, 8),
      outingDates: demoDatePattern(56, 7)
    },
    emotion: {
      note: "Stabiles Profil: soziale Praxis als bewusste Kontaktmomente.",
      socialTarget28: 14,
      socialBudgetMonthly: 80,
      base: {
        kommunikation: 6,
        konfliktfaehigkeit: 5,
        verletzlichkeit: 5,
        naeheZulassen: 6,
        grenzenSetzen: 6,
        selbstregulation: 7,
        initiative: 5
      },
      socialLog: makeDemoSocialSeries("demo-social", 56, 5)
    },
    mind: {
      note: "Stabiles Profil: Reflexion, Ordnung und bewusste Pausen.",
      weltbild: 6,
      perspektivenfaehigkeit: 6,
      intuition: 5,
      loslassen: 6,
      klarheit: 7,
      meditationTarget28: 12,
      meditationDates: demoDatePattern(56, 5),
      outingTarget28: 12,
      outingDates: demoDatePattern(56, 7),
      orderDetails: { desktop: [today], tabs: [today], files: [today], room: [], lists: [] }
    },
    gaming: {
      weekFrameHours: 8,
      actualHours: 4.5,
      actualEntries: [
        { id: "demo-media-1", date: today, hours: 1.5, createdAt: nowISO() },
        { id: "demo-media-2", date: addDaysISO(today, -1), hours: 1.5, createdAt: nowISO() },
        { id: "demo-media-3", date: addDaysISO(today, -3), hours: 1.5, createdAt: nowISO() }
      ],
      blocks: []
    },
    goals: [
      makeDemoGoal("demo-goal-1", "Public README fertigstellen", 65, 10, 2, today, true),
      makeDemoGoal("demo-goal-2", "Demo-Deployment vorbereiten", 40, 8, 3, addDaysISO(today, -1), true),
      makeDemoGoal("demo-goal-3", "Portfolio-Kaufhistorie planen", 25, 5, 1, addDaysISO(today, -1), true),
      makeDemoGoal("demo-goal-4", "Portfolio-Nachkauf-Flow testen", 35, 5, 5, null, false)
    ]
  };
}

function getWealthyDemoProfile(today) {
  return {
    finance: {
      fiat: 35000,
      portfolioAssets: [
        {
          id: "wealthy-msci-world",
          name: "MSCI World ETF",
          type: "ETF",
          symbol: "IWDA",
          providerSymbol: "IWDA.LON",
          units: 520,
          price: 92.4,
          currency: "USD",
          fxToEUR: 0.92,
          priceSource: "alpha-vantage",
          targetAllocation: 35,
          note: "Langfristiger Core-Anteil",
          purchases: [
            makeDemoPurchase("wealthy-msci-1", addDaysISO(today, -900), 18000, 62),
            makeDemoPurchase("wealthy-msci-2", addDaysISO(today, -360), 12000, 78),
            makeDemoPurchase("wealthy-msci-3", addDaysISO(today, -60), 8000, 90)
          ]
        },
        {
          id: "wealthy-sp500",
          name: "S&P 500 ETF",
          type: "ETF",
          symbol: "VUAA",
          providerSymbol: "VUAA.LON",
          units: 260,
          price: 86.2,
          currency: "USD",
          fxToEUR: 0.92,
          priceSource: "alpha-vantage",
          targetAllocation: 20,
          note: "US-Anteil",
          purchases: [makeDemoPurchase("wealthy-sp500-1", addDaysISO(today, -500), 16000, 70)]
        },
        {
          id: "wealthy-nvidia",
          name: "Nvidia",
          type: "Aktie",
          symbol: "NVDA",
          providerSymbol: "NVDA",
          units: 80,
          price: 120,
          currency: "USD",
          fxToEUR: 0.92,
          priceSource: "alpha-vantage",
          targetAllocation: 8,
          note: "Einzelaktie als Beispiel",
          purchases: [makeDemoPurchase("wealthy-nvda-1", addDaysISO(today, -250), 5000, 70)]
        },
        {
          id: "wealthy-bitcoin",
          name: "Bitcoin",
          type: "Krypto",
          symbol: "BTC",
          units: 0.45,
          price: 95000,
          targetAllocation: 15,
          note: "Krypto-Anteil",
          purchases: [
            makeDemoPurchase("wealthy-btc-1", addDaysISO(today, -1200), 6000, 30000),
            makeDemoPurchase("wealthy-btc-2", addDaysISO(today, -500), 8000, 42000)
          ]
        },
        {
          id: "wealthy-eth",
          name: "Ethereum",
          type: "Krypto",
          symbol: "ETH",
          units: 6,
          price: 3200,
          targetAllocation: 6,
          note: "zweiter Krypto-Baustein",
          purchases: [makeDemoPurchase("wealthy-eth-1", addDaysISO(today, -400), 9000, 1800)]
        },
        {
          id: "wealthy-gold",
          name: "Gold",
          type: "Edelmetall",
          symbol: "XAU",
          units: 8,
          price: 2150,
          currency: "USD",
          fxToEUR: 0.92,
          priceSource: "gold-api",
          targetAllocation: 10,
          note: "Stabilitätsbaustein",
          purchases: [makeDemoPurchase("wealthy-gold-1", addDaysISO(today, -700), 12000, 1500)]
        }
      ],
      incomeLastMonth: 8500,
      expensesLastMonth: 4100,
      incomeBeforeLastMonth: 7800,
      expensesBeforeLastMonth: 3900,
      periodLastMonth: "letzter Monat",
      periodBeforeLastMonth: "vorletzter Monat",
      debts: []
    },
    health: {
      schlaf: 8,
      energie: 8,
      beschwerdefreiheit: 8,
      ernaehrung: 8,
      regeneration: 7,
      vitalitaet: 8
    },
    life: {
      arbeitssituation: 8,
      selbstvermarktung: 8,
      wohnen: 8,
      mobilitaet: 8,
      sprachlicheReichweite: 8,
      perspektive: 9
    },
    fitness: {
      note: "Fortgeschrittenes Profil: hohe Stabilität und gute Erholung.",
      benchKg: 90,
      deadliftKg: 140,
      squatKg: 120,
      pullups: 14,
      runKm: 12,
      yogaTarget28: 16,
      trainingTarget28: 16,
      breathTarget28: 20,
      coldTarget28: 12,
      bodyCareTarget28: 24,
      outingTarget28: 18,
      yogaDates: demoDatePattern(56, 3),
      trainingDates: demoDatePattern(56, 3, 1),
      breathDates: demoDatePattern(56, 2),
      coldDates: demoDatePattern(56, 4, 1),
      bodyCareDates: demoDatePattern(56, 2, 1),
      organizationDates: demoDatePattern(56, 5),
      outingDates: demoDatePattern(56, 4)
    },
    emotion: {
      note: "Fortgeschrittenes Profil: soziale Praxis ist stabil integriert.",
      socialTarget28: 20,
      socialBudgetMonthly: 180,
      base: {
        kommunikation: 8,
        konfliktfaehigkeit: 7,
        verletzlichkeit: 7,
        naeheZulassen: 8,
        grenzenSetzen: 8,
        selbstregulation: 8,
        initiative: 8
      },
      socialLog: makeDemoSocialSeries("wealthy-social", 56, 3)
    },
    mind: {
      note: "Fortgeschrittenes Profil: hohe Klarheit, Perspektive und Ordnung.",
      weltbild: 8,
      perspektivenfaehigkeit: 8,
      intuition: 7,
      loslassen: 8,
      klarheit: 9,
      meditationTarget28: 18,
      meditationDates: demoDatePattern(56, 3),
      outingTarget28: 18,
      outingDates: demoDatePattern(56, 4),
      orderDetails: {
        desktop: demoDatePattern(56, 7),
        tabs: demoDatePattern(56, 7, 1),
        files: demoDatePattern(56, 10),
        room: demoDatePattern(56, 14),
        lists: demoDatePattern(56, 6)
      }
    },
    gaming: {
      weekFrameHours: 5,
      actualHours: 2,
      actualEntries: makeDemoMediaEntries("wealthy-media", 28, 5, 0.75),
      blocks: []
    },
    goals: [
      makeDemoGoal("wealthy-goal-1", "Portfolio-Rebalancing dokumentieren", 88, 6, 1, today, true),
      makeDemoGoal("wealthy-goal-2", "Live-Demo polishen", 82, 5, 2, today, true),
      makeDemoGoal("wealthy-goal-3", "Architekturdiagramm finalisieren", 76, 5, 3, addDaysISO(today, -1), true),
      makeDemoGoal("wealthy-goal-4", "Public-Release-Checkliste finalisieren", 62, 8, 5, addDaysISO(today, -1), true)
    ]
  };
}

function makeDemoGoal(id, name, progress, dailyIncrement, area, lastDone, active = true) {
  return {
    id,
    name,
    start: "0%",
    target: "100%",
    progress,
    dailyIncrement,
    dailyRequiredClicks: 1,
    area,
    endless: false,
    active,
    createdAt: addDaysISO(todayISO(), -14),
    lastDone,
    todayAdds: lastDone === todayISO() ? [{ date: todayISO(), amount: dailyIncrement, createdAt: nowISO() }] : []
  };
}

function getDemoData(profileKey = "stable") {
  const today = todayISO();
  const profileMap = {
    starter: getStarterDemoProfile(today),
    stable: getStableDemoProfile(today),
    wealthy: getWealthyDemoProfile(today)
  };

  const selectedProfile = profileMap[profileKey] || profileMap.stable;
  const demo = mergeDeep(structuredClone(defaultData), mergeDeep(getDemoBaseProfile(), selectedProfile));
  applyDemoProtocolDensity(demo, profileKey);

  demo.settings = demo.settings || {};
  demo.settings.demoMode = true;
  demo.settings.demoProfile = profileKey;
  demo.settings.demoLoadedAt = nowISO();
  demo.settings.lastSavedAt = nowISO();
  demo.settings.saveVersion = SAVE_VERSION;
  return demo;
}

function applyDemoData() {
  const select = document.getElementById("demoProfileSelect");
  const profileKey = select?.value || "";
  const labels = {
    starter: "Aufbau",
    stable: "Stabil",
    wealthy: "Vermögend"
  };
  const profileLabel = labels[profileKey];

  if (!profileLabel) {
    alert("Bitte wähle zuerst ein Demo-Profil aus.");
    select?.focus();
    return;
  }

  const confirmed = confirm(`Demo-Profil „${profileLabel}“ laden? Aktuelle lokale Public-Daten werden ersetzt. Deine private App bleibt unberührt.`);
  if (!confirmed) return;

  createEmergencyBackup("Vor Demo-Daten");
  data = getDemoData(profileKey);
  normalizeDataModel();
  saveData({ skipCloud: true });

  try {
    localStorage.setItem(LAST_ACTIVE_TAB_KEY, "dashboard");
    localStorage.setItem(DEMO_PROFILE_KEY, profileKey);
  } catch {}
  location.reload();
}

function resetPublicDemoData() {
  const confirmed = confirm("Public-Demo wirklich zurücksetzen? Aktuelle lokale Public-Daten werden ersetzt.");
  if (!confirmed) return;

  createEmergencyBackup("Vor Demo-Reset");
  data = structuredClone(defaultData);
  data.settings = data.settings || {};
  data.settings.demoMode = false;
  data.settings.lastSavedAt = nowISO();
  normalizeDataModel();
  saveData({ skipCloud: true });

  try {
    localStorage.setItem(LAST_ACTIVE_TAB_KEY, "dashboard");
    localStorage.removeItem(DEMO_PROFILE_KEY);
  } catch {}
  location.reload();
}

function updateDemoEmptyState() {
  const card = document.getElementById("demoModeCard");
  const hint = document.getElementById("demoEmptyHint");
  const hasDemo = data?.settings?.demoMode === true;

  if (card) {
    card.classList.toggle("demo-empty-state", !hasDemo);
  }
  if (hint) {
    hint.hidden = hasDemo;
  }
}

function setupDemoMode() {
  const select = document.getElementById("demoProfileSelect");
  if (select) {
    const hasDemo = data?.settings?.demoMode === true;
    const savedProfile = hasDemo ? (data?.settings?.demoProfile || localStorage.getItem(DEMO_PROFILE_KEY)) : "";
    if (savedProfile && [...select.options].some(option => option.value === savedProfile)) {
      select.value = savedProfile;
    } else {
      select.value = "";
    }
    select.addEventListener("change", () => {
      try {
        if (select.value) localStorage.setItem(DEMO_PROFILE_KEY, select.value);
        else localStorage.removeItem(DEMO_PROFILE_KEY);
      } catch {}
    });
  }

  updateDemoEmptyState();
  document.getElementById("loadDemoData")?.addEventListener("click", applyDemoData);
  document.getElementById("resetDemoData")?.addEventListener("click", resetPublicDemoData);
}


function setupTabs() {
  document.querySelectorAll(".tab").forEach(tab => {
    tab.addEventListener("click", () => {
      openDashboardTab(tab.dataset.tab, { persist: true, save: true });
    });
  });

  openDashboardTab(getStoredActiveTab(), { persist: true, save: false });
}

function setupNote() {
  const editor = document.getElementById("editor");
  const editor2 = document.getElementById("editor2");
  const lineHeight1 = document.getElementById("lineHeight1");
  const lineHeight2 = document.getElementById("lineHeight2");

  editor.innerHTML = data.noteContent;
  editor2.innerHTML = data.noteContent2;

  lineHeight1.value = data.noteLineHeight || "normal";
  lineHeight2.value = data.noteLineHeight2 || "normal";

  applyLineHeight("editor", lineHeight1.value);
  applyLineHeight("editor2", lineHeight2.value);

  editor.addEventListener("input", saveNotes);
  editor2.addEventListener("input", saveNotes);

  lineHeight1.addEventListener("change", () => {
    applyLineHeight("editor", lineHeight1.value);
    saveNotes();
  });

  lineHeight2.addEventListener("change", () => {
    applyLineHeight("editor2", lineHeight2.value);
    saveNotes();
  });

  document.querySelectorAll("[data-command]").forEach(button => {
    button.addEventListener("click", () => {
      formatText(button.dataset.command, button.dataset.editor);
    });
  });

  document.querySelectorAll("[data-table-editor]").forEach(button => {
    button.addEventListener("click", () => {
      insertTable(button.dataset.tableEditor);
    });
  });

  document.getElementById("applyColorEditor1").addEventListener("click", () => {
    applyColor("editor", "textColor");
  });

  document.getElementById("applyColorEditor2").addEventListener("click", () => {
    applyColor("editor2", "textColor2");
  });

  document.getElementById("toggleNote").addEventListener("click", () => {
    toggleArea("noteArea", "toggleNote");
  });

  document.getElementById("toggleNote2").addEventListener("click", () => {
    toggleArea("noteArea2", "toggleNote2");
  });
}

function toggleArea(areaId, buttonId) {
  const area = document.getElementById(areaId);
  const button = document.getElementById(buttonId);
  const hidden = area.style.display === "none";

  area.style.display = hidden ? "block" : "none";
  button.textContent = hidden ? "Zuklappen" : "Aufklappen";
}


function updateFinancePrivacyUI() {
  const collapsed = Boolean(data.settings?.financeCollapsed);
  const card = document.getElementById("financeDashboardCard");
  const overviewCard = document.getElementById("overviewFinanceCard");
  const overviewValue = document.getElementById("overviewFinance");
  const overviewText = document.getElementById("overviewFinanceText");
  const toggle = document.getElementById("toggleFinancePrivacy");
  const notice = document.getElementById("financePrivacyNotice");

  card?.classList.toggle("finance-collapsed", collapsed);
  overviewCard?.classList.toggle("finance-collapsed", collapsed);

  if (toggle) toggle.textContent = collapsed ? "Ausklappen" : "Einklappen";
  notice?.classList.toggle("hidden", !collapsed);

  if (collapsed) {
    if (overviewValue) overviewValue.textContent = "Ausgeblendet";
    if (overviewText) overviewText.textContent = "Private Finanzdaten";
  }
}

function setupFinancePrivacy() {
  const toggle = document.getElementById("toggleFinancePrivacy");
  if (!toggle) return;

  toggle.addEventListener("click", () => {
    data.settings = data.settings || {};
    data.settings.financeCollapsed = !Boolean(data.settings.financeCollapsed);
    saveData();
    calculateFinance();
    updateFinancePrivacyUI();
  });

  updateFinancePrivacyUI();
}


function setupFinance() {
  setupFinancePrivacy();

  const numberFields = [
    "fiat",
    "incomeLastMonth",
    "expensesLastMonth",
    "incomeBeforeLastMonth",
    "expensesBeforeLastMonth"
  ];

  const textFields = [
    "periodLastMonth",
    "periodBeforeLastMonth"
  ];

  numberFields.forEach(field => {
    const input = document.getElementById(field);
    if (!input) return;
    input.value = data.finance[field];

    input.addEventListener("input", () => {
      data.finance[field] = Number(input.value || 0);
      saveData();
      calculateFinance();
      updateFinanceFormattedPreview();
      updateAttraction();
    });
  });

  textFields.forEach(field => {
    const input = document.getElementById(field);
    if (!input) return;
    input.value = data.finance[field] || "";

    input.addEventListener("input", () => {
      data.finance[field] = input.value;
      saveData();
    });
  });

  document.getElementById("addIncome").addEventListener("click", () => addIncomeFromInput("incomeInput"));
  document.getElementById("subtractExpense").addEventListener("click", () => subtractExpenseFromInput("expenseInput"));
  document.getElementById("addPortfolioAsset")?.addEventListener("click", addPortfolioAssetFromForm);
  document.getElementById("openPortfolioPurchaseAdd")?.addEventListener("click", () => openPortfolioPurchaseAddModal());
  document.getElementById("cancelPortfolioAssetEdit")?.addEventListener("click", clearPortfolioAssetForm);
  document.getElementById("openEditingAssetHistory")?.addEventListener("click", () => {
    const editingId = document.getElementById("assetEditingId")?.value;
    if (editingId) openPortfolioPurchaseEditor(editingId);
  });
  document.getElementById("refreshAssetFx")?.addEventListener("click", () => {
    const currency = document.getElementById("assetCurrency")?.value || "EUR";
    updateAssetFxFieldForCurrency(currency, { useCache: false, toast: true });
  });
  document.getElementById("assetPreset")?.addEventListener("change", event => applyAssetPreset(event.target.value));
  document.getElementById("assetCurrency")?.addEventListener("change", event => {
    updateAssetFxFieldForCurrency(event.target.value, { useCache: true, toast: false });
  });

  setupMarketDataConfig();

  document.getElementById("checkFinanceToday").addEventListener("click", () => {
    data.finance.financeCheckedAt = nowISO();
    saveData();
    updateFinanceCheckStatus();
    showToast("✓ Finanzdaten heute geprüft");
  });

  document.getElementById("uncheckFinanceToday").addEventListener("click", () => {
    data.finance.financeCheckedAt = null;
    saveData();
    updateFinanceCheckStatus();
    showToast("Haken entfernt");
  });

  setupDebts();
  calculateFinance();
  updateFinanceFormattedPreview();
  updateFinanceCheckStatus();
}

function setupDebts() {
  document.getElementById("addDebt").addEventListener("click", () => {
    const name = document.getElementById("debtName").value.trim();
    const amount = Number(document.getElementById("debtAmount").value || 0);
    const startDate = document.getElementById("debtStartDate").value.trim();
    const monthlyRate = Number(document.getElementById("debtMonthlyRate").value || 0);
    const note = document.getElementById("debtNote").value.trim();

    if (!name) {
      alert("Bitte einen Namen eintragen, z. B. BAföG.");
      return;
    }

    data.finance.debts.push({
      id: crypto.randomUUID(),
      name,
      amount,
      startDate,
      monthlyRate,
      note,
      createdAt: nowISO()
    });

    document.getElementById("debtName").value = "";
    document.getElementById("debtAmount").value = "";
    document.getElementById("debtStartDate").value = "";
    document.getElementById("debtMonthlyRate").value = "";
    document.getElementById("debtNote").value = "";

    saveData();
    renderDebts();
    showToast(`Rückzahlung vorgemerkt: ${name}`);
  });

  renderDebts();
}

function renderDebts() {
  const container = document.getElementById("debtList");
  container.innerHTML = "";

  if (!data.finance.debts || !data.finance.debts.length) {
    container.innerHTML = "<p class='hint'>Noch keine Rückzahlungen vorgemerkt.</p>";
    return;
  }

  data.finance.debts.forEach(debt => {
    const entry = document.createElement("div");
    entry.className = "debt-entry";

    const countdown = getDebtCountdownText(debt.startDate);
    const rateText = debt.monthlyRate ? `${money.format(debt.monthlyRate)} / Monat` : "keine Rate eingetragen";

    entry.innerHTML = `
      <h4>${escapeHTML(debt.name)}</h4>
      <p>Restbetrag: <strong>${money.format(Number(debt.amount || 0))}</strong></p>
      <p>Start/Fällig ab: <strong>${escapeHTML(debt.startDate || "nicht eingetragen")}</strong></p>
      <p>Countdown: <strong>${escapeHTML(countdown)}</strong></p>
      <p>Vorgemerkte Rate: <strong>${rateText}</strong></p>
      ${debt.note ? `<p class="hint">${escapeHTML(debt.note)}</p>` : ""}
      <div class="debt-actions">
        <input type="number" step="0.01" placeholder="Rückzahlung €" data-debt-payment="${debt.id}" />
        <button data-debt-pay="${debt.id}">Abziehen</button>
        <button data-debt-edit="${debt.id}">Bearbeiten</button>
        <button data-debt-delete="${debt.id}">Löschen</button>
      </div>
    `;

    container.appendChild(entry);
  });

  container.querySelectorAll("[data-debt-pay]").forEach(button => {
    button.addEventListener("click", () => {
      const id = button.dataset.debtPay;
      const input = container.querySelector(`[data-debt-payment="${id}"]`);
      const amount = Number(input.value || 0);

      if (!amount) return;

      const debt = data.finance.debts.find(item => item.id === id);
      if (!debt) return;

      debt.amount = Number(debt.amount || 0) - amount;
      input.value = "";

      saveData();
      renderDebts();
      showToast(`${money.format(amount)} bei ${debt.name} abgezogen`);
    });
  });

  container.querySelectorAll("[data-debt-edit]").forEach(button => {
    button.addEventListener("click", () => {
      const debt = data.finance.debts.find(item => item.id === button.dataset.debtEdit);
      if (!debt) return;

      const newName = prompt("Name", debt.name);
      if (newName === null) return;

      const newAmount = prompt("Restbetrag €", debt.amount);
      if (newAmount === null) return;

      const newStartDate = prompt("Start/Fällig ab", debt.startDate || "");
      if (newStartDate === null) return;

      const newMonthlyRate = prompt("Monatliche Rate €", debt.monthlyRate || 0);
      if (newMonthlyRate === null) return;

      const newNote = prompt("Notiz", debt.note || "");
      if (newNote === null) return;

      debt.name = newName.trim() || debt.name;
      debt.amount = Number(newAmount || 0);
      debt.startDate = newStartDate.trim();
      debt.monthlyRate = Number(newMonthlyRate || 0);
      debt.note = newNote.trim();

      saveData();
      renderDebts();
      showToast(`Rückzahlung aktualisiert: ${debt.name}`);
    });
  });

  container.querySelectorAll("[data-debt-delete]").forEach(button => {
    button.addEventListener("click", () => {
      const debt = data.finance.debts.find(item => item.id === button.dataset.debtDelete);
      if (!debt) return;

      const confirmed = confirm(`"${debt.name}" wirklich löschen?`);
      if (!confirmed) return;

      data.finance.debts = data.finance.debts.filter(item => item.id !== debt.id);

      saveData();
      renderDebts();
      showToast(`Rückzahlung gelöscht: ${debt.name}`);
    });
  });
}

function getDebtCountdownText(value) {
  if (!value) return "kein Datum eingetragen";

  const parsed = parseDebtDate(value);
  if (!parsed) return "Datum frei notiert";

  const today = new Date();
  const diffMs = parsed.getTime() - today.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays > 0) {
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);

    if (years > 0) return `noch ca. ${years} J. ${months} Mon.`;
    if (months > 0) return `noch ca. ${months} Monate`;
    return `noch ${diffDays} Tage`;
  }

  if (diffDays === 0) return "heute erreicht";
  return `seit ${Math.abs(diffDays)} Tagen erreicht`;
}

function parseDebtDate(value) {
  const text = String(value).trim();

  if (/^\d{4}$/.test(text)) {
    return new Date(Number(text), 0, 1);
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) {
    return new Date(text + "T00:00:00");
  }

  const germanDate = text.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
  if (germanDate) {
    const day = Number(germanDate[1]);
    const month = Number(germanDate[2]) - 1;
    const year = Number(germanDate[3]);
    return new Date(year, month, day);
  }

  return null;
}

function addIncomeFromInput(inputId) {
  const input = document.getElementById(inputId);
  const amount = Number(input.value || 0);

  data.finance.fiat = Number(data.finance.fiat || 0) + amount;
  document.getElementById("fiat").value = data.finance.fiat.toFixed(2);
  input.value = "";

  saveData();
  calculateFinance();
  updateFinanceFormattedPreview();
  updateAttraction();

  if (amount) showToast(`+ ${money.format(amount)} hinzugefügt`);
}

function subtractExpenseFromInput(inputId) {
  const input = document.getElementById(inputId);
  const amount = Number(input.value || 0);

  data.finance.fiat = Number(data.finance.fiat || 0) - amount;
  document.getElementById("fiat").value = data.finance.fiat.toFixed(2);
  input.value = "";

  saveData();
  calculateFinance();
  updateFinanceFormattedPreview();
  updateAttraction();

  if (amount) showToast(`− ${money.format(amount)} abgezogen`);
}

function getBlockedMonthlyOutflow() {
  const last = Number(data.finance.expensesLastMonth || 0);
  const before = Number(data.finance.expensesBeforeLastMonth || 0);

  if (last && before) return (last + before) / 2;
  if (last) return last;
  if (before) return before;

  return 0;
}

const portfolioAssetPresets = {
  "msci-world": { name: "MSCI World ETF", type: "ETF", symbol: "IWDA", providerSymbol: "IWDA.LON", currency: "USD", fxToEUR: 0.92, priceSource: "alpha-vantage", note: "Breiter Aktienmarkt als Beispiel-ETF" },
  "sp500": { name: "S&P 500 ETF", type: "ETF", symbol: "VUAA", providerSymbol: "VUAA.LON", currency: "USD", fxToEUR: 0.92, priceSource: "alpha-vantage", note: "US-Aktienmarkt als Beispiel-ETF" },
  "nasdaq100": { name: "Nasdaq 100 ETF", type: "ETF", symbol: "EQAC", providerSymbol: "EQAC.DE", currency: "EUR", fxToEUR: 1, priceSource: "alpha-vantage", note: "Technologieorientierter Beispiel-ETF" },
  apple: { name: "Apple", type: "Aktie", symbol: "AAPL", providerSymbol: "AAPL", currency: "USD", fxToEUR: 0.92, priceSource: "alpha-vantage", note: "Beispiel-Aktie" },
  microsoft: { name: "Microsoft", type: "Aktie", symbol: "MSFT", providerSymbol: "MSFT", currency: "USD", fxToEUR: 0.92, priceSource: "alpha-vantage", note: "Beispiel-Aktie" },
  nvidia: { name: "Nvidia", type: "Aktie", symbol: "NVDA", providerSymbol: "NVDA", currency: "USD", fxToEUR: 0.92, priceSource: "alpha-vantage", note: "Beispiel-Aktie" },
  amazon: { name: "Amazon", type: "Aktie", symbol: "AMZN", providerSymbol: "AMZN", currency: "USD", fxToEUR: 0.92, priceSource: "alpha-vantage", note: "Beispiel-Aktie" },
  alphabet: { name: "Alphabet", type: "Aktie", symbol: "GOOGL", providerSymbol: "GOOGL", currency: "USD", fxToEUR: 0.92, priceSource: "alpha-vantage", note: "Beispiel-Aktie" },
  bitcoin: { name: "Bitcoin", type: "Krypto", symbol: "BTC", priceSource: "coinbase", note: "Krypto als optionale Portfolio-Komponente" },
  ethereum: { name: "Ethereum", type: "Krypto", symbol: "ETH", priceSource: "coinbase", note: "Smart-Contract-Krypto als Beispiel" },
  solana: { name: "Solana", type: "Krypto", symbol: "SOL", priceSource: "coinbase", note: "Krypto-Beispiel mit höherem Risiko" },
  gold: { name: "Gold", type: "Edelmetall", symbol: "XAU", currency: "USD", fxToEUR: 0.92, priceSource: "gold-api", note: "Edelmetall als Stabilitätsbaustein" },
  silver: { name: "Silber", type: "Edelmetall", symbol: "XAG", currency: "USD", fxToEUR: 0.92, priceSource: "gold-api", note: "Edelmetall als Beispiel-Asset" },
  "cash-eur": { name: "EUR Cash-Reserve", type: "Cash", symbol: "EUR", units: 1, price: 1000, note: "Liquiditätsbaustein" },
  manual: { name: "", type: "Sonstiges", symbol: "", note: "" }
};

function applyAssetPreset(presetKey) {
  const preset = portfolioAssetPresets[presetKey];
  if (!preset) return;

  const fields = {
    assetName: preset.name || "",
    assetType: preset.type || "Sonstiges",
    assetSymbol: preset.symbol || "",
    assetProviderSymbol: preset.providerSymbol || preset.symbol || "",
    assetUnits: preset.units ?? "",
    assetPrice: preset.price ?? "",
    assetCurrency: preset.currency || "EUR",
    assetFxToEUR: preset.fxToEUR ?? getDefaultFxToEUR(preset.currency || "EUR"),
    assetNote: preset.note || ""
  };

  Object.entries(fields).forEach(([id, value]) => {
    const el = document.getElementById(id);
    if (el) el.value = value;
  });

  updateAssetFxFieldForCurrency(fields.assetCurrency, { useCache: true, toast: false });
}

function getPortfolioAssets() {
  if (!Array.isArray(data.finance.portfolioAssets)) data.finance.portfolioAssets = [];
  data.finance.portfolioAssets = data.finance.portfolioAssets.map(asset => {
    const purchases = Array.isArray(asset.purchases) ? asset.purchases : [];
    return {
      id: asset.id || crypto.randomUUID(),
      name: asset.name || "",
      type: asset.type || "Sonstiges",
      symbol: asset.symbol || "",
      providerSymbol: asset.providerSymbol || asset.marketSymbol || asset.symbol || "",
      units: Number(asset.units || 0),
      price: Number(asset.price || 0),
      currency: normalizeCurrency(asset.currency || asset.priceCurrency || "EUR"),
      fxToEUR: getFxToEUR(asset.currency || asset.priceCurrency || "EUR", asset.fxToEUR),
      targetAllocation: Number(asset.targetAllocation || 0),
      note: asset.note || "",
      lastPriceUpdatedAt: asset.lastPriceUpdatedAt || null,
      lastManualPriceAt: asset.lastManualPriceAt || null,
priceSource: (!asset.priceSource || asset.priceSource === "manual")
        ? getDefaultAssetPriceSource(asset)
        : asset.priceSource,
      purchases: purchases.map(purchase => ({
        id: purchase.id || crypto.randomUUID(),
        date: purchase.date || todayISO(),
        investedAmount: Number(purchase.investedAmount || 0),
        currency: normalizeCurrency(purchase.currency || purchase.investedCurrency || "EUR"),
        fxToEUR: getFxToEUR(purchase.currency || purchase.investedCurrency || "EUR", purchase.fxToEUR),
        price: Number(purchase.price || 0),
        priceCurrency: normalizeCurrency(purchase.priceCurrency || purchase.currency || "EUR"),
        priceFxToEUR: getFxToEUR(purchase.priceCurrency || purchase.currency || "EUR", purchase.priceFxToEUR),
        units: Number(purchase.units || 0),
        note: purchase.note || ""
      }))
    };
  });
  return data.finance.portfolioAssets;
}

function getAssetValue(asset) {
  return Number(asset.units || 0) * Number(asset.price || 0) * getFxToEUR(asset.currency || "EUR", asset.fxToEUR);
}

function getAssetOriginalValue(asset) {
  return Number(asset.units || 0) * Number(asset.price || 0);
}

function getAssetInvested(asset) {
  const purchases = Array.isArray(asset.purchases) ? asset.purchases : [];
  return purchases.reduce((sum, purchase) => {
    return sum + Number(purchase.investedAmount || 0) * getFxToEUR(purchase.currency || "EUR", purchase.fxToEUR);
  }, 0);
}

function getAssetPurchaseUnits(asset) {
  return (asset.purchases || []).reduce((sum, purchase) => sum + Number(purchase.units || 0), 0);
}

function getAssetAverageBuyPrice(asset) {
  const units = getAssetPurchaseUnits(asset);
  const invested = getAssetInvested(asset);
  return units ? invested / units : 0;
}

function getPortfolioInvested() {
  return getPortfolioAssets().reduce((sum, asset) => sum + getAssetInvested(asset), 0);
}

function getPortfolioValue() {
  return getPortfolioAssets().reduce((sum, asset) => sum + getAssetValue(asset), 0);
}

function getPortfolioTypeTotals() {
  const totals = {};
  getPortfolioAssets().forEach(asset => {
    const type = asset.type || "Sonstiges";
    totals[type] = (totals[type] || 0) + getAssetValue(asset);
  });
  return totals;
}

function getPortfolioCompassText(portfolioValue) {
  const assets = getPortfolioAssets();
  if (!assets.length || !portfolioValue) return "noch keine Assets";
  const types = Object.keys(getPortfolioTypeTotals()).filter(type => getPortfolioTypeTotals()[type] > 0);
  if (types.length <= 1) return "fokussiert / wenig diversifiziert";
  if (types.length <= 3) return "moderat diversifiziert";
  return "breit diversifiziert";
}

function getDefaultAssetPriceSource(asset = {}) {
  const type = asset.type || "Sonstiges";
  const symbol = String(asset.symbol || "").toUpperCase();
  const providerSymbol = String(asset.providerSymbol || asset.marketSymbol || symbol).toUpperCase();
  if (type === "Krypto" && ["BTC", "ETH", "SOL"].includes(symbol)) return "coinbase";
  if (type === "Edelmetall" && ["XAU", "XAG"].includes(symbol)) return "gold-api";
  if (["Aktie", "ETF"].includes(type) && providerSymbol) return "alpha-vantage";
  if (type === "Cash" && symbol === "EUR") return "fixed-eur";
  return "manual";
}

function getAssetPriceSourceLabel(asset = {}) {
  const source = asset.priceSource || getDefaultAssetPriceSource(asset);
  if (source === "coinbase") return "Coinbase EUR";
  if (source === "gold-api") return "Gold API USD";
  if (source === "alpha-vantage") return "Alpha Vantage";
  if (source === "fixed-eur") return "Fixwert EUR";
  return "manuell";
}

function getAssetQuoteSourceHint(asset = {}) {
  const source = asset.priceSource || getDefaultAssetPriceSource(asset);
  const symbol = asset.providerSymbol || asset.symbol || "kein Symbol";

  if (source === "coinbase") {
    return `Quelle: Coinbase Exchange Rates · Symbol: ${symbol} · Kurs wird in EUR geladen.`;
  }

  if (source === "gold-api") {
    return `Quelle: Gold API · Symbol: ${symbol} · Kurs wird in USD geladen und über das FX-Feld nach EUR umgerechnet.`;
  }

  if (source === "alpha-vantage") {
    return `Quelle: Alpha Vantage Global Quote · Symbol: ${symbol} · Aktien/ETF-Kurse können je nach Börsenplatz, Symbol, Handelsplatz und Verzögerung leicht abweichen. API-Key erforderlich. Manuelle Korrektur bleibt möglich.`;
  }

  if (source === "fixed-eur") {
    return "Fixwert in EUR · keine Kursaktualisierung nötig.";
  }

  return "Keine automatische Kursquelle · Preis bitte manuell pflegen.";
}

function getAssetRefreshButtonLabel(asset = {}) {
  const source = asset.priceSource || getDefaultAssetPriceSource(asset);

  if (source === "alpha-vantage" && !getAlphaVantageKey()) return "API-Key nötig";
  if (canAutoRefreshAsset(asset)) return "Kurs aktualisieren";
  return "Keine Autoquelle";
}

function showQuoteSourceNotice(asset = {}) {
  const source = asset.priceSource || getDefaultAssetPriceSource(asset);
  if (source !== "alpha-vantage") return true;

  const message = [
    "Hinweis zu Aktien-/ETF-Kursen:",
    "",
    "Die Aktualisierung nutzt Alpha Vantage Global Quote.",
    "Je nach Börsenplatz, ETF-Symbol, Handelsplatz, Währung und Datenverzögerung kann der Kurs leicht von deinem Broker abweichen.",
    "",
    "Du kannst den Preis danach weiterhin manuell korrigieren.",
    "",
    "Jetzt Kurs aktualisieren?"
  ].join("\\n");

  return confirm(message);
}


function canAutoRefreshAsset(asset = {}) {
  return ["coinbase", "gold-api", "alpha-vantage"].includes(asset.priceSource || getDefaultAssetPriceSource(asset));
}



function getAlphaVantageKey() {
  try {
    return localStorage.getItem(ALPHA_VANTAGE_KEY_STORAGE) || "";
  } catch {
    return "";
  }
}

function setAlphaVantageKey(value) {
  try {
    if (value) localStorage.setItem(ALPHA_VANTAGE_KEY_STORAGE, value.trim());
    else localStorage.removeItem(ALPHA_VANTAGE_KEY_STORAGE);
  } catch {}
  updateMarketDataKeyStatus();
}

function updateMarketDataKeyStatus() {
  const status = document.getElementById("alphaVantageKeyStatus");
  const input = document.getElementById("alphaVantageApiKey");
  const key = getAlphaVantageKey();
  if (input && key) input.value = "";
  if (status) status.textContent = key ? "API-Key lokal gespeichert." : "Kein API-Key gespeichert.";
}

function setupMarketDataConfig() {
  document.getElementById("saveAlphaVantageKey")?.addEventListener("click", () => {
    const value = document.getElementById("alphaVantageApiKey")?.value || "";
    if (!value.trim()) {
      showToast("Bitte API-Key eintragen");
      return;
    }
    setAlphaVantageKey(value);
    showToast("Alpha-Vantage-Key lokal gespeichert");
  });

  document.getElementById("clearAlphaVantageKey")?.addEventListener("click", () => {
    setAlphaVantageKey("");
    const input = document.getElementById("alphaVantageApiKey");
    if (input) input.value = "";
    showToast("Alpha-Vantage-Key gelöscht");
  });

  updateMarketDataKeyStatus();
}

async function loadAlphaVantageQuote(providerSymbol) {
  let apiKey = getAlphaVantageKey();

  if (!apiKey) {
    const entered = prompt("Für Aktien/ETFs wird ein Alpha-Vantage-API-Key benötigt. API-Key eingeben:");
    if (!entered) throw new Error("Kein Alpha-Vantage-API-Key hinterlegt.");
    setAlphaVantageKey(entered);
    apiKey = entered.trim();
  }

  const symbol = encodeURIComponent(providerSymbol);
  const response = await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${encodeURIComponent(apiKey)}`);
  if (!response.ok) throw new Error("Alpha-Vantage-Kurs konnte nicht geladen werden.");

  const result = await response.json();
  const quote = result?.["Global Quote"];
  const price = Number(quote?.["05. price"]);

  if (!price || Number.isNaN(price)) {
    const info = result?.Information || result?.Note || "Kein Kurs im Alpha-Vantage-Ergebnis gefunden.";
    throw new Error(info);
  }

  return price;
}

async function loadMetalPriceUSD(symbol) {
  const normalized = String(symbol || "").toUpperCase();
  if (!["XAU", "XAG"].includes(normalized)) throw new Error(`${normalized}-Kursquelle nicht unterstützt.`);

  const response = await fetch(`https://api.gold-api.com/price/${normalized}`);
  if (!response.ok) throw new Error(`${normalized}-Kurs konnte nicht geladen werden.`);

  const result = await response.json();
  const price = Number(result?.price);

  if (!price || Number.isNaN(price)) throw new Error(`Kein USD-Kurs für ${normalized} gefunden.`);

  return price;
}

async function refreshPortfolioAssetPrice(assetId) {
  const asset = getPortfolioAssets().find(item => item.id === assetId);
  if (!asset) return;

  if (!canAutoRefreshAsset(asset)) {
    showToast(`${asset.name || "Asset"}: automatische Kursquelle noch nicht verfügbar`);
    alert("Für dieses Asset ist aktuell noch keine automatische Kursquelle eingebaut. Kurs bitte manuell bearbeiten.");
    return;
  }

  const symbol = String(asset.symbol || "").toUpperCase();
  if (!symbol) {
    showToast("Kein Symbol hinterlegt");
    return;
  }

  try {
    const source = asset.priceSource || getDefaultAssetPriceSource(asset);
    if (!showQuoteSourceNotice(asset)) return;
    showToast(`${symbol}-Kurs wird geladen…`);

    if (source === "coinbase") {
      const price = await loadCoinPrice(symbol);
      asset.price = roundTwo(price);
      asset.currency = "EUR";
      asset.fxToEUR = 1;
      asset.priceSource = "coinbase";
    } else if (source === "gold-api") {
      const price = await loadMetalPriceUSD(symbol);
      asset.price = roundTwo(price);
      asset.currency = "USD";
      asset.fxToEUR = (await loadCurrentFxToEUR("USD").catch(() => ({ rate: getDefaultFxToEUR("USD") }))).rate;
      asset.priceSource = "gold-api";
    } else if (source === "alpha-vantage") {
      const providerSymbol = asset.providerSymbol || asset.symbol;
      const price = await loadAlphaVantageQuote(providerSymbol);
      asset.price = roundTwo(price);
      asset.currency = asset.currency || "USD";
      asset.fxToEUR = (await loadCurrentFxToEUR(asset.currency || "USD").catch(() => ({ rate: getFxToEUR(asset.currency || "USD", asset.fxToEUR) }))).rate;
      asset.providerSymbol = providerSymbol;
      asset.priceSource = "alpha-vantage";
    } else {
      throw new Error("Keine unterstützte Kursquelle");
    }

    asset.lastPriceUpdatedAt = nowISO();

    saveData();
    calculateFinance();
    updateAttraction();

    showToast(`${symbol}-Kurs aktualisiert: ${formatCurrencyValue(asset.price, asset.currency)}`);
  } catch (error) {
    console.warn("Asset-Kurs konnte nicht geladen werden", error);
    showToast(`${symbol}-Kurs konnte nicht geladen werden`);
    alert(`${symbol}-Kurs konnte nicht automatisch geladen werden. Prüfe ggf. API-Key, Kurs-Symbol oder Datenlimit. Du kannst den Preis weiterhin manuell setzen.`);
  }
}


function renderPortfolioAssets() {
  const container = document.getElementById("portfolioAssetList");
  if (!container) return;
  const assets = getPortfolioAssets();

  if (!assets.length) {
    container.innerHTML = "<p class='hint'>Noch keine Assets angelegt. Füge z. B. einen ETF, eine Aktie, Bitcoin oder Gold hinzu.</p>";
    return;
  }

  const portfolioValue = getPortfolioValue() || 1;
  container.innerHTML = "";

  assets.forEach(asset => {
    const value = getAssetValue(asset);
    const invested = getAssetInvested(asset);
    const profit = invested ? value - invested : 0;
    const averageBuy = getAssetAverageBuyPrice(asset);
    const allocation = (value / portfolioValue) * 100;
    const target = Number(asset.targetAllocation || 0);
    const deviation = target ? allocation - target : 0;

    const entry = document.createElement("div");
    entry.className = "portfolio-asset-entry";
    entry.innerHTML = `
      <div>
        <strong>${escapeHTML(asset.name || "Unbenanntes Asset")}</strong>
        <small>${escapeHTML(asset.type || "Sonstiges")}${asset.symbol ? " · " + escapeHTML(asset.symbol) : ""}</small>
        ${asset.note ? `<small>${escapeHTML(asset.note)}</small>` : ""}
        <small class="quote-source-line" title="${escapeHTML(getAssetQuoteSourceHint(asset))}">Kursquelle: ${escapeHTML(getAssetPriceSourceLabel(asset))}${getDefaultAssetPriceSource(asset) === "alpha-vantage" && !getAlphaVantageKey() ? " · API-Key nötig" : canAutoRefreshAsset(asset) ? " · Update möglich" : " · manuell"}</small>
        ${asset.providerSymbol && asset.providerSymbol !== asset.symbol ? `<small>Kurs-Symbol: ${escapeHTML(asset.providerSymbol)}</small>` : ""}
        <small class="quote-source-hint">${escapeHTML(getAssetQuoteSourceHint(asset))}</small>
        ${asset.lastPriceUpdatedAt ? `<small>Kurs aktualisiert: ${formatDateTimeDE(asset.lastPriceUpdatedAt)}</small>` : asset.lastManualPriceAt ? `<small>Preis manuell gesetzt: ${formatDateTimeDE(asset.lastManualPriceAt)}</small>` : ""}
      </div>
      <div>
        <strong>${money.format(value)}</strong>
        <small>${roundOne(allocation)}% aktuell${target ? ` · Ziel ${roundOne(target)}% · Abw. ${deviation > 0 ? "+" : ""}${roundOne(deviation)}%` : ""}</small>
        <small>${roundOne(asset.units)} × ${formatCurrencyValue(Number(asset.price || 0), asset.currency || "EUR")}${asset.currency !== "EUR" ? ` · Wert in EUR ${money.format(value)}` : ""}</small>
        <small>Investiert: ${invested ? money.format(invested) : "–"}${invested ? ` · P/L ${profit >= 0 ? "+" : ""}${money.format(profit)}` : ""}</small>
        ${averageBuy ? `<small>Ø Kaufpreis: ${money.format(averageBuy)} / Einheit</small>` : ""}
      </div>
      <div class="portfolio-asset-actions">
        <button type="button" data-edit-asset="${asset.id}" class="small-btn">Bearbeiten</button>
        <button type="button" data-buy-asset="${asset.id}" class="small-btn">Kauf hinzufügen</button>
        <button type="button" data-history-asset="${asset.id}" class="small-btn">Historie bearbeiten</button>
        <button type="button" data-refresh-asset="${asset.id}" class="small-btn" title="${escapeHTML(getAssetQuoteSourceHint(asset))}">${getAssetRefreshButtonLabel(asset)}</button>
        <button type="button" data-manual-price-asset="${asset.id}" class="small-btn">Preis manuell</button>
        <button type="button" data-remove-asset="${asset.id}" class="small-btn">Entfernen</button>
      </div>
    `;
    container.appendChild(entry);
  });

  container.querySelectorAll("[data-remove-asset]").forEach(button => {
    button.addEventListener("click", () => {
      data.finance.portfolioAssets = getPortfolioAssets().filter(asset => asset.id !== button.dataset.removeAsset);
      saveData();
      calculateFinance();
      updateAttraction();
      showToast("Asset entfernt");
    });
  });

  container.querySelectorAll("[data-edit-asset]").forEach(button => {
    button.addEventListener("click", () => startEditPortfolioAsset(button.dataset.editAsset));
  });

  container.querySelectorAll("[data-buy-asset]").forEach(button => {
    button.addEventListener("click", () => addPortfolioPurchase(button.dataset.buyAsset));
  });

  container.querySelectorAll("[data-history-asset]").forEach(button => {
    button.addEventListener("click", () => openPortfolioPurchaseEditor(button.dataset.historyAsset));
  });

  container.querySelectorAll("[data-manual-price-asset]").forEach(button => {
    button.addEventListener("click", () => setManualAssetPrice(button.dataset.manualPriceAsset));
  });

  container.querySelectorAll("[data-refresh-asset]").forEach(button => {
    button.addEventListener("click", () => refreshPortfolioAssetPrice(button.dataset.refreshAsset));
  });
}

function setPortfolioFormMode(editing = false) {
  const button = document.getElementById("addPortfolioAsset");
  const cancel = document.getElementById("cancelPortfolioAssetEdit");
  const history = document.getElementById("openEditingAssetHistory");
  if (button) button.textContent = editing ? "Änderungen speichern" : "Asset hinzufügen";
  cancel?.classList.toggle("hidden", !editing);
  history?.classList.toggle("hidden", !editing);
}

function clearPortfolioAssetForm() {
  ["assetEditingId", "assetName", "assetSymbol", "assetProviderSymbol", "assetUnits", "assetPrice", "assetFxToEUR", "assetTargetAllocation", "assetNote"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });
  const type = document.getElementById("assetType");
  if (type) type.value = "ETF";
  const currency = document.getElementById("assetCurrency");
  if (currency) currency.value = "EUR";
  const preset = document.getElementById("assetPreset");
  if (preset) preset.value = "";
  setPortfolioFormMode(false);
}

function startEditPortfolioAsset(assetId) {
  const asset = getPortfolioAssets().find(item => item.id === assetId);
  if (!asset) return;

  document.getElementById("assetEditingId").value = asset.id;
  document.getElementById("assetName").value = asset.name || "";
  document.getElementById("assetType").value = asset.type || "Sonstiges";
  document.getElementById("assetSymbol").value = asset.symbol || "";
  document.getElementById("assetProviderSymbol").value = asset.providerSymbol || asset.symbol || "";
  document.getElementById("assetUnits").value = asset.units || "";
  document.getElementById("assetPrice").value = asset.price || "";
  document.getElementById("assetCurrency").value = asset.currency || "EUR";
  document.getElementById("assetFxToEUR").value = asset.fxToEUR || getDefaultFxToEUR(asset.currency || "EUR");
  document.getElementById("assetTargetAllocation").value = asset.targetAllocation || "";
  document.getElementById("assetNote").value = asset.note || "";
  setPortfolioFormMode(true);
  document.getElementById("assetName")?.focus();
}

function addPortfolioAssetFromForm() {
  const editingId = document.getElementById("assetEditingId")?.value || "";
  const name = document.getElementById("assetName")?.value.trim();
  const type = document.getElementById("assetType")?.value || "Sonstiges";
  const symbol = document.getElementById("assetSymbol")?.value.trim();
  const providerSymbol = document.getElementById("assetProviderSymbol")?.value.trim() || symbol;
  const units = Number(document.getElementById("assetUnits")?.value || 0);
  const price = Number(document.getElementById("assetPrice")?.value || 0);
  const currency = normalizeCurrency(document.getElementById("assetCurrency")?.value || "EUR");
  const fxToEUR = getFxToEUR(currency, document.getElementById("assetFxToEUR")?.value);
  const targetAllocation = Number(document.getElementById("assetTargetAllocation")?.value || 0);
  const note = document.getElementById("assetNote")?.value.trim();

  if (!name) {
    alert("Bitte einen Asset-Namen eintragen.");
    return;
  }

  if (editingId) {
    const asset = getPortfolioAssets().find(item => item.id === editingId);
    if (!asset) return;
    Object.assign(asset, { name, type, symbol, providerSymbol, units, price, currency, fxToEUR, targetAllocation, note, priceSource: getDefaultAssetPriceSource({ type, symbol, providerSymbol }) });
    showToast(`Asset aktualisiert: ${name}`);
  } else {
    getPortfolioAssets().push({
      id: crypto.randomUUID(),
      name,
      type,
      symbol,
      providerSymbol,
      units,
      price,
      currency,
      fxToEUR,
      targetAllocation,
      note,
      lastPriceUpdatedAt: null,
      priceSource: getDefaultAssetPriceSource({ type, symbol }),
      purchases: []
    });
    showToast(`Asset hinzugefügt: ${name}`);
  }

  clearPortfolioAssetForm();
  saveData();
  calculateFinance();
  updateAttraction();
}


function setManualAssetPrice(assetId) {
  const asset = getPortfolioAssets().find(item => item.id === assetId);
  if (!asset) return;

  const priceRaw = prompt(`Neuer Preis je Einheit für ${asset.name}`, asset.price || "");
  if (priceRaw === null) return;
  const price = Number(String(priceRaw).replace(",", ".") || 0);
  if (!price) return;

  const currency = normalizeCurrency(prompt("Preiswährung: EUR, USD, CHF oder GBP", asset.currency || "EUR") || asset.currency || "EUR");
  const fxToEUR = getFxToEUR(currency, prompt(`Umrechnung ${currency} → EUR`, asset.fxToEUR || getDefaultFxToEUR(currency)));

  asset.price = price;
  asset.currency = currency;
  asset.fxToEUR = fxToEUR;
  asset.lastManualPriceAt = nowISO();

  saveData();
  calculateFinance();
  updateAttraction();
  showToast(`Preis manuell gesetzt: ${asset.name}`);
}

function ensurePurchaseEditorModal() {
  let modal = document.getElementById("purchaseHistoryModal");
  if (modal) return modal;

  modal = document.createElement("div");
  modal.id = "purchaseHistoryModal";
  modal.className = "modal-overlay hidden";
  modal.innerHTML = `
    <div class="modal-card purchase-history-card">
      <div class="modal-header">
        <h3 id="purchaseHistoryTitle">Käufe bearbeiten</h3>
        <button type="button" id="purchaseHistoryClose" class="small-btn">Schließen</button>
      </div>
      <p class="hint">Diese Käufe bestimmen den investierten Betrag, die Menge und den durchschnittlichen Kaufpreis pro Einheit. Du kannst Datum, Kaufbetrag, Währung, FX-Kurs, Kaufkurs, Menge und Notiz ändern.</p>
      <div id="purchaseHistoryRows" class="purchase-history-rows"></div>
      <div class="purchase-history-actions">
        <button type="button" id="purchaseHistoryAdd" class="small-btn">Kaufzeile hinzufügen</button>
        <button type="button" id="purchaseHistorySave" class="small-btn">Käufe speichern</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  document.getElementById("purchaseHistoryClose")?.addEventListener("click", closePortfolioPurchaseEditor);
  document.getElementById("purchaseHistoryAdd")?.addEventListener("click", addPurchaseEditorRow);
  document.getElementById("purchaseHistorySave")?.addEventListener("click", savePortfolioPurchaseEditor);

  return modal;
}

function openPortfolioPurchaseEditor(assetId) {
  const asset = getPortfolioAssets().find(item => item.id === assetId);
  if (!asset) return;

  const modal = ensurePurchaseEditorModal();
  modal.dataset.assetId = assetId;
  document.getElementById("purchaseHistoryTitle").textContent = `Käufe bearbeiten · ${asset.name}`;
  renderPurchaseEditorRows(asset);
  modal.classList.remove("hidden");
}

function closePortfolioPurchaseEditor() {
  document.getElementById("purchaseHistoryModal")?.classList.add("hidden");
}

function renderPurchaseEditorRows(asset) {
  const container = document.getElementById("purchaseHistoryRows");
  if (!container) return;
  container.innerHTML = "";

  const purchases = Array.isArray(asset.purchases) && asset.purchases.length
    ? asset.purchases
    : [];

  purchases.forEach(purchase => addPurchaseEditorRow(purchase));
  if (!purchases.length) addPurchaseEditorRow();
}

function addPurchaseEditorRow(purchase = null) {
  const container = document.getElementById("purchaseHistoryRows");
  if (!container) return;

  const row = document.createElement("div");
  row.className = "purchase-history-row";
  row.innerHTML = `
    <label class="purchase-field">
      <span>Datum</span>
      <input data-purchase-field="date" type="date" value="${escapeHTML(purchase?.date || todayISO())}" aria-label="Kaufdatum" />
    </label>
    <label class="purchase-field">
      <span>Kaufbetrag</span>
      <input data-purchase-field="investedAmount" type="number" step="0.01" placeholder="Kaufbetrag" value="${purchase?.investedAmount ?? ""}" aria-label="Kaufbetrag" />
    </label>
    <label class="purchase-field">
      <span>Währung</span>
      <select data-purchase-field="currency" aria-label="Währung">
        ${supportedCurrencies.map(currency => `<option value="${currency}" ${normalizeCurrency(purchase?.currency || "EUR") === currency ? "selected" : ""}>${currency}</option>`).join("")}
      </select>
    </label>
    <label class="purchase-field">
      <span>FX zu EUR</span>
      <input data-purchase-field="fxToEUR" type="number" step="0.0001" placeholder="FX zu EUR" value="${purchase?.fxToEUR ?? getDefaultFxToEUR(purchase?.currency || "EUR")}" aria-label="Umrechnungskurs zu EUR" />
    </label>
    <label class="purchase-field">
      <span>Kurs je Einheit</span>
      <input data-purchase-field="price" type="number" step="0.00000001" placeholder="Preis je Einheit" value="${purchase?.price ?? ""}" aria-label="Kaufkurs je Einheit" />
    </label>
    <label class="purchase-field">
      <span>Menge</span>
      <input data-purchase-field="units" type="number" step="0.00000001" placeholder="Menge" value="${purchase?.units ?? ""}" aria-label="Gekaufte Menge" />
    </label>
    <label class="purchase-field purchase-field-note">
      <span>Notiz</span>
      <input data-purchase-field="note" placeholder="Notiz" value="${escapeHTML(purchase?.note || "")}" aria-label="Notiz" />
    </label>
    <button type="button" data-delete-purchase-row class="small-btn purchase-delete-btn">Löschen</button>
  `;

  row.querySelector("[data-delete-purchase-row]")?.addEventListener("click", () => row.remove());
  row.querySelector('[data-purchase-field="currency"]')?.addEventListener("change", event => {
    const fx = row.querySelector('[data-purchase-field="fxToEUR"]');
    updateFxInputForCurrency(event.target.value, fx, { useCache: true, toast: false });
  });

  container.appendChild(row);
}

function savePortfolioPurchaseEditor() {
  const modal = document.getElementById("purchaseHistoryModal");
  const asset = getPortfolioAssets().find(item => item.id === modal?.dataset.assetId);
  if (!asset) return;

  const rows = [...document.querySelectorAll("#purchaseHistoryRows .purchase-history-row")];
  const purchases = rows.map(row => {
    const get = field => row.querySelector(`[data-purchase-field="${field}"]`)?.value || "";
    const currency = normalizeCurrency(get("currency") || "EUR");
    const fxToEUR = getFxToEUR(currency, get("fxToEUR"));
    const investedAmount = Number(get("investedAmount") || 0);
    const price = Number(get("price") || 0);
    let units = Number(get("units") || 0);

    if (!units && investedAmount && price) {
      units = roundEight((investedAmount * fxToEUR) / (price * fxToEUR));
    }

    return {
      id: crypto.randomUUID(),
      date: get("date") || todayISO(),
      investedAmount,
      currency,
      fxToEUR,
      price,
      priceCurrency: currency,
      priceFxToEUR: fxToEUR,
      units,
      note: get("note")
    };
  }).filter(purchase => purchase.investedAmount || purchase.price || purchase.units);

  asset.purchases = purchases;
  asset.units = roundEight(purchases.reduce((sum, purchase) => sum + Number(purchase.units || 0), 0));

  saveData();
  calculateFinance();
  updateAttraction();
  closePortfolioPurchaseEditor();
  showToast(`Käufe gespeichert: ${asset.name}`);
}

function parsePortfolioNumber(value) {
  return Number(String(value ?? "").replace(",", ".") || 0);
}

function ensurePortfolioPurchaseAddModal() {
  let modal = document.getElementById("portfolioPurchaseAddModal");
  if (modal) return modal;

  modal = document.createElement("div");
  modal.id = "portfolioPurchaseAddModal";
  modal.className = "modal-overlay hidden";
  modal.innerHTML = `
    <div class="modal-card purchase-add-card">
      <div class="modal-header">
        <h3>Nachkauf eintragen</h3>
        <button type="button" id="purchaseAddClose" class="small-btn">Schließen</button>
      </div>
      <p class="hint">Wähle ein bestehendes Asset aus und trage Menge, Kaufpreis und FX-Kurs ein. Der Kauf wird als neue Transaktion gespeichert; alte Käufe und Stammdaten bleiben erhalten.</p>

      <label class="purchase-field purchase-field-wide">
        <span>Bestehendes Asset</span>
        <select id="purchaseAddAsset" aria-label="Bestehendes Asset auswählen"></select>
      </label>

      <div id="purchaseAddAssetMeta" class="purchase-add-meta hint"></div>

      <div class="purchase-add-grid">
        <label class="purchase-field">
          <span>Kaufdatum</span>
          <input id="purchaseAddDate" type="date" aria-label="Kaufdatum" />
        </label>
        <label class="purchase-field">
          <span>Menge</span>
          <input id="purchaseAddUnits" type="number" step="0.00000001" placeholder="z. B. 5" aria-label="Gekaufte Menge" />
        </label>
        <label class="purchase-field">
          <span>Preis je Einheit</span>
          <input id="purchaseAddPrice" type="number" step="0.00000001" placeholder="z. B. 90" aria-label="Kaufpreis je Einheit" />
        </label>
        <label class="purchase-field purchase-field-currency-compact">
          <span>Währung</span>
          <select id="purchaseAddCurrency" aria-label="Kaufwährung">
            ${supportedCurrencies.map(currency => `<option value="${currency}">${currency}</option>`).join("")}
          </select>
        </label>
        <label class="purchase-field">
          <span>FX zu EUR</span>
          <input id="purchaseAddFxToEUR" type="number" step="0.0001" placeholder="z. B. 0.92" aria-label="Umrechnungskurs zu EUR" />
        </label>
        <button type="button" id="purchaseAddRefreshFx" class="small-btn">FX aktualisieren</button>
        <label class="purchase-field purchase-field-wide">
          <span>Notiz</span>
          <input id="purchaseAddNote" placeholder="optional, z. B. Nachkauf über Sparplan" aria-label="Notiz zum Nachkauf" />
        </label>
        <label class="purchase-add-checkbox purchase-field-wide">
          <input id="purchaseAddSetCurrentPrice" type="checkbox" checked />
          <span>Kaufpreis auch als aktuellen Preis des Assets übernehmen</span>
        </label>
      </div>

      <div id="purchaseAddPreview" class="purchase-add-preview hint"></div>

      <div class="purchase-history-actions">
        <button type="button" id="purchaseAddSave" class="small-btn">Nachkauf speichern</button>
        <button type="button" id="purchaseAddCancel" class="small-btn">Abbrechen</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  document.getElementById("purchaseAddClose")?.addEventListener("click", closePortfolioPurchaseAddModal);
  document.getElementById("purchaseAddCancel")?.addEventListener("click", closePortfolioPurchaseAddModal);
  document.getElementById("purchaseAddSave")?.addEventListener("click", savePortfolioAdditionalPurchase);
  document.getElementById("purchaseAddAsset")?.addEventListener("change", event => fillPortfolioPurchaseAddForm(event.target.value));
  document.getElementById("purchaseAddCurrency")?.addEventListener("change", event => {
    updateFxInputForCurrency(event.target.value, document.getElementById("purchaseAddFxToEUR"), { useCache: true, toast: false })
      .then(updatePortfolioPurchaseAddPreview);
  });
  document.getElementById("purchaseAddRefreshFx")?.addEventListener("click", () => {
    const currency = document.getElementById("purchaseAddCurrency")?.value || "EUR";
    updateFxInputForCurrency(currency, document.getElementById("purchaseAddFxToEUR"), { useCache: false, toast: true })
      .then(updatePortfolioPurchaseAddPreview);
  });

  ["purchaseAddDate", "purchaseAddUnits", "purchaseAddPrice", "purchaseAddFxToEUR", "purchaseAddNote", "purchaseAddSetCurrentPrice"].forEach(id => {
    document.getElementById(id)?.addEventListener("input", updatePortfolioPurchaseAddPreview);
    document.getElementById(id)?.addEventListener("change", updatePortfolioPurchaseAddPreview);
  });

  return modal;
}

function renderPortfolioPurchaseAddAssetOptions(selectedAssetId = "") {
  const select = document.getElementById("purchaseAddAsset");
  if (!select) return;

  const assets = getPortfolioAssets();
  if (!assets.length) {
    select.innerHTML = `<option value="">Noch keine Assets vorhanden</option>`;
    select.disabled = true;
    return;
  }

  select.disabled = false;
  select.innerHTML = `
    <option value="">Asset auswählen…</option>
    ${assets.map(asset => `
      <option value="${escapeHTML(asset.id)}" ${asset.id === selectedAssetId ? "selected" : ""}>
        ${escapeHTML(asset.name || "Unbenanntes Asset")}${asset.symbol ? ` · ${escapeHTML(asset.symbol)}` : ""}
      </option>
    `).join("")}
  `;
}

function openPortfolioPurchaseAddModal(assetId = "") {
  const modal = ensurePortfolioPurchaseAddModal();
  const selectedAssetId = assetId || getPortfolioAssets()[0]?.id || "";

  renderPortfolioPurchaseAddAssetOptions(selectedAssetId);
  modal.dataset.assetId = selectedAssetId;

  document.getElementById("purchaseAddDate").value = todayISO();
  document.getElementById("purchaseAddUnits").value = "";
  document.getElementById("purchaseAddNote").value = "";
  const currentPriceCheckbox = document.getElementById("purchaseAddSetCurrentPrice");
  if (currentPriceCheckbox) currentPriceCheckbox.checked = true;

  if (selectedAssetId) fillPortfolioPurchaseAddForm(selectedAssetId);
  else updatePortfolioPurchaseAddPreview();

  modal.classList.remove("hidden");
  document.getElementById(selectedAssetId ? "purchaseAddUnits" : "purchaseAddAsset")?.focus();
}

function closePortfolioPurchaseAddModal() {
  document.getElementById("portfolioPurchaseAddModal")?.classList.add("hidden");
}

function fillPortfolioPurchaseAddForm(assetId) {
  const modal = document.getElementById("portfolioPurchaseAddModal");
  const asset = getPortfolioAssets().find(item => item.id === assetId);
  if (modal) modal.dataset.assetId = assetId || "";

  const meta = document.getElementById("purchaseAddAssetMeta");
  if (!asset) {
    if (meta) meta.textContent = "Bitte ein bestehendes Asset auswählen.";
    updatePortfolioPurchaseAddPreview();
    return;
  }

  const currency = normalizeCurrency(asset.currency || "EUR");
  const currencyField = document.getElementById("purchaseAddCurrency");
  const fxField = document.getElementById("purchaseAddFxToEUR");
  const priceField = document.getElementById("purchaseAddPrice");

  if (currencyField) currencyField.value = currency;
  if (fxField) fxField.value = getFxToEUR(currency, asset.fxToEUR);
  if (priceField) priceField.value = asset.price || "";
  if (meta) {
    meta.innerHTML = `
      <strong>${escapeHTML(asset.name || "Unbenanntes Asset")}</strong>
      ${asset.type ? ` · ${escapeHTML(asset.type)}` : ""}
      ${asset.symbol ? ` · ${escapeHTML(asset.symbol)}` : ""}
      ${asset.providerSymbol ? ` · Kurs-Symbol ${escapeHTML(asset.providerSymbol)}` : ""}
      <br />Aktuell: ${roundEight(Number(asset.units || 0))} Einheiten · ${formatCurrencyValue(Number(asset.price || 0), currency)} je Einheit · FX ${getFxToEUR(currency, asset.fxToEUR)}
    `;
  }

  updatePortfolioPurchaseAddPreview();
}

function getPortfolioPurchaseAddDraft() {
  const modal = document.getElementById("portfolioPurchaseAddModal");
  const assetId = modal?.dataset.assetId || document.getElementById("purchaseAddAsset")?.value || "";
  const asset = getPortfolioAssets().find(item => item.id === assetId);
  const currency = normalizeCurrency(document.getElementById("purchaseAddCurrency")?.value || asset?.currency || "EUR");
  const fxToEUR = getFxToEUR(currency, document.getElementById("purchaseAddFxToEUR")?.value);
  const units = parsePortfolioNumber(document.getElementById("purchaseAddUnits")?.value);
  const price = parsePortfolioNumber(document.getElementById("purchaseAddPrice")?.value);
  const investedAmount = roundEight(units * price);
  const investedEUR = investedAmount * fxToEUR;

  return {
    asset,
    assetId,
    date: document.getElementById("purchaseAddDate")?.value || todayISO(),
    units,
    price,
    currency,
    fxToEUR,
    investedAmount,
    investedEUR,
    note: document.getElementById("purchaseAddNote")?.value.trim() || "",
    setCurrentPrice: Boolean(document.getElementById("purchaseAddSetCurrentPrice")?.checked)
  };
}

function updatePortfolioPurchaseAddPreview() {
  const preview = document.getElementById("purchaseAddPreview");
  if (!preview) return;

  const draft = getPortfolioPurchaseAddDraft();
  if (!draft.asset) {
    preview.textContent = "Wähle zuerst ein bestehendes Asset aus.";
    return;
  }

  if (!draft.units || !draft.price) {
    preview.innerHTML = `
      <strong>Vorschau</strong><br />
      Bisherige Menge: ${roundEight(Number(draft.asset.units || 0))} Einheiten · Investiert laut Kaufhistorie: ${getAssetInvested(draft.asset) ? money.format(getAssetInvested(draft.asset)) : "–"}
    `;
    return;
  }

  const currentUnits = Number(draft.asset.units || 0);
  const newTotalUnits = roundEight(currentUnits + draft.units);
  const currentInvested = getAssetInvested(draft.asset);
  const currentPurchaseUnits = getAssetPurchaseUnits(draft.asset);
  const newInvested = currentInvested + draft.investedEUR;
  const newAverageBuy = (currentPurchaseUnits + draft.units) ? newInvested / (currentPurchaseUnits + draft.units) : 0;

  preview.innerHTML = `
    <strong>Automatische Berechnung</strong><br />
    Neuer Kauf: ${roundEight(draft.units)} × ${formatCurrencyValue(draft.price, draft.currency)} = ${formatCurrencyValue(draft.investedAmount, draft.currency)}${draft.currency !== "EUR" ? ` · ${money.format(draft.investedEUR)} in EUR` : ""}<br />
    Neue Gesamtmenge: ${roundEight(currentUnits)} + ${roundEight(draft.units)} = ${roundEight(newTotalUnits)} Einheiten<br />
    Neue Kostenbasis laut Kaufhistorie: ${money.format(newInvested)}${newAverageBuy ? ` · Ø ${money.format(newAverageBuy)} / Einheit` : ""}
  `;
}

function savePortfolioAdditionalPurchase() {
  const draft = getPortfolioPurchaseAddDraft();
  const asset = draft.asset;

  if (!asset) {
    alert("Bitte ein bestehendes Asset auswählen.");
    return;
  }

  if (!draft.units || draft.units <= 0) {
    alert("Bitte eine gekaufte Menge größer als 0 eintragen.");
    return;
  }

  if (!draft.price || draft.price <= 0) {
    alert("Bitte einen Preis je Einheit größer als 0 eintragen.");
    return;
  }

  if (!Array.isArray(asset.purchases)) asset.purchases = [];
  asset.purchases.push({
    id: crypto.randomUUID(),
    date: draft.date || todayISO(),
    investedAmount: draft.investedAmount,
    currency: draft.currency,
    fxToEUR: draft.fxToEUR,
    price: draft.price,
    priceCurrency: draft.currency,
    priceFxToEUR: draft.fxToEUR,
    units: draft.units,
    note: draft.note
  });

  asset.units = roundEight(Number(asset.units || 0) + draft.units);

  if (draft.setCurrentPrice) {
    asset.price = draft.price;
    asset.currency = draft.currency;
    asset.fxToEUR = draft.fxToEUR;
    asset.lastManualPriceAt = nowISO();
    asset.lastPriceUpdatedAt = null;
  }

  saveData();
  calculateFinance();
  updateAttraction();
  closePortfolioPurchaseAddModal();
  showToast(`Nachkauf gespeichert: ${asset.name} · ${roundEight(draft.units)} × ${formatCurrencyValue(draft.price, draft.currency)}`);
}

function addPortfolioPurchase(assetId) {
  openPortfolioPurchaseAddModal(assetId);
}



function calculateFinance() {
  const fiat = Number(data.finance.fiat || 0);
  const blocked = getBlockedMonthlyOutflow();
  const freeFiat = fiat - blocked;
  const portfolioValue = getPortfolioValue();
  const financeWealth = freeFiat + portfolioValue;
  const level = getFinanceLevel(financeWealth);

  scores.finance = level.value;

  document.getElementById("fiatBalanceDisplay").textContent = money.format(fiat);
  document.getElementById("blockedMonthlyOutflow").textContent = money.format(blocked);
  document.getElementById("freeFiatBuffer").textContent = money.format(freeFiat);
  document.getElementById("portfolioValue").textContent = money.format(portfolioValue);
  document.getElementById("totalWealth").textContent = money.format(financeWealth);
  document.getElementById("portfolioCompass").textContent = getPortfolioCompassText(portfolioValue);
  document.getElementById("financeSlider").value = level.value;
  document.getElementById("financeLevel").textContent = level.value;
  document.getElementById("financeName").textContent = `${level.name} — ab ${money.format(level.amount)}`;
  document.getElementById("overviewFinance").textContent = level.value;
  document.getElementById("overviewFinanceText").textContent = money.format(financeWealth);
  updateFinanceFormattedPreview();
  renderPortfolioAssets();
  updateFinancePrivacyUI();

  const lastResult = Number(data.finance.incomeLastMonth || 0) - Number(data.finance.expensesLastMonth || 0);
  const beforeResult = Number(data.finance.incomeBeforeLastMonth || 0) - Number(data.finance.expensesBeforeLastMonth || 0);

  document.getElementById("resultLastMonth").textContent = money.format(lastResult);
  document.getElementById("resultBeforeLastMonth").textContent = money.format(beforeResult);
}

function updateFinanceFormattedPreview() {
  document.getElementById("formattedFiat").textContent = money.format(Number(data.finance.fiat || 0));
  const portfolioValueEl = document.getElementById("formattedPortfolioValue");
  if (portfolioValueEl) portfolioValueEl.textContent = money.format(getPortfolioValue());
  document.getElementById("formattedInvested").textContent = money.format(getPortfolioInvested());
}

function updateFinanceCheckStatus() {
  const status = document.getElementById("financeCheckStatus");
  const checkedToday = isSameDayISO(data.finance.financeCheckedAt, todayISO());

  if (checkedToday) {
    status.className = "check-ok";
    status.textContent = `✓ Finanzdaten heute geprüft. Letzte Prüfung: ${formatDateTimeDE(data.finance.financeCheckedAt)}`;
  } else {
    status.className = "check-missing";
    status.textContent = "Finanzdaten heute noch nicht geprüft.";
  }
}

async function loadCoinPrice(symbol) {
  const response = await fetch(`https://api.coinbase.com/v2/exchange-rates?currency=${symbol}`);
  if (!response.ok) throw new Error(`${symbol}-Kurs konnte nicht geladen werden.`);

  const result = await response.json();
  const eurRate = Number(result?.data?.rates?.EUR);

  if (!eurRate || Number.isNaN(eurRate)) throw new Error(`Kein EUR-Kurs für ${symbol} gefunden.`);

  return eurRate;
}

async function loadCryptoPrices() {
  try {
    const [btcRate, ltcRate] = await Promise.all([
      loadCoinPrice("BTC"),
      loadCoinPrice("LTC")
    ]);

    data.finance.btcPrice = btcRate;
    data.finance.ltcPrice = ltcRate;
    data.finance.btcPriceLoadedAt = nowISO();
    data.finance.ltcPriceLoadedAt = nowISO();
    data.finance.financeCheckedAt = nowISO();

    document.getElementById("btcPrice").value = btcRate.toFixed(2);
    document.getElementById("ltcPrice").value = ltcRate.toFixed(2);

    const quickBtc = document.getElementById("quickBtcPrice");
    const quickLtc = document.getElementById("quickLtcPrice");
    if (quickBtc) quickBtc.value = "";
    if (quickLtc) quickLtc.value = "";

    saveData();
    calculateFinance();
    updateFinanceFormattedPreview();
    updateFinanceCheckStatus();
    updateAttraction();

    showToast(`Krypto-Kurse geladen: BTC ${money.format(btcRate)} · LTC ${money.format(ltcRate)}`);
  } catch {
    showToast("Krypto-Kurse konnten nicht geladen werden");
    alert("Krypto-Kurse konnten nicht automatisch geladen werden. Bitte manuell eintragen.");
  }
}

function getFinanceLevel(total) {
  let current = financeLevels[0];

  for (const level of financeLevels) {
    if (total >= level.amount) current = level;
  }

  return current;
}


function setupMiniNote(fieldId, sectionKey) {
  const input = document.getElementById(fieldId);
  if (!input || !data[sectionKey]) return;

  input.value = data[sectionKey].note || "";

  if (data[sectionKey].noteHeight) {
    input.style.height = `${data[sectionKey].noteHeight}px`;
  }

  const saveNoteHeight = () => {
    const height = Math.round(input.getBoundingClientRect().height);
    if (height > 40 && data[sectionKey].noteHeight !== height) {
      data[sectionKey].noteHeight = height;
      saveData();
    }
  };

  input.addEventListener("input", () => {
    data[sectionKey].note = input.value;
    saveNoteHeight();
    saveData();
  });

  input.addEventListener("mouseup", saveNoteHeight);
  input.addEventListener("pointerup", saveNoteHeight);
  input.addEventListener("touchend", saveNoteHeight);
  input.addEventListener("change", saveNoteHeight);
  input.addEventListener("blur", saveNoteHeight);

  if (window.ResizeObserver) {
    const observer = new ResizeObserver(saveNoteHeight);
    observer.observe(input);
  }
}

function setupStoredTextareaHeight(id, ownerObject, heightKey) {
  const input = document.getElementById(id);
  if (!input || !ownerObject) return;

  ownerObject[heightKey] = ownerObject[heightKey] || {};
  const storedHeight = ownerObject[heightKey][id];

  const applyHeight = height => {
    if (!height) return;
    input.style.height = height;
    input.style.minHeight = height;
    input.dataset.savedHeight = height;
  };

  applyHeight(storedHeight);

  const saveHeight = () => {
    const measured = Math.round(input.getBoundingClientRect().height);
    if (!measured || measured < 40) return;

    const height = `${measured}px`;
    if (ownerObject[heightKey][id] !== height) {
      ownerObject[heightKey][id] = height;
      input.dataset.savedHeight = height;
      saveData();
    }
  };

  input.addEventListener("input", saveHeight);
  input.addEventListener("mouseup", saveHeight);
  input.addEventListener("pointerup", saveHeight);
  input.addEventListener("touchend", saveHeight);
  input.addEventListener("change", saveHeight);
  input.addEventListener("blur", saveHeight);

  if (window.ResizeObserver) {
    let initialized = false;
    const observer = new ResizeObserver(() => {
      if (!initialized) {
        initialized = true;
        applyHeight(ownerObject[heightKey][id] || input.dataset.savedHeight);
        return;
      }
      saveHeight();
    });
    observer.observe(input);
  }

  setTimeout(() => applyHeight(ownerObject[heightKey][id] || input.dataset.savedHeight), 0);
  setTimeout(() => applyHeight(ownerObject[heightKey][id] || input.dataset.savedHeight), 250);
}

function setupMindfulnessTextareaHeights() {
  const ids = ["mindfulnessMonthlyIntention", "mindfulnessTodayInsight", "mindfulnessAllowed", "mindfulnessEmergence"];

  let localHeights = {};
  try {
    localHeights = JSON.parse(localStorage.getItem(MINDFULNESS_HEIGHTS_KEY) || "{}");
  } catch {
    localHeights = {};
  }

  data.mindfulness.textareaHeights = {
    ...(localHeights || {}),
    ...(data.mindfulness.textareaHeights || {})
  };

  ids.forEach(id => {
    setupStoredTextareaHeight(id, data.mindfulness, "textareaHeights");

    const input = document.getElementById(id);
    if (!input) return;

    const persistLocalHeight = () => {
      const height = data.mindfulness.textareaHeights?.[id] || input.dataset.savedHeight;
      if (!height) return;
      localHeights[id] = height;
      localStorage.setItem(MINDFULNESS_HEIGHTS_KEY, JSON.stringify(localHeights));
    };

    input.addEventListener("input", persistLocalHeight);
    input.addEventListener("mouseup", persistLocalHeight);
    input.addEventListener("pointerup", persistLocalHeight);
    input.addEventListener("touchend", persistLocalHeight);
    input.addEventListener("change", persistLocalHeight);
    input.addEventListener("blur", persistLocalHeight);
  });
}

function setupFitness() {
  setupMiniNote("fitnessNote", "fitness");

  ["benchKg", "deadliftKg", "squatKg", "pullups", "runKm", "yogaTarget28", "trainingTarget28", "breathTarget28", "coldTarget28", "bodyCareTarget28"].forEach(field => {
    const input = document.getElementById(field);
    input.value = data.fitness[field];

    input.addEventListener("input", () => {
      data.fitness[field] = Number(input.value || 0);
      saveData();
      calculateFitness();
      updateDiscipline();
      updateAttraction();
    });
  });

  document.getElementById("markYogaToday").addEventListener("click", () => {
    const added = markYogaToday();
    showRoutineToast("Yoga", data.fitness.yogaTarget28, added);
  });

  document.getElementById("removeYogaToday").addEventListener("click", () => {
    removeYogaToday();
    showToast("Yoga heute entfernt");
  });

  document.getElementById("markTrainingToday").addEventListener("click", () => {
    const added = markTrainingToday();
    showRoutineToast("Training", data.fitness.trainingTarget28, added);
  });

  document.getElementById("removeTrainingToday").addEventListener("click", () => {
    removeTrainingToday();
    showToast("Training heute entfernt");
  });

  document.getElementById("markBreathToday").addEventListener("click", () => {
    const added = markBreathToday();
    showRoutineToast("Atemübung", data.fitness.breathTarget28, added);
  });

  document.getElementById("removeBreathToday").addEventListener("click", () => {
    removeBreathToday();
    showToast("Atemübung heute entfernt");
  });

  document.getElementById("markColdToday").addEventListener("click", () => {
    const added = markColdToday();
    showRoutineToast("Kältetraining", data.fitness.coldTarget28, added);
  });

  document.getElementById("removeColdToday").addEventListener("click", () => {
    removeColdToday();
    showToast("Kältetraining heute entfernt");
  });

  document.getElementById("markBodyCareToday").addEventListener("click", () => {
    const added = markBodyCareToday();
    showRoutineToast("Körperpflege", data.fitness.bodyCareTarget28, added);
  });

  document.getElementById("removeBodyCareToday").addEventListener("click", () => {
    removeBodyCareToday();
    showToast("Körperpflege heute entfernt");
  });

  calculateFitness();
}

function showRoutineToast(label, target, added) {
  if (!added) {
    showToast(`${label} heute schon erfasst`);
    return;
  }

  const percent = roundOne(100 / Math.max(Number(target || 1), 1));
  showToast(`+${percent}% vom 28-Tage-Ziel · ${label}`);
}

function markYogaToday() {
  const added = addDateOnce(data.fitness.yogaDates, todayISO());
  saveData();
  calculateFitness();
  updateDiscipline();
  updateAttraction();
  updateQuickDailyStatus();
  return added;
}

function removeYogaToday() {
  data.fitness.yogaDates = removeDate(data.fitness.yogaDates, todayISO());
  saveData();
  calculateFitness();
  updateDiscipline();
  updateAttraction();
  updateQuickDailyStatus();
}

function markTrainingToday() {
  const added = addDateOnce(data.fitness.trainingDates, todayISO());
  saveData();
  calculateFitness();
  updateDiscipline();
  updateAttraction();
  updateQuickDailyStatus();
  return added;
}

function removeTrainingToday() {
  data.fitness.trainingDates = removeDate(data.fitness.trainingDates, todayISO());
  saveData();
  calculateFitness();
  updateDiscipline();
  updateAttraction();
  updateQuickDailyStatus();
}

function markBreathToday() {
  const added = addDateOnce(data.fitness.breathDates, todayISO());
  saveData();
  calculateFitness();
  updateDiscipline();
  updateAttraction();
  updateQuickDailyStatus();
  return added;
}

function removeBreathToday() {
  data.fitness.breathDates = removeDate(data.fitness.breathDates, todayISO());
  saveData();
  calculateFitness();
  updateDiscipline();
  updateAttraction();
  updateQuickDailyStatus();
}

function markColdToday() {
  const added = addDateOnce(data.fitness.coldDates, todayISO());
  if (added) {
    saveData();
    calculateFitness();
    updateAttraction();
  }
  updateQuickDailyStatus();
  return added;
}

function removeColdToday() {
  data.fitness.coldDates = removeDate(data.fitness.coldDates, todayISO());
  saveData();
  calculateFitness();
  updateAttraction();
  updateQuickDailyStatus();
}

function markBodyCareToday() {
  const added = addDateOnce(data.fitness.bodyCareDates, todayISO());
  if (added) {
    saveData();
    calculateFitness();
    updateAttraction();
  }
  updateQuickDailyStatus();
  return added;
}

function removeBodyCareToday() {
  data.fitness.bodyCareDates = removeDate(data.fitness.bodyCareDates, todayISO());
  saveData();
  calculateFitness();
  updateAttraction();
  updateQuickDailyStatus();
}

function markOutingToday() {
  if (!Array.isArray(data.mind.outingDates)) data.mind.outingDates = [];
  const added = addDateOnce(data.mind.outingDates, todayISO());
  saveData();
  updateOutingScore();
  updateDiscipline();
  updateAttraction();
  updateQuickDailyStatus();
  return added;
}

function removeOutingToday() {
  data.mind.outingDates = removeDate(data.mind.outingDates || [], todayISO());
  saveData();
  updateOutingScore();
  updateDiscipline();
  updateAttraction();
  updateQuickDailyStatus();
}


function calculateFitness() {
  const strengthScore = calculateStrengthScore();
  const enduranceScore = calculateEnduranceScore();
  const mobilityScore = calculateMobilityScore();
  const breathScore = updateBreathScore();
  const coldScore = updateColdScore();
  const bodyCareScore = updateBodyCareScore();
  const consistencyScore = calculateConsistencyScore();
  const total = roundOne(average([strengthScore, enduranceScore, mobilityScore, breathScore, coldScore, bodyCareScore, consistencyScore]));
  const rounded = clamp(Math.round(total), 0, 10);

  scores.fitness = total;

  document.getElementById("fitnessScore").textContent = total;
  document.getElementById("fitnessName").textContent = fitnessNames[rounded];
  document.getElementById("overviewFitness").textContent = total;
  document.getElementById("overviewFitnessText").textContent = fitnessNames[rounded];
}

function calculateStrengthScore() {
  const bench = scaleStrengthKg(data.fitness.benchKg);
  const deadlift = scaleStrengthKg(data.fitness.deadliftKg);
  const squat = scaleStrengthKg(data.fitness.squatKg);
  const pullups = clamp((Number(data.fitness.pullups || 0) / 10) * 8, 0, 10);
  const score = roundOne(average([bench, deadlift, squat, pullups]));

  document.getElementById("strengthScore").textContent = score;
  document.getElementById("strengthDetails").textContent =
    `Bankdrücken ${roundOne(bench)}/10 · Kreuzheben ${roundOne(deadlift)}/10 · Kniebeuge ${roundOne(squat)}/10 · Klimmzüge ${roundOne(pullups)}/10`;

  return score;
}

function scaleStrengthKg(kg) {
  const value = Number(kg || 0);

  if (value <= 60) {
    return clamp((value / 60) * 8, 0, 8);
  }

  return clamp(8 + ((value - 60) / 40) * 2, 8, 10);
}

function calculateEnduranceScore() {
  const km = Number(data.fitness.runKm || 0);
  let score = 0;

  if (km <= 10) score = (km / 10) * 6;
  else if (km <= 21.1) score = 6 + ((km - 10) / 11.1) * 2;
  else score = 8 + Math.min((km - 21.1) / 20, 1) * 2;

  score = roundOne(clamp(score, 0, 10));

  document.getElementById("enduranceScore").textContent = score;
  document.getElementById("enduranceText").textContent =
    score < 3 ? "Grundlagenausdauer im Aufbau." :
    score < 6 ? "Solide Basis, aber 10 km sind noch nicht stabil erreicht." :
    score < 8 ? "10 km sind erreichbar oder stabil." :
    "Sehr starke Ausdauer.";

  return score;
}

function calculateMobilityScore() {
  const count = countDatesInLastDays(data.fitness.yogaDates, 28);
  const target = Math.max(Number(data.fitness.yogaTarget28 || 12), 1);
  const percent = clamp((count / target) * 100, 0, 100);
  const score = percentToLevel(percent);

  scores.yoga = score;

  document.getElementById("yogaCount28").textContent = count;
  document.getElementById("yogaThisMonth").textContent = countDatesInMonth(data.fitness.yogaDates, 0);
  document.getElementById("yogaLastMonth").textContent = countDatesInMonth(data.fitness.yogaDates, -1);
  document.getElementById("mobilityScore").textContent = score;
  document.getElementById("yogaText").textContent = `${roundOne(percent)}% vom 28-Tage-Ziel erreicht.`;

  return score;
}

function updateBreathScore() {
  const count = countDatesInLastDays(data.fitness.breathDates, 28);
  const target = Math.max(Number(data.fitness.breathTarget28 || 12), 1);
  const percent = clamp((count / target) * 100, 0, 100);
  const score = percentToLevel(percent);

  scores.breath = score;

  document.getElementById("breathCount28").textContent = count;
  document.getElementById("breathThisMonth").textContent = countDatesInMonth(data.fitness.breathDates, 0);
  document.getElementById("breathLastMonth").textContent = countDatesInMonth(data.fitness.breathDates, -1);
  document.getElementById("breathScore").textContent = score;
  if (document.getElementById("breathText")) {
    document.getElementById("breathText").textContent = `${roundOne(percent)}% vom 28-Tage-Ziel erreicht.`;
  }

  return score;
}

function updateColdScore() {
  const count = countDatesInLastDays(data.fitness.coldDates, 28);
  const target = Math.max(Number(data.fitness.coldTarget28 || 12), 1);
  const percent = clamp((count / target) * 100, 0, 100);
  const score = percentToLevel(percent);

  scores.cold = score;

  document.getElementById("coldCount28").textContent = count;
  document.getElementById("coldThisMonth").textContent = countDatesInMonth(data.fitness.coldDates, 0);
  document.getElementById("coldLastMonth").textContent = countDatesInMonth(data.fitness.coldDates, -1);
  document.getElementById("coldScore").textContent = score;
  document.getElementById("coldText").textContent = `${roundOne(percent)}% vom 28-Tage-Ziel erreicht.`;

  return score;
}

function updateBodyCareScore() {
  const count = countDatesInLastDays(data.fitness.bodyCareDates, 28);
  const target = Math.max(Number(data.fitness.bodyCareTarget28 || 20), 1);
  const percent = clamp((count / target) * 100, 0, 100);
  const score = percentToLevel(percent);

  scores.bodyCare = score;

  document.getElementById("bodyCareCount28").textContent = count;
  document.getElementById("bodyCareThisMonth").textContent = countDatesInMonth(data.fitness.bodyCareDates, 0);
  document.getElementById("bodyCareLastMonth").textContent = countDatesInMonth(data.fitness.bodyCareDates, -1);
  document.getElementById("bodyCareScore").textContent = score;
  document.getElementById("bodyCareText").textContent = `${roundOne(percent)}% vom 28-Tage-Ziel erreicht.`;

  return score;
}

function updateOutingScore() {
  if (!Array.isArray(data.mind.outingDates)) data.mind.outingDates = [];
  const count = countDatesInLastDays(data.mind.outingDates, 28);
  const target = Math.max(Number(data.mind.outingTarget28 || 12), 1);
  const percent = clamp((count / target) * 100, 0, 100);
  const score = percentToLevel(percent);

  scores.outing = score;

  if (document.getElementById("outingCount28")) document.getElementById("outingCount28").textContent = count;
  if (document.getElementById("outingThisMonth")) document.getElementById("outingThisMonth").textContent = countDatesInMonth(data.mind.outingDates, 0);
  if (document.getElementById("outingLastMonth")) document.getElementById("outingLastMonth").textContent = countDatesInMonth(data.mind.outingDates, -1);
  if (document.getElementById("outingScore")) document.getElementById("outingScore").textContent = score;
  if (document.getElementById("outingText")) document.getElementById("outingText").textContent = `${roundOne(percent)}% vom 28-Tage-Ziel erreicht.`;

  return score;
}


function calculateConsistencyScore() {
  const count = countDatesInLastDays(data.fitness.trainingDates, 28);
  const target = Math.max(Number(data.fitness.trainingTarget28 || 12), 1);
  const percent = clamp((count / target) * 100, 0, 100);
  const score = percentToLevel(percent);

  scores.training = score;

  document.getElementById("trainingCount28").textContent = count;
  document.getElementById("trainingThisMonth").textContent = countDatesInMonth(data.fitness.trainingDates, 0);
  document.getElementById("trainingLastMonth").textContent = countDatesInMonth(data.fitness.trainingDates, -1);
  document.getElementById("consistencyScore").textContent = score;
  document.getElementById("consistencyText").textContent = `${roundOne(percent)}% vom 28-Tage-Ziel erreicht.`;

  return score;
}

function setupHealth() {
  createSliderGroup({
    object: data.health,
    containerId: "healthMetrics",
    descriptions: healthDescriptions,
    onUpdate: () => {
      updateHealthScore();
      updateAttraction();
    }
  });

  updateHealthScore();
}

function updateHealthScore() {
  const score = roundOne(average(Object.values(data.health)));
  const rounded = clamp(Math.round(score), 0, 10);
  scores.health = score;

  document.getElementById("healthScore").textContent = score;
  document.getElementById("overviewHealth").textContent = score;
  document.getElementById("overviewHealthText").textContent = healthNames[rounded];
}

function setupLife() {
  createSliderGroup({
    object: data.life,
    containerId: "lifeMetrics",
    descriptions: lifeDescriptions,
    onUpdate: () => {
      updateLifeScore();
      updateAttraction();
    }
  });

  updateLifeScore();
}

function updateLifeScore() {
  const manualValues = Object.values(data.life);
  const skillPercent = getActiveGoalAverage();
  const skillLevel = percentToLevel(skillPercent);
  const score = roundOne(average([...manualValues, skillLevel]));
  const rounded = clamp(Math.round(score), 0, 10);

  scores.life = score;

  document.getElementById("lifeSkillProfile").textContent = formatPercent(skillPercent);
  document.getElementById("lifeScore").textContent = score;
  document.getElementById("overviewLife").textContent = score;
  document.getElementById("overviewLifeText").textContent = lifeNames[rounded];
}

function renderSocialActionLegend() {
  const container = document.getElementById("socialActionLegend");
  if (!container) return;

  container.innerHTML = "";

  Object.entries(socialActions).forEach(([key, action]) => {
    const row = document.createElement("div");
    row.className = "social-action-legend-row";
    row.innerHTML = `
      <div>
        <strong>${escapeHTML(action.label)}</strong>
        <span>${escapeHTML(action.category || "Praxis")}</span>
      </div>
      <p>${escapeHTML(action.description || "")}</p>
      <em>+${roundOne(action.points)} Punkte</em>
    `;
    container.appendChild(row);
  });
}


function renderSocialBackfillActions() {
  const container = document.getElementById("socialBackfillActions");
  if (!container) return;

  container.innerHTML = "";

  Object.entries(socialActions).forEach(([key, action]) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = action.label;
    button.addEventListener("click", () => {
      const dateInput = document.getElementById("socialBackfillDate");
      const date = dateInput?.value || todayISO();
      const added = addSocialAction(key, date);
      if (added) showToast(`${formatShortDate(date)} · +${added.points} Punkte · ${added.label}`);
    });
    container.appendChild(button);
  });
}


function removeSocialBackfillAddedToday() {
  const today = todayISO();
  const before = data.emotion.socialLog.length;

  data.emotion.socialLog = data.emotion.socialLog.filter(entry => {
    return !(entry.createdAt === today && entry.date !== today);
  });

  const removed = before - data.emotion.socialLog.length;

  saveData();
  updateEmotionScore();
  updateDiscipline();
  updateAttraction();
  updateQuickDailyStatus();
  updateProtocolTable();

  showToast(removed ? `${removed} heute hinzugefügte Nachträge entfernt` : "Keine heutigen Nachträge gefunden");
}


function removeSocialEntriesForDate(date) {
  if (!date) {
    showToast("Bitte Datum auswählen");
    return;
  }

  const before = data.emotion.socialLog.length;
  data.emotion.socialLog = data.emotion.socialLog.filter(entry => entry.date !== date);
  const removed = before - data.emotion.socialLog.length;

  saveData();
  updateEmotionScore();
  updateDiscipline();
  updateAttraction();
  updateQuickDailyStatus();
  updateProtocolTable();

  showToast(removed ? `${removed} Soziale Praxis-Einträge für ${formatShortDate(date)} entfernt` : `Keine Einträge für ${formatShortDate(date)} gefunden`);
}

function setupSocialBackfill() {
  const panel = document.getElementById("socialBackfillPanel");
  const dateInput = document.getElementById("socialBackfillDate");

  if (dateInput && !dateInput.value) {
    dateInput.value = addDaysISO(todayISO(), -1);
    dateInput.max = todayISO();
  }

  const removeDateInput = document.getElementById("socialBackfillRemoveDate");
  if (removeDateInput && !removeDateInput.value) {
    removeDateInput.value = dateInput?.value || addDaysISO(todayISO(), -1);
    removeDateInput.max = todayISO();
  }

  renderSocialBackfillActions();

  document.getElementById("openSocialBackfill")?.addEventListener("click", () => {
    panel?.classList.remove("hidden");
    if (dateInput && !dateInput.value) dateInput.value = addDaysISO(todayISO(), -1);
    if (removeDateInput && !removeDateInput.value) removeDateInput.value = dateInput?.value || addDaysISO(todayISO(), -1);
    dateInput?.focus();
  });

  document.getElementById("removeSocialBackfillForDate")?.addEventListener("click", () => {
    const date = document.getElementById("socialBackfillRemoveDate")?.value;
    removeSocialEntriesForDate(date);
  });

  document.getElementById("closeSocialBackfill")?.addEventListener("click", () => {
    panel?.classList.add("hidden");
  });
}

function setupEmotion() {
  setupMiniNote("emotionNote", "emotion");
  renderSocialActionLegend();
  setupSocialBackfill();

  document.getElementById("socialTarget28").value = data.emotion.socialTarget28;
  document.getElementById("socialBudgetMonthly").value = data.emotion.socialBudgetMonthly;

  document.getElementById("socialTarget28").addEventListener("input", event => {
    data.emotion.socialTarget28 = Number(event.target.value || 1);
    saveData();
    updateEmotionScore();
    updateDiscipline();
    updateAttraction();
  });

  document.getElementById("socialBudgetMonthly").addEventListener("input", event => {
    data.emotion.socialBudgetMonthly = Number(event.target.value || 0);
    saveData();
    updateEmotionScore();
  });

  createSliderGroup({
    object: data.emotion.base,
    containerId: "emotionMetrics",
    descriptions: emotionDescriptions,
    onUpdate: () => {
      updateEmotionScore();
      updateAttraction();
    }
  });

  document.querySelectorAll("[data-social-action]").forEach(button => {
    button.addEventListener("click", () => {
      const action = addSocialAction(button.dataset.socialAction);
      if (action) showToast(`+${action.points} Punkte · ${action.label}`);
    });
  });

  document.getElementById("removeSocialToday").addEventListener("click", removeSocialToday);

  document.getElementById("addPaidEvent").addEventListener("click", () => {
    const cost = Number(document.getElementById("eventCost").value || 0);
    data.finance.fiat = Number(data.finance.fiat || 0) - cost;
    document.getElementById("fiat").value = data.finance.fiat.toFixed(2);

    data.emotion.socialLog.push({
      id: crypto.randomUUID(),
      date: todayISO(),
      action: "event",
      label: "Event besucht",
      points: socialActions.event.points,
      cost
    });

    document.getElementById("eventCost").value = "";

    saveData();
    calculateFinance();
    updateFinanceFormattedPreview();
    updateEmotionScore();
    updateDiscipline();
    updateAttraction();
    updateQuickDailyStatus();

    showToast(`+${socialActions.event.points} Punkte · Event`);
  });

  updateEmotionScore();
}

function addSocialAction(actionKey, dateOverride = todayISO()) {
  const action = socialActions[actionKey];
  if (!action) return null;

  data.emotion.socialLog.push({
    id: crypto.randomUUID(),
    date: dateOverride || todayISO(),
    action: actionKey,
    label: action.label,
    points: action.points,
    cost: 0,
    createdAt: todayISO()
  });

  saveData();
  updateEmotionScore();
  updateDiscipline();
  updateAttraction();
  updateQuickDailyStatus();
  updateProtocolTable();

  return action;
}

function removeSocialToday() {
  const today = todayISO();
  const before = data.emotion.socialLog.length;

  data.emotion.socialLog = data.emotion.socialLog.filter(entry => entry.date !== today);

  const removed = before - data.emotion.socialLog.length;

  saveData();
  updateEmotionScore();
  updateDiscipline();
  updateAttraction();
  updateQuickDailyStatus();

  if (removed > 0) {
    showToast(`${removed} soziale Einträge heute entfernt`);
  } else {
    showToast("Keine sozialen Einträge von heute vorhanden");
  }
}

function updateEmotionScore() {
  const baseScore = roundOne(average(Object.values(data.emotion.base)));
  const practiceScore = calculateSocialPracticeScore();
  const total = roundOne((baseScore * 0.7) + (practiceScore * 0.3));
  const rounded = clamp(Math.round(total), 0, 10);

  scores.emotion = total;

  document.getElementById("emotionBaseScore").textContent = baseScore;
  document.getElementById("emotionTotalScore").textContent = total;
  document.getElementById("emotionTotalName").textContent = emotionNames[rounded];
  document.getElementById("overviewEmotion").textContent = total;
  document.getElementById("overviewEmotionText").textContent = emotionNames[rounded];

  renderSocialLog();
}

function calculateSocialPracticeScore() {
  const log28 = filterLogInLastDays(data.emotion.socialLog, 28);
  const points = log28.reduce((sum, entry) => sum + Number(entry.points || 0), 0);
  const target = Math.max(Number(data.emotion.socialTarget28 || 20), 1);
  const percent = clamp((points / target) * 100, 0, 100);
  const score = percentToLevel(percent);

  scores.social = score;

  const thisMonth = filterLogInMonth(data.emotion.socialLog, 0);
  const lastMonth = filterLogInMonth(data.emotion.socialLog, -1);
  const spentThisMonth = thisMonth.reduce((sum, entry) => sum + Number(entry.cost || 0), 0);
  const budget = Number(data.emotion.socialBudgetMonthly || 0);

  document.getElementById("socialPoints28").textContent = roundOne(points);
  document.getElementById("socialPracticeScore").textContent = score;
  document.getElementById("socialThisMonth").textContent = thisMonth.length;
  document.getElementById("socialLastMonth").textContent = lastMonth.length;
  document.getElementById("socialPracticeText").textContent = `${roundOne(percent)}% vom 28-Tage-Praxisziel erreicht.`;
  document.getElementById("socialSpentThisMonth").textContent = money.format(spentThisMonth);
  document.getElementById("socialBudgetLeft").textContent = money.format(budget - spentThisMonth);

  return score;
}

function renderSocialLog() {
  const container = document.getElementById("socialLogList");
  container.innerHTML = "";

  const latest = [...data.emotion.socialLog].reverse().slice(0, 8);

  if (!latest.length) {
    container.innerHTML = "<p class='hint'>Noch keine sozialen Einträge.</p>";
    return;
  }

  latest.forEach(entry => {
    const div = document.createElement("div");
    div.className = "log-entry";
    div.innerHTML = `
      <strong>${escapeHTML(entry.label)} · +${entry.points} Punkte</strong>
      <small>${entry.date}${entry.cost ? ` · Kosten: ${money.format(entry.cost)}` : ""}</small>
    `;
    container.appendChild(div);
  });
}


const orderDetailLabels = {
  desktop: "🖥 Desktop sortiert",
  tabs: "🌐 Tabs geschlossen",
  files: "📁 Dateien/Downloads geordnet",
  room: "🧺 Zimmer & Schreibtisch aufgeräumt",
  lists: "📝 Listen & Orga sortiert"
};

function ensureOrderDetails() {
  if (!data.mind) data.mind = {};
  if (!data.mind.orderDetails || typeof data.mind.orderDetails !== "object" || Array.isArray(data.mind.orderDetails)) data.mind.orderDetails = {};
  Object.keys(orderDetailLabels).forEach(key => {
    const current = data.mind.orderDetails[key];
    if (Array.isArray(current)) {
      data.mind.orderDetails[key] = [...new Set(current.filter(Boolean))];
    } else if (typeof current === "string" && current) {
      data.mind.orderDetails[key] = [current];
    } else {
      data.mind.orderDetails[key] = [];
    }
  });
}

function isOrderDetailDone(key, date = todayISO()) {
  ensureOrderDetails();
  return isTodayMarkedForDate(data.mind.orderDetails[key], date);
}

function isTodayMarkedForDate(list = [], date = todayISO()) {
  return Array.isArray(list) && list.includes(date);
}

function getOrderDoneKeys(date = todayISO()) {
  ensureOrderDetails();
  return Object.keys(orderDetailLabels).filter(key => isTodayMarkedForDate(data.mind.orderDetails[key], date));
}

function isOrderDone(date = todayISO()) {
  return getOrderDoneKeys(date).length === Object.keys(orderDetailLabels).length;
}

function getOrderTooltipText(date = todayISO()) {
  ensureOrderDetails();
  const lines = ["Ordnung schaffen (klarer Arbeitsplatz)"];
  Object.entries(orderDetailLabels).forEach(([key, label]) => {
    lines.push(`${isTodayMarkedForDate(data.mind.orderDetails[key], date) ? "✓" : "☐"} ${label}`);
  });
  lines.push("");
  lines.push("Effekt: weniger Reibung · weniger Ablenkung · weniger offene Schleifen · mehr Fokus · mehr Kontrolle.");
  return lines.join("\n");
}

function normalizeOrderList(key) {
  ensureOrderDetails();
  if (!orderDetailLabels[key]) return [];
  if (!Array.isArray(data.mind.orderDetails[key])) data.mind.orderDetails[key] = [];
  data.mind.orderDetails[key] = [...new Set(data.mind.orderDetails[key].filter(Boolean))];
  return data.mind.orderDetails[key];
}

function addOrderDate(key, date = todayISO()) {
  const list = normalizeOrderList(key);
  if (!orderDetailLabels[key]) return false;
  if (!list.includes(date)) list.push(date);
  data.mind.orderDetails[key] = list;
  return true;
}

function removeOrderDate(key, date = todayISO()) {
  const list = normalizeOrderList(key);
  if (!orderDetailLabels[key]) return false;
  const next = list.filter(item => item !== date);
  data.mind.orderDetails[key] = next;
  return next.length !== list.length;
}

function setOrderDetail(key, active, date = todayISO()) {
  return active ? addOrderDate(key, date) : removeOrderDate(key, date);
}

function markOrderToday() {
  ensureOrderDetails();
  const wasComplete = isOrderDone();
  Object.keys(orderDetailLabels).forEach(key => setOrderDetail(key, true));
  updateOrderStatus();
  saveData({ sections: ["mind"] });
  try { updateMindScore(); } catch (error) { console.warn("Order mind update failed", error); }
  try { updateDiscipline(); } catch (error) { console.warn("Order discipline update failed", error); }
  try { updateAttraction(); } catch (error) { console.warn("Order attraction update failed", error); }
  try { updateQuickDailyStatus(); } catch (error) { console.warn("Order quick status update failed", error); }
  return !wasComplete;
}

function toggleOrderDetailToday(key) {
  ensureOrderDetails();
  const active = !isOrderDetailDone(key);
  setOrderDetail(key, active);
  updateOrderStatus();
  saveData({ sections: ["mind"] });
  try { updateMindScore(); } catch (error) { console.warn("Order mind update failed", error); }
  try { updateDiscipline(); } catch (error) { console.warn("Order discipline update failed", error); }
  try { updateAttraction(); } catch (error) { console.warn("Order attraction update failed", error); }
  try { updateQuickDailyStatus(); } catch (error) { console.warn("Order quick status update failed", error); }
  return active;
}

function updateOrganizationStatus() {
  const active = isTodayMarked(data.fitness?.organizationDates || []);
  const status = document.getElementById("organizationTodayStatus");
  if (status) status.textContent = active ? "1/1 erledigt" : "0/1 offen";
  const orgButton = document.getElementById("markOrganizationMind");
  if (orgButton) {
    orgButton.classList.remove("active");
    orgButton.dataset.state = active ? "done" : "open";
  }
  return active;
}


function updateOrderStatus() {
  ensureOrderDetails();
  const doneKeys = getOrderDoneKeys();
  const total = Object.keys(orderDetailLabels).length;
  const complete = doneKeys.length === total;

  Object.keys(orderDetailLabels).forEach(key => {
    const button = document.querySelector(`[data-order-key="${key}"]`);
    if (!button) return;
    const active = isOrderDetailDone(key);
    button.classList.remove("active");
    button.dataset.state = active ? "done" : "open";
    button.setAttribute("aria-pressed", active ? "true" : "false");

    const count = button.querySelector("[data-order-count]");
    if (count) count.textContent = active ? "1/1" : "0/1";
  });

  const status = document.getElementById("orderTodayStatus");
  if (status) status.textContent = complete ? "5/5 erledigt" : `${doneKeys.length}/5 offen`;

  const quick = document.getElementById("quickOrder");
  if (quick) {
    quick.classList.remove("active");
    quick.dataset.state = complete ? "done" : "open";
    quick.title = getOrderTooltipText();
  }

  const tile = document.getElementById("fitStatusOrder");
  if (tile) {
    tile.title = getOrderTooltipText();
  }

  updateOrganizationStatus();

  return complete;
}


function resetOrderToday() {
  ensureOrderDetails();
  const today = todayISO();
  Object.keys(orderDetailLabels).forEach(key => {
    removeOrderDate(key, today);
  });
  updateOrderStatus();
  saveData({ sections: ["mind"] });
  try { updateMindScore(); } catch (error) { console.warn("Order mind update failed", error); }
  try { updateDiscipline(); } catch (error) { console.warn("Order discipline update failed", error); }
  try { updateAttraction(); } catch (error) { console.warn("Order attraction update failed", error); }
  try { updateQuickDailyStatus(); } catch (error) { console.warn("Order quick status update failed", error); }
}



window.handleOrderButtonClick = function(event, key) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  const active = toggleOrderDetailToday(key);
  const done = getOrderDoneKeys().length;
  showToast(`${active ? "Erledigt" : "Entfernt"} · Ordnung ${done}/5`);
  return false;
};

window.handleQuickOrderClick = function(event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  const added = markOrderToday();
  showToast(added ? "Ordnung schaffen heute erledigt · 5/5" : "Ordnung schaffen heute war schon markiert");
  return false;
};

window.handleResetOrderClick = function(event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  resetOrderToday();
  showToast("Ordnung schaffen heute entfernt");
  return false;
};


function setupOrderDelegatedClicks() {
  if (window.__orderDelegatedClicksReady) return;
  window.__orderDelegatedClicksReady = true;

  document.addEventListener("click", event => {
    const orderKeyButton = event.target.closest?.("[data-order-key]");
    if (orderKeyButton && !orderKeyButton.getAttribute("onclick")) {
      event.preventDefault();
      const active = toggleOrderDetailToday(orderKeyButton.dataset.orderKey);
      const done = getOrderDoneKeys().length;
      showToast(`${active ? "Erledigt" : "Entfernt"} · Ordnung ${done}/5`);
      return;
    }

    const quickOrder = event.target.closest?.("#quickOrder");
    if (quickOrder && !quickOrder.getAttribute("onclick")) {
      event.preventDefault();
      const added = markOrderToday();
      showToast(added ? "Ordnung schaffen heute erledigt · 5/5" : "Ordnung schaffen heute war schon markiert");
      return;
    }

    const resetOrder = event.target.closest?.("#resetOrderToday");
    if (resetOrder && !resetOrder.getAttribute("onclick")) {
      event.preventDefault();
      resetOrderToday();
      showToast("Ordnung schaffen heute entfernt");
      return;
    }
  }, true);
}


function setupOrderPractice() {
  ensureOrderDetails();
  setupOrderDelegatedClicks();

  document.getElementById("markOrganizationMind")?.addEventListener("click", () => {
    const added = markOrganizationToday();
    showToast(added ? "Organisatorisches heute erledigt" : "Organisatorisches heute war schon markiert");
  });

  document.getElementById("removeOrganizationMind")?.addEventListener("click", () => {
    removeOrganizationToday();
    showToast("Organisatorisches heute entfernt");
  });

  updateOrderStatus();
}

function setupMind() {
  setupMiniNote("mindNote", "mind");

  document.getElementById("meditationTarget28").value = data.mind.meditationTarget28;

  document.getElementById("meditationTarget28").addEventListener("input", event => {
    data.mind.meditationTarget28 = Number(event.target.value || 1);
    saveData();
    updateMeditationScore();
    updateDiscipline();
    updateMindScore();
    updateAttraction();
  });

  document.getElementById("mindOutingTarget28").value = data.mind.outingTarget28;
  document.getElementById("mindOutingTarget28").addEventListener("input", event => {
    data.mind.outingTarget28 = Number(event.target.value || 1);
    saveData();
    updateOutingScore();
    updateDiscipline();
    updateAttraction();
  });

  document.getElementById("markMeditationToday").addEventListener("click", () => {
    const added = markMeditationToday();
    showRoutineToast("Meditation", data.mind.meditationTarget28, added);
  });

  document.getElementById("removeMeditationToday").addEventListener("click", () => {
    removeMeditationToday();
    showToast("Meditation heute entfernt");
  });

  document.getElementById("markOutingToday").addEventListener("click", () => {
    const added = markOutingToday();
    showRoutineToast("Draußen gewesen", data.mind.outingTarget28, added);
  });

  document.getElementById("removeOutingToday").addEventListener("click", () => {
    removeOutingToday();
    showToast("Draußen heute entfernt");
  });

  createSliderGroup({
    object: data.mind,
    containerId: "mindMetrics",
    descriptions: mindDescriptions,
    allowedKeys: ["weltbild", "perspektivenfaehigkeit", "intuition", "loslassen", "klarheit"],
    onUpdate: () => {
      updateMindScore();
      updateAttraction();
    }
  });

  setupOrderPractice();

  updateMeditationScore();
  updateOutingScore();
  updateOrderStatus();
  updateMindScore();
}

function markMeditationToday() {
  const added = addDateOnce(data.mind.meditationDates, todayISO());
  saveData();
  updateMeditationScore();
  updateDiscipline();
  updateMindScore();
  updateAttraction();
  updateQuickDailyStatus();
  return added;
}

function removeMeditationToday() {
  data.mind.meditationDates = removeDate(data.mind.meditationDates, todayISO());
  saveData();
  updateMeditationScore();
  updateDiscipline();
  updateMindScore();
  updateAttraction();
  updateQuickDailyStatus();
}

function updateMeditationScore() {
  const count = countDatesInLastDays(data.mind.meditationDates, 28);
  const target = Math.max(Number(data.mind.meditationTarget28 || 12), 1);
  const percent = clamp((count / target) * 100, 0, 100);
  const score = percentToLevel(percent);

  scores.meditation = score;

  document.getElementById("meditationCount28").textContent = count;
  document.getElementById("meditationThisMonth").textContent = countDatesInMonth(data.mind.meditationDates, 0);
  document.getElementById("meditationLastMonth").textContent = countDatesInMonth(data.mind.meditationDates, -1);
  document.getElementById("meditationScore").textContent = score;
  if (document.getElementById("meditationText")) {
    document.getElementById("meditationText").textContent = `${roundOne(percent)}% vom 28-Tage-Ziel erreicht.`;
  }

  return score;
}

function updateMindScore() {
  const manualValues = [
    data.mind.weltbild,
    data.mind.perspektivenfaehigkeit,
    data.mind.intuition,
    data.mind.loslassen,
    data.mind.klarheit,
    scores.meditation,
    scores.discipline
  ];

  const score = roundOne(average(manualValues));
  const rounded = clamp(Math.round(score), 0, 10);

  scores.mind = score;

  document.getElementById("mindScore").textContent = score;
  document.getElementById("mindName").textContent = mindNames[rounded];
  document.getElementById("overviewMind").textContent = score;
  document.getElementById("overviewMindText").textContent = mindNames[rounded];
}

function updateDiscipline() {
  const skillActivity = calculateSkillActivityScore();

  const training = scoreDatesCurrentAndLastMonth(
    data.fitness.trainingDates,
    data.fitness.trainingTarget28
  );

  const yoga = scoreDatesCurrentAndLastMonth(
    data.fitness.yogaDates,
    data.fitness.yogaTarget28
  );

  const breath = scoreDatesCurrentAndLastMonth(
    data.fitness.breathDates,
    data.fitness.breathTarget28
  );

  const cold = scoreDatesCurrentAndLastMonth(
    data.fitness.coldDates,
    data.fitness.coldTarget28
  );

  const bodyCare = scoreDatesCurrentAndLastMonth(
    data.fitness.bodyCareDates,
    data.fitness.bodyCareTarget28
  );

  const outing = scoreDatesRolling56(
    data.mind.outingDates || [],
    data.mind.outingTarget28 || 12
  );

  const meditation = scoreDatesCurrentAndLastMonth(
    data.mind.meditationDates,
    data.mind.meditationTarget28
  );

  const social = scoreSocialCurrentAndLastMonth();
  const mediaFrame = calculateCaveAdherence(
    Number(data.gaming.weekFrameHours || 0),
    getCaveActualHours()
  );

  const disciplineValues = {
    skillActivity,
    training,
    yoga,
    breath,
    cold,
    bodyCare,
    outing,
    meditation,
    social,
    mediaFrame
  };

  const disciplineWeightKeys = Object.keys(data.disciplineWeights || {});
  const missingDisciplineKeys = Object.keys(defaultDisciplineWeights).some(key => !disciplineWeightKeys.includes(key));
  if (missingDisciplineKeys) {
    data.disciplineWeights = structuredClone(defaultDisciplineWeights);
    saveData();
  }

  const score = roundOne(weightedAverage(disciplineValues, data.disciplineWeights || defaultDisciplineWeights));

  const rounded = clamp(Math.round(score), 0, 10);

  scores.skillActivity = skillActivity;
  scores.training = training;
  scores.yoga = yoga;
  scores.breath = breath;
  scores.cold = cold;
  scores.bodyCare = bodyCare;
  scores.outing = outing;
  scores.mediaFrame = mediaFrame;
  scores.meditation = meditation;
  scores.social = social;
  scores.discipline = score;

  document.getElementById("disciplineSkills").textContent = skillActivity;
  document.getElementById("disciplineTraining").textContent = training;
  document.getElementById("disciplineYoga").textContent = yoga;
  document.getElementById("disciplineBreath").textContent = breath;
  if (document.getElementById("disciplineOuting")) document.getElementById("disciplineOuting").textContent = outing;
  if (document.getElementById("disciplineMediaFrame")) document.getElementById("disciplineMediaFrame").textContent = mediaFrame;
  if (document.getElementById("disciplineCold")) document.getElementById("disciplineCold").textContent = cold;
  if (document.getElementById("disciplineBodyCare")) document.getElementById("disciplineBodyCare").textContent = bodyCare;
  document.getElementById("disciplineMeditation").textContent = meditation;
  document.getElementById("disciplineSocial").textContent = social;
  document.getElementById("disciplineScore").textContent = score;
  document.getElementById("disciplineName").textContent = disciplineNames[rounded];

  document.getElementById("overviewDiscipline").textContent = score;
  document.getElementById("overviewDisciplineText").textContent = disciplineNames[rounded];

  renderDisciplineBreakdown(disciplineValues, data.disciplineWeights || defaultDisciplineWeights, score);
  updateMindScore();
}

function renderDisciplineBreakdown(values, weights, finalScore) {
  const container = document.getElementById("disciplineBreakdown");
  if (!container) return;

  const labels = {
    skillActivity: "Skill-Aktivität",
    training: "Training",
    yoga: "Yoga",
    breath: "Atemübungen",
    cold: "Kältetraining",
    bodyCare: "Körperpflege",
    outing: "Rausgegangen",
    meditation: "Meditation",
    social: "Soziale Praxis",
    mediaFrame: "Medien-Rahmentreue",
    mediaFrame: "Medien-Rahmentreue"
  };

  const mergedWeights = mergeDeep(structuredClone(defaultDisciplineWeights), weights || {});
  const totalWeight = Object.values(mergedWeights).reduce((sum, value) => sum + Number(value || 0), 0);
  const safeTotal = totalWeight > 0 ? totalWeight : Object.keys(values).length;

  let html = `
    <div class="discipline-breakdown-header">
      <span>Baustein</span>
      <span>Wert</span>
      <span>Gewicht</span>
      <span>Beitrag</span>
    </div>
  `;

  Object.entries(values).forEach(([key, value]) => {
    const weight = totalWeight > 0 ? Number(mergedWeights[key] || 0) : 1;
    const relativeWeight = safeTotal > 0 ? (weight / safeTotal) * 100 : 0;
    const contribution = Number(value || 0) * (relativeWeight / 100);

    html += `
      <div class="discipline-breakdown-row">
        <span>${escapeHTML(labels[key] || key)}</span>
        <strong>${roundOne(value)}</strong>
        <em>${roundOne(relativeWeight)}%</em>
        <b>${roundOne(contribution)}</b>
      </div>
    `;
  });

  html += `
    <div class="discipline-breakdown-result">
      <span>Disziplin gesamt</span>
      <strong>${roundOne(finalScore)}/10</strong>
    </div>
  `;

  container.innerHTML = html;
}

function setupDisciplineWeights() {
  const labels = {
    skillActivity: "Skill-Aktivität",
    training: "Training",
    yoga: "Yoga",
    breath: "Atemübungen",
    cold: "Kältetraining",
    bodyCare: "Körperpflege",
    outing: "Rausgegangen",
    meditation: "Meditation",
    social: "Soziale Praxis",
    mediaFrame: "Medien-Rahmentreue",
    mediaFrame: "Medien-Rahmentreue"
  };

  const container = document.getElementById("disciplineWeights");
  if (!container) return;

  container.innerHTML = "";

  const existingDisciplineKeys = Object.keys(data.disciplineWeights || {});
  const defaultDisciplineKeys = Object.keys(defaultDisciplineWeights);
  const missingNewDisciplineKeys = defaultDisciplineKeys.some(key => !existingDisciplineKeys.includes(key));
  data.disciplineWeights = missingNewDisciplineKeys
    ? structuredClone(defaultDisciplineWeights)
    : mergeDeep(structuredClone(defaultDisciplineWeights), data.disciplineWeights || {});

  Object.keys(defaultDisciplineWeights).forEach(key => {
    const row = document.createElement("div");
    row.className = "metric-row";

    const label = document.createElement("label");
    label.textContent = labels[key];

    const input = document.createElement("input");
    input.type = "range";
    input.min = 0;
    input.max = 50;
    input.step = 0.5;
    input.value = data.disciplineWeights[key];

    const number = document.createElement("strong");
    number.textContent = `${roundOne(data.disciplineWeights[key])}%`;

    input.addEventListener("input", () => {
      data.disciplineWeights[key] = Number(input.value || 0);
      number.textContent = `${roundOne(data.disciplineWeights[key])}%`;
      saveData();
      updateDiscipline();
      updateDisciplineWeightTotal();
      updateAttraction();
    });

    row.appendChild(label);
    row.appendChild(input);
    row.appendChild(number);
    container.appendChild(row);
  });

  const resetButton = document.getElementById("resetDisciplineWeights");
  if (resetButton) {
    resetButton.onclick = () => {
      data.disciplineWeights = structuredClone(defaultDisciplineWeights);
      saveData();
      setupDisciplineWeights();
      updateDiscipline();
      updateAttraction();
      showToast("Disziplin-Gewichtung zurückgesetzt");
    };
  }

  updateDisciplineWeightTotal();
}

function updateDisciplineWeightTotal() {
  const total = Object.values(data.disciplineWeights || {}).reduce((sum, value) => sum + Number(value || 0), 0);
  const el = document.getElementById("disciplineWeightTotal");
  if (el) el.textContent = `${roundOne(total)}%`;
}

function calculateSkillActivityScore() {
  const activeGoals = getActiveGoals();
  if (!activeGoals.length) return 0;

  const values = activeGoals.map(goal => {
    const days = daysSince(goal.lastDone);
    if (days === 0) return 10;
    if (days <= 2) return 8;
    if (days <= 6) return 5;
    return 1;
  });

  return roundOne(average(values));
}

function createSliderGroup({ object, containerId, descriptions, onUpdate, allowedKeys = null }) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";

  const entries = Object.entries(object).filter(([key]) => {
    return allowedKeys ? allowedKeys.includes(key) : typeof object[key] === "number";
  });

  entries.forEach(([key, value]) => {
    const row = document.createElement("div");
    row.className = "metric-row";

    const label = document.createElement("label");
    label.textContent = readableKey(key);

    const slider = document.createElement("input");
    slider.type = "range";
    slider.min = 0;
    slider.max = 10;
    slider.value = value;

    const number = document.createElement("strong");
    number.textContent = value;

    const description = document.createElement("div");
    description.className = "metric-description";
    description.textContent = descriptions[key][value];

    slider.addEventListener("input", () => {
      object[key] = Number(slider.value);
      number.textContent = slider.value;
      description.textContent = descriptions[key][slider.value];
      saveData();
      onUpdate();
    });

    row.appendChild(label);
    row.appendChild(slider);
    row.appendChild(number);
    row.appendChild(description);
    container.appendChild(row);
  });
}

function setupAttractionWeights() {
  const labels = {
    finance: "Finanzen",
    fitness: "Fitness",
    health: "Gesundheit",
    life: "Lebenssituation",
    goals: "Ziele & Skills",
    emotion: "Emotion",
    mind: "Reflexion",
    discipline: "Disziplin"
  };

  const container = document.getElementById("attractionWeights");
  container.innerHTML = "";

  Object.keys(defaultWeights).forEach(key => {
    const row = document.createElement("div");
    row.className = "metric-row";

    const label = document.createElement("label");
    label.textContent = labels[key];

    const input = document.createElement("input");
    input.type = "range";
    input.min = 0;
    input.max = 50;
    input.value = data.attractionWeights[key];

    const number = document.createElement("strong");
    number.textContent = `${data.attractionWeights[key]}%`;

    input.addEventListener("input", () => {
      data.attractionWeights[key] = Number(input.value || 0);
      number.textContent = `${data.attractionWeights[key]}%`;
      saveData();
      updateAttraction();
    });

    row.appendChild(label);
    row.appendChild(input);
    row.appendChild(number);
    container.appendChild(row);
  });

  document.getElementById("resetWeights").addEventListener("click", () => {
    data.attractionWeights = structuredClone(defaultWeights);
    saveData();
    setupAttractionWeights();
    updateAttraction();
  });

  updateAttraction();
}

function updateAttraction() {
  const weights = data.attractionWeights;
  const totalWeight = Object.values(weights).reduce((sum, value) => sum + Number(value || 0), 0);

  let weightedSum = 0;

  Object.entries(weights).forEach(([key, weight]) => {
    weightedSum += Number(scores[key] || 0) * Number(weight || 0);
  });

  const score = totalWeight > 0 ? roundOne(weightedSum / totalWeight) : 0;
  const rounded = clamp(Math.round(score), 0, 10);

  scores.attraction = score;

  document.getElementById("attractionScore").textContent = score;
  document.getElementById("overviewAttraction").textContent = score;
  document.getElementById("overviewAttractionText").textContent = attractionNames[rounded];
  document.getElementById("attractionDescription").textContent = attractionNames[rounded];
  document.getElementById("weightTotal").textContent = `${totalWeight}%`;
}

function clearGoalForm() {
  document.getElementById("goalName").value = "";
  document.getElementById("goalStart").value = "";
  document.getElementById("goalTarget").value = "";
  document.getElementById("goalDaily").value = "";
  document.getElementById("goalDailyRequiredClicks").value = "";
  document.getElementById("goalArea").value = "1";
}

function createGoalFromForm({ endless = false } = {}) {
  const name = document.getElementById("goalName").value.trim();
  const start = document.getElementById("goalStart").value.trim();
  const target = document.getElementById("goalTarget").value.trim();
  const daily = Number(document.getElementById("goalDaily").value || 0);
  const dailyRequiredClicks = Math.max(1, Math.round(Number(document.getElementById("goalDailyRequiredClicks").value || 1)));
  const area = Number(document.getElementById("goalArea").value || 1);

  if (!name) return;

  data.goals.push({
    id: crypto.randomUUID(),
    name,
    start: endless ? "Endlos" : (start || "0%"),
    target: endless ? "fortlaufend" : (target || "100%"),
    progress: endless ? 0 : 0,
    dailyIncrement: endless ? 0 : (daily || 0.02),
    dailyRequiredClicks,
    area,
    endless,
    active: true,
    createdAt: todayISO(),
    lastDone: null,
    todayAdds: []
  });

  clearGoalForm();

  saveData();
  renderGoals();
  renderQuickGoals();
  updateQuickDailyStatus();
  updateLifeScore();
  updateDiscipline();
  updateAttraction();

  showToast(endless ? `Endlosziel erstellt: ${name}` : `Ziel erstellt: ${name}`);
}

function setupGoals() {
  document.getElementById("addGoal").addEventListener("click", () => createGoalFromForm({ endless: false }));
  document.getElementById("addEndlessGoal")?.addEventListener("click", () => createGoalFromForm({ endless: true }));

  document.getElementById("undoTodayGoalCompletions")?.addEventListener("click", undoTodayGoalCompletions);
  document.getElementById("goalEditClose")?.addEventListener("click", closeGoalEditModal);
  document.getElementById("goalEditSave")?.addEventListener("click", saveGoalEditModal);

  renderGoals();
  renderQuickGoals();
}


function getGoalDailyRequiredClicks(goal) {
  const raw = Number(goal?.dailyRequiredClicks || 1);
  return Number.isFinite(raw) && raw > 0 ? Math.max(1, Math.round(raw)) : 1;
}

function getGoalTodayClickCount(goal, date = todayISO()) {
  if (!Array.isArray(goal?.todayAdds)) return 0;
  return goal.todayAdds.filter(entry => entry.date === date).length;
}

function isGoalDoneForDate(goal, date = todayISO()) {
  return getGoalTodayClickCount(goal, date) >= getGoalDailyRequiredClicks(goal);
}

function updateGoalLastDoneFromClicks(goal, date = todayISO()) {
  if (isGoalDoneForDate(goal, date)) {
    goal.lastDone = date;
  } else if (goal.lastDone === date) {
    goal.lastDone = null;
  }
}

function getGoalDailyClickLabel(goal, date = todayISO()) {
  const count = getGoalTodayClickCount(goal, date);
  const required = getGoalDailyRequiredClicks(goal);
  return `${Math.min(count, required)}/${required}`;
}


function renderGoals() {
  const list = document.getElementById("goalsList");
  list.innerHTML = "";

  if (!data.goals.length) {
    const empty = document.createElement("div");
    empty.className = "card neutral-card";
    empty.innerHTML = "<p class='hint'>Noch keine Ziele eingetragen.</p>";
    list.appendChild(empty);
    updateGoalSummary();
    return;
  }

  data.goals.forEach(goal => {
    const card = document.createElement("div");
    card.className = `goal-card ${getGoalStatusClass(goal)}`;
    const status = getGoalStatusText(goal);

    card.innerHTML = `
      <div class="goal-top">
        <div>
          <div class="goal-title">${escapeHTML(goal.name)}</div>
          <div class="goal-meta">
            ${goal.endless
              ? `Endlosziel · Tagesziel-Klicks: ${getGoalDailyRequiredClicks(goal)} · Heute: ${getGoalDailyClickLabel(goal)} · Letzter Eintrag: ${goal.lastDone || "nie"}`
              : `${escapeHTML(goal.start)} → ${escapeHTML(goal.target)} · Tageswert: ${formatPercent(goal.dailyIncrement)} · Tagesziel-Klicks: ${getGoalDailyRequiredClicks(goal)} · Heute: ${getGoalDailyClickLabel(goal)} · Letzter Eintrag: ${goal.lastDone || "nie"}`
            }
          </div>
          <div class="goal-area-badge">${goal.endless ? "Endlosziel · " : ""}Skill-Bereich ${Number(goal.area || 1)}</div>
        </div>
        <span class="status-pill">${status}</span>
      </div>

      ${goal.endless ? "" : `
        <div class="progress-shell">
          <div class="progress-bar" style="width: ${clamp(goal.progress, 0, 100)}%"></div>
        </div>
      `}

      <div>${goal.endless ? "Status" : "Fortschritt"}: <strong>${goal.endless ? (isGoalDoneForDate(goal) ? "heute getan" : `offen · ${getGoalDailyClickLabel(goal)}`) : `${formatPercent(goal.progress)} · heute ${getGoalDailyClickLabel(goal)}`}</strong></div>

      <div class="goal-actions">
        <button data-action="add" data-id="${goal.id}">${goal.endless ? `Heute getan (${getGoalDailyClickLabel(goal)})` : `Klick +${formatPercent(goal.dailyIncrement)} (${getGoalDailyClickLabel(goal)})`}</button>
        <button data-action="edit" data-id="${goal.id}">Bearbeiten</button>
        <button data-action="custom" data-id="${goal.id}">Manuell addieren</button>
        <button data-action="setprogress" data-id="${goal.id}">Prozent setzen</button>
        <select class="goal-area-select" data-action="setarea" data-id="${goal.id}">
          <option value="1" ${Number(goal.area || 1) === 1 ? 'selected' : ''}>Skill-Bereich 1 · Auswandern</option>
          <option value="2" ${Number(goal.area || 1) === 2 ? 'selected' : ''}>Skill-Bereich 2 · Lesen</option>
          <option value="3" ${Number(goal.area || 1) === 3 ? 'selected' : ''}>Skill-Bereich 3 · Bildschirmarbeit</option>
          <option value="4" ${Number(goal.area || 1) === 4 ? 'selected' : ''}>Skill-Bereich 4 · Wohnsituation</option>
          <option value="5" ${Number(goal.area || 1) === 5 ? 'selected' : ''}>Skill-Bereich 5 · Bewerbung</option>
        </select>
        <button data-action="toggle" data-id="${goal.id}">
          ${goal.active ? "Auf inaktiv setzen" : "Auf aktiv setzen"}
        </button>
        <button data-action="delete" data-id="${goal.id}">Löschen</button>
      </div>
    `;

    list.appendChild(card);
  });

  list.querySelectorAll("button").forEach(button => {
    button.addEventListener("click", () => handleGoalAction(button.dataset.id, button.dataset.action));
  });

  list.querySelectorAll("select[data-action='setarea']").forEach(select => {
    select.addEventListener("change", () => handleGoalAction(select.dataset.id, "setarea", select.value));
  });

  updateGoalSummary();
}

function handleGoalAction(id, action, value = null) {
  const goal = data.goals.find(item => item.id === id);
  if (!goal) return;

  if (action === "add") {
    const increment = goal.endless ? 0 : Number(goal.dailyIncrement || 0);
    const today = todayISO();
    if (!goal.endless) {
      goal.progress = clamp(Number(goal.progress) + increment, 0, 100);
    }
    if (!Array.isArray(goal.todayAdds)) goal.todayAdds = [];
    goal.todayAdds.push({
      id: crypto.randomUUID(),
      date: today,
      amount: increment
    });
    updateGoalLastDoneFromClicks(goal, today);

    const clickLabel = getGoalDailyClickLabel(goal, today);
    const doneText = isGoalDoneForDate(goal, today) ? "Tagesziel erreicht" : "Tagesziel offen";
    showToast(goal.endless ? `${clickLabel} · ${doneText} · ${goal.name}` : `+${formatPercent(increment)} · ${clickLabel} · ${doneText} · ${goal.name}`);
  }

  if (action === "edit") {
    openGoalEditModal(id);
    return;
  }

  if (action === "custom") {
    if (goal.endless) {
      showToast("Endlosziele haben keinen Prozentwert");
    } else {
      const amount = Number(prompt("Wie viel Prozent möchtest du addieren?", goal.dailyIncrement) || 0);
      goal.progress = clamp(Number(goal.progress) + amount, 0, 100);
      if (!Array.isArray(goal.todayAdds)) goal.todayAdds = [];
      goal.todayAdds.push({
        id: crypto.randomUUID(),
        date: todayISO(),
        amount
      });
      updateGoalLastDoneFromClicks(goal, todayISO());
      showToast(`+${formatPercent(amount)} · ${goal.name}`);
    }
  }

  if (action === "setprogress") {
    if (goal.endless) {
      showToast("Endlosziele haben keinen Prozentwert");
    } else {
      const amount = Number(prompt("Auf wie viel Prozent setzen?", goal.progress) || goal.progress);
      goal.progress = clamp(amount, 0, 100);
      showToast(`${goal.name}: ${formatPercent(goal.progress)}`);
    }
  }

  if (action === "setarea") {
    goal.area = clamp(Number(value || 1), 1, 5);
    showToast(`${goal.name}: Skill-Bereich ${goal.area}`);
  }

  if (action === "toggle") {
    goal.active = !goal.active;
    showToast(goal.active ? `${goal.name} aktiv` : `${goal.name} inaktiv`);
  }

  if (action === "delete") {
    const confirmed = confirm(`Ziel "${goal.name}" wirklich löschen?`);
    if (confirmed) {
      data.goals = data.goals.filter(item => item.id !== id);
      showToast(`Ziel gelöscht: ${goal.name}`);
    }
  }

  saveData();
  renderGoals();
  renderQuickGoals();
  updateQuickDailyStatus();
  updateLifeScore();
  updateDiscipline();
  updateAttraction();
}


function openGoalEditModal(id) {
  const goal = data.goals.find(item => item.id === id);
  if (!goal) return;

  document.getElementById("goalEditId").value = goal.id;
  document.getElementById("goalEditName").value = goal.name || "";
  document.getElementById("goalEditStart").value = goal.start || "";
  document.getElementById("goalEditTarget").value = goal.target || "";
  document.getElementById("goalEditEndless").checked = !!goal.endless;
  document.getElementById("goalEditProgress").value = Number(goal.progress || 0);
  document.getElementById("goalEditDaily").value = Number(goal.dailyIncrement || 0);
  document.getElementById("goalEditDailyRequiredClicks").value = getGoalDailyRequiredClicks(goal);
  document.getElementById("goalEditArea").value = String(Number(goal.area || 1));

  document.getElementById("goalEditModal").classList.remove("hidden");
}

function closeGoalEditModal() {
  document.getElementById("goalEditModal")?.classList.add("hidden");
}

function saveGoalEditModal() {
  const id = document.getElementById("goalEditId").value;
  const goal = data.goals.find(item => item.id === id);
  if (!goal) return;

  goal.name = document.getElementById("goalEditName").value.trim() || goal.name;
  goal.start = document.getElementById("goalEditStart").value.trim() || "0%";
  goal.target = document.getElementById("goalEditTarget").value.trim() || "100%";
  goal.endless = !!document.getElementById("goalEditEndless").checked;
  goal.progress = goal.endless ? 0 : clamp(Number(document.getElementById("goalEditProgress").value || 0), 0, 100);
  goal.dailyIncrement = goal.endless ? 0 : Number(document.getElementById("goalEditDaily").value || 0);
  goal.dailyRequiredClicks = Math.max(1, Math.round(Number(document.getElementById("goalEditDailyRequiredClicks").value || 1)));
  updateGoalLastDoneFromClicks(goal, todayISO());
  goal.area = clamp(Number(document.getElementById("goalEditArea").value || 1), 1, 5);

  saveData();
  closeGoalEditModal();
  renderGoals();
  renderQuickGoals();
  updateQuickDailyStatus();
  updateLifeScore();
  updateDiscipline();
  updateAttraction();

  showToast(`Ziel gespeichert: ${goal.name}`);
}

function undoTodayGoalCompletions() {
  const today = todayISO();
  let undoneCount = 0;
  let undonePercent = 0;

  (data.goals || []).forEach(goal => {
    if (!Array.isArray(goal.todayAdds)) goal.todayAdds = [];
    const todayAdds = goal.todayAdds.filter(entry => entry.date === today);
    if (!todayAdds.length) return;

    const amount = todayAdds.reduce((sum, entry) => sum + Number(entry.amount || 0), 0);
    goal.progress = clamp(Number(goal.progress || 0) - amount, 0, 100);
    goal.todayAdds = goal.todayAdds.filter(entry => entry.date !== today);
    undoneCount += todayAdds.length;
    undonePercent += amount;

    updateGoalLastDoneFromClicks(goal, today);
  });

  saveData();
  renderGoals();
  renderQuickGoals();
  updateQuickDailyStatus();
  updateLifeScore();
  updateDiscipline();
  updateAttraction();

  if (undoneCount) {
    showToast(`${undoneCount} heutige Ziel-Erledigung(en) zurückgesetzt · -${formatPercent(undonePercent)}`);
  } else {
    showToast("Keine heutigen Ziel-Erledigungen zum Zurücksetzen vorhanden");
  }
}

function renderQuickGoals() {
  const container = document.getElementById("quickGoalsList");
  container.innerHTML = "";

  const activeGoals = getActiveGoals();

  if (!activeGoals.length) {
    container.innerHTML = "<p class='hint'>Keine aktiven Ziele vorhanden.</p>";
    return;
  }

  activeGoals.forEach(goal => {
    const button = document.createElement("button");
    button.className = getGoalStatusClass(goal);
    button.textContent = goal.endless
      ? `[B${Number(goal.area || 1)}] ${goal.name} · ${getGoalDailyClickLabel(goal)} · ${getGoalStatusText(goal)}`
      : `[B${Number(goal.area || 1)}] ${goal.name} +${formatPercent(goal.dailyIncrement)} · ${getGoalDailyClickLabel(goal)} · ${getGoalStatusText(goal)}`;
    button.addEventListener("click", () => handleGoalAction(goal.id, "add"));
    container.appendChild(button);
  });
}

function getActiveGoals() {
  return data.goals.filter(goal => goal.active);
}

function getProgressGoals() {
  return getActiveGoals().filter(goal => !goal.endless);
}

function getActiveGoalAverage() {
  const progressGoals = getProgressGoals();
  if (!progressGoals.length) return 0;
  return average(progressGoals.map(goal => Number(goal.progress || 0)));
}

function updateGoalSummary() {
  const activeGoals = getActiveGoals();
  const progressGoals = getProgressGoals();
  const endlessGoals = activeGoals.filter(goal => goal.endless);
  const averageProgress = getActiveGoalAverage();

  scores.goals = percentToLevel(averageProgress);

  let green = 0;
  let orange = 0;
  let red = 0;
  let inactive = 0;

  data.goals.forEach(goal => {
    if (!goal.active) {
      inactive++;
      return;
    }

    const days = daysSince(goal.lastDone);
    if (days <= 2) green++;
    else if (days <= 6) orange++;
    else red++;
  });

  document.getElementById("activeGoalCount").textContent = activeGoals.length;
  document.getElementById("goalAverage").textContent = formatPercentTwoDecimals(averageProgress);
  document.getElementById("goalGreenCount").textContent = green;
  document.getElementById("goalOrangeCount").textContent = orange;
  document.getElementById("goalRedCount").textContent = red;
  document.getElementById("goalInactiveCount").textContent = inactive;

  document.getElementById("overviewGoals").textContent = formatPercentTwoDecimals(averageProgress);
  document.getElementById("overviewGoalsText").textContent =
    activeGoals.length
      ? `${activeGoals.length} aktiv · ${progressGoals.length} Prozentziel(e) · ${endlessGoals.length} Endlosziel(e) · ${green} grün · ${orange} orange · ${red} rot`
      : "keine aktiven Ziele";

  updateLifeScore();
  updateDiscipline();
}

function getGoalStatusClass(goal) {
  if (!goal.active) return "status-gray";

  const days = daysSince(goal.lastDone);

  if (days <= 2) return "status-green";
  if (days <= 6) return "status-orange";
  return "status-red";
}

function getGoalStatusText(goal) {
  if (!goal.active) return "inaktiv";

  const todayClicks = getGoalDailyClickLabel(goal);
  const days = daysSince(goal.lastDone);

  if (days === Infinity) return `noch nicht gestartet · heute ${todayClicks}`;
  if (days === 0) return `heute aktiv · ${todayClicks}`;
  if (days <= 2) return `${days} Tage her · heute ${todayClicks}`;
  if (days <= 6) return `${days} Tage Pause · heute ${todayClicks}`;
  return `${days} Tage nichts getan · heute ${todayClicks}`;
}



function markOrganizationToday() {
  if (!Array.isArray(data.fitness.organizationDates)) data.fitness.organizationDates = [];
  const today = todayISO();
  const added = !data.fitness.organizationDates.includes(today);
  if (added) data.fitness.organizationDates.push(today);
  updateOrganizationStatus();
  saveData();
  updateDiscipline();
  updateAttraction();
  updateQuickDailyStatus();
  updateProtocolTable();
  return added;
}

function removeOrganizationToday() {
  const today = todayISO();
  data.fitness.organizationDates = Array.isArray(data.fitness.organizationDates)
    ? data.fitness.organizationDates.filter(item => item !== today)
    : [];
  updateOrganizationStatus();
  saveData();
  updateDiscipline();
  updateAttraction();
  updateQuickDailyStatus();
  updateProtocolTable();
}

function isTodayMarked(list = []) {
  return Array.isArray(list) && list.includes(todayISO());
}

function getTodaySocialEntries() {
  return (data.emotion.socialLog || []).filter(entry => entry.date === todayISO());
}

function getTodaySkillAreasDone() {
  const done = new Set();
  (data.goals || []).forEach(goal => {
    if (isGoalDoneForDate(goal, todayISO())) done.add(Number(goal.area || 1));
  });
  return done;
}

function setStatusTileActive(elementId, active, activeLabel = "aktiv", inactiveLabel = "offen") {
  const el = document.getElementById(elementId);
  if (!el) return;
  el.classList.toggle('status-active', !!active);
  el.dataset.state = active ? "done" : "open";
  const small = el.querySelector('small');
  if (small && el.classList.contains('status-main-tile')) {
    small.textContent = active ? activeLabel : inactiveLabel;
  }
}


function getProtocolStartDate() {
  if (!data.quickEntry) data.quickEntry = {};
  if (!data.quickEntry.protocolStartDate) {
    data.quickEntry.protocolStartDate = todayISO();
    saveData();
  }
  return data.quickEntry.protocolStartDate;
}

function protocolDayDiff(date, reference = todayISO()) {
  const a = new Date(`${date}T12:00:00`);
  const b = new Date(`${reference}T12:00:00`);
  return Math.floor((b - a) / 86400000);
}

function getProtocolDateSet() {
  const start = getProtocolStartDate();
  const end = todayISO();
  const rows = [];

  let cursor = start <= end ? start : end;
  while (cursor <= end) {
    rows.push(cursor);
    cursor = addDaysISO(cursor, 1);
  }

  if (!rows.includes(todayISO())) rows.push(todayISO());
  return [...new Set(rows)].sort();
}

function getProtocolSkillAreasForDate(date) {
  const areas = new Set();

  (data.goals || []).forEach(goal => {
    const area = clamp(Number(goal.area || 1), 1, 5);

    if (isGoalDoneForDate(goal, date)) {
      areas.add(area);
    }
  });

  const manual = data.quickEntry?.protocolManualSkills || {};
  ["1","2","3","4","5"].forEach(area => {
    if ((manual[area] || []).includes(date)) areas.add(Number(area));
  });

  return areas;
}

function formatProtocolDate(date) {
  const parsed = new Date(`${date}T12:00:00`);
  return new Intl.DateTimeFormat("de-DE", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  }).format(parsed);
}

function getDisciplineWindowPosition(date) {
  const diff = protocolDayDiff(date, todayISO());
  if (diff < 0 || diff >= 56) return null;
  return diff + 1;
}

function isDateInDisciplineWindow(date) {
  const diff = protocolDayDiff(date, todayISO());
  return diff >= 0 && diff < 56;
}

function protocolCell(done, emoji, label, date, key = "") {
  const todayClass = date === todayISO() ? "today-cell" : "";
  const editAttr = key ? ` data-protocol-key="${escapeHTML(key)}" data-protocol-date="${escapeHTML(date)}"` : "";
  return done
    ? `<button type="button" class="protocol-cell-chip active ${todayClass}" title="${escapeHTML(label)}"${editAttr}>${emoji}</button>`
    : `<button type="button" class="protocol-cell-chip open ${todayClass}" title="${escapeHTML(label)}"${editAttr}>${emoji}</button>`;
}

function updateProtocolTable() {
  const tbody = document.getElementById("protocolTableBody");
  if (!tbody) return;

  document.getElementById("protocol")?.classList.toggle("protocol-edit-mode", Boolean(data.quickEntry?.protocolEditMode));
  const editButton = document.getElementById("toggleProtocolEdit");
  if (editButton) editButton.textContent = data.quickEntry?.protocolEditMode ? "Bearbeiten beenden" : "Vergangene Tage bearbeiten";

  const dates = getProtocolDateSet();
  const newestFirst = [...dates].sort().reverse();

  tbody.innerHTML = "";

  newestFirst.forEach(date => {
    const skillAreas = getProtocolSkillAreasForDate(date);
    const socialEntries = (data.emotion.socialLog || []).filter(entry => entry.date === date);
    const inWindow = isDateInDisciplineWindow(date);
    const windowPosition = getDisciplineWindowPosition(date);

    const wellCells = [
      protocolCell((data.fitness.yogaDates || []).includes(date), "🤸‍♂️", "Yoga", date, "yoga"),
      protocolCell((data.fitness.breathDates || []).includes(date), "🌬️", "Atemübung", date, "breath"),
      protocolCell((data.fitness.bodyCareDates || []).includes(date), "🚿", "Körperpflege", date, "bodyCare"),
      protocolCell((data.fitness.coldDates || []).includes(date), "❄️", "Kälte-/Kreislauftraining", date, "cold"),
      protocolCell((data.mind.meditationDates || []).includes(date), "🧘‍♂️", "Meditation", date, "meditation"),
      protocolCell((data.fitness.organizationDates || []).includes(date), "📝", "Organisatorisches", date, "organization"),
      protocolCell(isOrderDone(date), "🧹", "Ordnung schaffen", date, "order")
    ].join("");

    const trainCell = [
      protocolCell((data.fitness.trainingDates || []).includes(date), "🏋️", "Training", date, "training"),
      protocolCell((data.finance.workDates || []).includes(date), "💼", "Work", date, "work")
    ].join("");

    const socialCell = [
      socialEntries.length
        ? `<button type="button" class="protocol-cell-chip active ${date === todayISO() ? "today-cell" : ""}" title="Soziale Praxis" data-protocol-key="social" data-protocol-date="${escapeHTML(date)}">💬${socialEntries.length > 1 ? `×${socialEntries.length}` : ""}</button>`
        : `<button type="button" class="protocol-cell-chip open ${date === todayISO() ? "today-cell" : ""}" title="Soziale Praxis" data-protocol-key="social" data-protocol-date="${escapeHTML(date)}">💬</button>`,
      protocolCell((data.mind.outingDates || []).includes(date), "🍃", "Rausgegangen", date, "outing")
    ].join("");

    const skillCell = [
      protocolCell(skillAreas.has(1), "🌍", "Skill-Bereich 1 · Auswandern", date, "skill1"),
      protocolCell(skillAreas.has(2), "📖", "Skill-Bereich 2 · Lesen", date, "skill2"),
      protocolCell(skillAreas.has(3), "💻", "Skill-Bereich 3 · Bildschirmarbeit", date, "skill3"),
      protocolCell(skillAreas.has(4), "🏠", "Skill-Bereich 4 · Wohnsituation", date, "skill4"),
      protocolCell(skillAreas.has(5), "📄", "Skill-Bereich 5 · Bewerbung", date, "skill5")
    ].join("");

    const row = document.createElement("tr");
    row.className = inWindow ? "protocol-row-active" : "protocol-row-old";
    if (date === todayISO()) row.classList.add("protocol-row-today");

    row.innerHTML = `
      <td>
        <strong>${formatProtocolDate(date)}</strong>
        ${date === todayISO() ? `<span class="protocol-today-badge">heute</span>` : ""}
      </td>
      <td><div class="protocol-chip-group">${wellCells}</div></td>
      <td><div class="protocol-chip-group single">${trainCell}</div></td>
      <td><div class="protocol-chip-group">${socialCell}</div></td>
      <td><div class="protocol-chip-group">${skillCell}</div></td>
      <td><span class="protocol-window-chip ${inWindow ? "active" : "old"}">${inWindow ? `● ${windowPosition}/56` : "○ raus"}</span></td>
    `;

    tbody.appendChild(row);
  });

  const summary = document.getElementById("protocolSummary");
  if (summary) {
    const activeRows = dates.filter(isDateInDisciplineWindow).length;
    const first = dates[0] || todayISO();
    const last = dates[dates.length - 1] || todayISO();
    summary.textContent = `${dates.length} Tag(e) seit Protokollstart · ${activeRows} Tag(e) im aktuellen 56-Tage-Fenster · ${formatShortDate(first)} bis ${formatShortDate(last)}`;
  }
}


function toggleDateInList(list, date) {
  const source = Array.isArray(list) ? [...list] : [];
  return source.includes(date) ? source.filter(item => item !== date) : [...source, date];
}

function toggleProtocolCell(key, date) {
  if (!key || !date) return;

  const skillMatch = key.match(/^skill([1-5])$/);
  if (skillMatch) {
    const area = skillMatch[1];
    if (!data.quickEntry.protocolManualSkills) data.quickEntry.protocolManualSkills = { "1": [], "2": [], "3": [], "4": [], "5": [] };
    data.quickEntry.protocolManualSkills[area] = toggleDateInList(data.quickEntry.protocolManualSkills[area] || [], date);
  } else if (key === "yoga") {
    data.fitness.yogaDates = toggleDateInList(data.fitness.yogaDates, date);
  } else if (key === "breath") {
    data.fitness.breathDates = toggleDateInList(data.fitness.breathDates, date);
  } else if (key === "bodyCare") {
    data.fitness.bodyCareDates = toggleDateInList(data.fitness.bodyCareDates, date);
  } else if (key === "cold") {
    data.fitness.coldDates = toggleDateInList(data.fitness.coldDates, date);
  } else if (key === "meditation") {
    data.mind.meditationDates = toggleDateInList(data.mind.meditationDates || [], date);
  } else if (key === "organization") {
    data.fitness.organizationDates = toggleDateInList(data.fitness.organizationDates || [], date);
  } else if (key === "order") {
    ensureOrderDetails();
    const shouldAdd = !isOrderDone(date);
    Object.keys(orderDetailLabels).forEach(orderKey => {
      setOrderDetail(orderKey, shouldAdd, date);
    });
  } else if (key === "training") {
    data.fitness.trainingDates = toggleDateInList(data.fitness.trainingDates, date);
  } else if (key === "work") {
    data.finance.workDates = toggleDateInList(data.finance.workDates || [], date);
    if (!(data.finance.workDates || []).includes(date)) {
      data.finance.workEntries = (data.finance.workEntries || []).filter(entry => entry.date !== date);
    }
  } else if (key === "outing") {
    data.mind.outingDates = toggleDateInList(data.mind.outingDates || [], date);
  } else if (key === "social") {
    const existingManual = (data.emotion.socialLog || []).find(entry => entry.date === date && entry.action === "protocolManual");
    if (existingManual) {
      data.emotion.socialLog = (data.emotion.socialLog || []).filter(entry => !(entry.date === date && entry.action === "protocolManual"));
    } else {
      data.emotion.socialLog = data.emotion.socialLog || [];
      data.emotion.socialLog.push({
        id: crypto.randomUUID(),
        date,
        action: "protocolManual",
        label: "Soziale Praxis manuell",
        points: 0,
        note: "Nachgetragen im Protokoll"
      });
    }
  }

  saveData();
  calculateFitness();
  updateBreathScore();
  updateColdScore();
  updateBodyCareScore();
  updateOutingScore?.();
  updateEmotion();
  updateDiscipline();
  updateAttraction();
  updateQuickDailyStatus();
  updateProtocolTable();
}

function setupProtocol() {
  document.getElementById("refreshProtocol")?.addEventListener("click", () => {
    updateProtocolTable();
    showToast("Protokoll aktualisiert");
  });

  document.getElementById("toggleProtocolEdit")?.addEventListener("click", () => {
    data.quickEntry.protocolEditMode = !data.quickEntry.protocolEditMode;
    saveData();
    updateProtocolTable();
    showToast(data.quickEntry.protocolEditMode ? "Protokoll-Bearbeitung aktiv" : "Protokoll-Bearbeitung beendet");
  });

  document.getElementById("protocolTableBody")?.addEventListener("click", event => {
    const button = event.target.closest("[data-protocol-key]");
    if (!button || !data.quickEntry.protocolEditMode) return;
    toggleProtocolCell(button.dataset.protocolKey, button.dataset.protocolDate);
  });
}

function updateQuickDailyStatus() {
  const dateBadge = document.getElementById('quickStatusDateBadge');
  if (dateBadge) {
    dateBadge.textContent = new Intl.DateTimeFormat("de-DE", { weekday: "long", day: "2-digit", month: "2-digit" }).format(new Date());
  }

  const fitMap = {
    fitStatusYoga: isTodayMarked(data.fitness.yogaDates),
    fitStatusBreath: isTodayMarked(data.fitness.breathDates),
    fitStatusBodyCare: isTodayMarked(data.fitness.bodyCareDates),
    fitStatusCold: isTodayMarked(data.fitness.coldDates),
    fitStatusMeditation: isTodayMarked(data.mind.meditationDates),
    fitStatusOrganization: isTodayMarked(data.fitness.organizationDates),
    fitStatusOrder: isOrderDone()
  };

  Object.entries(fitMap).forEach(([id, active]) => setStatusTileActive(id, active));
  const fitCount = Object.values(fitMap).filter(Boolean).length;
  const fitCountEl = document.getElementById('quickFitCount');
  if (fitCountEl) fitCountEl.textContent = `${fitCount}/7`;

  const trainActive = isTodayMarked(data.fitness.trainingDates);
  const workActive = isWorkMarkedToday();
  setStatusTileActive('trainStatusMain', trainActive, 'heute gemacht', 'noch offen');
  setStatusTileActive('workStatusMain', workActive);
  const trainCountEl = document.getElementById('quickTrainCount');
  if (trainCountEl) trainCountEl.textContent = `${[trainActive, workActive].filter(Boolean).length}/2`;

  const socialEntries = getTodaySocialEntries();
  setStatusTileActive('socialStatusMain', socialEntries.length > 0, `${socialEntries.length} Aktion${socialEntries.length === 1 ? '' : 'en'}`, 'noch offen');
  const outingActive = isTodayMarked(data.mind.outingDates || []);
  setStatusTileActive('outingStatusMain', outingActive);
  const socialCountEl = document.getElementById('quickSocialCount');
  if (socialCountEl) socialCountEl.textContent = String(socialEntries.length + (outingActive ? 1 : 0));

  const skillAreasDone = getTodaySkillAreasDone();
  [1,2,3,4,5].forEach(area => setStatusTileActive(`skillStatus${area}`, skillAreasDone.has(area)));
  const skillCountEl = document.getElementById('quickSkillCount');
  if (skillCountEl) skillCountEl.textContent = `${skillAreasDone.size}/5`;

  updateProtocolTable();
}


function saveQuickWeeklyNote() {
  if (!data.quickEntry) data.quickEntry = {};
  if (!data.quickEntry.protocolStartDate) data.quickEntry.protocolStartDate = todayISO();
  if (!data.quickEntry.protocolManualSkills || typeof data.quickEntry.protocolManualSkills !== "object") {
    data.quickEntry.protocolManualSkills = { "1": [], "2": [], "3": [], "4": [], "5": [] };
  }
  ["1","2","3","4","5"].forEach(area => {
    if (!Array.isArray(data.quickEntry.protocolManualSkills[area])) data.quickEntry.protocolManualSkills[area] = [];
  });
  data.quickEntry.protocolEditMode = Boolean(data.quickEntry.protocolEditMode);
  const note = document.getElementById("quickWeeklyNote");
  if (!note) return;
  cleanupQuickNoteWhitespace(note);
  data.quickEntry.weeklyNoteHtml = note.innerHTML;
  const height = Math.round(note.getBoundingClientRect().height);
  if (height > 60) data.quickEntry.weeklyNoteHeight = `${height}px`;
  saveData();
}

function focusQuickWeeklyNote() {
  const note = document.getElementById("quickWeeklyNote");
  if (!note) return null;
  note.focus();
  return note;
}

function placeCaretInside(element) {
  if (!element) return;
  element.focus?.();

  const range = document.createRange();
  const selection = window.getSelection();
  range.selectNodeContents(element);
  range.collapse(false);
  selection.removeAllRanges();
  selection.addRange(range);
}

function appendQuickNoteLine(kind = "arrow") {
  const note = focusQuickWeeklyNote();
  if (!note) return;

  const line = document.createElement("div");
  line.className = kind === "task" ? "quick-note-task" : "quick-note-line";
  line.contentEditable = "false";

  const arrow = document.createElement("span");
  arrow.className = "quick-note-arrow";
  arrow.contentEditable = "false";
  arrow.textContent = "▶";

  const text = document.createElement("span");
  text.className = kind === "task" ? "quick-note-task-text" : "quick-note-text";
  text.contentEditable = "true";
  text.spellcheck = true;
  text.innerHTML = "";

  line.appendChild(arrow);
  line.appendChild(text);

  if (kind === "task") {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "quick-note-check";
    button.contentEditable = "false";
    button.textContent = "☐";
    line.appendChild(button);
  }

  note.appendChild(line);
  prepareQuickNoteLine(line);
  refreshQuickNotePriority(note);
  placeCaretInside(text);
  saveQuickWeeklyNote();
}


function cleanupQuickNoteWhitespace(note = document.getElementById("quickWeeklyNote")) {
  if (!note) return;
  const hasQuickItems = [...note.children].some(child => child.classList?.contains("quick-note-line") || child.classList?.contains("quick-note-task"));
  if (!hasQuickItems) return;
  [...note.childNodes].forEach(node => {
    if (node.nodeType === Node.TEXT_NODE && !node.textContent.trim()) node.remove();
  });
}

function getQuickNoteItems(note = document.getElementById("quickWeeklyNote")) {
  if (!note) return [];
  return [...note.children].filter(child => child.classList?.contains("quick-note-line") || child.classList?.contains("quick-note-task"));
}

function prepareQuickNoteLine(line) {
  if (!line) return;
  line.querySelectorAll?.(".quick-note-drag").forEach(handle => handle.remove());
  line.dataset.quickPrepared = "1";
  line.draggable = false;
  line.setAttribute("aria-label", "Notizzeile");
  const arrow = line.querySelector(".quick-note-arrow");
  if (arrow) {
    arrow.classList.add("quick-note-drag-handle");
    arrow.setAttribute("title", "Zum Sortieren ziehen");
    arrow.setAttribute("aria-label", "Zum Sortieren ziehen");
    arrow.setAttribute("draggable", "true");
    arrow.contentEditable = "false";
  }
}

function prepareQuickNoteList(note = document.getElementById("quickWeeklyNote")) {
  if (!note) return;
  cleanupQuickNoteWhitespace(note);
  getQuickNoteItems(note).forEach(prepareQuickNoteLine);
  refreshQuickNotePriority(note);
}

function updateQuickNotePriorityButton() {
  const button = document.getElementById("quickNoteTogglePriority");
  if (!button) return;
  const active = Boolean(data.quickEntry?.weeklyNotePriorityMode);
  button.textContent = active ? "Prio-Modus aus" : "Prio-Modus an";
  button.classList.toggle("active", active);
}

function refreshQuickNotePriority(note = document.getElementById("quickWeeklyNote")) {
  if (!note) return;
  const active = Boolean(data.quickEntry?.weeklyNotePriorityMode);
  note.classList.toggle("quick-priority-mode", active);
  const items = getQuickNoteItems(note);
  items.forEach((item, index) => {
    item.classList.remove("quick-note-prio-1", "quick-note-prio-2");
    item.removeAttribute("data-prio-label");
    if (!active) return;
    if (index === 0) {
      item.classList.add("quick-note-prio-1");
    } else if (index >= 1 && index <= 3) {
      item.classList.add("quick-note-prio-2");
    }
  });
  updateQuickNotePriorityButton();
}

function toggleQuickNotePriorityMode() {
  data.quickEntry = data.quickEntry || {};
  data.quickEntry.weeklyNotePriorityMode = !Boolean(data.quickEntry.weeklyNotePriorityMode);
  refreshQuickNotePriority();
  saveQuickWeeklyNote();
  showToast(data.quickEntry.weeklyNotePriorityMode ? "Prio-Modus aktiv" : "Prio-Modus aus");
}

function setupQuickNoteDragAndDrop(note) {
  if (!note || note.dataset.dragReady === "1") return;
  note.dataset.dragReady = "1";

  let draggedLine = null;
  let pointerLine = null;
  let startX = 0;
  let startY = 0;
  let pointerDragging = false;

  const getLine = target => target?.closest?.(".quick-note-line, .quick-note-task");
  const getHandle = target => target?.closest?.(".quick-note-drag-handle");

  const moveLineNearPoint = (line, clientX, clientY) => {
    const target = document.elementFromPoint(clientX, clientY)?.closest?.(".quick-note-line, .quick-note-task");
    if (!target || !note.contains(target) || target === line) return;
    const rect = target.getBoundingClientRect();
    const before = clientY < rect.top + rect.height / 2;
    note.insertBefore(line, before ? target : target.nextSibling);
  };

  note.addEventListener("dragstart", event => {
    const handle = getHandle(event.target);
    const line = getLine(event.target);
    if (!handle || !line || !note.contains(line)) {
      event.preventDefault();
      return;
    }
    draggedLine = line;
    line.classList.add("is-dragging");
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", "quick-note-line");
  });

  note.addEventListener("dragover", event => {
    if (!draggedLine) return;
    event.preventDefault();
    moveLineNearPoint(draggedLine, event.clientX, event.clientY);
  });

  note.addEventListener("drop", event => {
    if (!draggedLine) return;
    event.preventDefault();
    draggedLine.classList.remove("is-dragging");
    draggedLine = null;
    refreshQuickNotePriority(note);
    saveQuickWeeklyNote();
  });

  note.addEventListener("dragend", () => {
    if (draggedLine) draggedLine.classList.remove("is-dragging");
    draggedLine = null;
    refreshQuickNotePriority(note);
    saveQuickWeeklyNote();
  });

  note.addEventListener("pointerdown", event => {
    const handle = getHandle(event.target);
    const line = getLine(event.target);
    if (!handle || !line || !note.contains(line)) return;
    pointerLine = line;
    pointerDragging = false;
    startX = event.clientX;
    startY = event.clientY;
  }, { passive: true });

  note.addEventListener("pointermove", event => {
    if (!pointerLine) return;
    const dx = Math.abs(event.clientX - startX);
    const dy = Math.abs(event.clientY - startY);
    if (!pointerDragging && Math.max(dx, dy) < 8) return;

    pointerDragging = true;
    event.preventDefault();
    pointerLine.classList.add("is-dragging");
    moveLineNearPoint(pointerLine, event.clientX, event.clientY);
  }, { passive: false });

  const finishPointerDrag = () => {
    if (!pointerLine) return;
    pointerLine.classList.remove("is-dragging");
    if (pointerDragging) {
      refreshQuickNotePriority(note);
      saveQuickWeeklyNote();
    }
    pointerLine = null;
    pointerDragging = false;
  };

  note.addEventListener("pointerup", finishPointerDrag);
  note.addEventListener("pointercancel", finishPointerDrag);
}

function updateQuickNoteWeekBadge() {
  const badge = document.getElementById("quickNoteWeekBadge");
  if (!badge) return;
  badge.textContent = data.mindPlanner?.weekStart
    ? `${formatShortDate(data.mindPlanner.weekStart)} bis ${formatShortDate(addDaysISO(data.mindPlanner.weekStart, 7))}`
    : "Woche nicht erzeugt";
}

function setupQuickWeeklyNote() {
  const note = document.getElementById("quickWeeklyNote");
  if (!note) return;
  updateQuickNoteWeekBadge();

  data.quickEntry = data.quickEntry || {};
  note.innerHTML = data.quickEntry.weeklyNoteHtml || "";
  if (data.quickEntry.weeklyNoteHeight) {
    note.style.height = data.quickEntry.weeklyNoteHeight;
    note.style.minHeight = data.quickEntry.weeklyNoteHeight;
  }

  prepareQuickNoteList(note);
  setupQuickNoteDragAndDrop(note);
  updateQuickNotePriorityButton();

  note.addEventListener("input", () => {
    prepareQuickNoteList(note);
    saveQuickWeeklyNote();
  });
  note.addEventListener("blur", saveQuickWeeklyNote);

  document.getElementById("quickNoteInsertArrow")?.addEventListener("click", () => {
    appendQuickNoteLine("arrow");
  });

  document.getElementById("quickNoteInsertCheck")?.addEventListener("click", () => {
    appendQuickNoteLine("task");
  });

  document.getElementById("quickNoteTogglePriority")?.addEventListener("click", toggleQuickNotePriorityMode);

  document.getElementById("quickNoteClearDone")?.addEventListener("click", () => {
    const doneTasks = [...note.querySelectorAll(".quick-note-task.is-done")];
    if (!doneTasks.length) {
      showToast("Keine abgehakten Aufgaben gefunden");
      return;
    }
    doneTasks.forEach(task => task.remove());
    refreshQuickNotePriority(note);
    saveQuickWeeklyNote();
    showToast("Abgehakte Aufgaben gelöscht");
  });

  document.getElementById("quickNoteClearAll")?.addEventListener("click", () => {
    if (!confirm("Alle Wochen-Notizen wirklich löschen?")) return;
    note.innerHTML = "";
    refreshQuickNotePriority(note);
    saveQuickWeeklyNote();
    showToast("Wochen-Notizen geleert");
  });

  note.addEventListener("keydown", event => {
    if (event.key !== "Backspace" && event.key !== "Delete") return;

    const text = event.target.closest?.(".quick-note-text, .quick-note-task-text");
    if (!text) return;

    const line = text.closest(".quick-note-line, .quick-note-task");
    if (!line) return;

    const isEmptyLine = !text.textContent.trim();
    if (!isEmptyLine) return;

    // Nur komplett leere Sonderzeilen entfernen. Kein aggressives Cursor-Umsetzen.
    event.preventDefault();
    line.remove();
    refreshQuickNotePriority(note);
    saveQuickWeeklyNote();
    note.focus();
  });

  note.addEventListener("click", event => {
    const button = event.target.closest(".quick-note-check");
    if (button) {
      const task = button.closest(".quick-note-task");
      if (!task) return;

      const done = !task.classList.contains("is-done");
      task.classList.toggle("is-done", done);
      button.textContent = done ? "☑" : "☐";
      saveQuickWeeklyNote();
      return;
    }

    // Normales Contenteditable-Verhalten: Cursorposition nicht nach jedem Klick erzwingen.
  });
}



function setupQuickStatusJumps() {
  document.querySelectorAll("[data-quick-jump]").forEach(tile => {
    tile.addEventListener("click", () => {
      const selector = tile.dataset.quickJump;
      const target = document.querySelector(selector);
      if (!target) return;

      const card = target.closest(".card") || target;
      card.scrollIntoView({ behavior: "smooth", block: "center" });

      setTimeout(() => {
        target.classList.add("quick-jump-highlight");
        if (typeof target.focus === "function") target.focus({ preventScroll: true });
        setTimeout(() => target.classList.remove("quick-jump-highlight"), 1400);
      }, 420);
    });
  });
}


function isWorkMarkedToday() {
  return isTodayMarked(data.finance.workDates || []);
}


function parseDecimalInput(value) {
  if (typeof value === "number") return value;
  const cleaned = String(value || "")
    .trim()
    .replace(/\s/g, "")
    .replace(",", ".");
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : 0;
}

function roundTwo(value) {
  return Math.round(Number(value || 0) * 100) / 100;
}

function roundEight(value) {
  return Math.round(Number(value || 0) * 100000000) / 100000000;
}


function formatInputDecimal(value) {
  const number = Number(value || 0);
  if (!number) return "";
  const fixed = Number.isInteger(number) ? String(number) : String(roundTwo(number));
  return fixed.replace(".", ",");
}

function getTodayWorkEntry() {
  return (data.finance.workEntries || []).find(entry => entry.date === todayISO()) || null;
}

function isWorkMarkedToday() {
  return Boolean(getTodayWorkEntry()) || isTodayMarked(data.finance.workDates || []);
}

function calculateWorkNetHourly() {
  const gross = Number(data.finance.workGrossHourly || 0);
  const deduction = clamp(Number(data.finance.workDeductionRate || 0), 0, 100);
  const net = roundTwo(gross * (1 - deduction / 100));
  data.finance.workNetHourly = net;
  return net;
}

function updateQuickWorkPreview() {
  const grossInput = document.getElementById("quickWorkGrossHourly");
  const deductionInput = document.getElementById("quickWorkDeductionRate");
  const netInput = document.getElementById("quickWorkNetHourly");
  const hoursInput = document.getElementById("quickWorkHours");

  if (grossInput && document.activeElement !== grossInput) {
    grossInput.value = formatInputDecimal(data.finance.workGrossHourly);
  }

  if (deductionInput && document.activeElement !== deductionInput) {
    deductionInput.value = formatInputDecimal(data.finance.workDeductionRate);
  }

  const net = calculateWorkNetHourly();

  if (netInput) {
    netInput.value = formatInputDecimal(net);
  }

  if (hoursInput && document.activeElement !== hoursInput) {
    hoursInput.value = formatInputDecimal(data.finance.workHours);
  }

  const gross = Number(data.finance.workGrossHourly || 0);
  const hours = Number(data.finance.workHours || 0);
  const grossToday = roundTwo(gross * hours);
  const netToday = roundTwo(net * hours);
  const bookedToday = getTodayWorkEntry()?.netAmount || 0;

  const grossEl = document.getElementById("quickWorkGrossToday");
  const netEl = document.getElementById("quickWorkNetToday");
  const bookedEl = document.getElementById("quickWorkBookedToday");

  if (grossEl) grossEl.textContent = money.format(grossToday);
  if (netEl) netEl.textContent = money.format(netToday);
  if (bookedEl) bookedEl.textContent = money.format(bookedToday);
}

function saveQuickWorkField(field, value) {
  data.finance[field] = parseDecimalInput(value);
  if (field === "workDeductionRate") data.finance[field] = clamp(data.finance[field], 0, 100);
  calculateWorkNetHourly();
  saveData();
  updateQuickWorkPreview();
}

function markWorkToday(entry) {
  if (!Array.isArray(data.finance.workDates)) data.finance.workDates = [];
  if (!Array.isArray(data.finance.workEntries)) data.finance.workEntries = [];

  data.finance.workDates = removeDate(data.finance.workDates, todayISO());
  data.finance.workDates.push(todayISO());

  data.finance.workEntries = data.finance.workEntries.filter(existing => existing.date !== todayISO());
  if (entry) {
    data.finance.workEntries.push({
      id: crypto.randomUUID(),
      date: todayISO(),
      hours: Number(entry.hours || 0),
      grossHourly: Number(entry.grossHourly || 0),
      deductionRate: Number(entry.deductionRate || 0),
      netHourly: Number(entry.netHourly || 0),
      grossAmount: roundTwo(Number(entry.grossAmount || 0)),
      netAmount: roundTwo(Number(entry.netAmount || 0))
    });
  }

  saveData();
  updateQuickDailyStatus();
  updateProtocolTable();
}

function removeWorkToday() {
  const existing = getTodayWorkEntry();
  if (existing?.netAmount) {
    data.finance.fiat = roundTwo(Number(data.finance.fiat || 0) - Number(existing.netAmount || 0));
    const fiatInput = document.getElementById("fiat");
    if (fiatInput) fiatInput.value = data.finance.fiat.toFixed(2);
  }

  data.finance.workEntries = (data.finance.workEntries || []).filter(entry => entry.date !== todayISO());
  data.finance.workDates = removeDate(data.finance.workDates || [], todayISO());
  data.finance.workHours = 0;

  saveData();
  calculateFinance();
  updateFinanceFormattedPreview();
  updateAttraction();
  updateQuickWorkPreview();
  updateQuickDailyStatus();
  updateProtocolTable();
}

function addWorkIncomeToday() {
  const previous = getTodayWorkEntry();
  if (previous?.netAmount) {
    data.finance.fiat = roundTwo(Number(data.finance.fiat || 0) - Number(previous.netAmount || 0));
  }

  const hours = Number(data.finance.workHours || 0);
  const grossHourly = Number(data.finance.workGrossHourly || 0);
  const deductionRate = clamp(Number(data.finance.workDeductionRate || 0), 0, 100);
  const netHourly = calculateWorkNetHourly();
  const grossAmount = roundTwo(grossHourly * hours);
  const netAmount = roundTwo(netHourly * hours);

  if (!hours || !grossHourly || !netAmount) {
    showToast("Bitte Brutto-Stundenlohn, Abzug und Stunden eintragen");
    if (previous?.netAmount) {
      data.finance.fiat = roundTwo(Number(data.finance.fiat || 0) + Number(previous.netAmount || 0));
    }
    return;
  }

  data.finance.fiat = roundTwo(Number(data.finance.fiat || 0) + netAmount);
  const fiatInput = document.getElementById("fiat");
  if (fiatInput) fiatInput.value = data.finance.fiat.toFixed(2);

  markWorkToday({
    hours,
    grossHourly,
    deductionRate,
    netHourly,
    grossAmount,
    netAmount
  });

  saveData();
  calculateFinance();
  updateFinanceFormattedPreview();
  updateAttraction();
  updateQuickWorkPreview();

  showToast(`Work: ${money.format(netAmount)} netto gebucht`);
}

function setupQuickEntry() {
  ["quickWorkGrossHourly", "quickWorkDeductionRate", "quickWorkHours"].forEach(id => {
    const input = document.getElementById(id);
    const field = {
      quickWorkGrossHourly: "workGrossHourly",
      quickWorkDeductionRate: "workDeductionRate",
      quickWorkHours: "workHours"
    }[id];
    if (!input || !field) return;
    input.addEventListener("input", () => saveQuickWorkField(field, input.value));
    input.addEventListener("blur", () => updateQuickWorkPreview());
  });

  document.querySelectorAll("[data-work-hours-add]").forEach(button => {
    button.addEventListener("click", () => {
      data.finance.workHours = roundTwo(Number(data.finance.workHours || 0) + Number(button.dataset.workHoursAdd || 0));
      saveData();
      updateQuickWorkPreview();
    });
  });

  document.getElementById("quickWorkHoursReset")?.addEventListener("click", () => {
    data.finance.workHours = 0;
    saveData();
    updateQuickWorkPreview();
  });

  document.getElementById("quickAddWorkIncome")?.addEventListener("click", addWorkIncomeToday);
  document.getElementById("quickRemoveWorkToday")?.addEventListener("click", () => {
    removeWorkToday();
    showToast("Work heute entfernt");
  });
  updateQuickWorkPreview();

  document.getElementById("quickAddIncome").addEventListener("click", () => addIncomeFromInput("quickIncome"));
  document.getElementById("quickSubtractExpense").addEventListener("click", () => subtractExpenseFromInput("quickExpense"));

  document.getElementById("quickYoga").addEventListener("click", () => {
    const added = markYogaToday();
    showRoutineToast("Yoga", data.fitness.yogaTarget28, added);
  });

  document.getElementById("quickTraining").addEventListener("click", () => {
    const added = markTrainingToday();
    showRoutineToast("Training", data.fitness.trainingTarget28, added);
  });

  document.getElementById("quickBreath").addEventListener("click", () => {
    const added = markBreathToday();
    showRoutineToast("Atemübung", data.fitness.breathTarget28, added);
  });

  document.getElementById("quickCold").addEventListener("click", () => {
    const added = markColdToday();
    showRoutineToast("Kältetraining", data.fitness.coldTarget28, added);
  });

  document.getElementById("quickBodyCare").addEventListener("click", () => {
    const added = markBodyCareToday();
    showRoutineToast("Körperpflege", data.fitness.bodyCareTarget28, added);
  });

  document.getElementById("quickOrganization")?.addEventListener("click", () => {
    const added = markOrganizationToday();
    showToast(added ? "Organisatorisches heute erledigt" : "Organisatorisches heute war schon markiert");
  });

  document.getElementById("quickMeditation").addEventListener("click", () => {
    const added = markMeditationToday();
    showRoutineToast("Meditation", data.mind.meditationTarget28, added);
  });

  document.getElementById("quickOuting")?.addEventListener("click", () => {
    const added = markOutingToday();
    showRoutineToast("Rausgegangen", data.mind.outingTarget28, added);
  });

  document.querySelectorAll("[data-quick-social]").forEach(button => {
    button.addEventListener("click", () => {
      const action = addSocialAction(button.dataset.quickSocial);
      if (action) showToast(`+${action.points} Punkte · ${action.label}`);
    });
  });
}


function setupMindfulness() {
  const level = document.getElementById("presenceLevel");
  if (!level) return;

  level.value = data.mindfulness.presenceLevel || 0;
  document.getElementById("presenceLevelValue").textContent = level.value;
  document.getElementById("presenceDescription").textContent = mindfulnessDescriptions[level.value];

  level.addEventListener("input", () => {
    data.mindfulness.presenceLevel = Number(level.value || 0);
    document.getElementById("presenceLevelValue").textContent = level.value;
    document.getElementById("presenceDescription").textContent = mindfulnessDescriptions[level.value];
    saveData();
  });

  const textFields = [
    ["mindfulnessMonthlyIntention", "monthlyIntention"],
    ["mindfulnessTodayInsight", "todayInsight"],
    ["mindfulnessAllowed", "allowed"],
    ["mindfulnessEmergence", "emergence"],
    ["mindfulnessMomentNote", "momentNote"]
  ];

  textFields.forEach(([id, key]) => {
    const input = document.getElementById(id);
    input.value = data.mindfulness[key] || "";
    input.addEventListener("input", () => {
      data.mindfulness[key] = input.value;
      saveData();
    });
  });

  setupMindfulnessTextareaHeights();

  document.querySelectorAll("[data-mindfulness-action]").forEach(button => {
    button.addEventListener("click", () => {
      addMindfulnessMoment(button.dataset.mindfulnessAction);
    });
  });

  document.getElementById("removeMindfulnessToday").addEventListener("click", removeMindfulnessToday);

  renderMindfulness();
}

function addMindfulnessMoment(actionKey) {
  const action = mindfulnessActions[actionKey];
  if (!action) return;

  const noteInput = document.getElementById("mindfulnessMomentNote");
  const note = noteInput.value.trim();

  data.mindfulness.log.push({
    id: crypto.randomUUID(),
    date: todayISO(),
    createdAt: nowISO(),
    action: actionKey,
    label: action.label,
    kind: action.kind,
    note
  });

  data.mindfulness.momentNote = "";
  noteInput.value = "";

  saveData();
  renderMindfulness();
  showToast(`Achtsamkeit: ${action.label}`);
}

function removeMindfulnessToday() {
  const today = todayISO();
  const before = data.mindfulness.log.length;
  data.mindfulness.log = data.mindfulness.log.filter(entry => entry.date !== today);
  const removed = before - data.mindfulness.log.length;

  saveData();
  renderMindfulness();
  showToast(removed ? `${removed} Achtsamkeits-Momente heute entfernt` : "Keine Achtsamkeits-Momente von heute vorhanden");
}

function renderMindfulness() {
  const log = data.mindfulness.log || [];
  const month = filterLogInMonth(log, 0);

  const moments = month.length;
  const courage = month.filter(entry => entry.kind === "courage").length;
  const release = month.filter(entry => entry.kind === "release").length;
  const natural = month.filter(entry => entry.kind === "natural").length;

  document.getElementById("mindfulnessMomentsMonth").textContent = moments;
  document.getElementById("mindfulnessCourageMonth").textContent = courage;
  document.getElementById("mindfulnessReleaseMonth").textContent = release;
  document.getElementById("mindfulnessNaturalMonth").textContent = natural;

  const container = document.getElementById("mindfulnessLogList");
  container.innerHTML = "";

  const latest = [...log].reverse().slice(0, 10);
  if (!latest.length) {
    container.innerHTML = "<p class='hint'>Noch keine Achtsamkeits-Momente eingetragen.</p>";
    return;
  }

  latest.forEach(entry => {
    const div = document.createElement("div");
    div.className = "log-entry";
    div.innerHTML = `
      <strong>${escapeHTML(entry.label)}</strong>
      <small>${formatDateTimeDE(entry.createdAt || entry.date)}</small>
      ${entry.note ? `<p class="hint">${escapeHTML(entry.note)}</p>` : ""}
    `;
    container.appendChild(div);
  });
}


function createEmergencyBackup(reason = "Automatische Sicherheitskopie") {
  try {
    const snapshot = makeSaveEnvelope();
    snapshot.reason = reason;
    localStorage.setItem(EMERGENCY_BACKUP_KEY, JSON.stringify(snapshot));
    return true;
  } catch {
    return false;
  }
}

function getByteSize(text) {
  return new Blob([text || ""]).size;
}

function formatBytes(bytes) {
  if (!bytes) return "0 B";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${roundOne(bytes / 1024)} KB`;
  return `${roundOne(bytes / (1024 * 1024))} MB`;
}

function setTextIfExists(id, value) {
  const element = document.getElementById(id);
  if (element) element.textContent = value;
}


function updateBuildDiagnostics() {
  const appEl = document.getElementById("buildAppStatus");
  if (appEl) appEl.textContent = `app.js ${SAVE_VERSION} geladen`;

  const cssEl = document.getElementById("buildCssStatus");
  const probe = document.createElement("div");
  probe.className = "v125-css-probe";
  probe.style.position = "absolute";
  probe.style.left = "-9999px";
  probe.style.top = "-9999px";
  document.body.appendChild(probe);
  const content = getComputedStyle(probe, "::after").content || "";
  probe.remove();

  if (cssEl) {
    cssEl.textContent = content.includes("style.css-public-v26")
      ? "style.css Public V26 geladen"
      : "style.css NICHT Public V26 / Cache alt";
  }
}


function updateBackupStatus() {
  const raw = localStorage.getItem(STORAGE_KEY) || "";
  const emergencyRaw = localStorage.getItem(EMERGENCY_BACKUP_KEY) || "";
  let emergency = null;
  try {
    emergency = emergencyRaw ? JSON.parse(emergencyRaw) : null;
  } catch {
    emergency = null;
  }

  setTextIfExists("backupAppVersion", SAVE_VERSION);
  setTextIfExists("backupStorageKey", STORAGE_KEY);
  setTextIfExists("backupSavedAt", data?.settings?.lastSavedAt ? formatDateTimeDE(data.settings.lastSavedAt) : "noch nicht gespeichert");
  setTextIfExists("backupSize", formatBytes(getByteSize(raw)));
  setTextIfExists("backupDeviceName", data?.settings?.deviceName || "kein Gerätename");
  setTextIfExists("backupMigrationInfo", data?.settings?.lastMigrationFrom ? `aus ${data.settings.lastMigrationFrom} übernommen` : "stabiler Speicher aktiv");
  setTextIfExists("backupExportInfo", data?.settings?.lastBackupExportAt ? formatDateTimeDE(data.settings.lastBackupExportAt) : "noch kein Export in dieser Version");
  setTextIfExists("backupImportInfo", data?.settings?.lastBackupImportAt ? formatDateTimeDE(data.settings.lastBackupImportAt) : "noch kein Import in dieser Version");
  setTextIfExists("backupEmergencyInfo", emergency ? `${formatDateTimeDE(emergency.savedAt)} · ${emergency.reason || "Sicherheitskopie"}` : "keine Notfallkopie vorhanden");
  setTextIfExists("backupSyncDecision", data?.settings?.lastSyncDecision ? `${data.settings.lastSyncDecision} · ${formatDateTimeDE(data.settings.lastSyncDecisionAt)}` : "noch keine Sync-Entscheidung");
  updateBuildDiagnostics();
}

function applyImportedSave(imported, reason) {
  const importedData = extractImportedData(imported);
  createEmergencyBackup(reason);
  data = mergeDeep(structuredClone(defaultData), importedData);
  data.settings = data.settings || {};
  data.settings.lastBackupImportAt = nowISO();
  saveData();
  location.reload();
}

function setupBackup() {
  const deviceInput = document.getElementById("deviceName");
  deviceInput.value = data.settings.deviceName || "";

  deviceInput.addEventListener("input", () => {
    data.settings.deviceName = deviceInput.value;
    saveData();
    updateBackupStatus();
  });

  document.getElementById("copySave").addEventListener("click", async () => {
    const saveText = JSON.stringify(makeSaveEnvelope(), null, 2);
    document.getElementById("saveCode").value = saveText;

    try {
      await navigator.clipboard.writeText(saveText);
      showToast("Save-Code kopiert");
    } catch {
      showToast("Save-Code erzeugt");
    }

    updateBackupStatus();
  });

  document.getElementById("loadSave").addEventListener("click", () => {
    const text = document.getElementById("saveCode").value.trim();
    if (!text) return alert("Bitte zuerst einen Save-Code einfügen.");

    try {
      const imported = JSON.parse(text);
      const label = imported.savedAt ? `Save-Code vom ${formatDateTimeDE(imported.savedAt)}` : "Save-Code";
      const confirmed = confirm(`${label} laden?\n\nVor dem Ersetzen wird automatisch eine lokale Notfallkopie angelegt.`);
      if (!confirmed) return;

      applyImportedSave(imported, "Vor Save-Code-Import");
    } catch {
      alert("Der Save-Code konnte nicht gelesen werden.");
    }
  });

  document.getElementById("exportFile").addEventListener("click", () => {
    data.settings.lastBackupExportAt = nowISO();
    saveData();

    const envelope = makeSaveEnvelope();

    const blob = new Blob([JSON.stringify(envelope, null, 2)], {
      type: "application/json"
    });

    const stamp = new Date()
      .toISOString()
      .slice(0, 16)
      .replace("T", "-")
      .replace(":", "-");

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `life-dashboard-public-backup-${stamp}.json`;
    link.click();

    URL.revokeObjectURL(url);
    showToast("Backup-Datei erzeugt");
    updateBackupStatus();
  });

  document.getElementById("importFile").addEventListener("change", event => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      try {
        const imported = JSON.parse(reader.result);
        const label = imported.savedAt ? `Backup vom ${formatDateTimeDE(imported.savedAt)}` : `Backup-Datei ${file.name}`;
        const confirmed = confirm(
          `${label} laden?\n\nAktuelle lokale Daten werden ersetzt. Vorher wird automatisch eine lokale Notfallkopie angelegt.`
        );

        if (!confirmed) return;

        applyImportedSave(imported, "Vor Backup-Datei-Import");
      } catch {
        alert("Die Backup-Datei konnte nicht gelesen werden.");
      }
    };

    reader.readAsText(file);
  });

  document.getElementById("refreshStorageStatus")?.addEventListener("click", () => {
    updateBackupStatus();
    showToast("Speicherstatus aktualisiert");
  });

  document.getElementById("showLocalStorage")?.addEventListener("click", () => {
    document.getElementById("saveCode").value = JSON.stringify(makeSaveEnvelope(), null, 2);
    updateBackupStatus();
    showToast("Lokaler Speicher als Save-Code angezeigt");
  });

  document.getElementById("restoreEmergencyBackup")?.addEventListener("click", () => {
    const emergencyRaw = localStorage.getItem(EMERGENCY_BACKUP_KEY);
    if (!emergencyRaw) return alert("Es gibt noch keine lokale Notfallkopie.");

    try {
      const emergency = JSON.parse(emergencyRaw);
      const confirmed = confirm(
        `Lokale Notfallkopie vom ${formatDateTimeDE(emergency.savedAt)} wiederherstellen?\n\nAktuelle Daten werden dadurch ersetzt.`
      );
      if (!confirmed) return;

      applyImportedSave(emergency, "Vor Wiederherstellung der Notfallkopie");
    } catch {
      alert("Die lokale Notfallkopie konnte nicht gelesen werden.");
    }
  });

  document.getElementById("resetLocalStorage")?.addEventListener("click", () => {
    const first = confirm("Lokalen Dashboard-Speicher wirklich zurücksetzen?\n\nVorher wird automatisch eine lokale Notfallkopie angelegt.");
    if (!first) return;

    const phrase = prompt('Zur Sicherheit bitte "RESET" eingeben:');
    if (phrase !== "RESET") return alert("Zurücksetzen abgebrochen.");

    createEmergencyBackup("Vor lokalem Reset");
    localStorage.removeItem(STORAGE_KEY);
    location.reload();
  });

  updateBackupStatus();
}

function escapeHTML(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


const caveDayLabels = [
  "So Planung",
  "Mo",
  "Di",
  "Mi",
  "Do",
  "Fr",
  "Sa",
  "So"
];

const caveTypes = {
  gaming: "Gaming",
  podcast: "Podcast hören",
  digital: "Digitale Medien",
  retreat: "Rückzug",
  regen: "Regeneration",
  risk: "Achtung / Risiko"
};

function getCaveVisibleSlots() {
  const slots = [];
  for (let slot = 0; slot < 48; slot++) {
    const isEarly = slot < 12;
    const isLate = slot >= 45;
    if (isEarly && !data.gaming.showEarlyHours) continue;
    if (isLate && !data.gaming.showLateHours) continue;
    slots.push(slot);
  }
  return slots;
}

function getCaveSlotRowMap(visibleSlots) {
  const map = new Map();
  visibleSlots.forEach((slot, index) => map.set(slot, index + 2));
  return map;
}

function getCaveActualEntriesForCurrentWeek() {
  const start = data.gaming.weekStart || getCurrentSundayISO();
  const end = addDaysISO(start, 7);
  return (data.gaming.actualEntries || []).filter(entry => entry.date >= start && entry.date <= end);
}

function getCaveActualHours() {
  const entries = getCaveActualEntriesForCurrentWeek();
  if (entries.length) {
    return entries.reduce((sum, entry) => sum + Number(entry.hours || 0), 0);
  }
  return Number(data.gaming.actualHours || 0);
}

function getCaveActualTotalInputValue() {
  const ids = ["caveActualHours", "quickCaveActualTotal", "mindCaveActualInput"];
  for (const id of ids) {
    const input = document.getElementById(id);
    if (!input) continue;
    const parsed = Number(input.value || 0);
    if (Number.isFinite(parsed) && parsed > 0) return parsed;
  }
  return Number(getCaveActualHours() || 0);
}

function addCaveActualHoursFromInput(inputId) {
  const input = document.getElementById(inputId);
  if (!input) return;
  const hours = Number(input.value || 0);
  if (!hours) return;

  if (!Array.isArray(data.gaming.actualEntries)) data.gaming.actualEntries = [];
  const current = getCaveActualTotalInputValue();
  const nextTotal = roundOne(current + hours);

  data.gaming.actualEntries.push({
    id: crypto.randomUUID(),
    date: todayISO(),
    hours: roundOne(hours),
    createdAt: nowISO()
  });
  data.gaming.actualHours = nextTotal;

  input.value = "";
  saveData();
  syncCaveActualInputs();
  updateCaveSummary();
  renderCaveHistory();
  updateDiscipline();
  updateAttraction();
  showToast(`+${roundOne(hours)} h tatsächliche Media Balance · gesamt ${nextTotal} h`);
}

function removeCaveActualToday() {
  if (!Array.isArray(data.gaming.actualEntries)) data.gaming.actualEntries = [];
  const today = todayISO();
  const todaysEntries = data.gaming.actualEntries.filter(entry => entry.date === today);
  const removedHours = roundOne(todaysEntries.reduce((sum, entry) => sum + Number(entry.hours || 0), 0));

  if (!todaysEntries.length && !removedHours) {
    showToast("Heute keine Media Balance-Einträge vorhanden");
    return;
  }

  data.gaming.actualEntries = data.gaming.actualEntries.filter(entry => entry.date !== today);
  data.gaming.actualHours = roundOne(Math.max(0, Number(data.gaming.actualHours || 0) - removedHours));

  saveData();
  syncCaveActualInputs();
  updateCaveSummary();
  renderCaveHistory();
  updateDiscipline();
  updateAttraction();
  showToast(`${roundOne(removedHours)} h heutige Media Balance entfernt`);
}

function syncCaveActualInputs() {
  const actual = roundOne(getCaveActualHours());
  ["caveActualHours", "quickCaveActualTotal", "mindCaveActualInput"].forEach(id => {
    const el = document.getElementById(id);
    if (el && document.activeElement !== el) el.value = actual || "";
  });

  ["caveWeekFrameHours", "quickCaveWeekFrameHours", "mindCaveWeekFrameHours"].forEach(id => {
    const el = document.getElementById(id);
    if (el && document.activeElement !== el) el.value = data.gaming.weekFrameHours || 12;
  });
}

function setCaveWeekFrameFromInput(inputId) {
  const input = document.getElementById(inputId);
  if (!input) return;
  data.gaming.weekFrameHours = Number(input.value || 0);
  saveData();
  syncCaveActualInputs();
  updateCaveSummary();
  updateDiscipline();
  updateAttraction();
}

function archiveCurrentCaveWeek() {
  const planned = getCavePlannedHours();
  const actual = getCaveActualHours();
  const frame = Number(data.gaming.weekFrameHours || 0);
  const adherence = calculateCaveAdherence(frame, actual);

  if (!data.gaming.weekStart) return;
  if (!planned && !actual && !(data.gaming.blocks || []).length) return;

  if (!Array.isArray(data.gaming.weekHistory)) data.gaming.weekHistory = [];

  data.gaming.weekHistory.unshift({
    id: crypto.randomUUID(),
    weekStart: data.gaming.weekStart,
    frameHours: frame,
    plannedHours: roundOne(planned),
    actualHours: roundOne(actual),
    deviation: roundOne(actual - frame),
    adherence,
    archivedAt: nowISO()
  });

  data.gaming.weekHistory = data.gaming.weekHistory.slice(0, 4);
}

function renderCaveHistory() {
  const container = document.getElementById("caveHistoryList");
  if (!container) return;
  container.innerHTML = "";

  const history = data.gaming.weekHistory || [];
  if (!history.length) {
    container.innerHTML = "<p class='hint'>Noch keine vergangenen Medienwochen dokumentiert.</p>";
    return;
  }

  history.slice(0, 4).forEach(item => {
    const div = document.createElement("div");
    div.className = "log-entry";
    div.innerHTML = `
      <strong>Woche ab ${formatShortDate(item.weekStart)} · Rahmentreue ${item.adherence}/10</strong>
      <small>Rahmen ${roundOne(item.frameHours)} h · geplant ${roundOne(item.plannedHours)} h · tatsächlich ${roundOne(item.actualHours)} h · Abweichung ${item.deviation > 0 ? "+" : ""}${roundOne(item.deviation)} h</small>
    `;
    container.appendChild(div);
  });
}


function setupDurationAddButtons(scope = document) {
  scope.querySelectorAll(".duration-add-row").forEach(row => {
    if (row.dataset.bound === "1") return;
    row.dataset.bound = "1";

    row.querySelectorAll("[data-duration-add]").forEach(button => {
      button.addEventListener("click", () => {
        const input = document.getElementById(row.dataset.durationTarget);
        if (!input) return;

        const add = Number(button.dataset.durationAdd || 0);
        const current = Number(input.value || 0);
        const next = Math.max(0.5, current + add);
        input.value = String(next).replace(".", ",").replace(",", ".");
        input.dispatchEvent(new Event("input", { bubbles: true }));
      });
    });
  });
}

function setupGaming() {
  document.getElementById("caveGenerateWeek").addEventListener("click", () => {
    const hasBlocks = data.gaming.blocks && data.gaming.blocks.length > 0;
    const hasActual = getCaveActualHours() > 0;
    const message = hasBlocks || hasActual
      ? "Neue Woche erzeugen? Die aktuelle Woche wird in der Historie dokumentiert und danach geleert."
      : "Neue Woche ab aktuellem Sonntag erzeugen?";

    if (!confirm(message)) return;

    archiveCurrentCaveWeek();
    data.gaming.weekStart = getCurrentSundayISO();
    data.gaming.blocks = [];
    data.gaming.actualEntries = [];
    data.gaming.actualHours = 0;
    data.gaming.selectedDay = null;
    data.gaming.selectedSlot = null;
    data.gaming.editingBlockId = null;
    saveData();
    renderCaveCalendar();
    syncCaveActualInputs();
    updateCaveSummary();
    renderCaveHistory();
    showToast("Neue Medienwoche erzeugt");
  });

  document.getElementById("caveClearCalendar").addEventListener("click", () => {
    if (!confirm("Alle geplanten digitale Medien / Media Balanceen dieser Woche löschen? Tatsächliche Stunden bleiben erhalten.")) return;

    data.gaming.blocks = [];
    data.gaming.selectedDay = null;
    data.gaming.selectedSlot = null;
    data.gaming.editingBlockId = null;
    saveData();
    renderCaveCalendar();
    updateCaveSummary();
    showToast("Medienkalender geleert");
  });

  document.getElementById("caveToggleEarlyHours").addEventListener("click", () => {
    data.gaming.showEarlyHours = !data.gaming.showEarlyHours;
    saveData();
    renderCaveCalendar();
    updateCaveEarlyButton();
  });

  document.getElementById("caveToggleLateHours").addEventListener("click", () => {
    data.gaming.showLateHours = !data.gaming.showLateHours;
    saveData();
    renderCaveCalendar();
    updateCaveLateButton();
  });

  document.getElementById("caveCreateBlock").addEventListener("click", createCaveBlockFromForm);
  document.getElementById("caveResetBlockForm")?.addEventListener("click", resetCaveBlockForm);
  document.getElementById("caveCloseModal").addEventListener("click", closeCaveModal);
  document.getElementById("caveBlockModal").addEventListener("click", event => {
    if (event.target.id === "caveBlockModal") closeCaveModal();
  });

  ["caveWeekFrameHours", "quickCaveWeekFrameHours", "mindCaveWeekFrameHours"].forEach(id => {
    const input = document.getElementById(id);
    if (!input) return;
    input.value = data.gaming.weekFrameHours || 12;
    input.addEventListener("input", () => setCaveWeekFrameFromInput(id));
  });

  ["caveActualHours", "quickCaveActualTotal", "mindCaveActualInput"].forEach(id => {
    const input = document.getElementById(id);
    if (!input) return;
    input.value = getCaveActualHours() || "";
    input.addEventListener("input", event => {
      data.gaming.actualHours = Number(event.target.value || 0);
      data.gaming.actualEntries = [];
      saveData();
      syncCaveActualInputs();
      updateCaveSummary();
      updateDiscipline();
      updateAttraction();
    });
  });

  ["caveAddActualHours", "quickCaveAddActualHours", "mindCaveAddActualHours"].forEach(id => {
    const button = document.getElementById(id);
    if (button) button.addEventListener("click", () => addCaveActualHoursFromInput(id.replace("AddActualHours", "ActualAdd")));
  });

  ["caveRemoveActualToday", "quickCaveRemoveActualToday", "mindCaveRemoveActualToday"].forEach(id => {
    const button = document.getElementById(id);
    if (button) button.addEventListener("click", removeCaveActualToday);
  });

  if (!data.gaming.weekStart) {
    data.gaming.weekStart = getCurrentSundayISO();
    saveData();
  }

  if (!Array.isArray(data.gaming.actualEntries)) data.gaming.actualEntries = [];
  if (!Array.isArray(data.gaming.weekHistory)) data.gaming.weekHistory = [];
  if (!data.gaming.weekFrameHours) data.gaming.weekFrameHours = 12;

  renderCaveCalendar();
  syncCaveActualInputs();
  updateCaveSummary();
  updateCaveEarlyButton();
  updateCaveLateButton();
  renderCaveHistory();
}

function localDateToISO(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function isoToLocalDate(iso) {
  const [year, month, day] = String(iso).split("-").map(Number);
  return new Date(year, month - 1, day);
}

function getCurrentSundayISO() {
  const now = new Date();
  const sunday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  sunday.setDate(sunday.getDate() - sunday.getDay());
  return localDateToISO(sunday);
}

function addDaysISO(iso, days) {
  const date = isoToLocalDate(iso);
  date.setDate(date.getDate() + days);
  return localDateToISO(date);
}

function formatShortDate(iso) {
  if (!iso) return "";
  const date = isoToLocalDate(iso);
  return new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "2-digit"
  }).format(date);
}

function slotToTime(slot) {
  const minutes = slot * 30;
  const h = String(Math.floor(minutes / 60)).padStart(2, "0");
  const m = String(minutes % 60).padStart(2, "0");
  return `${h}:${m}`;
}

function slotRangeText(startSlot, durationSlots) {
  return `${slotToTime(startSlot)}–${slotToTime(Math.min(startSlot + durationSlots, 48))}`;
}

function renderCaveCalendar() {
  const grid = document.getElementById("caveCalendarGrid");
  grid.innerHTML = "";

  const weekStart = data.gaming.weekStart || getCurrentSundayISO();
  const visibleSlots = getCaveVisibleSlots();
  const slotRowMap = getCaveSlotRowMap(visibleSlots);

  grid.style.gridTemplateRows = `50px repeat(${visibleSlots.length}, 34px) 50px`;

  const corner = document.createElement("div");
  corner.className = "cave-header cave-time-sticky";
  corner.style.gridColumn = "1";
  corner.style.gridRow = "1";
  corner.innerHTML = "<strong>Zeit</strong><span>30 Min.</span>";
  grid.appendChild(corner);

  const rightCorner = document.createElement("div");
  rightCorner.className = "cave-header cave-time-right";
  rightCorner.style.gridColumn = "10";
  rightCorner.style.gridRow = "1";
  rightCorner.innerHTML = "<strong>Zeit</strong><span>30 Min.</span>";
  grid.appendChild(rightCorner);

  caveDayLabels.forEach((label, index) => {
    const header = document.createElement("div");
    header.className = "cave-header";
    if (index === 0) header.classList.add("mind-plan-sunday-planning");
    header.style.gridColumn = String(index + 2);
    header.style.gridRow = "1";
    header.innerHTML = `<strong>${label}</strong><span>${formatShortDate(addDaysISO(weekStart, index))}</span>`;
    grid.appendChild(header);
  });

  const footerRow = visibleSlots.length + 2;

  const bottomCorner = document.createElement("div");
  bottomCorner.className = "cave-header cave-footer cave-time-sticky";
  bottomCorner.style.gridColumn = "1";
  bottomCorner.style.gridRow = String(footerRow);
  bottomCorner.innerHTML = "<strong>Zeit</strong><span>30 Min.</span>";
  grid.appendChild(bottomCorner);

  const bottomRightCorner = document.createElement("div");
  bottomRightCorner.className = "cave-header cave-footer cave-time-right";
  bottomRightCorner.style.gridColumn = "10";
  bottomRightCorner.style.gridRow = String(footerRow);
  bottomRightCorner.innerHTML = "<strong>Zeit</strong><span>30 Min.</span>";
  grid.appendChild(bottomRightCorner);

  caveDayLabels.forEach((label, index) => {
    const footer = document.createElement("div");
    footer.className = "cave-header cave-footer";
    if (index === 0) footer.classList.add("mind-plan-sunday-planning");
    footer.style.gridColumn = String(index + 2);
    footer.style.gridRow = String(footerRow);
    footer.innerHTML = `<strong>${label}</strong><span>${formatShortDate(addDaysISO(weekStart, index))}</span>`;
    grid.appendChild(footer);
  });

  visibleSlots.forEach(slot => {
    const row = slotRowMap.get(slot);
    const isEarly = slot < 12;
    const isLate = slot >= 45;

    const time = document.createElement("div");
    time.className = "cave-time";
    if (isEarly) time.classList.add("early-hour");
    if (isLate) time.classList.add("late-hour");
    time.style.gridColumn = "1";
    time.style.gridRow = String(row);
    time.textContent = slotToTime(slot);
    grid.appendChild(time);

    const rightTime = document.createElement("div");
    rightTime.className = "cave-time cave-time-right";
    if (isEarly) rightTime.classList.add("early-hour");
    if (isLate) rightTime.classList.add("late-hour");
    rightTime.style.gridColumn = "10";
    rightTime.style.gridRow = String(row);
    rightTime.textContent = slotToTime(slot);
    grid.appendChild(rightTime);

    for (let day = 0; day < 8; day++) {
      const cell = document.createElement("div");
      cell.className = "cave-cell";
      if (day === 0) cell.classList.add("mind-plan-sunday-planning");
      if (isEarly) cell.classList.add("early-hour");
      if (isLate) cell.classList.add("late-hour");
      if (data.gaming.selectedDay === day && data.gaming.selectedSlot === slot) {
        cell.classList.add("selected");
      }
      cell.style.gridColumn = String(day + 2);
      cell.style.gridRow = String(row);
      cell.dataset.day = String(day);
      cell.dataset.slot = String(slot);
      cell.title = `${caveDayLabels[day]} ${slotToTime(slot)}`;

      cell.addEventListener("click", () => {
        data.gaming.selectedDay = day;
        data.gaming.selectedSlot = slot;
        data.gaming.editingBlockId = null;
        resetCaveBlockForm();
        saveData();
        updateCaveSelectedLabel();
        renderCaveCalendar();
        openCaveModal("create");
      });

      grid.appendChild(cell);
    }
  });

  (data.gaming.blocks || []).forEach(block => {
    const startSlot = Number(block.startSlot);
    const durationSlots = Number(block.durationSlots || 1);
    const blockSlots = Array.from({ length: durationSlots }, (_, i) => startSlot + i);
    const visibleBlockSlots = blockSlots.filter(slot => slotRowMap.has(slot));
    if (!visibleBlockSlots.length) return;

    const firstVisibleSlot = visibleBlockSlots[0];
    const visibleDuration = visibleBlockSlots.length;

    const div = document.createElement("div");
    div.className = `cave-block cave-type-${block.type || "gaming"}`;
    if (startSlot < 12) div.classList.add("early-hour");
    if (startSlot >= 45) div.classList.add("late-hour");
    if (firstVisibleSlot !== startSlot) div.classList.add("continues-from-hidden");
    div.style.gridColumn = String(Number(block.day) + 2);
    div.style.gridRow = `${slotRowMap.get(firstVisibleSlot)} / span ${visibleDuration}`;
    div.style.color = block.textColor || "#ffffff";
    div.style.fontWeight = block.bold ? "700" : "400";
    div.style.fontStyle = block.italic ? "italic" : "normal";
    div.style.textDecoration = block.underline ? "underline" : "none";

    div.innerHTML = `
      <div class="cave-block-actions">
        <button data-cave-edit="${block.id}">Edit</button>
        <button data-cave-delete="${block.id}">Delete</button>
      </div>
      <strong>${block.title || "Media Balance"}</strong>
      <small>${slotRangeText(Number(block.startSlot), Number(block.durationSlots || 1))} · ${caveTypes[block.type] || "Gaming"}</small>
      <span class="mind-plan-block-note">${escapeHTML(block.note || "")}</span>
    `;

    grid.appendChild(div);
  });

  grid.querySelectorAll("[data-cave-delete]").forEach(button => {
    button.addEventListener("click", event => {
      event.stopPropagation();
      deleteCaveBlock(button.dataset.caveDelete);
    });
  });

  grid.querySelectorAll("[data-cave-edit]").forEach(button => {
    button.addEventListener("click", event => {
      event.stopPropagation();
      editCaveBlock(button.dataset.caveEdit);
    });
  });

  updateCaveSelectedLabel();
  updateCalendarScrollSpacers();
}

function openCaveModal(mode = "create") {
  const modal = document.getElementById("caveBlockModal");
  const title = document.getElementById("caveBlockModalTitle");
  const actionButton = document.getElementById("caveCreateBlock");

  if (title) title.textContent = mode === "edit" ? "Block bearbeiten" : "Block erstellen";
  if (actionButton) actionButton.textContent = mode === "edit" ? "Änderungen speichern" : "Block eintragen";

  modal.classList.remove("hidden");
  updateCaveSelectedLabel();
  setTimeout(() => document.getElementById("caveBlockTitle")?.focus(), 20);
}

function closeCaveModal() {
  document.getElementById("caveBlockModal")?.classList.add("hidden");
  data.gaming.editingBlockId = null;
  saveData();
  renderCaveCalendar();
}

function resetCaveBlockForm() {
  document.getElementById("caveBlockTitle").value = "";
  document.getElementById("caveBlockDuration").value = "0";
  document.getElementById("caveBlockType").value = "gaming";
  document.getElementById("caveBlockNote").value = "";
  document.getElementById("caveBlockBold").checked = false;
  document.getElementById("caveBlockItalic").checked = false;
  document.getElementById("caveBlockUnderline").checked = false;
  document.getElementById("caveBlockTextColor").value = "#ffffff";
}

function fillCaveBlockForm(block) {
  document.getElementById("caveBlockTitle").value = block.title || "Media Balance / digitale Medien";
  document.getElementById("caveBlockDuration").value = String(Number(block.durationSlots || 1) * 0.5);
  document.getElementById("caveBlockType").value = block.type || "gaming";
  document.getElementById("caveBlockNote").value = block.note || "";
  document.getElementById("caveBlockBold").checked = Boolean(block.bold);
  document.getElementById("caveBlockItalic").checked = Boolean(block.italic);
  document.getElementById("caveBlockUnderline").checked = Boolean(block.underline);
  document.getElementById("caveBlockTextColor").value = block.textColor || "#ffffff";
}

function updateCaveEarlyButton() {
  const button = document.getElementById("caveToggleEarlyHours");
  if (!button) return;
  button.textContent = data.gaming.showEarlyHours ? "0–6 Uhr einklappen" : "0–6 Uhr anzeigen";
}

function updateCaveLateButton() {
  const button = document.getElementById("caveToggleLateHours");
  if (!button) return;
  button.textContent = data.gaming.showLateHours ? "22:30–24 Uhr einklappen" : "22:30–24 Uhr anzeigen";
}

function updateCaveSelectedLabel() {
  const label = document.getElementById("caveSelectedSlot");

  if (data.gaming.selectedDay === null || data.gaming.selectedSlot === null) {
    label.textContent = "keiner";
    return;
  }

  const day = Number(data.gaming.selectedDay);
  const slot = Number(data.gaming.selectedSlot);
  const date = formatShortDate(addDaysISO(data.gaming.weekStart, day));
  label.textContent = `${caveDayLabels[day]} ${date}, ${slotToTime(slot)}`;
}

function createCaveBlockFromForm() {
  if (data.gaming.selectedDay === null || data.gaming.selectedSlot === null) {
    alert("Bitte zuerst eine Startzeit im Kalender anklicken.");
    return;
  }

  const editingId = data.gaming.editingBlockId;
  const existingBlock = editingId
    ? data.gaming.blocks.find(item => item.id === editingId)
    : null;

  const title = document.getElementById("caveBlockTitle").value.trim() || "Media Balance";
  const hours = Number(document.getElementById("caveBlockDuration").value || 2);
  const durationSlots = clamp(Math.round(hours * 2), 1, 48 - Number(data.gaming.selectedSlot));
  const type = document.getElementById("caveBlockType").value;
  const note = document.getElementById("caveBlockNote").value.trim();

  const block = {
    id: existingBlock?.id || crypto.randomUUID(),
    day: Number(data.gaming.selectedDay),
    startSlot: Number(data.gaming.selectedSlot),
    durationSlots,
    title,
    type,
    note,
    bold: document.getElementById("caveBlockBold").checked,
    italic: document.getElementById("caveBlockItalic").checked,
    underline: document.getElementById("caveBlockUnderline").checked,
    textColor: document.getElementById("caveBlockTextColor").value,
    createdAt: existingBlock?.createdAt || nowISO(),
    updatedAt: editingId ? nowISO() : null
  };

  if (caveBlockOverlaps(block, editingId || null)) {
    alert("Dieser Block überschneidet sich mit einer vorhandenen Media Balance.");
    return;
  }

  if (editingId && existingBlock) {
    Object.assign(existingBlock, block);
  } else {
    data.gaming.blocks.push(block);
  }

  data.gaming.editingBlockId = null;
  saveData();
  closeCaveModal();
  resetCaveBlockForm();
  renderCaveCalendar();
  updateCaveSummary();
  showToast(editingId ? "Media Balance aktualisiert" : `${roundOne(durationSlots * 0.5)} h Media Balance eingetragen`);
}

function caveBlockOverlaps(candidate, ignoreId = null) {
  return (data.gaming.blocks || []).some(block => {
    if (ignoreId && block.id === ignoreId) return false;
    if (Number(block.day) !== Number(candidate.day)) return false;

    const aStart = Number(candidate.startSlot);
    const aEnd = aStart + Number(candidate.durationSlots);
    const bStart = Number(block.startSlot);
    const bEnd = bStart + Number(block.durationSlots);

    return aStart < bEnd && bStart < aEnd;
  });
}

function editCaveBlock(id) {
  const block = data.gaming.blocks.find(item => item.id === id);
  if (!block) return;

  data.gaming.selectedDay = Number(block.day);
  data.gaming.selectedSlot = Number(block.startSlot);
  data.gaming.editingBlockId = block.id;
  fillCaveBlockForm(block);
  saveData();
  renderCaveCalendar();
  openCaveModal("edit");
}

function deleteCaveBlock(id) {
  const block = data.gaming.blocks.find(item => item.id === id);
  if (!block) return;

  if (!confirm(`"${block.title}" wirklich löschen?`)) return;

  data.gaming.blocks = data.gaming.blocks.filter(item => item.id !== id);
  saveData();
  renderCaveCalendar();
  updateCaveSummary();
  showToast("Media Balance gelöscht");
}

function getCavePlannedHoursByType() {
  const totals = {};

  (data.mindPlanner.blocks || []).forEach(block => {  });

  (data.gaming.blocks || []).forEach(block => {
    const type = block.type || "gaming";
    totals[type] = (totals[type] || 0) + Number(block.durationSlots || 0) * 0.5;
  });
  return totals;
}

function formatCaveTypeBreakdown() {
  const totals = getCavePlannedHoursByType();
  const entries = Object.entries(totals).filter(([, hours]) => Number(hours) > 0);

  if (!entries.length) return "noch nichts geplant";

  return entries
    .map(([type, hours]) => `${caveTypes[type] || type}: ${roundOne(hours)} h`)
    .join(" · ");
}

function getNextCaveBlock() {
  if (!data.gaming || !data.gaming.weekStart || !Array.isArray(data.gaming.blocks)) return null;

  const now = new Date();
  const today = localDateToISO(now);
  const weekStart = data.gaming.weekStart || getCurrentSundayISO();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  const upcoming = (data.gaming.blocks || [])
    .filter(block => Number(block.day) !== 0)
    .map(block => {
      const blockDate = addDaysISO(weekStart, Number(block.day));
      const startSlot = Number(block.startSlot || 0);
      const durationSlots = Number(block.durationSlots || 1);
      const startMinutes = startSlot * 30;
      const endMinutes = Math.min((startSlot + durationSlots) * 30, 24 * 60);

      let distance = Infinity;
      if (blockDate > today) {
        distance = (isoToLocalDate(blockDate) - isoToLocalDate(today)) / (1000 * 60 * 60 * 24) * 24 * 60 + startMinutes;
      } else if (blockDate === today && endMinutes > nowMinutes) {
        distance = Math.max(startMinutes - nowMinutes, 0);
      }

      return { block, blockDate, distance };
    })
    .filter(item => Number.isFinite(item.distance))
    .sort((a, b) => a.distance - b.distance);

  return upcoming[0] || null;
}

function formatCaveNextBlock() {
  const next = getNextCaveBlock();
  if (!next) return "keine geplant";

  const block = next.block;
  const day = Number(block.day);
  const label = caveDayLabels[day] || "Tag";
  const range = slotRangeText(Number(block.startSlot), Number(block.durationSlots || 1));
  const type = caveTypes[block.type] || "Digitale Medien";
  const date = formatShortDate(next.blockDate);

  return `${label} ${date}, ${range} · ${block.title || "Media Balance"} · ${type}`;
}

function getCavePlannedHours() {
  return (data.gaming.blocks || []).reduce((sum, block) => {
    return sum + Number(block.durationSlots || 0) * 0.5;
  }, 0);
}

function updateCaveSummary() {
  const planned = getCavePlannedHours();
  const actual = getCaveActualHours();
  const frame = Number(data.gaming.weekFrameHours || 0);
  const deviation = actual - frame;
  const adherence = calculateCaveAdherence(frame, actual);

  document.getElementById("caveWeekStartLabel").textContent =
    data.gaming.weekStart
      ? `${formatShortDate(data.gaming.weekStart)} bis ${formatShortDate(addDaysISO(data.gaming.weekStart, 7))}`
      : "noch nicht erzeugt";

  document.getElementById("caveFrameHoursLabel").textContent = `${roundOne(frame)} h`;
  document.getElementById("cavePlannedHours").textContent = `${roundOne(planned)} h`;
  const typeBreakdown = document.getElementById("caveTypeBreakdown");
  const nextBlock = document.getElementById("caveNextBlock");
  if (typeBreakdown) typeBreakdown.textContent = formatCaveTypeBreakdown();
  if (nextBlock) nextBlock.textContent = formatCaveNextBlock();
  document.getElementById("caveActualHoursLabel").textContent = `${roundOne(actual)} h`;
  document.getElementById("caveDeviation").textContent =
    `${deviation > 0 ? "+" : ""}${roundOne(deviation)} h`;
  document.getElementById("caveAdherence").textContent = `${adherence}/10`;

  syncCaveActualInputs();

  const mindFrame = document.getElementById("mindCaveFrameHours");
  const mindPlanned = document.getElementById("mindCavePlannedHours");
  const mindNext = document.getElementById("mindCaveNextBlock");
  const mindActual = document.getElementById("mindCaveActualHours");
  const mindDeviation = document.getElementById("mindCaveDeviation");
  const mindAdherence = document.getElementById("mindCaveAdherence");
  if (mindFrame) mindFrame.textContent = `${roundOne(frame)} h`;
  if (mindPlanned) mindPlanned.textContent = `${roundOne(planned)} h`;
  if (mindNext) mindNext.textContent = formatCaveNextBlock();
  if (mindActual) mindActual.textContent = `${roundOne(actual)} h`;
  if (mindDeviation) mindDeviation.textContent = `${deviation > 0 ? "+" : ""}${roundOne(deviation)} h`;
  if (mindAdherence) mindAdherence.textContent = `${adherence}/10`;

  const quickFrame = document.getElementById("quickCaveFrameLabel");
  const quickActual = document.getElementById("quickCaveActualLabel");
  const quickAdherence = document.getElementById("quickCaveAdherenceLabel");
  if (quickFrame) quickFrame.textContent = `${roundOne(frame)} h`;
  if (quickActual) quickActual.textContent = `${roundOne(actual)} h`;
  if (quickAdherence) quickAdherence.textContent = `${adherence}/10`;

  updateActiveCaveDashboardCard();
}

function calculateCaveAdherence(frame, actual) {
  const allowed = Number(frame || 0);
  const used = Number(actual || 0);

  if (!allowed && !used) return 10;
  if (!allowed && used) return 0;
  if (used <= allowed) return 10;

  const over = used - allowed;
  return clamp(roundOne(10 - over), 0, 10);
}

function getActiveCaveBlock() {
  if (!data.gaming || !data.gaming.weekStart || !Array.isArray(data.gaming.blocks)) return null;

  const now = new Date();
  const today = localDateToISO(now);
  const weekStart = data.gaming.weekStart || getCurrentSundayISO();

  for (const block of data.gaming.blocks) {
    const day = Number(block.day);

    // Die erste Spalte ist „Sonntag Planung“ und wird nicht als aktive Gaming-Zeit gewertet.
    if (day === 0) continue;

    const blockDate = addDaysISO(weekStart, day);
    if (blockDate !== today) continue;

    const startSlot = Number(block.startSlot || 0);
    const durationSlots = Number(block.durationSlots || 1);
    const startMinutes = startSlot * 30;
    const endMinutes = Math.min((startSlot + durationSlots) * 30, 24 * 60);
    const nowMinutes = now.getHours() * 60 + now.getMinutes();

    if (nowMinutes >= startMinutes && nowMinutes < endMinutes) {
      return block;
    }
  }

  return null;
}

function updateActiveCaveDashboardCard() {
  const card = document.getElementById("activeCaveCard");
  const text = document.getElementById("activeCaveText");
  if (!card || !text) return;

  const block = getActiveCaveBlock();

  if (!block) {
    card.classList.add("hidden");
    return;
  }

  const title = block.title || "Media Balance / digitale Medien";
  const range = slotRangeText(Number(block.startSlot), Number(block.durationSlots || 1));
  const type = caveTypes[block.type] || "Digitale Medien";

  text.innerHTML = `${escapeHTML(title)}<br>${range} · ${escapeHTML(type)}`;
  card.classList.remove("hidden");
}



const mindPlanTypes = {
  morning: "Morgenroutine",
  work1: "Arbeitsblock 1",
  work2: "Arbeitsblock 2",
  work3: "Arbeitsblock 3",
  job: "Arbeiten",
  study: "Studium",
  fitness: "Fitness",
  relax: "Entspannung / Medien",
  food: "Essen",
  travel: "Reisezeit",
  event: "Event",
  nature: "In der Natur sein",
  city: "In die Stadt gehen",
  free: "Freier Block"
};

function getMindPlanVisibleSlots() {
  const slots = [];
  for (let slot = 0; slot < 48; slot++) {
    const isEarly = slot < 12;
    const isLate = slot >= 44;
    if (isEarly && !data.mindPlanner.showEarlyHours) continue;
    if (isLate && !data.mindPlanner.showLateHours) continue;
    slots.push(slot);
  }
  return slots;
}

function getMindPlanSlotRowMap(visibleSlots) {
  const map = new Map();
  visibleSlots.forEach((slot, index) => map.set(slot, index + 2));
  return map;
}


function setupMindPlanner() {
  const generate = document.getElementById("mindPlanGenerateWeek");
  if (!generate) return;

  generate.addEventListener("click", () => {
    const hasBlocks = data.mindPlanner.blocks && data.mindPlanner.blocks.length > 0;
    const carryBlocks = (data.mindPlanner.blocks || [])
      .filter(block => Number(block.day) === 7)
      .map(block => ({
        ...block,
        id: crypto.randomUUID(),
        day: 0
      }));

    const message = hasBlocks
      ? `Neue Woche erzeugen?\n\nDer rechte Sonntag wird als neuer linker Sonntag übernommen (${carryBlocks.length} Block/Blöcke). Alle anderen Tage werden geleert.`
      : "Neue Woche ab aktuellem Sonntag erzeugen?";

    if (!confirm(message)) return;

    data.mindPlanner.weekStart = data.mindPlanner.weekStart
      ? addDaysISO(data.mindPlanner.weekStart, 7)
      : getCurrentSundayISO();
    data.mindPlanner.blocks = carryBlocks;
    data.mindPlanner.selectedDay = null;
    data.mindPlanner.selectedSlot = null;
    data.mindPlanner.editingBlockId = null;
    saveData();
      renderMindPlanCalendar();
    updateMindPlanSummary();
    showToast(carryBlocks.length ? "Neue Woche erzeugt · rechter Sonntag übernommen" : "Neue Geist-&-Denken-Woche erzeugt");
  });

  document.getElementById("mindPlanClearCalendar")?.addEventListener("click", () => {
    if (!confirm("Alle Zeitblöcke dieser Wochenplanung löschen?")) return;
    data.mindPlanner.blocks = [];
    data.mindPlanner.selectedDay = null;
    data.mindPlanner.selectedSlot = null;
    data.mindPlanner.editingBlockId = null;
    saveData();
      renderMindPlanCalendar();
    updateMindPlanSummary();
    showToast("Wochenplanung geleert");
  });

  document.getElementById("mindPlanClearSundayPlanning")?.addEventListener("click", () => {
    const removed = (data.mindPlanner.blocks || []).filter(block => Number(block.day) === 0).length;
    if (!removed) {
      showToast("SO-Planung ist bereits leer");
      return;
    }

    if (!confirm(`SO-Planung löschen? ${removed} Block/Blöcke werden entfernt.`)) return;

    data.mindPlanner.blocks = (data.mindPlanner.blocks || []).filter(block => Number(block.day) !== 0);
    data.mindPlanner.selectedDay = null;
    data.mindPlanner.selectedSlot = null;
    data.mindPlanner.editingBlockId = null;
    saveData();
      renderMindPlanCalendar();
    updateMindPlanSummary();
    showToast("SO-Planung gelöscht");
  });

  document.getElementById("mindPlanToggleEarlyHours")?.addEventListener("click", () => {
    data.mindPlanner.showEarlyHours = !data.mindPlanner.showEarlyHours;
    saveData();
    renderMindPlanCalendar();
    updateMindPlanEarlyButton();
  });

  document.getElementById("mindPlanToggleLateHours")?.addEventListener("click", () => {
    data.mindPlanner.showLateHours = !data.mindPlanner.showLateHours;
    saveData();
    renderMindPlanCalendar();
    updateMindPlanLateButton();
  });

  document.getElementById("mindPlanCreateBlock")?.addEventListener("click", createMindPlanBlockFromForm);
  document.getElementById("mindPlanBlockPulseToggle")?.addEventListener("click", event => {
    const button = event.currentTarget;
    const active = !button.classList.contains("active");
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", active ? "true" : "false");
  });
  document.getElementById("mindPlanResetBlockForm")?.addEventListener("click", resetMindPlanBlockForm);
  document.getElementById("mindPlanCloseModal")?.addEventListener("click", closeMindPlanModal);
  document.getElementById("mindPlanBlockModal")?.addEventListener("click", event => {
    if (event.target.id === "mindPlanBlockModal") closeMindPlanModal();
  });

  if (!data.mindPlanner.weekStart) {
    data.mindPlanner.weekStart = getCurrentSundayISO();
    saveData();
  }
  if (!Array.isArray(data.mindPlanner.blocks)) data.mindPlanner.blocks = [];

  renderMindPlanCalendar();
  updateMindPlanSummary();
  updateMindPlanEarlyButton();
  updateMindPlanLateButton();
}


function isMindPlanBlockActiveNow(block) {
  if (!data.mindPlanner?.weekStart) return false;

  const now = new Date();
  const today = todayISO();
  const blockDate = addDaysISO(data.mindPlanner.weekStart, Number(block.day || 0));
  if (blockDate !== today) return false;

  const nowSlot = (now.getHours() * 60 + now.getMinutes()) / 30;
  const startSlot = Number(block.startSlot || 0);
  const endSlot = startSlot + Number(block.durationSlots || 1);

  return nowSlot >= startSlot && nowSlot < endSlot;
}

function renderMindPlanCalendar() {
  const grid = document.getElementById("mindPlanCalendarGrid");
  if (!grid) return;
  grid.innerHTML = "";

  const weekStart = data.mindPlanner.weekStart || getCurrentSundayISO();
  const visibleSlots = getMindPlanVisibleSlots();
  const slotRowMap = getMindPlanSlotRowMap(visibleSlots);

  grid.style.gridTemplateRows = `50px repeat(${visibleSlots.length}, 34px) 50px`;

  const corner = document.createElement("div");
  corner.className = "cave-header cave-time-sticky";
  corner.style.gridColumn = "1";
  corner.style.gridRow = "1";
  corner.innerHTML = "<strong>Zeit</strong><span>30 Min.</span>";
  grid.appendChild(corner);

  const rightCorner = document.createElement("div");
  rightCorner.className = "cave-header cave-time-right";
  rightCorner.style.gridColumn = "10";
  rightCorner.style.gridRow = "1";
  rightCorner.innerHTML = "<strong>Zeit</strong><span>30 Min.</span>";
  grid.appendChild(rightCorner);

  caveDayLabels.forEach((label, index) => {
    const header = document.createElement("div");
    header.className = "cave-header";
    if (String(label).toLowerCase().includes("planung")) header.classList.add("mind-plan-sunday-planning");
    header.style.gridColumn = String(index + 2);
    header.style.gridRow = "1";
    header.innerHTML = `<strong>${label}</strong><span>${formatShortDate(addDaysISO(weekStart, index))}</span>`;
    grid.appendChild(header);
  });

  const footerRow = visibleSlots.length + 2;
  const bottomCorner = document.createElement("div");
  bottomCorner.className = "cave-header cave-footer cave-time-sticky";
  bottomCorner.style.gridColumn = "1";
  bottomCorner.style.gridRow = String(footerRow);
  bottomCorner.innerHTML = "<strong>Zeit</strong><span>30 Min.</span>";
  grid.appendChild(bottomCorner);

  const bottomRightCorner = document.createElement("div");
  bottomRightCorner.className = "cave-header cave-footer cave-time-right";
  bottomRightCorner.style.gridColumn = "10";
  bottomRightCorner.style.gridRow = String(footerRow);
  bottomRightCorner.innerHTML = "<strong>Zeit</strong><span>30 Min.</span>";
  grid.appendChild(bottomRightCorner);

  caveDayLabels.forEach((label, index) => {
    const footer = document.createElement("div");
    footer.className = "cave-header cave-footer";
    if (String(label).toLowerCase().includes("planung")) footer.classList.add("mind-plan-sunday-planning");
    footer.style.gridColumn = String(index + 2);
    footer.style.gridRow = String(footerRow);
    footer.innerHTML = `<strong>${label}</strong><span>${formatShortDate(addDaysISO(weekStart, index))}</span>`;
    grid.appendChild(footer);
  });

  visibleSlots.forEach(slot => {
    const row = slotRowMap.get(slot);
    const isEarly = slot < 12;
    const isLate = slot >= 44;

    const time = document.createElement("div");
    time.className = "cave-time";
    if (isEarly) time.classList.add("early-hour");
    if (isLate) time.classList.add("late-hour");
    time.style.gridColumn = "1";
    time.style.gridRow = String(row);
    time.textContent = slotToTime(slot);
    grid.appendChild(time);

    const rightTime = document.createElement("div");
    rightTime.className = "cave-time cave-time-right";
    if (isEarly) rightTime.classList.add("early-hour");
    if (isLate) rightTime.classList.add("late-hour");
    rightTime.style.gridColumn = "10";
    rightTime.style.gridRow = String(row);
    rightTime.textContent = slotToTime(slot);
    grid.appendChild(rightTime);

    for (let day = 0; day < 8; day++) {
      const cell = document.createElement("div");
      cell.className = "cave-cell";
      if (String(caveDayLabels[day] || "").toLowerCase().includes("planung")) cell.classList.add("mind-plan-sunday-planning");
      if (isEarly) cell.classList.add("early-hour");
      if (isLate) cell.classList.add("late-hour");
      if (data.mindPlanner.selectedDay === day && data.mindPlanner.selectedSlot === slot) {
        cell.classList.add("selected");
      }
      cell.style.gridColumn = String(day + 2);
      cell.style.gridRow = String(row);
      cell.dataset.day = String(day);
      cell.dataset.slot = String(slot);
      cell.title = `${caveDayLabels[day]} ${slotToTime(slot)}`;

      cell.addEventListener("click", () => {
        data.mindPlanner.selectedDay = day;
        data.mindPlanner.selectedSlot = slot;
        data.mindPlanner.editingBlockId = null;
        resetMindPlanBlockForm();
        saveData();
        updateMindPlanSelectedLabel();
        renderMindPlanCalendar();
        openMindPlanModal("create");
      });

      grid.appendChild(cell);
    }
  });

  (data.mindPlanner.blocks || []).forEach(block => {
    const startSlot = Number(block.startSlot);
    const durationSlots = Number(block.durationSlots || 1);
    const blockSlots = Array.from({ length: durationSlots }, (_, i) => startSlot + i);
    const visibleBlockSlots = blockSlots.filter(slot => slotRowMap.has(slot));
    if (!visibleBlockSlots.length) return;

    const firstVisibleSlot = visibleBlockSlots[0];
    const visibleDuration = visibleBlockSlots.length;

    const div = document.createElement("div");
    div.className = `cave-block mind-type-${block.type || "free"}`;
    if (Number(block.day) === 0) div.classList.add("mind-plan-sunday-planning-block");
    if (String(caveDayLabels[Number(block.day)] || "").toLowerCase().includes("planung")) div.classList.add("mind-plan-sunday-planning-block");
    if (block.pulse) div.classList.add("mind-plan-pulse");
    if (isMindPlanBlockActiveNow(block)) div.classList.add("mind-plan-active-now");
    if (startSlot < 12) div.classList.add("early-hour");
    if (startSlot >= 44) div.classList.add("late-hour");
    if (firstVisibleSlot !== startSlot) div.classList.add("continues-from-hidden");
    div.style.gridColumn = String(Number(block.day) + 2);
    div.style.gridRow = `${slotRowMap.get(firstVisibleSlot)} / span ${visibleDuration}`;
    div.style.color = block.textColor || "#ffffff";
    div.style.fontWeight = block.bold ? "700" : "400";
    div.style.fontStyle = block.italic ? "italic" : "normal";
    div.style.textDecoration = block.underline ? "underline" : "none";

    div.innerHTML = `
      <div class="cave-block-actions">
        <button data-mind-plan-edit="${block.id}">Edit</button>
        <button data-mind-plan-delete="${block.id}">Delete</button>
      </div>
      <strong>${escapeHTML(block.title || "Zeitblock")}</strong>
      <small>${slotRangeText(Number(block.startSlot), Number(block.durationSlots || 1))} · ${escapeHTML(mindPlanTypes[block.type] || "Freier Block")}</small>
      <span class="mind-plan-block-note">${escapeHTML(block.note || "")}</span>
    `;

    grid.appendChild(div);
  });

  grid.querySelectorAll("[data-mind-plan-delete]").forEach(button => {
    button.addEventListener("click", event => {
      event.stopPropagation();
      deleteMindPlanBlock(button.dataset.mindPlanDelete);
    });
  });

  grid.querySelectorAll("[data-mind-plan-edit]").forEach(button => {
    button.addEventListener("click", event => {
      event.stopPropagation();
      editMindPlanBlock(button.dataset.mindPlanEdit);
    });
  });

  updateMindPlanSelectedLabel();
  updateCalendarScrollSpacers();
}

function openMindPlanModal(mode = "create") {
  const modal = document.getElementById("mindPlanBlockModal");
  const title = document.getElementById("mindPlanBlockModalTitle");
  const actionButton = document.getElementById("mindPlanCreateBlock");
  if (!modal) return;

  if (title) title.textContent = mode === "edit" ? "Zeitblock bearbeiten" : "Zeitblock erstellen";
  if (actionButton) actionButton.textContent = mode === "edit" ? "Änderungen speichern" : "Block eintragen";

  modal.classList.remove("hidden");
  updateMindPlanSelectedLabel();
  setTimeout(() => document.getElementById("mindPlanBlockTitle")?.focus(), 20);
}

function closeMindPlanModal() {
  document.getElementById("mindPlanBlockModal")?.classList.add("hidden");
  data.mindPlanner.editingBlockId = null;
  saveData();
  renderMindPlanCalendar();
}

function resetMindPlanBlockForm() {
  document.getElementById("mindPlanBlockTitle").value = "";
  document.getElementById("mindPlanBlockDuration").value = "0";
  document.getElementById("mindPlanBlockType").value = "morning";
  document.getElementById("mindPlanBlockNote").value = "";
  document.getElementById("mindPlanBlockBold").checked = false;
  document.getElementById("mindPlanBlockItalic").checked = false;
  document.getElementById("mindPlanBlockUnderline").checked = false;
  document.getElementById("mindPlanBlockTextColor").value = "#ffffff";
  const pulseToggle = document.getElementById("mindPlanBlockPulseToggle");
  if (pulseToggle) {
    pulseToggle.classList.remove("active");
    pulseToggle.setAttribute("aria-pressed", "false");
  }
}

function fillMindPlanBlockForm(block) {
  document.getElementById("mindPlanBlockTitle").value = block.title || "Zeitblock";
  document.getElementById("mindPlanBlockDuration").value = String(Number(block.durationSlots || 1) * 0.5);
  document.getElementById("mindPlanBlockType").value = block.type || "free";
  document.getElementById("mindPlanBlockNote").value = block.note || "";
  document.getElementById("mindPlanBlockBold").checked = Boolean(block.bold);
  document.getElementById("mindPlanBlockItalic").checked = Boolean(block.italic);
  document.getElementById("mindPlanBlockUnderline").checked = Boolean(block.underline);
  document.getElementById("mindPlanBlockTextColor").value = block.textColor || "#ffffff";
  const pulseToggle = document.getElementById("mindPlanBlockPulseToggle");
  if (pulseToggle) {
    pulseToggle.classList.toggle("active", Boolean(block.pulse));
    pulseToggle.setAttribute("aria-pressed", Boolean(block.pulse) ? "true" : "false");
  }
}

function updateMindPlanEarlyButton() {
  const button = document.getElementById("mindPlanToggleEarlyHours");
  if (!button) return;
  button.textContent = data.mindPlanner.showEarlyHours ? "0–6 Uhr einklappen" : "0–6 Uhr anzeigen";
}

function updateMindPlanLateButton() {
  const button = document.getElementById("mindPlanToggleLateHours");
  if (!button) return;
  button.textContent = data.mindPlanner.showLateHours ? "22–24 Uhr einklappen" : "22–24 Uhr anzeigen";
}

function updateMindPlanSelectedLabel() {
  const label = document.getElementById("mindPlanSelectedSlot");
  if (!label) return;

  if (data.mindPlanner.selectedDay === null || data.mindPlanner.selectedSlot === null) {
    label.textContent = "keiner";
    return;
  }

  const day = Number(data.mindPlanner.selectedDay);
  const slot = Number(data.mindPlanner.selectedSlot);
  const date = formatShortDate(addDaysISO(data.mindPlanner.weekStart, day));
  label.textContent = `${caveDayLabels[day]} ${date}, ${slotToTime(slot)}`;
}

function createMindPlanBlockFromForm() {
  if (data.mindPlanner.selectedDay === null || data.mindPlanner.selectedSlot === null) {
    alert("Bitte zuerst eine Startzeit im Kalender anklicken.");
    return;
  }

  const editingId = data.mindPlanner.editingBlockId;
  const existingBlock = editingId
    ? data.mindPlanner.blocks.find(item => item.id === editingId)
    : null;

  const title = document.getElementById("mindPlanBlockTitle").value.trim() || "Zeitblock";
  const hours = Number(document.getElementById("mindPlanBlockDuration").value || 2);
  const durationSlots = clamp(Math.round(hours * 2), 1, 48 - Number(data.mindPlanner.selectedSlot));
  const type = document.getElementById("mindPlanBlockType").value;
  const note = document.getElementById("mindPlanBlockNote").value.trim();

  const block = {
    id: existingBlock?.id || crypto.randomUUID(),
    day: Number(data.mindPlanner.selectedDay),
    startSlot: Number(data.mindPlanner.selectedSlot),
    durationSlots,
    title,
    type,
    note,
    bold: document.getElementById("mindPlanBlockBold").checked,
    italic: document.getElementById("mindPlanBlockItalic").checked,
    underline: document.getElementById("mindPlanBlockUnderline").checked,
    pulse: document.getElementById("mindPlanBlockPulseToggle")?.classList.contains("active") || false,
    textColor: document.getElementById("mindPlanBlockTextColor").value,
    createdAt: existingBlock?.createdAt || nowISO(),
    updatedAt: editingId ? nowISO() : null
  };

  if (mindPlanBlockOverlaps(block, editingId || null)) {
    alert("Dieser Block überschneidet sich mit einem vorhandenen Zeitblock.");
    return;
  }

  if (editingId && existingBlock) {
    Object.assign(existingBlock, block);
  } else {
    data.mindPlanner.blocks.push(block);
  }

  data.mindPlanner.editingBlockId = null;
  saveData();
  closeMindPlanModal();
  resetMindPlanBlockForm();
  renderMindPlanCalendar();
  updateMindPlanSummary();
  showToast(editingId ? "Zeitblock aktualisiert" : `${roundOne(durationSlots * 0.5)} h Zeitblock eingetragen`);
}

function mindPlanBlockOverlaps(candidate, ignoreId = null) {
  return (data.mindPlanner.blocks || []).some(block => {
    if (ignoreId && block.id === ignoreId) return false;
    if (Number(block.day) !== Number(candidate.day)) return false;

    const aStart = Number(candidate.startSlot);
    const aEnd = aStart + Number(candidate.durationSlots);
    const bStart = Number(block.startSlot);
    const bEnd = bStart + Number(block.durationSlots);

    return aStart < bEnd && bStart < aEnd;
  });
}

function editMindPlanBlock(id) {
  const block = data.mindPlanner.blocks.find(item => item.id === id);
  if (!block) return;

  data.mindPlanner.selectedDay = Number(block.day);
  data.mindPlanner.selectedSlot = Number(block.startSlot);
  data.mindPlanner.editingBlockId = block.id;
  fillMindPlanBlockForm(block);
  saveData();
  renderMindPlanCalendar();
  openMindPlanModal("edit");
}

function deleteMindPlanBlock(id) {
  const block = data.mindPlanner.blocks.find(item => item.id === id);
  if (!block) return;

  if (!confirm(`"${block.title}" wirklich löschen?`)) return;

  data.mindPlanner.blocks = data.mindPlanner.blocks.filter(item => item.id !== id);
  saveData();
  renderMindPlanCalendar();
  updateMindPlanSummary();
  showToast("Zeitblock gelöscht");
}

function getMindPlanPlannedHours() {
  return (data.mindPlanner.blocks || []).reduce((sum, block) => {
    return sum + Number(block.durationSlots || 0) * 0.5;
  }, 0);
}

function getMindPlanPlannedHoursByType() {
  const totals = {};
  (data.mindPlanner.blocks || []).forEach(block => {
    const type = block.type || "free";
    totals[type] = (totals[type] || 0) + Number(block.durationSlots || 0) * 0.5;
  });
  return totals;
}

function formatMindPlanTypeBreakdown() {
  const totals = getMindPlanPlannedHoursByType();
  const entries = Object.entries(totals).filter(([, hours]) => Number(hours) > 0);
  if (!entries.length) return "noch nichts geplant";
  return entries
    .map(([type, hours]) => `${mindPlanTypes[type] || type}: ${roundOne(hours)} h`)
    .join(" · ");
}

function formatMindPlanTypeBreakdownHTML() {
  const totals = getMindPlanPlannedHoursByType();
  const entries = Object.entries(totals)
    .filter(([, hours]) => Number(hours) > 0)
    .sort((a, b) => Number(b[1]) - Number(a[1]));
  if (!entries.length) {
    return '<div class="mind-plan-type-item is-empty">noch nichts geplant</div>';
  }
  return entries.map(([type, hours]) => `
    <div class="mind-plan-type-item type-${type}">
      <span>${escapeHTML(mindPlanTypes[type] || type)}</span>
      <strong>${roundOne(hours)} h</strong>
    </div>
  `).join("");
}

function getNextMindPlanBlock() {
  if (!data.mindPlanner || !data.mindPlanner.weekStart || !Array.isArray(data.mindPlanner.blocks)) return null;

  const now = new Date();
  const today = localDateToISO(now);
  const weekStart = data.mindPlanner.weekStart || getCurrentSundayISO();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  const upcoming = (data.mindPlanner.blocks || [])
    .map(block => {
      const blockDate = addDaysISO(weekStart, Number(block.day));
      const startSlot = Number(block.startSlot || 0);
      const durationSlots = Number(block.durationSlots || 1);
      const startMinutes = startSlot * 30;
      const endMinutes = Math.min((startSlot + durationSlots) * 30, 24 * 60);
      let distance = Infinity;
      if (blockDate > today) {
        distance = (isoToLocalDate(blockDate) - isoToLocalDate(today)) / (1000 * 60 * 60 * 24) * 24 * 60 + startMinutes;
      } else if (blockDate === today && endMinutes > nowMinutes) {
        distance = Math.max(startMinutes - nowMinutes, 0);
      }
      return { block, blockDate, distance };
    })
    .filter(item => Number.isFinite(item.distance))
    .sort((a, b) => a.distance - b.distance);

  return upcoming[0] || null;
}

function formatMindPlanNextBlock() {
  const next = getNextMindPlanBlock();
  if (!next) return "keine geplant";
  const block = next.block;
  const day = Number(block.day);
  const label = caveDayLabels[day] || "Tag";
  const range = slotRangeText(Number(block.startSlot), Number(block.durationSlots || 1));
  const type = mindPlanTypes[block.type] || "Freier Block";
  const date = formatShortDate(next.blockDate);
  return `${label} ${date}, ${range} · ${block.title || "Zeitblock"} · ${type}`;
}

function updateMindPlanSummary() {
  const weekLabel = document.getElementById("mindPlanWeekStartLabel");
  const planned = document.getElementById("mindPlanPlannedHours");
  const breakdown = document.getElementById("mindPlanTypeBreakdown");
  const next = document.getElementById("mindPlanNextBlock");
  if (weekLabel) {
    weekLabel.textContent = data.mindPlanner.weekStart
      ? `${formatShortDate(data.mindPlanner.weekStart)} bis ${formatShortDate(addDaysISO(data.mindPlanner.weekStart, 7))}`
      : "noch nicht erzeugt";
  }
  if (planned) planned.textContent = `${roundOne(getMindPlanPlannedHours())} h`;

  if (breakdown) {
    breakdown.innerHTML = formatMindPlanTypeBreakdownHTML();
  }

  updateQuickNoteWeekBadge();

  if (next) {
    const nextData = getNextMindPlanBlock();
    if (!nextData) {
      next.className = "mind-plan-next-block is-empty";
      next.textContent = "keine geplant";
    } else {
      const block = nextData.block;
      const day = Number(block.day);
      const label = caveDayLabels[day] || "Tag";
      const range = slotRangeText(Number(block.startSlot), Number(block.durationSlots || 1));
      const typeKey = block.type || "free";
      const typeLabel = mindPlanTypes[typeKey] || "Freier Block";
      const date = formatShortDate(nextData.blockDate);
      next.className = `mind-plan-next-block type-${typeKey}`;
      next.innerHTML = `
        <span class="mind-plan-next-day">${label} ${date}</span>
        <strong>${escapeHTML(block.title || "Zeitblock")}</strong>
        <small>${escapeHTML(range)} · ${escapeHTML(typeLabel)}</small>
      `;
    }
  }
}



function updateCalendarScrollSpacers() {
  document.querySelectorAll(".calendar-scroll-top").forEach(top => {
    const targetId = top.dataset.scrollSync;
    const main = document.getElementById(targetId);
    const spacer = top.firstElementChild;
    if (!main || !spacer) return;
    spacer.style.width = `${main.scrollWidth}px`;
    top.scrollLeft = main.scrollLeft;
  });
}

function setupCalendarScrollSync() {
  document.querySelectorAll(".calendar-scroll-top").forEach(top => {
    const targetId = top.dataset.scrollSync;
    const main = document.getElementById(targetId);
    const spacer = top.firstElementChild;
    if (!main || !spacer) return;

    const updateSpacer = () => {
      spacer.style.width = `${main.scrollWidth}px`;
      top.scrollLeft = main.scrollLeft;
    };

    updateSpacer();

    let syncing = false;
    top.addEventListener("scroll", () => {
      if (syncing) return;
      syncing = true;
      main.scrollLeft = top.scrollLeft;
      syncing = false;
    });

    main.addEventListener("scroll", () => {
      if (syncing) return;
      syncing = true;
      top.scrollLeft = main.scrollLeft;
      syncing = false;
    });

    if (window.ResizeObserver) {
      const observer = new ResizeObserver(updateSpacer);
      observer.observe(main);
      if (main.firstElementChild) observer.observe(main.firstElementChild);
    }

    window.addEventListener("resize", updateSpacer);
    setTimeout(updateSpacer, 0);
  });
}


function setupScrollToBottomButtons() {
  document.querySelectorAll("section.view").forEach(section => {
    if (section.querySelector(".mobile-top-actions")) return;

    const actions = document.createElement("div");
    actions.className = "mobile-top-actions";

    const menuButton = document.createElement("button");
    menuButton.type = "button";
    menuButton.className = "mobile-section-menu-btn";
    menuButton.setAttribute("aria-label", "Menü öffnen");
    menuButton.innerHTML = "<span></span><span></span><span></span>";
    menuButton.addEventListener("click", openMobileMenu);

    const spacer = document.createElement("span");
    spacer.className = "mobile-actions-spacer";

    const button = document.createElement("button");
    button.type = "button";
    button.className = "scroll-to-bottom-btn";
    button.textContent = "↓ Nach unten";
    button.addEventListener("click", () => {
      const bottom = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
      window.scrollTo({ top: bottom, behavior: "smooth" });
    });

    actions.appendChild(menuButton);
    actions.appendChild(button);
    actions.appendChild(spacer);
    section.insertBefore(actions, section.firstElementChild);
  });
}

function setupBackToTopButtons() {
  document.querySelectorAll("section.view").forEach(section => {
    if (section.querySelector(".back-to-top-btn")) return;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "back-to-top-btn";
    button.textContent = "↑ Nach oben";
    button.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    section.appendChild(button);
  });
}


/* Paket 2 – Supabase Auth / Magic Link Vorbereitung */
// V90 FIX:
 // authState ist absichtlich var, weil saveData() beim Start bereits vor setupAuth()
 // laufen kann und scheduleCloudSave() dann defensiv auf authState zugreift.
var authState = {
  client: null,
  enabled: false,
  session: null,
  user: null
};

function getSupabaseConfig() {
  return window.DASHBOARD_SUPABASE_CONFIG || {
    enabled: false,
    url: "",
    anonKey: "",
    redirectTo: window.location.origin + window.location.pathname
  };
}

function isSupabaseConfigured() {
  const config = getSupabaseConfig();
  return Boolean(
    config.enabled &&
    config.url &&
    config.anonKey &&
    window.supabase &&
    window.supabase.createClient
  );
}

function setupSupabaseClient() {
  if (!isSupabaseConfigured()) {
    authState.enabled = false;
    authState.client = null;
    return null;
  }

  const config = getSupabaseConfig();
  authState.enabled = true;
  authState.client = window.supabase.createClient(config.url, config.anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  });

  return authState.client;
}

function updateAuthUI() {
  const panel = document.getElementById("authPanel");
  const title = document.getElementById("authStatusTitle");
  const text = document.getElementById("authStatusText");
  const loginControls = document.getElementById("authLoginControls");
  const userControls = document.getElementById("authUserControls");
  const emailEl = document.getElementById("authUserEmail");

  if (!panel || !title || !text) return;

  panel.classList.remove("hidden");

  if (!authState.enabled) {
    title.textContent = "Lokaler Modus";
    text.textContent = "Supabase ist noch nicht konfiguriert. Cloud-Sync und Backup bleiben lokal nutzbar.";
    loginControls?.classList.add("hidden");
    userControls?.classList.add("hidden");
    return;
  }

  if (authState.user) {
    title.textContent = "Eingeloggt";
    text.textContent = "Magic-Link-Login ist aktiv. Daten werden mit Supabase synchronisiert, localStorage bleibt als Cache/Fallback.";
    if (emailEl) emailEl.textContent = authState.user.email || "angemeldet";
    loginControls?.classList.add("hidden");
    userControls?.classList.remove("hidden");
    return;
  }

  title.textContent = "Privater Login";
  text.textContent = "Gib deine E-Mail ein. Supabase sendet dir einen Magic Link.";
  loginControls?.classList.remove("hidden");
  userControls?.classList.add("hidden");
}

async function refreshAuthSession() {
  if (!authState.client) return;

  const { data, error } = await authState.client.auth.getSession();
  if (error) {
    console.warn("Auth session error", error);
  }

  authState.session = data?.session || null;
  authState.user = authState.session?.user || null;
  updateAuthUI();
}

async function sendMagicLink() {
  if (!authState.client) {
    showToast("Supabase ist noch nicht konfiguriert");
    return;
  }

  const emailInput = document.getElementById("authEmail");
  const email = emailInput?.value?.trim();

  if (!email) {
    showToast("Bitte E-Mail eintragen");
    return;
  }

  const config = getSupabaseConfig();
  const { error } = await authState.client.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: config.redirectTo || (window.location.origin + window.location.pathname)
    }
  });

  if (error) {
    console.warn("Magic Link error", error);
    showToast("Magic Link konnte nicht gesendet werden");
    return;
  }

  showToast("Magic Link gesendet");
}

async function signOut() {
  if (!authState.client) return;
  const { error } = await authState.client.auth.signOut();
  if (error) {
    console.warn("Sign out error", error);
    showToast("Abmelden fehlgeschlagen");
    return;
  }
  authState.session = null;
  authState.user = null;
  cloudState.loaded = false;
  cloudState.pendingSave = false;
  setCloudStatus("Abgemeldet");
  updateAuthUI();
  showToast("Abgemeldet");
}


function setCloudStatus(text) {
  const el = document.getElementById("cloudSyncStatus");
  if (el) el.textContent = text;
}

function getDashboardPayloadForCloud() {
  const exported = clonePlain(extractImportedData(data));
  exported.settings = exported.settings || {};
  exported.settings.lastCloudPreparedAt = nowISO();
  exported.settings.saveVersion = SAVE_VERSION;
  return exported;
}



const CLOUD_SECTION_KEYS = [
  "activeTab",
  "noteContent",
  "noteContent2",
  "noteLineHeight",
  "noteLineHeight2",
  "quickEntry",
  "finance",
  "fitness",
  "health",
  "life",
  "emotion",
  "mind",
  "mindfulness",
  "gaming",
  "mindPlanner",
  "attractionWeights",
  "disciplineWeights",
  "goals"
];

function rememberSyncDecision(text) {
  if (!data.settings) data.settings = {};
  data.settings.lastSyncDecision = text;
  data.settings.lastSyncDecisionAt = nowISO();
  setCloudStatus(text);
}

function clonePlain(value) {
  try {
    return structuredClone(value);
  } catch {
    return JSON.parse(JSON.stringify(value));
  }
}

function getSectionForActiveTab() {
  const tab = data?.activeTab || document.querySelector(".tab.active")?.dataset?.tab || "";
  const map = {
    note: ["noteContent", "noteContent2"],
    dashboard: [],
    quick: ["quickEntry"],
    fitness: ["fitness", "health"],
    emotion: ["emotion"],
    mind: ["mind", "mindPlanner"],
    goals: ["goals"],
    backup: [],
    finance: ["finance"],
    protocol: ["quickEntry"],
    mindfulness: ["mindfulness"],
    gaming: ["gaming"]
  };
  return map[tab] || [tab].filter(Boolean);
}


function markUserInteraction() {
  if (!cloudState) return;
  cloudState.userInteractionStarted = true;
  if (authState?.user && cloudState.loaded) {
    cloudState.cloudReady = true;
    cloudState.suppressAutoCloudSave = false;
  }
}

function canAutoSaveToCloud() {
  return Boolean(
    authState?.client &&
    authState?.user &&
    cloudState.enabled &&
    cloudState.cloudReady &&
    cloudState.userInteractionStarted &&
    !cloudState.suppressAutoCloudSave
  );
}

function bindCloudSourceOfTruthUserEvents() {
  const mark = event => {
    const target = event.target;
    if (!target) return;
    if (target.closest?.("#authPanel")) return;
    markUserInteraction();
  };

  document.addEventListener("input", mark, true);
  document.addEventListener("change", mark, true);
  document.addEventListener("click", mark, true);
  document.addEventListener("keydown", mark, true);
}


function markDirtySections(sectionNames = null) {
  if (!cloudState.sessionDirtySections || typeof cloudState.sessionDirtySections.add !== "function") {
    cloudState.sessionDirtySections = new Set();
  }

  const sections = Array.isArray(sectionNames) ? sectionNames : getSectionForActiveTab();
  sections.forEach(section => {
    if (section) cloudState.sessionDirtySections.add(section);
  });
}

function getDirtySectionsForCloudSave() {
  if (!cloudState.sessionDirtySections || typeof cloudState.sessionDirtySections.values !== "function") return [];
  return [...cloudState.sessionDirtySections].filter(Boolean);
}

function clearDirtySectionsAfterCloudSave() {
  if (cloudState.sessionDirtySections && typeof cloudState.sessionDirtySections.clear === "function") {
    cloudState.sessionDirtySections.clear();
  }
}

function makeMergedCloudPayload(cloudData, localData, dirtySections) {
  const merged = mergeDeep(structuredClone(defaultData), extractImportedData(cloudData || {}));
  const local = extractImportedData(localData || {});
  const dirty = new Set(dirtySections || []);

  dirty.forEach(key => {
    if (Object.prototype.hasOwnProperty.call(local, key)) {
      merged[key] = clonePlain(local[key]);
    }
  });

  merged.settings = mergeDeep(merged.settings || {}, local.settings || {});
  merged.settings.lastSavedAt = nowISO();
  merged.settings.cloudLoadedAt = nowISO();
  merged.settings.lastSyncDecision = dirty.size
    ? `Safe Merge gespeichert · lokale Bereiche: ${[...dirty].join(", ")}`
    : "Safe Merge ohne lokale Bereiche";
  merged.settings.lastSyncDecisionAt = nowISO();
  merged.settings.saveVersion = SAVE_VERSION;

  return merged;
}

function isLocalCloudVirginAgainst(row) {
  return Boolean(row?.dashboard_json) && !data?.settings?.cloudLoadedAt && !cloudState.lastCloudSavedAt;
}


function getLocalSavedTime() {
  const value = data?.settings?.lastSavedAt;
  const time = value ? new Date(value).getTime() : 0;
  return Number.isFinite(time) ? time : 0;
}

function getCloudSavedTime(row) {
  const value = row?.updated_at;
  const time = value ? new Date(value).getTime() : 0;
  return Number.isFinite(time) ? time : 0;
}

function hasMeaningfulTimeDifference(a, b, toleranceMs = 3000) {
  return Math.abs(Number(a || 0) - Number(b || 0)) > toleranceMs;
}

async function applyCloudRowToApp(row, { silent = true } = {}) {
  if (!row?.dashboard_json) return false;

  const cloudData = mergeDeep(structuredClone(defaultData), extractImportedData(row.dashboard_json));
  data = cloudData;
  data.settings = data.settings || {};
  data.settings.cloudLoadedAt = row.updated_at || nowISO();
  data.settings.lastSavedAt = row.updated_at || data.settings.lastSavedAt || nowISO();
  data.settings.lastSyncDecision = "Cloud neuer · geladen";
  data.settings.lastSyncDecisionAt = nowISO();
  normalizeDataModel();
  saveData({ skipCloud: true });

  if (cloudState.uiReady) {
    refreshAllAfterDataLoad();
  }

  cloudState.loaded = true;
  cloudState.lastCloudSavedAt = row.updated_at || null;
  cloudState.pendingSave = false;
  cloudState.lastLocalChangeAt = null;
  cloudState.cloudReady = true;
  cloudState.suppressAutoCloudSave = false;
  clearDirtySectionsAfterCloudSave();
  setCloudStatus(`Cloud geladen · ${formatDateTimeDE(row.updated_at)}`);
  if (!silent) showToast("Cloud-Speicherstand geladen");
  return true;
}

async function syncCloudByTimestamp({ silent = true, reason = "auto" } = {}) {
  if (!authState?.client || !authState?.user || !cloudState.enabled) return false;
  if (cloudState.syncInProgress || cloudState.saving || cloudState.loading) return false;

  cloudState.syncInProgress = true;
  cloudState.lastCloudCheckAt = nowISO();

  try {
    const row = await fetchCloudDashboardState();

    if (!row?.dashboard_json) {
      if (canAutoSaveToCloud() && (cloudState.pendingSave || cloudState.lastLocalChangeAt)) {
        setCloudStatus("Kein Cloud-Stand · Nutzeränderung wird gespeichert");
        return await saveCloudDataNow({ silent: true, force: true });
      }
      cloudState.cloudReady = true;
      cloudState.suppressAutoCloudSave = false;
      setCloudStatus("Noch kein Cloud-Stand");
      return false;
    }

    cloudState.loaded = true;

    if (cloudState.pendingSave || cloudState.lastLocalChangeAt) {
      if (canAutoSaveToCloud()) {
        setCloudStatus("Nutzeränderung offen · speichere Cloud…");
        return await saveCloudDataNow({ silent: true, force: true });
      }
      setCloudStatus("Lokale Altänderung ignoriert · Cloud wird geladen");
      return await applyCloudRowToApp(row, { silent: true });
    }

    const localTime = getLocalSavedTime();
    const cloudTime = getCloudSavedTime(row);

    if (cloudTime && (!localTime || hasMeaningfulTimeDifference(localTime, cloudTime, 1000))) {
      setCloudStatus("Cloud ist Quelle · neuer Stand wird geladen…");
      return await applyCloudRowToApp(row, { silent });
    }

    cloudState.cloudReady = true;
    cloudState.suppressAutoCloudSave = false;
    cloudState.lastCloudSavedAt = row.updated_at || cloudState.lastCloudSavedAt;
    setCloudStatus(`Cloud aktuell · ${formatDateTimeDE(row.updated_at)}`);
    return false;
  } catch (error) {
    console.warn("Cloud-Zeitstempel-Sync fehlgeschlagen", error);
    setCloudStatus("Cloud-Sync-Prüfung fehlgeschlagen");
    return false;
  } finally {
    cloudState.syncInProgress = false;
  }
}

function startCloudPullSync() {
  if (cloudState.cloudCheckTimer) return;

  cloudState.cloudCheckTimer = setInterval(() => {
    if (document.visibilityState !== "visible") return;
    if (!authState?.user) return;
    syncCloudByTimestamp({ silent: true, reason: "interval" });
  }, 5000);
}


async function fetchCloudDashboardState() {
  if (!authState.client || !authState.user) return null;

  const { data: row, error } = await authState.client
    .from("modular_life_dashboard_states")
    .select("dashboard_json, updated_at")
    .eq("user_id", authState.user.id)
    .maybeSingle();

  if (error) {
    console.warn("Cloud load error", error);
    throw error;
  }

  return row || null;
}

async function loadCloudDataIntoApp({ preferCloud = true, silent = false } = {}) {
  if (!authState.client || !authState.user) return false;

  cloudState.loading = true;
  cloudState.suppressAutoCloudSave = true;
  setCloudStatus("Cloud wird geladen…");

  try {
    const row = await fetchCloudDashboardState();

    if (!row?.dashboard_json) {
      cloudState.loaded = true;
      cloudState.cloudReady = true;
      cloudState.suppressAutoCloudSave = false;
      setCloudStatus("Noch kein Cloud-Stand · lokale Änderungen dürfen ab jetzt speichern");
      if (!silent) showToast("Noch kein Cloud-Speicherstand vorhanden");
      return false;
    }

    if (preferCloud) {
      const applied = await applyCloudRowToApp(row, { silent });
      cloudState.loaded = true;
      cloudState.cloudReady = true;
      cloudState.suppressAutoCloudSave = false;
      return applied;
    }

    return false;
  } catch (error) {
    cloudState.cloudReady = false;
    cloudState.suppressAutoCloudSave = true;
    setCloudStatus("Cloud-Laden fehlgeschlagen · Autosave gesperrt");
    if (!silent) showToast("Cloud-Laden fehlgeschlagen");
    return false;
  } finally {
    cloudState.loading = false;
  }
}

async function saveCloudDataNow({ silent = false, force = false, manualForce = false } = {}) {
  if (!authState.client || !authState.user) return false;
  if (!manualForce && !canAutoSaveToCloud()) {
    setCloudStatus("Cloud ist Quelle · automatisches Speichern blockiert");
    return false;
  }
  if (cloudState.loading && !force) return false;

  if (cloudState.saveTimer) {
    clearTimeout(cloudState.saveTimer);
    cloudState.saveTimer = null;
  }

  cloudState.saving = true;
  cloudState.lastSaveAttemptAt = nowISO();
  setCloudStatus("Cloud wird geprüft…");

  try {
    const row = await fetchCloudDashboardState();
    const dirtySections = manualForce ? CLOUD_SECTION_KEYS : getDirtySectionsForCloudSave();

    let payload;
    let decisionText = "";

    if (row?.dashboard_json) {
      const cloudData = mergeDeep(structuredClone(defaultData), extractImportedData(row.dashboard_json));
      const cloudTime = getCloudSavedTime(row);
      const localTime = getLocalSavedTime();

      if (!dirtySections.length && isLocalCloudVirginAgainst(row)) {
        rememberSyncDecision("Alter lokaler Stand erkannt · Cloud bleibt erhalten");
        await applyCloudRowToApp(row, { silent: true });
        return false;
      }

      if (!dirtySections.length && cloudTime > localTime + 3000) {
        rememberSyncDecision("Cloud neuer · Laden statt Speichern");
        await applyCloudRowToApp(row, { silent: true });
        return false;
      }

      payload = makeMergedCloudPayload(cloudData, data, dirtySections.length ? dirtySections : CLOUD_SECTION_KEYS);
      decisionText = dirtySections.length
        ? `Safe Merge gespeichert · ${dirtySections.length} lokale Bereiche`
        : "Safe Merge gespeichert · vollständiger Stand";
    } else {
      payload = getDashboardPayloadForCloud();
      payload.settings = payload.settings || {};
      payload.settings.lastSavedAt = nowISO();
      payload.settings.cloudLoadedAt = nowISO();
      payload.settings.lastSyncDecision = "Erster Cloud-Stand gespeichert";
      payload.settings.lastSyncDecisionAt = nowISO();
      decisionText = "Erster Cloud-Stand gespeichert";
    }

    const updatedAt = nowISO();
    payload.settings = payload.settings || {};
    payload.settings.lastSavedAt = updatedAt;
    payload.settings.cloudLoadedAt = updatedAt;
    payload.settings.lastCloudPreparedAt = updatedAt;
    payload.settings.saveVersion = SAVE_VERSION;
    payload.settings.lastSyncDecision = decisionText;
    payload.settings.lastSyncDecisionAt = updatedAt;

    const { error } = await authState.client
      .from("modular_life_dashboard_states")
      .upsert({
        user_id: authState.user.id,
        dashboard_json: payload,
        updated_at: updatedAt
      }, { onConflict: "user_id" });

    if (error) {
      console.warn("Cloud save error", error);
      throw error;
    }

    data = mergeDeep(structuredClone(defaultData), payload);
    normalizeDataModel();
    saveData({ skipCloud: true });
    if (cloudState.uiReady) refreshAllAfterDataLoad();

    cloudState.lastCloudSavedAt = updatedAt;
    cloudState.lastLocalChangeAt = null;
    cloudState.pendingSave = false;
    cloudState.cloudReady = true;
    cloudState.suppressAutoCloudSave = false;
    clearDirtySectionsAfterCloudSave();
    setCloudStatus(`${decisionText} · ${formatDateTimeDE(updatedAt)}`);
    if (!silent) showToast("Cloud gespeichert");
    return true;
  } catch (error) {
    cloudState.pendingSave = true;
    setCloudStatus("Cloud-Speichern fehlgeschlagen");
    if (!silent) showToast("Cloud-Speichern fehlgeschlagen");
    return false;
  } finally {
    cloudState.saving = false;
  }
}

function scheduleCloudSave() {
  try {
    if (!canAutoSaveToCloud()) {
      setCloudStatus("Cloud ist Quelle · Autosave wartet auf Cloud-Ladung/Nutzeraktion");
      return;
    }
    if (cloudState.loading) return;

    cloudState.pendingSave = true;
    setCloudStatus("Nutzeränderung · Cloud-Speichern geplant");

    if (cloudState.saveTimer) {
      clearTimeout(cloudState.saveTimer);
    }

    cloudState.saveTimer = setTimeout(() => {
      saveCloudDataNow({ silent: true });
    }, 500);
  } catch (error) {
    console.warn("Cloud-Sync beim Start übersprungen", error);
  }
}


function refreshDynamicSlidersAfterDataLoad() {
  // Nach Cloud-/Backup-Laden müssen dynamisch erzeugte Slider neu aus `data`
  // gerendert werden. Wichtig: keine kompletten setup* Funktionen für Bereiche
  // mit vielen Buttons erneut aufrufen, damit keine doppelten Eventlistener entstehen.
  try {
    createSliderGroup({
      object: data.health,
      containerId: "healthMetrics",
      descriptions: healthDescriptions,
      onUpdate: () => {
        updateHealthScore();
        updateAttraction();
      }
    });
  } catch (error) {
    console.warn("Health-Slider konnten nicht aktualisiert werden", error);
  }

  try {
    createSliderGroup({
      object: data.life,
      containerId: "lifeMetrics",
      descriptions: lifeDescriptions,
      onUpdate: () => {
        updateLifeScore();
        updateAttraction();
      }
    });
  } catch (error) {
    console.warn("Life-Slider konnten nicht aktualisiert werden", error);
  }

  try {
    createSliderGroup({
      object: data.emotion.base,
      containerId: "emotionMetrics",
      descriptions: emotionDescriptions,
      onUpdate: () => {
        updateEmotionScore();
        updateAttraction();
      }
    });
  } catch (error) {
    console.warn("Emotion-Slider konnten nicht aktualisiert werden", error);
  }

  try {
    createSliderGroup({
      object: data.mind,
      containerId: "mindMetrics",
      descriptions: mindDescriptions,
      allowedKeys: ["weltbild", "perspektivenfaehigkeit", "intuition", "loslassen", "klarheit"],
      onUpdate: () => {
        updateMindScore();
        updateAttraction();
      }
    });
  } catch (error) {
    console.warn("Mind-Slider konnten nicht aktualisiert werden", error);
  }
}

function refreshKeyInputsAfterDataLoad() {
  // Einzelne Eingabefelder, die nicht Teil der Slidergruppen sind.
  const setValue = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.value = value ?? "";
  };

  try {
    setValue("socialTarget28", data.emotion?.socialTarget28);
    setValue("socialBudgetMonthly", data.emotion?.socialBudgetMonthly);
    setValue("meditationTarget28", data.mind?.meditationTarget28);
    setValue("mindOutingTarget28", data.mind?.outingTarget28);
  } catch (error) {
    console.warn("Einzelfelder konnten nicht aktualisiert werden", error);
  }
}


function refreshAllAfterDataLoad() {
  normalizeDataModel();

  setupNoteValuesAfterCloudLoad();
  refreshDynamicSlidersAfterDataLoad();
  refreshKeyInputsAfterDataLoad();

  try { updateGoalSummary(); } catch {}
  try { renderGoals(); } catch {}
  try { renderQuickGoals(); } catch {}
  try { calculateFinance(); } catch {}
  try { calculateFitness(); } catch {}
  try { updateBreathScore(); } catch {}
  try { updateColdScore(); } catch {}
  try { updateBodyCareScore(); } catch {}
  try { updateOutingScore(); } catch {}
  try { updateEmotionScore(); } catch {}
  try { updateMindScore(); } catch {}
  try { updateOrderStatus?.(); } catch {}
  try { updateDiscipline(); } catch {}
  try { updateAttraction(); } catch {}
  try { updateFinanceCheckStatus(); } catch {}
  try { updateQuickWorkPreview?.(); } catch {}
  try { updateQuickDailyStatus(); } catch {}
  try { updateProtocolTable(); } catch {}
  try { renderMindPlanCalendar?.(); } catch {}
  try { renderCaveCalendar?.(); } catch {}
  try { updateActiveCaveDashboardCard?.(); } catch {}
  try { updateBuildDiagnostics?.(); } catch {}
}

function setupNoteValuesAfterCloudLoad() {
  const note = document.getElementById("editor");
  if (note && data.note?.html !== undefined) note.innerHTML = data.note.html || "";

  const note2 = document.getElementById("editor2");
  if (note2 && data.note2?.html !== undefined) note2.innerHTML = data.note2.html || "";

  const quickNote = document.getElementById("quickWeeklyNote");
  if (quickNote && data.quickEntry?.weeklyNoteHtml !== undefined) {
    const selection = window.getSelection?.();
    const selectionInsideQuickNote = selection && selection.rangeCount > 0 && quickNote.contains(selection.anchorNode);
    const activeInsideQuickNote = quickNote.contains(document.activeElement);
    if (!activeInsideQuickNote && !selectionInsideQuickNote) {
      quickNote.innerHTML = data.quickEntry.weeklyNoteHtml || "";
      if (data.quickEntry.weeklyNoteHeight) quickNote.style.minHeight = data.quickEntry.weeklyNoteHeight;
    }
  }
}

function updateAllInputsFromData() {
  document.querySelectorAll("input, textarea, select").forEach(input => {
    const id = input.id;
    if (!id) return;

    // Die App initialisiert die meisten Felder bereits in den Setup-Funktionen.
    // Diese Funktion ist bewusst defensiv und vermeidet aggressive Überschreibungen.
    if (id === "authEmail") return;
  });

  setupFinance();
  setupFitness();
  refreshDynamicSlidersAfterDataLoad();
  refreshKeyInputsAfterDataLoad();
  setupGaming();
  setupMindPlanner();
}


async function flushCloudSaveNow({ reason = "manual", silent = true } = {}) {
  try {
    if (!authState?.client || !authState?.user || !cloudState.enabled) return false;
    if (!cloudState.pendingSave && !cloudState.lastLocalChangeAt) return false;
    if (cloudState.flushInProgress) return false;

    cloudState.flushInProgress = true;
    const ok = await saveCloudDataNow({ silent, force: reason === "pagehide" || reason === "visibilitychange" || reason === "beforeunload" });
    return ok;
  } catch (error) {
    console.warn("Sofort-Cloud-Speichern fehlgeschlagen", error);
    return false;
  } finally {
    cloudState.flushInProgress = false;
  }
}

function setupMobileCloudFlush() {
  const flush = reason => {
    flushCloudSaveNow({ reason, silent: true });
  };

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      flush("visibilitychange");
    } else if (document.visibilityState === "visible") {
      if (authState?.user && cloudState.pendingSave) {
        setCloudStatus("Lokal geändert · Cloud-Speichern geplant");
        scheduleCloudSave();
      } else {
        syncCloudByTimestamp({ silent: true, reason: "visible" });
      }
    }
  });

  window.addEventListener("pagehide", () => flush("pagehide"));
  window.addEventListener("beforeunload", () => flush("beforeunload"));
  window.addEventListener("online", () => {
    if (authState?.user && cloudState.pendingSave) {
      setCloudStatus("Wieder online · Cloud-Speichern geplant");
      scheduleCloudSave();
    } else {
      syncCloudByTimestamp({ silent: true, reason: "online" });
    }
  });

  window.addEventListener("focus", () => {
    syncCloudByTimestamp({ silent: true, reason: "focus" });
  });
}


async function handleManualCloudLoad() {
  await loadCloudDataIntoApp({ preferCloud: true, silent: false });
}

async function handleManualCloudSave() {
  markUserInteraction();
  cloudState.cloudReady = true;
  cloudState.suppressAutoCloudSave = false;
  markDirtySections(CLOUD_SECTION_KEYS);
  await saveCloudDataNow({ silent: false, force: true, manualForce: true });
}

async function setupAuth() {
  setupSupabaseClient();

  document.getElementById("sendMagicLink")?.addEventListener("click", sendMagicLink);
  document.getElementById("authEmail")?.addEventListener("keydown", event => {
    if (event.key === "Enter") sendMagicLink();
  });
  document.getElementById("signOutButton")?.addEventListener("click", signOut);
  document.getElementById("manualCloudLoad")?.addEventListener("click", handleManualCloudLoad);
  document.getElementById("manualCloudSave")?.addEventListener("click", handleManualCloudSave);

  if (!authState.client) {
    cloudState.enabled = false;
    updateAuthUI();
    return;
  }

  cloudState.enabled = true;

  authState.client.auth.onAuthStateChange(async (_event, session) => {
    const oldUserId = authState.user?.id || null;
    authState.session = session || null;
    authState.user = session?.user || null;
    updateAuthUI();

    if (authState.user && authState.user.id !== oldUserId) {
      startCloudPullSync();
      if (cloudState.uiReady) {
        await loadCloudDataIntoApp({ preferCloud: true, silent: true });
      } else {
        cloudState.autoLoadAfterInit = true;
      }
    }
  });

  await refreshAuthSession();
  if (authState.user) {
    cloudState.autoLoadAfterInit = true;
    startCloudPullSync();
    setCloudStatus("Cloud bereit");
  }
}


async function loadCloudAfterUiReady() {
  cloudState.uiReady = true;

  if (!authState?.user || !cloudState.autoLoadAfterInit) return;

  cloudState.autoLoadAfterInit = false;
  startCloudPullSync();
  await loadCloudDataIntoApp({ preferCloud: true, silent: true });
}


function openMobileMenu() {
  if (document.activeElement && typeof document.activeElement.blur === "function") {
    document.activeElement.blur();
  }
  syncMobileMenuActiveTab(data.activeTab);
  document.body.classList.add("mobile-menu-open");
  const overlay = document.getElementById("mobileNavOverlay");
  if (overlay) overlay.setAttribute("aria-hidden", "false");
}

function closeMobileMenu() {
  document.body.classList.remove("mobile-menu-open");
  const overlay = document.getElementById("mobileNavOverlay");
  if (overlay) overlay.setAttribute("aria-hidden", "true");
}

function setupMobileMenu() {
  const desktopNav = document.getElementById("mainNav");
  const items = document.getElementById("mobileNavItems");
  const close = document.getElementById("mobileMenuClose");

  if (!desktopNav || !items) return;

  items.innerHTML = "";

  desktopNav.querySelectorAll(".tab").forEach(originalButton => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "mobile-nav-item";
    ["mindfulness-tab", "gaming-tab", "protocol-tab"].forEach(className => {
      if (originalButton.classList.contains(className)) {
        button.classList.add(className);
      }
    });
    button.dataset.tab = originalButton.dataset.tab || "";
    button.textContent = originalButton.textContent.trim() || originalButton.getAttribute("aria-label") || "Bereich";

    if (originalButton.classList.contains("active")) {
      button.classList.add("active");
    }

    button.addEventListener("click", () => {
      originalButton.click();
      closeMobileMenu();
    });

    items.appendChild(button);
  });

  close?.addEventListener("click", closeMobileMenu);

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeMobileMenu();
  });

  document.getElementById("mobileNavOverlay")?.addEventListener("click", event => {
    if (event.target.id === "mobileNavOverlay") closeMobileMenu();
  });

  syncMobileMenuActiveTab(data.activeTab);
}

function syncMobileMenuActiveTab(tabName) {
  document.querySelectorAll(".mobile-nav-item").forEach(button => {
    button.classList.toggle("active", button.dataset.tab === tabName);
  });
}


async function init() {
  try {
    await setupAuth();
  } catch (error) {
    console.warn("Auth/Cloud Start fehlgeschlagen; lokaler Modus bleibt aktiv.", error);
    try { updateAuthUI(); } catch {}
  }
  bindCloudSourceOfTruthUserEvents();
  setupMobileCloudFlush();
  setupCalendarScrollSync();
  setupBackToTopButtons();
  setupScrollToBottomButtons();
  setupTabs();
  setupDemoMode();
  setupMobileMenu();
  setupNote();
  setupFinance();
  setupFitness();
  setupHealth();
  setupLife();
  setupEmotion();
  setupOrderDelegatedClicks();
  setupMind();
  setupGoals();
  setupAttractionWeights();
  setupDisciplineWeights();
  setupQuickEntry();
  setupQuickStatusJumps();
  setupQuickWeeklyNote();
  setupProtocol();
  setupBackup();
  setupMindfulness();
  setupDurationAddButtons();
  setupGaming();
  setupMindPlanner();

  updateActiveCaveDashboardCard();
  setInterval(updateActiveCaveDashboardCard, 60000);

  updateGoalSummary();
  updateDiscipline();
  updateMindScore();
  updateAttraction();
  updateFinanceCheckStatus();
  updateQuickDailyStatus();
  updateProtocolTable();
  setInterval(updateQuickDailyStatus, 60000);
  setInterval(renderMindPlanCalendar, 60000);

  try {
    await loadCloudAfterUiReady();
  } catch (error) {
    console.warn("Cloud-Laden nach UI-Start fehlgeschlagen", error);
    setCloudStatus("Cloud-Laden fehlgeschlagen");
  }
}


function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  if (location.protocol !== "https:" && location.hostname !== "localhost" && location.hostname !== "127.0.0.1") return;

  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/service-worker.js")
      .then(() => console.info("Service Worker aktiv"))
      .catch(error => console.warn("Service Worker konnte nicht registriert werden", error));
  });
}


registerServiceWorker();
init();