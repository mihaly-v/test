let colorDebounceTimer = null; // カラーピッカーの間引き用タイマー

const CYBER_PANEL_CONFIG = {
    fontSize: 30,            // 点灯式パネルの文字サイズ
    font: '700 20px  "Share Tech Mono", monospace',
    // font: '700 20px "Orbitron", sans-serif',
    // 縦の間隔（上下の詰まり・くっつきを解消する行間）
    rowHeight: 40,           // 以前の48pxよりさらに少し広げて余裕を持たせました

    // 横の間隔（各項目が右隣と被らないための列の幅）
    styleColumnWidth: 140,   // PLAY_STYLE（3列）の1列あたりの横幅
    raceColumnWidth: 100,    // FAV_RACE（4列）の1列あたりの横幅
    phaseColumnWidth: 110,   // MSQ_PHASE（2列）の1列あたりの横幅
    
    // ラベルからパネル開始位置までの左マージン
    offsetX: 180             // PLAY_STYLE: 等の文字から右にどれだけ離すか
};

// =================================================================
// 1. マスターデータ
// =================================================================
const jobMasterCategorized = {
    TANK: [
        { id: "ナイト", jp: "ナイト", en: "PALADIN", code: "PLD" },
        { id: "戦士", jp: "戦士", en: "WARRIOR", code: "WAR" },
        { id: "暗黒騎士", jp: "暗黒騎士", en: "DARK KNIGHT", code: "DRK" },
        { id: "ガンブレイカー", jp: "ガンブレイカー", en: "GUNBREAKER", code: "GNB" }
    ],
    HEALER: [
        { id: "白魔道士", jp: "白魔道士", en: "WHITE MAGE", code: "WHM" },
        { id: "学者", jp: "学者", en: "SCHOLAR", code: "SCH" },
        { id: "占星術師", jp: "占星術師", en: "ASTROLOGIAN", code: "AST" },
        { id: "賢者", jp: "賢者", en: "SAGE", code: "SGE" }
    ],
    MELEE_DPS: [
        { id: "モンク", jp: "モンク", en: "MONK", code: "MNK" },
        { id: "竜騎士", jp: "竜騎士", en: "DRAGOON", code: "DRG" },
        { id: "忍者", jp: "忍者", en: "NINJA", code: "NIN" },
        { id: "侍", jp: "侍", en: "SAMURAI", code: "SAM" },
        { id: "リーパー", jp: "リーパー", en: "REAPER", code: "RPR" },
        { id: "ヴァイパー", jp: "ヴァイパー", en: "VIPER", code: "VPR" }
    ],
    PHYSICAL_RANGED_DPS: [
        { id: "吟遊詩人", jp: "吟遊詩人", en: "BARD", code: "BRD" },
        { id: "機工士", jp: "機工士", en: "MACHINIST", code: "MCH" },
        { id: "踊り子", jp: "踊り子", en: "DANCER", code: "DNC" }
    ],
    MAGIC_CASTER_DPS: [
        { id: "黒魔道士", jp: "黒魔道士", en: "BLACK MAGE", code: "BLM" },
        { id: "召喚士", jp: "召喚士", en: "SUMMONER", code: "SMN" },
        { id: "赤魔道士", jp: "赤魔道士", en: "RED MAGE", code: "RDM" },
        { id: "ピクトマンサー", jp: "ピクトマンサー", en: "PICTOMANCER", code: "PCT" }
    ]
};

const styleMaster = [
    { id: "ストーリー", jp: "ストーリー", en: "STORY" },
    { id: "雑談/RP", jp: "雑談/RP", en: "CHAT/RP" },
    { id: "ミラプリ", jp: "ミラプリ", en: "GLAMOUR" },
    { id: "ハウジング", jp: "ハウジング", en: "HOUSING" },
    { id: "SS撮影", jp: "SS撮影", en: "SCREENSHOT" },
    { id: "PvP", jp: "PvP", en: "PVP" },
    { id: "クラフター", jp: "クラフター", en: "CRAFTER" },
    { id: "ギャザラー", jp: "ギャザラー", en: "GATHER" },
    { id: "レイド/戦闘", jp: "レイド/戦闘", en: "RAID" }
];

const raceMaster = [
    { id: "Hyur", jp: "ヒューラン", en: "HYUR" },
    { id: "Elezen", jp: "エレゼン", en: "ELEZEN" },
    { id: "Lalafell", jp: "ララフェル", en: "LALAFELL" },
    { id: "Miqo'te", jp: "ミコッテ", en: "MIQO'TE" },
    { id: "Roegadyn", jp: "ルガディン", en: "ROEGADYN" },
    { id: "Au Ra", jp: "アウラ", en: "AU RA" },
    { id: "Hrothgar", jp: "ロスガル", en: "HROTHGAR" },
    { id: "Viera", jp: "ヴィエラ", en: "VIERA" }
];

const progressMaster = [
    { val: 0, jp: "新生(2.X)", en: "ARR 2.x" },
    { val: 1, jp: "蒼天(3.X)", en: "HW 3.x" },
    { val: 2, jp: "紅蓮(4.X)", en: "SB 4.x" },
    { val: 3, jp: "漆黒(5.X)", en: "ShB 5.x" },
    { val: 4, jp: "暁月(6.X)", en: "EW 6.x" },
    { val: 5, jp: "黄金(7.X)", en: "DT 7.x" }
];

const neonPalettes = [
    { label: "CYAN",   c1: "#00f0ff", c2: "#ff007f" },
    { label: "SOL_9",  c1: "#ff00a0", c2: "#00f0ff" },
    { label: "TOKYO",  c1: "#9900ff", c2: "#00ff66" },
    { label: "MATRIX", c1: "#33ff33", c2: "#ff9900" },
    { label: "GOLD",   c1: "#ffaa00", c2: "#00e5ff" },
    { label: "VIOLET", c1: "#d500f9", c2: "#ffff00" },
    { label: "CRIMSN", c1: "#ff0055", c2: "#00ffff" },
    { label: "LIGHT",  c1: "#707880", c2: "#131619" }
];

const worldData = {
    Secret: ["Secret"],

    // === 日本 (Japan Data Center) ===
    Elemental: ["Secret", "Aegis", "Atomos", "Carbuncle", "Garuda", "Gungnir", "Kujata", "Tonberry", "Typhon"],
    Gaia: ["Secret", "Alexander", "Bahamut", "Durandal", "Fenrir", "Ifrit", "Ridill", "Tiamat", "Ultima"],
    Mana: ["Secret", "Anima", "Asura", "Chocobo", "Hades", "Ixion", "Masamune", "Pandaemonium", "Titan"],
    Meteor: ["Secret", "Belias", "Mandragora", "Ramuh", "Shinryu", "Unicorn", "Valefor", "Yojimbo", "Zeromus"],

    // === 北米 (North America Data Center) ===
    Aether: ["Secret", "Adamantoise", "Cactuar", "Faerie", "Gilgamesh", "Jenova", "Midgardsormr", "Sargatanas", "Siren"],
    Crystal: ["Secret", "Balmung", "Brynhildr", "Coeurl", "Diabolos", "Goblin", "Malboro", "Mateus", "Zalera"],
    Dynamis: ["Secret", "Cuchulainn", "Golem", "Halicarnassus", "Kraken", "Maduin", "Marilith", "Rafflesia", "Seraph"],
    Primal: ["Secret", "Behemoth", "Excalibur", "Exodus", "Famfrit", "Hyperion", "Lamia", "Leviathan", "Ultros"],

    // === 欧州 (European Data Center) ===
    Chaos: ["Secret", "Cerberus", "Louisoix", "Moogle", "Omega", "Phantom", "Ragnarok", "Sagittarius", "Spriggan"],
    Light: ["Secret", "Alpha", "Phoenix", "Raiden", "Shiva", "Twintania", "Zodiark", "Lich", "Odin"],

    // === オセアニア (Oceanian Data Center) ===
    Materia: ["Secret", "Bismarck", "Ravana", "Sephirot", "Sophia", "Zurvan"],

    // === 韓国 (Korean Data Center) ===
    Korea: ["Secret", "Carbuncle", "Chocobo", "Moogle", "Tonberry", "Fenrir"]
};

let currentLang = "JP";

// =================================================================
// 2. DOM要素取得
// =================================================================
const dcSelect = document.getElementById('dcSelect');
const worldSelect = document.getElementById('worldSelect');
const mainJobSelect = document.getElementById('mainJob');
const canvas = document.getElementById('ui-layer');
const canvasLoad = document.getElementById('cardLoadCanvas');
const ctx = canvas.getContext('2d');
const resultImage = document.getElementById('resultImage');
const ctxLoad = canvasLoad.getContext('2d');
const resultLoadImage = document.getElementById('resultLoadImage');
const canvasBack = document.getElementById('cardCanvasBack');
const ctxBack = canvasBack.getContext('2d');
const resultImageBack = document.getElementById('resultImageBack');
const themeColorPicker = document.getElementById('themeColorPicker');
const themeColorPicker2 = document.getElementById('themeColorPicker2');
const shadowColorPicker = document.getElementById('shadowColorPicker');
const backColorPicker = document.getElementById('backColorPicker');
const alphaSlider = document.getElementById('alphaSlider');
const textFontName = document.getElementById('textFontName');
const textFontComment = document.getElementById('textFontComment');
const backCommentInput = document.getElementById('backComment');
const commentYSlider = document.getElementById('commentYSlider');
const xTwitterIDInput = document.getElementById('xTwitterID');
const hiddenQrContainer = document.getElementById('hiddenQrContainer');
const generatedID = `SOL9-ID-00${Math.floor(10000000 + Math.random() * 90000000)}//LVM_ARC`;

let loadedImage = null;
let imgX = 0;
let imgY = 0;
let imgScale = 1.0;
let isDragging = false;
let startMouseX = 0;
let startMouseY = 0;
let cachedQrSourceCanvas = null;
let BASE_WIDTH = 1000;
let BASE_HEIGHT = 1545;
const SCALE_FACTOR = 1.0;
let CANVAS_WIDTH = BASE_WIDTH * SCALE_FACTOR;
let CANVAS_HEIGHT = BASE_HEIGHT * SCALE_FACTOR;

const backgroundLayer = document.getElementById('background-layer');
const uiLayer = document.getElementById('ui-layer');
const bgCtx = backgroundLayer.getContext('2d');
const uiCtx = uiLayer.getContext('2d');

// =================================================================
// 3. マスク画像読み込み＆輝度→アルファ変換
// =================================================================
let maskCanvas = null;

function loadMaskImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            maskCanvas = document.createElement('canvas');
            maskCanvas.width = img.width;
            maskCanvas.height = img.height;
            const mCtx = maskCanvas.getContext('2d');
            mCtx.drawImage(img, 0, 0);

            const imgData = mCtx.getImageData(0, 0, maskCanvas.width, maskCanvas.height);
            const data = imgData.data;
            for (let i = 0; i < data.length; i += 4) {
                const luminance = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
                data[i + 3] = luminance; // 輝度をアルファチャンネルに反映
            }
            mCtx.putImageData(imgData, 0, 0);

            resolve(maskCanvas);

            // マスク読み込み完了を通知
            window.dispatchEvent(new CustomEvent('maskImageLoaded'));
        };
        img.onerror = (err) => reject(err);
        img.src = src; // 引数の src を指定
    });
}

// ページ読み込み時にマスクを事前ロードしておく
// （読み込みが完了したタイミングで 'maskImageLoaded' イベントが発火するので、
//   drawUserImageLayer 側でこれを購読して再描画すれば、
//   マスクが後から読み込まれても正しく反映される）
loadMaskImage('images/mask-A.jpg').catch((err) => {
    console.error('mask.jpg の読み込みに失敗しました:', err);
});

const iconCompositeCanvas = document.createElement('canvas');
iconCompositeCanvas.width = CANVAS_WIDTH;
iconCompositeCanvas.height = CANVAS_HEIGHT;
const iconCompositeCtx = iconCompositeCanvas.getContext('2d');

const fileNameDisplay = document.getElementById('file-upload-text');
const uploadImageInput = document.getElementById('uploadImage');

const previewSize = document.querySelector('.preview-fit');
const saveFrontBtn = document.querySelector('.save-btn');
const saveBackBtn = document.querySelector('.saveBack-btn');

const previewFrontPanel = document.querySelector('.previewFrontPanel');
const previewBackPanel = document.querySelector('.previewBackPanel');

const previewPanel = document.querySelector('.preview-panel');

function getAutomaticBackTextColor(hexColor) {
    let r = parseInt(hexColor.slice(1, 3), 16);
    let g = parseInt(hexColor.slice(3, 5), 16);
    let b = parseInt(hexColor.slice(5, 7), 16);
    let hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));
    return (hsp > 127.5) ? '#131619' : '#ffffff';
}

function initPaletteUI() {
    const container = document.getElementById('paletteContainer');
    container.innerHTML = "";
    neonPalettes.forEach(p => {
        const btn = document.createElement('button');
        btn.type = "button";
        btn.className = "palette-btn";
        btn.title = p.label;

        const preview = document.createElement('div');
        preview.className = "palette-preview";
        const c1 = document.createElement('div');
        c1.className = "palette-color";
        c1.style.backgroundColor = p.c1;
        const c2 = document.createElement('div');
        c2.className = "palette-color";
        c2.style.backgroundColor = p.c2;
        preview.appendChild(c1);
        preview.appendChild(c2);

        const label = document.createElement('span');
        label.className = "palette-label";
        label.textContent = p.label;

        btn.appendChild(preview);
        btn.appendChild(label);
        btn.addEventListener('click', () => {
            themeColorPicker.value = p.c1;
            themeColorPicker2.value = p.c2;
            updateCard();
        });
        container.appendChild(btn);
    });
}


// =================================================================
// 4. UI多言語対応（ラベル定義・切り替え）
// =================================================================
const uiLabels = {
    JP: {
        charName: "// 表示する名前", charNameHolder: "ｱﾙﾌｧﾍﾞｯﾄがｵｽｽﾒです！",
        affiliation: "// サーバー", mainJob: "// メインジョブ",
        xTwitterID: "// X (Twitter) @ユーザーID", xTwitterIDHolder: "@無しでもOK！ (QRコードに変換されます)",
        orientation: "// カードの向き", optVert: "縦型", optHoriz: "横型", pattern: "// パターン",
        bgImage: "// 背景画像アップロード", playstyle: "// プレイスタイル (複数選択可)", favRace: "// 好きな種族 (複数選択可)",
        progress: "// メインストーリー進行度", comment: "// 裏面のコメント", commentHolder: "改行もできます！", footerUpdates: "// アップデート", footerTerms: "// 利用規約",
        mainColor: "// メインカラー", subColor: "// サブカラー", preset: "// テーマプリセット",
        shadow: "// 要素の影", shadowColor: "// 影の色", shadowAlpha: "// 透明度", on: "オン", off: "オフ",
        weekday: "// 平日", weekend: "// 休日",
        inst: "*表面プレビューで写真の位置を調整、拡大縮小できます。",
        mask: "// マスク", maskOff: "オフ", maskOn: "オン", maskPattern: "// マスクパターン", maskBackColor: "// マスク背景色", openMask: "// マスクオプション (クリックで開閉)",
        backTextColor: "// 裏面テキストカラー", commentY: "// コメント上下位置", tips: "マスクのデザインは、今後のアップデートで追加/変更する予定です。"
    },
    EN: {
        charName: "// Character Name", charNameHolder: "RECOMMENDED: ALPHABET",
        affiliation: "// Server", mainJob: "// Main Job",
        xTwitterID: "// X (Twitter) @User ID", xTwitterIDHolder: "'@' NOT REQUIRED [ QR_GENERATION ]",
        orientation: "// Card Style", optHoriz: "Horizontal", optVert: "Vertical", pattern: "// Pattern",
        bgImage: "// Upload Image", playstyle: "// Playstyle (Multiple)", favRace: "// Favorite Race (Multiple)",
        progress: "// Main Story Progress", comment: "// Rear Card Comment", commentHolder: "LINE_BREAK: ENABLED", footerUpdates: "// Updates", footerTerms: "// Terms of Service",
        mainColor: "// Main Color", subColor: "// Sub Color", preset: "// Presets",
        shadow: "// Shadow ", shadowColor: "// Shadow Color", shadowAlpha: "// Shadow Alpha", on: "ON", off: "OFF",
        weekday: "// Weekdays", weekend: "// Weekends",
        inst: "FRONT_PREVIEW // PHOTO_TRANSFORM_ENABLED (Move/Scale)",
        mask: "// Mask", maskOff: "OFF", maskOn: "ON", maskPattern: "// Mask Pattern",maskBackColor: "// Mask Background", openMask: "// Mask Options ( Click to expand/collapse )",
        backTextColor: "// Rear Text Color", commentY: "// Rear Comment Y-Pos", tips: "The mask designs are scheduled to be added or modified in future updates."
    }
};

function updateLanguageLabels() {
    const data = uiLabels[currentLang];
    document.getElementById('lblCharName').textContent = data.charName;
    document.getElementById('charName').placeholder = data.charNameHolder;
    document.getElementById('lblXID').textContent = data.xTwitterID;
    document.getElementById('xTwitterID').placeholder = data.xTwitterIDHolder;
    document.getElementById('lblAffiliation').textContent = data.affiliation;
    document.getElementById('lblMainJob').textContent = data.mainJob;
    document.getElementById('lblOrientation').firstChild.textContent = data.orientation;
    document.getElementById('optHoriz').textContent = data.optHoriz;
    document.getElementById('optVert').textContent = data.optVert;
    document.getElementById('lblPattern').firstChild.textContent = data.pattern;
    document.getElementById('lblBgImage').textContent = data.bgImage;
    document.getElementById('lblPlaystyle').textContent = data.playstyle;
    document.getElementById('lblFavRace').textContent = data.favRace;
    document.getElementById('lblProgress').textContent = data.progress;
    document.getElementById('lblComment').firstChild.textContent = data.comment;
    document.getElementById('backComment').placeholder = data.commentHolder;
    document.getElementById('lblUpdates').textContent = data.footerUpdates;
    document.getElementById('lblFooterTerms').textContent = data.footerTerms;
    document.getElementById('lblCol1').textContent = data.mainColor;
    document.getElementById('lblCol2').textContent = data.subColor;
    document.getElementById('lblColors').textContent = data.preset;
    document.getElementById('lblShadow').textContent = data.shadow;
    document.getElementById('lblShadowCol').textContent = data.shadowColor;
    document.getElementById('lblAplha').textContent = data.shadowAlpha;
    document.getElementById('lblShadowOn').textContent = data.on;
    document.getElementById('lblShadowOff').textContent = data.off;
    document.getElementById('lblWeekday').textContent = data.weekday;
    document.getElementById('lblWeekend').textContent = data.weekend;
    document.getElementById('lblInst').textContent = data.inst;
    document.getElementById('lblMask').textContent = data.mask;
    document.getElementById('lblMaskOff').textContent = data.maskOff;
    document.getElementById('lblMaskOn').textContent = data.maskOn;
    document.getElementById('lblMaskPattern').textContent = data.maskPattern;
    document.getElementById('lblCol3').textContent = data.backTextColor;
    document.getElementById('lblMaskBack').textContent = data.maskBackColor;
    document.getElementById('lblTips').textContent = data.tips;
    document.getElementById('lblOpenMask').textContent = data.openMask; 
    document.getElementById('lblCommentY').textContent = data.commentY; 
}

function constructFormOptions() {
    const savedJob = mainJobSelect.value;
    mainJobSelect.innerHTML = "";
    const roleLabels = {
        JP: { TANK: "タンク", HEALER: "ヒーラー", MELEE_DPS: "近接", PHYSICAL_RANGED_DPS: "遠隔物理", MAGIC_CASTER_DPS: "遠隔魔法" },
        EN: { TANK: "TANK", HEALER: "HEALER", MELEE_DPS: "MELEE", PHYSICAL_RANGED_DPS: "PHYS.RANGED", MAGIC_CASTER_DPS: "MAG.CASTER" }
    };

    Object.keys(jobMasterCategorized).forEach(roleKey => {
        const grp = document.createElement("optgroup");
        grp.label = roleLabels[currentLang][roleKey];
        jobMasterCategorized[roleKey].forEach(j => {
            const o = document.createElement("option");
            o.value = j.id;
            o.textContent = (currentLang === "JP") ? `${j.jp} (${j.code})` : `${j.en} (${j.code})`;
            if (j.id === savedJob) o.selected = true;
            grp.appendChild(o);
        });
        mainJobSelect.appendChild(grp);
    });
    if (!mainJobSelect.value) mainJobSelect.value = "侍";

    const checkedStyles = Array.from(document.querySelectorAll('input[name="style"]:checked')).map(el => el.value);
    const playstyleGrid = document.getElementById("playstyleGrid");
    playstyleGrid.innerHTML = "";
    styleMaster.forEach(s => {
        const lbl = document.createElement("label");
        lbl.className = "checkbox-label";
        const chk = document.createElement("input");
        chk.type = "checkbox";
        chk.name = "style";
        chk.value = s.id;
        if (checkedStyles.includes(s.id) || (checkedStyles.length === 0 && [].includes(s.id))) chk.checked = true;
        lbl.appendChild(chk);
        const txtSpan = document.createElement("span");
        txtSpan.textContent = (currentLang === "JP") ? s.jp : s.en;
        lbl.appendChild(txtSpan);
        playstyleGrid.appendChild(lbl);
    });

    const checkedRaces = Array.from(document.querySelectorAll('input[name="race"]:checked')).map(el => el.value);
    const raceGrid = document.getElementById("raceGrid");
    raceGrid.innerHTML = "";
    raceMaster.forEach(r => {
        const lbl = document.createElement("label");
        lbl.className = "checkbox-label";
        const chk = document.createElement("input");
        chk.type = "checkbox";
        chk.name = "race";
        chk.value = r.id;
        if (checkedRaces.includes(r.id) || (checkedRaces.length === 0 && [].includes(r.id))) chk.checked = true;
        lbl.appendChild(chk);
        const txtSpan = document.createElement("span");
        txtSpan.textContent = (currentLang === "JP") ? r.jp : r.en;
        lbl.appendChild(txtSpan);
        raceGrid.appendChild(lbl);
    });

    const checkedProg = document.querySelector('input[name="progress"]:checked')?.value || "0";
    const progressGroup = document.getElementById("progressGroup");
    progressGroup.innerHTML = "";
    progressMaster.forEach(p => {
        const lbl = document.createElement("label");
        const rad = document.createElement("input");
        rad.type = "radio";
        rad.name = "progress";
        rad.value = p.val;
        if (String(p.val) === String(checkedProg)) rad.checked = true;
        lbl.className = "radio-label";
        lbl.appendChild(rad);
        const txtSpan = document.createElement("span");
        txtSpan.textContent = (currentLang === "JP") ? p.jp : p.en;
        lbl.appendChild(txtSpan);
        progressGroup.appendChild(lbl);
    });

    // 各フォーム要素への一括イベント登録
    document.querySelectorAll('input, select, textarea').forEach(el => {
        if (el.id === 'themeColorPicker' || el.id === 'themeColorPicker2' || el.id === 'shadowColorPicker' || el.id === 'backColorPicker' || el.id === 'alphaSlider' || el.id === 'maskColorPicker' || el.id === 'commentYSlider') {

            // つまみをドラッグしている最中（input）
            el.oninput = function (e) {
                // 1. タイマーが走る前に、現在操作している要素を確保しておく
                const targetElement = e.target;

                clearTimeout(colorDebounceTimer);
                colorDebounceTimer = setTimeout(() => {
                    // ★ maskColorPicker または backColorPicker が動かされた時は画像レイヤーを再描画
                    if (targetElement.id === 'maskColorPicker' || targetElement.id === 'backColorPicker') {
                        drawUserImageLayer();
                    }

                    // 2. タイマー発動時に中身が消えないよう、自作のイベントオブジェクトを作る
                    const customEvent = { target: targetElement };
                    updateCard(customEvent);
                }, 10);
            };

            // つまみを離した時 / 確定した時（change）
            el.onchange = function (e) {
                const targetElement = e.target;

                // ★ 確定時も同様に画像レイヤーを再描画
                if (targetElement.id === 'maskColorPicker' || targetElement.id === 'backColorPicker') {
                    drawUserImageLayer();
                }

                updateCard({ target: targetElement });
            };
        } else {
            // その他の一般要素
            el.oninput = function (e) { updateCard(e); };
            el.onchange = function (e) { updateCard(e); };
        }
    });
}

// =================================================================
// 5. イベントリスナー：言語切り替え・サーバー選択・背景画像アップロード
// =================================================================
document.getElementById('btnLangJP').addEventListener('click', () => {
    currentLang = "JP";
    document.getElementById('btnLangJP').classList.add('active');
    document.getElementById('btnLangEN').classList.remove('active');
    updateLanguageLabels();
    constructFormOptions();
    updateCard();
});

document.getElementById('btnLangEN').addEventListener('click', () => {
    currentLang = "EN";
    document.getElementById('btnLangEN').classList.add('active');
    document.getElementById('btnLangJP').classList.remove('active');
    updateLanguageLabels();
    constructFormOptions();
    updateCard();
});

dcSelect.addEventListener('change', () => {
    const selectedDC = dcSelect.value;
    worldSelect.innerHTML = '';
    if (selectedDC === '') {
        worldSelect.disabled = true;
        return;
    }
    worldSelect.disabled = false;
    worldData[selectedDC].forEach(world => {
        const option = document.createElement('option');
        option.value = world;
        option.textContent = world;
        worldSelect.appendChild(option);
    });
    updateCard();
});

document.getElementById('bgImage').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    document.getElementById('file-upload-text').textContent = file.name.toUpperCase();
    const reader = new FileReader();
    reader.onload = function (event) {
        const img = new Image();
        img.onload = function () {
            loadedImage = img;
            imgX = 0;
            imgY = 0;
            imgScale = 1.0;
            updateCard();
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
});

function getClientXY(e) {
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: clientX, y: clientY };
}

function handleStart(e) {
    if (!e.target.classList.contains('interactive-front')) return;
    if (!loadedImage) return;
    isDragging = true;
    const pos = getClientXY(e);
    startMouseX = pos.x - imgX;
    startMouseY = pos.y - imgY;
    if (e.cancelable) e.preventDefault();
}

function handleMove(e) {
    if (!isDragging) return;
    const pos = getClientXY(e);
    imgX = pos.x - startMouseX;
    imgY = pos.y - startMouseY;

    // 重い updateCard() を毎回ダイレクトに呼ばず、
    // 画面の書き換えタイミング（アニメーションフレーム）に同期させて間引く
    if (!isDrawingRequested) {
        isDrawingRequested = true;
        requestAnimationFrame(() => {
            renderCanvasLoadImage();
            isDrawingRequested = false;
        });
    }
}

function handleEnd() { isDragging = false; }

window.addEventListener('mousemove', handleMove);
window.addEventListener('touchmove', handleMove, { passive: false });
window.addEventListener('mouseup', handleEnd);
window.addEventListener('touchend', handleEnd);

// =================================================================
// 6. QRコード生成
// =================================================================
function updateQrAndCard() {
    const inputValue = xTwitterIDInput.value.trim().replace('@', '');
    const rawID = inputValue === "" ? "FF_XIV_JP" : inputValue;

    hiddenQrContainer.innerHTML = "";
    // 安定して機能していた元の生成設定
    new QRCode(hiddenQrContainer, { text: `https://x.com/${rawID}`, width: 120, height: 120, colorDark: "#000000", colorLight: "#ffffff", correctLevel: QRCode.CorrectLevel.H });
    setTimeout(() => {
        const qrCanvasElement = hiddenQrContainer.querySelector('canvas');
        if (qrCanvasElement) {
            cachedQrSourceCanvas = qrCanvasElement;
            updateCard();
        }
    }, 80);
}
xTwitterIDInput.addEventListener('change', updateQrAndCard);
xTwitterIDInput.addEventListener('input', updateQrAndCard);

function updateCard(e) {
    // スライダー（alphaSlider）やカラーピッカーが動かされたとき
    if (e && e.target && (e.target.id === 'alphaSlider' || e.target.id === 'commentYSlider' || e.target.type === 'range' || e.target.type === 'color')) {
        renderCanvas(); // 画面の再描画だけを行う（HTML要素を再構築しない）
        return;
    }

    // 通常の変更（文字入力やチェックボックス等）の時だけHTMLを再構築する
    constructFormOptions();
    renderCanvas();
}

// =================================================================
// 7. 描画ユーティリティ
// =================================================================
function wrapAndDrawText(targetCtx, text, x, y, maxWidth, lineHeight) {
    const words = text.split('');
    let line = '';
    let currentY = y;

    for (let n = 0; n < words.length; n++) {
        if (words[n] === '\n') {
            targetCtx.fillText(line, x, currentY);
            line = '';
            currentY += lineHeight;
            continue;
        }
        let testLine = line + words[n];
        let metrics = targetCtx.measureText(testLine);
        if (metrics.width > maxWidth && n > 0) {
            targetCtx.fillText(line, x, currentY);
            line = words[n];
            currentY += lineHeight;
        } else {
            line = testLine;
        }
    }
    targetCtx.fillText(line, x, currentY);
}

function renderCanvasLoadImage() {
    const orientation = document.querySelector('input[name="cardOrientation"]:checked').value;

    const cardW = (orientation === 'vertical') ? 1000 : 1545;
    const cardH = (orientation === 'vertical') ? 1545 : 1000;
    const backW = cardW;
    const backH = cardH;
    canvasLoad.width = cardW;
    canvasLoad.height = cardH;

    ctxLoad.fillStyle = '#ffffff';
    ctxLoad.fillRect(0, 0, cardW, cardH);
    if (loadedImage) {
        ctxLoad.save();
        const minScaleX = cardW / loadedImage.width;
        const minScaleY = cardH / loadedImage.height;
        const baseScale = Math.max(minScaleX, minScaleY);
        const finalWidth = loadedImage.width * baseScale * imgScale;
        const finalHeight = loadedImage.height * baseScale * imgScale;

        // 【余白防止システム】現在の画像サイズから、上下左右の最大移動可能距離を算出
        const maxMoveX = (finalWidth - cardW) / 2;
        const maxMoveY = (finalHeight - cardH) / 2;

        // 移動量が限界を超えないようにグローバル変数の数値を直接制限（クランプ）
        imgX = Math.max(-maxMoveX, Math.min(maxMoveX, imgX));
        imgY = Math.max(-maxMoveY, Math.min(maxMoveY, imgY));

        ctxLoad.drawImage(loadedImage, (cardW - finalWidth) / 2 + imgX, (cardH - finalHeight) / 2 + imgY, finalWidth, finalHeight);
        ctxLoad.restore();
    }
    //resultLoadImage.src = canvasLoad.toDataURL('image/png');
}

// 背景の16進数カラーコード（例: "#ffffff"）から、最適な文字色（"#000000" または "#ffffff"）を返す関数
const getContrastColor = (hexColor) => {
    // # を除去
    const hex = hexColor.replace('#', '');

    // RGBの各数値を抽出
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    // HSP（Luminance）モデルを用いて輝度を計算 (人間の目の感度特性に合わせた重み付け)
    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;

    // 輝度が128（中間の明るさ）より大きければ背景が明るいので「黒文字」、小さければ暗いので「白文字」
    return luminance > 128 ? '#000000' : '#ffffff';
};

/**
 * ラジオボタンの状態に応じて、Canvasコンテキストに影（シャドウ）を設定または解除する関数
 * @param {CanvasRenderingContext2D} ctx - 影を適用したいCanvasのコンテキスト（uiCtx など）
 */
const applyUiShadowIfEnabled = (ctx) => {
    // 影のラジオボタンで "on" が選ばれているかチェック
    const shadowElement = document.querySelector('input[name="textShadow"]:checked');
    const isShadowEnabled = shadowElement && shadowElement.value === 'on';

    const alphaValue = document.getElementById('alphaValue');

    const hex = shadowColorPicker.value;
    const alpha = alphaSlider.value;

    alphaValue.textContent = alpha;

    const r = parseInt(hex.substring(1, 3), 16);
    const g = parseInt(hex.substring(3, 5), 16);
    const b = parseInt(hex.substring(5, 7), 16);

    const rgbaColor = `rgba(${r}, ${g}, ${b}, ${alpha})`;

    ctx.shadowColor = rgbaColor;
    if (isShadowEnabled) {
        // 【オンの場合】影のプロパティを設定（色、ぼかし、ズレ）
        ctx.shadowBlur = 12;      // ぼかし具合
        ctx.shadowOffsetX = 0;    // 右へのズレ
        ctx.shadowOffsetY = 0;    // 下へのズレ
    } else {
        // 【オフの場合】影を完全に無効化（クリア）する
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
    }
};

// 影のラジオボタンが変更されたら再描画
document.querySelectorAll('input[name="textShadow"]').forEach(radio => {
    radio.addEventListener('change', () => {
        renderCanvas();     // 再描画
    });
});

// マスクのラジオボタンが変更されたら再描画
document.querySelectorAll('input[name="layoutMask"]').forEach(radio => {
    radio.addEventListener('change', () => {
        drawUserImageLayer();
    });
});

// マスクパターンのボタンが変更されたら再描画
document.querySelectorAll('input[name="layoutMaskPattern"]').forEach(radio => {
    radio.addEventListener('change', () => {
        // HTMLの value からファイル名（"mask-A.jpg" 等）をダイレクトに取得
        const selectedMaskFile = document.querySelector('input[name="layoutMaskPattern"]:checked').value;

        // 選択されたマスクファイルをそのまま非同期ロードに回す
        loadMaskImage(selectedMaskFile).then(() => {
            // ロード完了後に背景レイヤーを再描画
            drawUserImageLayer();
        }).catch((err) => {
            console.error(`${selectedMaskFile} の読み込みに失敗しました:`, err);
        });
    });
});

// =================================================================
// 8. メイン描画処理（カード表面・裏面）
// =================================================================
// alertColorが 'rgb(255,0,0)' や '#ff0000' 形式なら rgba に変換して直接指定
function toRgba(color, alpha) {
    const c = document.createElement('canvas').getContext('2d');
    c.fillStyle = color;
    const computed = c.fillStyle; // ブラウザが正規化した色 (#rrggbb or rgb(...))
    const m = computed.match(/\d+/g);
    return `rgba(${m[0]}, ${m[1]}, ${m[2]}, ${alpha})`;
}

function renderCanvas() {
    const name = document.getElementById('charName').value || 'Cellica Flame';
    const dc = dcSelect.value || '---';
    const world = worldSelect.value || '---';
    const orientation = document.querySelector('input[name="cardOrientation"]:checked').value;
    const layoutPattern = document.querySelector('input[name="layoutPattern"]:checked').value;
    const backComment = backCommentInput.value || '';
    const themeColor = themeColorPicker.value;
    const alertColor = themeColorPicker2.value;
    const backTextColor = getAutomaticBackTextColor(themeColor);
    const backColor = backColorPicker.value;
    const backNameColor = getAutomaticBackTextColor(backColor);
    const fontForName = textFontName.value;
    const fontForComment = textFontComment.value;
    // スライダーの比率（0.4 ～ 0.8）を取得
    const commentYRatio = parseFloat(commentYSlider.value || "0.65");

    let targetJobObj = { code: "N/A", en: "UNKNOWN" };
    Object.keys(jobMasterCategorized).forEach(rk => {
        const found = jobMasterCategorized[rk].find(j => j.id === mainJobSelect.value);
        if (found) targetJobObj = found;
    });

    const cardW = (orientation === 'vertical') ? 1000 : 1545;
    const cardH = (orientation === 'vertical') ? 1545 : 1000;
    const backW = cardW;
    const backH = cardH;

    previewSize.style.aspectRatio = cardW / cardH;

    canvas.width = cardW;
    canvas.height = cardH;
    canvasBack.width = backW;
    canvasBack.height = backH;
    canvasLoad.width = cardW;
    canvasLoad.height = cardH;

    const selectedStylesIDs = Array.from(document.querySelectorAll('input[name="style"]:checked')).map(el => el.value);
    const selectedRacesIDs = Array.from(document.querySelectorAll('input[name="race"]:checked')).map(el => el.value);
    const progressVal = parseInt(document.querySelector('input[name="progress"]:checked')?.value || "0", 10);

    // ---- 【表面】描画 ----

    // 【表面】レイアウトパターン連動で1箇所だけにツインウェーブ目盛りを配置
    let surfaceWavePt = { x: 105, y: 175 }; // デフォルト：パターンA（左上）
    if (layoutPattern === 'B') {
        surfaceWavePt = { x: cardW - 105, y: 105 }; // パターンB（右上）
    }
    drawCyberTwinWaveScale(ctx, surfaceWavePt.x, surfaceWavePt.y, alertColor);
    applyUiShadowIfEnabled(ctx);
    ctx.strokeStyle = themeColor;
    ctx.lineWidth = 5;
    ctx.strokeRect(20, 20, cardW - 40, cardH - 40);
    ctx.strokeStyle = alertColor;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(28, 28, cardW - 56, cardH - 56);

    ctx.textBaseline = 'top';
    ctx.fillStyle = themeColor;
    ctx.font = '900 24px "Orbitron", sans-serif';
    ctx.textAlign = 'left';
    applyUiShadowIfEnabled(ctx);
    ctx.fillText('NEO CITIZEN IDENTIFICATION CARD /////', 45, 45);
    ctx.fillStyle = alertColor;
    ctx.font = '700 16px "Orbitron", sans-serif';
    ctx.fillText(`ID_NO: ${generatedID}`, 45, 75);

    let padding = 60;
    let namePt = { x: cardW - padding, y: cardH - 350 };
    let profPt = { x: padding, y: padding + 120 };
    if (orientation === 'vertical') {
        namePt.y = cardH - 450;
        profPt.y = padding + 160;
    }
    if (layoutPattern === 'A') {
        namePt.y = padding + 60;
        profPt.y = (orientation === 'horizontal') ? cardH - 560 : cardH - 580;
    }

    ctx.textAlign = 'right';
    ctx.fillStyle = alertColor;
    ctx.font = `900 70px ${fontForName}`;
    ctx.fillText(name, namePt.x, namePt.y);
    ctx.fillStyle = themeColor;
    ctx.font = '900 32px "Orbitron", sans-serif';
    ctx.fillText(`[ JOB:  ${targetJobObj.en} ]`, namePt.x, namePt.y + 85);
    ctx.fillStyle = alertColor;
    ctx.font = 'bold 22px "Share Tech Mono", monospace';
    ctx.font = '900 22px "Orbitron", sans-serif';
    ctx.fillText(`[ DC: ${dc.toUpperCase()} // ${world.toUpperCase()} ]`, namePt.x, namePt.y + 125);

    ctx.font = `bold ${CYBER_PANEL_CONFIG.fontSize}px "Share Tech Mono", monospace`;




    

// =================================================================
    // 💡 縦型・横型、パターンA・Bに応じた【各項目の位置・座標】の設定
    // =================================================================
    let playStyleY = 0;
    let favRaceY = 0;
    let msqPhaseY = 0;
    
    // ジョブコード（うっすら文字）のX座標とY座標を入れる変数
    let jobCodePt = { x: 0, y: 0 }; 

    if (orientation === 'vertical') {
        // 📱 ーーー 【 縦 型 】のとき ーーー
        if (layoutPattern === 'A') {
            // 【縦型 × パターンA】の位置
            playStyleY = 980;  
            favRaceY   = 1110; 
            msqPhaseY  = 1200; 
            
            // ジョブコードの位置（必要に応じて数値を調整してください）
            jobCodePt = { x: cardW - 45, y: cardH - 160 };
        } else {
            // 【縦型 × パターンB】の位置
            playStyleY = 140;  
            favRaceY   = 270;  
            msqPhaseY  = 360;  

            // ジョブコードの位置
            jobCodePt = { x: cardW - 45, y: cardH - 160 };
        }
    } else {
        // 💻 ーーー 【 横 型 】のとき ーーー
        if (layoutPattern === 'A') {
            // 【横型 × パターンA】の位置
            playStyleY = 510;  
            favRaceY   = 640;  
            msqPhaseY  = 730;  

            // ジョブコードの位置
            jobCodePt = { x: cardW - 45, y: cardH - 170 };
        } else {
            // 【横型 × パターンB】の位置
            playStyleY = 140;  
            favRaceY   = 270;  
            msqPhaseY  = 360;  

            // ジョブコードの位置
            jobCodePt = { x: cardW - 650, y: cardH - 170 };
        }
    }

    // =================================================================
    // 【表面】右下にメインジョブの3文字（アルファベット）をうっすらと表示
    // =================================================================
    ctx.save();
    ctx.textAlign = 'right';
    ctx.textBaseline = 'bottom';
    // ctx.fillStyle = alertColor; // テーマカラー2
    // ctx.globalAlpha = 0.15;     // 透明度（0.1〜0.2程度がうっすら見えて綺麗です）

    // カードのサイズや向きに応じてフォントサイズと位置を調整
    ctx.font = '900 120px "Orbitron", sans-serif';

    // ctx.fillStyle = toRgba(alertColor, 0.15);
    // ctx.fillStyle = `color-mix(in srgb, ${alertColor} 15%, transparent)`;
    ctx.fillStyle = alertColor + "26"; // 一番シンプル
    
    // 💡 上の分岐で決定した X と Y の座標を使って配置
    ctx.fillText("///////" + targetJobObj.code + "//", jobCodePt.x, jobCodePt.y);
    ctx.restore();

    // =================================================================
    // --- PLAY_STYLE パネル群 ---
    // =================================================================
    let currentY = playStyleY; // 💡 上で設定した縦型・横型・パターン別の位置を代入
    ctx.textAlign = 'left';
    ctx.fillStyle = alertColor;
    ctx.font = '700 20px "Orbitron", sans-serif';
    ctx.fillText('PLAY_STYLE:', profPt.x, currentY);

    styleMaster.forEach((s, i) => {
        let col = i % 3, row = Math.floor(i / 3);
        let targetX = profPt.x + CYBER_PANEL_CONFIG.offsetX + (col * CYBER_PANEL_CONFIG.styleColumnWidth);

        if (col === 1) { targetX -= 15; }
        if (col === 2) { targetX += 10; }
        
        drawCustomCyberPanel(ctx, s.en, targetX, currentY + (row * CYBER_PANEL_CONFIG.rowHeight), CYBER_PANEL_CONFIG.fontSize, selectedStylesIDs.includes(s.id), themeColor, CYBER_PANEL_CONFIG.font);
    });

    // =================================================================
    // --- FAV_RACE パネル群 ---
    // =================================================================
    currentY = favRaceY; // 💡 上で設定した縦型・横型・パターン別の位置を代入
    ctx.fillStyle = alertColor;
    ctx.fillText('FAV_RACE:', profPt.x, currentY);

    raceMaster.forEach((r, i) => {
        let col = i % 4, row = Math.floor(i / 4);
        let targetX = profPt.x + CYBER_PANEL_CONFIG.offsetX + (col * CYBER_PANEL_CONFIG.raceColumnWidth);

        switch (col) {
            case 1: targetX += 35; break;
            case 2: targetX += 40; break;
            case 3: targetX += 75; break;
        }

        drawCustomCyberPanel(ctx, r.en, targetX, currentY + (row * CYBER_PANEL_CONFIG.rowHeight), CYBER_PANEL_CONFIG.fontSize, selectedRacesIDs.includes(r.id), themeColor, CYBER_PANEL_CONFIG.font);
    });

    // =================================================================
    // --- MSQ_PHASE パネル群 ---
    // =================================================================
    currentY = msqPhaseY; // 💡 上で設定した縦型・横型・パターン別の位置を代入
    ctx.fillStyle = alertColor;
    ctx.fillText('MSQ_PHASE:', profPt.x, currentY);

    progressMaster.forEach((p, i) => {
        let col = i % 3, row = Math.floor(i / 3);
        let targetX = profPt.x + CYBER_PANEL_CONFIG.offsetX + (col * CYBER_PANEL_CONFIG.phaseColumnWidth);

        if (col === 1) {
            targetX += 10;
        } else if (col === 2) {
            targetX += 5;
        }

        drawCustomCyberPanel(ctx, p.en, targetX, currentY + (row * CYBER_PANEL_CONFIG.rowHeight), CYBER_PANEL_CONFIG.fontSize, p.val <= progressVal, themeColor, CYBER_PANEL_CONFIG.font);
    });

    drawCyberBarcode(ctx, 45, cardH - 110, 360, 42, themeColor, alertColor, generatedID);

    // 【表面】バーコードとQRコードの中間にコピーライトを表示
    ctx.save();
    applyUiShadowIfEnabled(ctx);
    ctx.fillStyle = themeColor; // または alertColor（テーマカラー2）でお好みに合わせてください
    ctx.font = '700 14px "Orbitron", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // バーコードの右端(405)とQRコードの左端(cardW - 165)の中間座標を計算
    const copyrightX = (405 + (cardW - 165)) / 2;
    const copyrightY = cardH - 55; // バーコードの高さ(42px)の中央に合わせる

    ctx.fillText('//////// [ COPYRIGHT: ©SQUARE ENIX ] ////////', copyrightX, copyrightY);
    ctx.restore();

    const layoutType = (orientation === 'vertical') ? 'vertical' : 'horizontal';
    const pattern = document.querySelector('input[name="layoutPattern"]:checked').value; // A or B

    drawLoginTimeVisualizer(ctx, cardW, cardH, themeColor, alertColor, layoutType, pattern);

    // ---- 【裏面】描画 ----
    applyUiShadowIfEnabled(ctxBack);
    ctxBack.fillStyle = themeColor;
    ctxBack.fillRect(0, 0, backW, backH);
    ctxBack.strokeStyle = alertColor;
    ctxBack.lineWidth = 5;
    ctxBack.strokeRect(20, 20, backW - 40, backH - 40);
    ctxBack.strokeStyle = alertColor;
    ctxBack.lineWidth = 1.5;
    ctxBack.strokeRect(28, 28, backW - 56, backH - 56);

    // 【裏面】縦型と横型で数値を切り替えて1箇所だけに配置
    let backWavePt;

    if (orientation === 'vertical') {
        // --- 📱 縦型のとき（1000 x 1545） ---
        backWavePt = { x: backW / 2, y: 350 }; // デフォルト：パターンA（左上）
        if (layoutPattern === 'B') {
            backWavePt = { x: backW / 2, y: 350 }; // パターンB（右上）
        }
    } else {
        // --- 💻 横型のとき（1545 x 1000） ---
        backWavePt = { x: backW / 2, y: 250 }; // パターンA（右下）
        if (layoutPattern === 'B') {
            backWavePt = { x: backW / 2, y: 250 }; // パターンB（左下）
        }
    }

    // 決定した座標で描画を実行
    drawCyberTwinWaveScale(ctxBack, backWavePt.x, backWavePt.y, alertColor);

    ctxBack.textBaseline = 'middle';
    ctxBack.textAlign = 'center';
    ctxBack.fillStyle = alertColor;
    ctxBack.font = 'bold 50px "Orbitron", sans-serif';
    ctxBack.fillText('FINAL FANTASY XIV', backW / 2, backH * 0.15);

    ctxBack.save();
    ctxBack.fillStyle = backColor;
    let signFontSize = 300;
    const maxSignWidth = backW * 0.8; // これ以上はみ出してほしくない最大横幅（裏面幅の80%）

    // まずは最大の大きさ(300px)でフォントを設定
    ctxBack.font = `lighter ${signFontSize}px "Meow Script", "cursive"`;

    // 文字の横幅を測定し、最大幅（裏面の8割）を超える場合は自動で小さくする
    // 元のサイズが大きいため、3pxずつ高速に削り落とします（最低40pxでストップ）
    while (ctxBack.measureText(name).width > maxSignWidth && signFontSize > 40) {
        signFontSize -= 3;
        ctxBack.font = `lighter ${signFontSize}px "Meow Script", "cursive"`;
    }

    ctxBack.translate(backW / 2, backH * 0.45);
    ctxBack.rotate(-2 * Math.PI / 180);
    ctxBack.fillText(name, 0, 0);
    ctxBack.restore();

    ctxBack.save();
    ctxBack.setTransform(1, 0, 0, 1, 0, 0);
    ctxBack.fillStyle = backColor;
    ctxBack.font = `40px ${fontForComment}`;
    ctxBack.textAlign = 'center';
    ctxBack.textBaseline = 'top';
    // wrapAndDrawText(ctxBack, backComment, backW / 2, backH * 0.65, 800, 48);
    // 【修正】固定値だった backH * 0.65 を、スライダー連動の backH * commentYRatio に変更
    wrapAndDrawText(ctxBack, backComment, backW / 2, backH * commentYRatio, 800, 48);
    ctxBack.restore();

    ctxBack.fillStyle = backColor;
    ctxBack.font = `900 54px "Orbitron", sans-serif`;
    ctxBack.fillText(name, backW / 2, backH * 0.85);
    drawCyberBarcode(ctxBack, backW / 2 - 220, backH - 110, 440, 45, alertColor, alertColor, generatedID);

    if (cachedQrSourceCanvas) {
        drawQrWithoutBase(ctx, cardW - 120 - 45, cardH - 120 - 45, 120, themeColor);
        drawQrWithoutBase(ctxBack, backW - 130 - 45, backH - 130 - 45, 130, alertColor);
    }

    //resultImage.src = canvas.toDataURL('image/png');
    resultImageBack.src = canvasBack.toDataURL('image/png');
}

/**
 * ログイン時間帯ビジュアライザー
 */
function drawLoginTimeVisualizer(ctx, cardW, cardH, themeColor, alertColor, layoutType, pattern) {
    // 【調整用パラメータ：基準位置】
    const positions = {
        vertical: { A: { x: cardW - 170, y: 450 }, B: { x: cardW - 70, y: 340 } },
        horizontal: { A: { x: 600, y: 920 }, B: { x: 600, y: 820 } }
    };

    // 【個別調整用：各要素の微調整】
    // x, y で位置を自由にオフセット可能
    const offsetConfig = {
        vertical: {
            wd: { x: 0, y: -65 },
            hol: { x: 0, y: -65 },
            time: { x: -55, y: 0 }
        },
        horizontal: {
            wd: { x: 35, y: -65 },
            hol: { x: 35, y: -65 },
            time: { x: 20, y: 0 }
        }
    };

    const pos = positions[layoutType][pattern];
    const off = offsetConfig[layoutType];
    const startX = pos.x;
    const startY = pos.y;

    const dotX = 36, dotY = 18, gap = 30, extraGap = 20;
    const totalHeight = (23 * gap) + extraGap;

    ctx.save();
    applyUiShadowIfEnabled(ctx);
    ctx.translate(startX, startY);

    if (layoutType === 'horizontal') {
        ctx.rotate(-Math.PI / 2);
    }

    function drawLabel(text, x, y, color) {
        ctx.save();
        applyUiShadowIfEnabled(ctx);
        ctx.fillStyle = color;
        ctx.font = 'bold 16px Orbitron, sans-serif';
        ctx.textAlign = 'center';
        ctx.translate(x, y);
        let rotation = Math.PI / 2;
        if (layoutType === 'vertical') rotation += Math.PI;
        ctx.rotate(rotation);
        ctx.fillText(text, 0, 0);
        ctx.restore();
    }

    const labelOffset = (pattern === 'B') ? -50 : 50;
    const shift = (layoutType === 'vertical') ? 50 : 0;

    // ラベル位置をそれぞれ独立して適用
    drawLabel("WEEKDAYS", labelOffset - shift + off.wd.x, off.wd.y, themeColor);
    drawLabel("WEEKENDS", labelOffset - 50 + shift + off.hol.x, off.hol.y, alertColor);

    const wdBtns = document.querySelectorAll('#weekdayTimeGrid .time-selector-btn');
    const weBtns = document.querySelectorAll('#weekendTimeGrid .time-selector-btn');

    for (let i = 0; i < 24; i++) {
        const gapOffset = (i >= 12) ? extraGap : 0;
        let currentY = (layoutType === 'vertical') ? totalHeight - (i * gap) - gapOffset : (i * gap) + gapOffset;

        const leftColX = (layoutType === 'vertical') ? labelOffset - 50 : labelOffset;
        const rightColX = (layoutType === 'vertical') ? labelOffset : labelOffset - 50;

        if (wdBtns[i]) {
            ctx.fillStyle = wdBtns[i].classList.contains('active') ? themeColor : '#0000003d';
            ctx.fillRect(leftColX, currentY, dotX, dotY);
        }
        if (weBtns[i]) {
            ctx.fillStyle = weBtns[i].classList.contains('active') ? alertColor : '#0000003d';
            ctx.fillRect(rightColX, currentY, dotX, dotY);
        }

        // 時刻表示
        if (i === 0 || i === 12) {
            ctx.save();
            applyUiShadowIfEnabled(ctx);
            ctx.fillStyle = themeColor;
            ctx.font = 'bold 16px Orbitron, sans-serif';
            ctx.textAlign = 'center';
            // 時刻位置も time.x, time.y で個別に適用
            ctx.translate(leftColX + dotX + off.time.x, currentY + (dotY / 2) + off.time.y);

            if (layoutType === 'vertical') {
                ctx.rotate(-Math.PI / 2);
            } else {
                ctx.rotate(Math.PI / 2);
            }
            ctx.fillText(i === 0 ? "0" : "12", 0, 0);
            ctx.restore();
        }
    }
    ctx.restore();
}

// 最終リファイン：内側増量高密度・11時開放・3点局所電撃＆全体さざ波システム
function drawCyberTwinWaveScale(targetCtx, cx, cy, color) {
    targetCtx.save();
    applyUiShadowIfEnabled(targetCtx);
    targetCtx.strokeStyle = color;
    targetCtx.lineWidth = 3.5;
    targetCtx.globalAlpha = 0.9;

    // --- コンパクトサイズ＆超内側近接パラメーター ---
    const innerTickCount = 48;   // 内側の目盛り数を36から48に増量して高密度化
    const innerRadius = 42;
    const innerLength = 11;

    // 1列目：内側サークル（100%完全表示・高密度）
    for (let i = 0; i < innerTickCount; i++) {
        let angle = (i * 2 * Math.PI) / innerTickCount;
        let iStartX = cx + (innerRadius - innerLength) * Math.cos(angle);
        let iStartY = cy + (innerRadius - innerLength) * Math.sin(angle);
        let iEndX = cx + innerRadius * Math.cos(angle);
        let iEndY = cy + innerRadius * Math.sin(angle);

        targetCtx.beginPath();
        targetCtx.moveTo(iStartX, iStartY);
        targetCtx.lineTo(iEndX, iEndY);
        targetCtx.stroke();
    }

    // 2列目：外側サークル（内側密着・11時ゼロ・3箇所パルス・全体さざ波）
    const outerTickCount = 72; // 5度刻み（インデックス12が2時、24が4時、36が6時…）
    const outerRadiusBase = innerRadius + 2;
    const baseLength = 10;

    for (let j = 0; j < outerTickCount; j++) {
        let angle = (j * 2 * Math.PI) / outerTickCount;

        // 【非表示ロジック】時計の11時方向（インデックス52〜56付近）をゼロに
        if (j >= 52 && j <= 56) {
            continue;
        }

        // 【全体：さざ波エフェクト】
        let ripple = Math.sin(j * 2.3) * 1.3 + Math.cos(j * 4.7) * 0.8;
        let waveHeight = ripple;

        // 【局所アクセント：2時・5時・8時（突出量は最大2倍＝ベース+10pxまで）】
        // 🔹 2時の方向（インデックス 65〜69 付近）
        if (j >= 65 && j <= 69) {
            if (j === 67) waveHeight = 2; // 真ん中はへこむ
            else waveHeight = 9;
        }

        // 🔹 5時の方向（インデックス 10〜14 付近）
        if (j >= 10 && j <= 14) {
            if (j === 12) waveHeight = 3; // 真ん中はへこむ
            else waveHeight = 10;
        }

        // 🔹 8時の方向（インデックス 28〜32 付近）
        if (j >= 28 && j <= 32) {
            if (j === 30) waveHeight = 2; // 真ん中はへこむ
            else waveHeight = 8.5;
        }

        // 最終的な目盛りの長さを計算（1.2倍〜2倍のクランプ保証）
        let finalWaveLength = baseLength + waveHeight;
        if (finalWaveLength < 6) finalWaveLength = 6;
        if (finalWaveLength > 20) finalWaveLength = 20;

        let oStartX = cx + outerRadiusBase * Math.cos(angle);
        let oStartY = cy + outerRadiusBase * Math.sin(angle);
        let oEndX = cx + (outerRadiusBase + finalWaveLength) * Math.cos(angle);
        let oEndY = cy + (outerRadiusBase + finalWaveLength) * Math.sin(angle);

        targetCtx.beginPath();
        targetCtx.moveTo(oStartX, oStartY);
        targetCtx.lineTo(oEndX, oEndY);
        targetCtx.stroke();
    }
    targetCtx.restore();
}

// QRをドットのみ描画するヘルパー関数
function drawQrWithoutBase(targetCtx, x, y, size, color) {
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = cachedQrSourceCanvas.width;
    tempCanvas.height = cachedQrSourceCanvas.height;
    const tCtx = tempCanvas.getContext('2d');
    tCtx.drawImage(cachedQrSourceCanvas, 0, 0);

    const imgData = tCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
    const data = imgData.data;
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);

    for (let i = 0; i < data.length; i += 4) {
        // 白背景部分は透明にする
        if (data[i] > 200 && data[i + 1] > 200 && data[i + 2] > 200) {
            data[i + 3] = 0;
        } else {
            // ドット部分のみ色付け
            data[i] = r;
            data[i + 1] = g;
            data[i + 2] = b;
            data[i + 3] = 255;
        }
    }
    tCtx.putImageData(imgData, 0, 0);
    targetCtx.drawImage(tempCanvas, x, y, size, size);
}

function drawQrWithHighVisibility(targetCtx, x, y, size, color) {
    // 強制的にQRの背面に白い背景を敷く
    targetCtx.fillStyle = "#ffffff";
    targetCtx.fillRect(x - 5, y - 5, size + 10, size + 10);

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = cachedQrSourceCanvas.width;
    tempCanvas.height = cachedQrSourceCanvas.height;
    const tCtx = tempCanvas.getContext('2d');
    tCtx.drawImage(cachedQrSourceCanvas, 0, 0);

    const imgData = tCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
    const data = imgData.data;
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);

    for (let i = 0; i < data.length; i += 4) {
        if (data[i] > 200 && data[i + 1] > 200 && data[i + 2] > 200) {
            data[i + 3] = 0;
        } else {
            data[i] = r;
            data[i + 1] = g;
            data[i + 2] = b;
        }
    }
    tCtx.putImageData(imgData, 0, 0);
    targetCtx.drawImage(tempCanvas, x, y, size, size);
}

function drawCyberBarcode(targetCtx, x, y, width, height, color, subColor, codeText) {
    targetCtx.save();
    applyUiShadowIfEnabled(targetCtx);
    targetCtx.fillStyle = color;

    const barWidthSequence = [1, 3, 1, 1, 4, 2, 1, 3, 2, 1, 1, 2, 4, 1, 2, 2, 1, 4, 1, 1, 2, 3, 1, 2, 2, 1, 1, 4, 3, 1, 1, 1, 2, 4, 2, 1];
    let currentX = x;
    let i = 0;
    const unitSize = width / 125;

    targetCtx.fillRect(currentX, y, unitSize * 2, height);
    currentX += unitSize * 3;

    while (currentX < (x + width - (unitSize * 5))) {
        let pattern = barWidthSequence[i % barWidthSequence.length];
        let computedBarW = pattern * unitSize;

        if (i % 2 === 0) {
            let drawW = Math.min(computedBarW, (x + width) - currentX);
            targetCtx.fillRect(currentX, y, drawW, height);
        }
        currentX += computedBarW;
        i++;
    }

    targetCtx.fillRect(x + width - (unitSize * 2), y, unitSize * 2, height);

    if (subColor) {
        targetCtx.fillStyle = subColor;
        targetCtx.fillRect(x, y - 4, width, 2);
        targetCtx.fillRect(x, y + height + 2, width, 2);
    }

    if (codeText) {
        targetCtx.fillStyle = color;
        targetCtx.font = '700 14px "Orbitron", sans-serif';
        targetCtx.textAlign = 'center';
        targetCtx.textBaseline = 'top';
        targetCtx.fillText(codeText, x + (width / 2), y + height + 8);
    }
    targetCtx.restore();
}

function drawCustomCyberPanel(tCtx, text, x, y, fSize, active, tCol, font) {
    const themeColor = themeColorPicker.value;
    const alertColor = themeColorPicker2.value;
    tCtx.save();
    applyUiShadowIfEnabled(tCtx);
    tCtx.font = `bold ${fSize - 4}px "Share Tech Mono", monospace`;
    let mWidth = tCtx.measureText(text).width + 0;
    if (active) {
        tCtx.font = font;
        tCtx.fillStyle = tCol;
        tCtx.fillRect(x - 6, y - 2, mWidth, fSize -4);
        tCtx.fillStyle = getContrastColor(themeColor);
        tCtx.fillText(text, x, y + 0);
    } else {
        tCtx.font = font;
        tCtx.fillStyle = 'rgba(0, 0, 0, 0.25)';
        tCtx.fillRect(x - 6, y - 2, mWidth, fSize - 4);
        tCtx.fillStyle = 'rgba(255, 255, 255, 0.45)';
        tCtx.fillText(text, x, y + 0);
    }
    
    tCtx.restore();
}

// =================================================================
// 9. 初期化呼び出し
// =================================================================
initPaletteUI();
updateLanguageLabels();
constructFormOptions();
updateQrAndCard();

// =================================================================
// 10. スマホ用：元の位置を残したまま、独立したオーバーレイプレビューを表示（スクロール完全ロック版）
// =================================================================
document.addEventListener("DOMContentLoaded", () => {
    // 1. 右下の固定ボタンを生成
    const triggerBtn = document.createElement("button");
    triggerBtn.className = "mobile-preview-trigger";
    document.body.appendChild(triggerBtn);

    // 言語切り替えに連動する関数
    const updateTriggerText = () => {
        const isJP = document.getElementById("btnLangJP")?.classList.contains("active");
        triggerBtn.innerHTML = isJP ? "プレビューを表示" : "VIEW PREVIEW";
    };
    updateTriggerText();
    document.getElementById("btnLangJP")?.addEventListener("click", updateTriggerText);
    document.getElementById("btnLangEN")?.addEventListener("click", updateTriggerText);

    // 「プレビューを表示」ボタンタップ時の処理
    triggerBtn.addEventListener("click", () => {
        const isJP = document.getElementById("btnLangJP")?.classList.contains("active");

        // プレビューが開いたら、右下の「プレビューを表示」ボタン自身を非表示にする
        triggerBtn.classList.add("is-hidden");

        // 2. 独立したオーバーレイ（全画面のコンテナ）を作成
        const overlay = document.createElement("div");
        overlay.className = "mobile-overlay-preview";

        // 3. オーバーレイ専用の「閉じる」ボタンを作成
        const closeBtn = document.createElement("button");
        closeBtn.className = "mobile-preview-close";
        closeBtn.innerHTML = isJP ? "✕ 閉じる" : "✕ CLOSE";
        document.body.appendChild(closeBtn);

        // 5. 表面プレビューは「複製(clone)」ではなく、実物の .preview-fit
        //    （background-layer / ui-layer を含む、実際に触って操作しているCanvas）を
        //    そのままオーバーレイへ移動させる。
        //    複製だとCanvasに描かれている絵柄も、既存のドラッグ移動／ホイール・ピンチ拡縮の
        //    イベントリスナーも引き継がれないため、実物を移動することで
        //    「オーバーレイの中でも通常のプレビューと同様に移動・拡縮ができる」状態にする。
        let previewPanelOriginalParent = null;
        let previewPanelOriginalNextSibling = null;

        if (previewPanel) {
            previewPanelOriginalParent = previewPanel.parentNode;
            previewPanelOriginalNextSibling = previewPanel.nextSibling;
            overlay.appendChild(previewPanel);
        }

        // 5. 画面にオーバーレイを表示
        document.body.appendChild(overlay);

        // 横幅が769px以上かを監視するメディアクエリ
        const mediaQuery = window.matchMedia("(min-width: 769px)");

        // 画面幅が変更されたときに実行する関数
        const handleResize = (e) => {
            // 769px以上になった場合
            if (e.matches) {
                // closeBtnのクリックイベントと同じ処理を実行
                if (previewPanel && previewPanelOriginalParent) {
                    previewPanelOriginalParent.insertBefore(previewPanel, previewPanelOriginalNextSibling);
                }
                closeBtn.remove();
                overlay.remove();

                document.documentElement.style.overflow = "";
                document.body.style.overflow = "";
                triggerBtn.classList.remove("is-hidden");

                // 用が済んだので、このサイズ監視イベント自体を削除（メモリリーク防止）
                mediaQuery.removeEventListener("change", handleResize);
            }
        };

        // resize（画面幅変更）の監視を開始
        mediaQuery.addEventListener("change", handleResize);

        // 【重要】背後のメニューがスクロールするのを絶対に防ぐため、htmlとbodyの両方をロック
        document.documentElement.style.overflow = "hidden";
        document.body.style.overflow = "hidden";

        // 6. 「閉じる」タップ時の処理
        closeBtn.addEventListener("click", () => {
            if (previewPanel && previewPanelOriginalParent) {
                previewPanelOriginalParent.insertBefore(previewPanel, previewPanelOriginalNextSibling);
            }
            closeBtn.remove();

            overlay.remove(); // オーバーレイを消去

            // 【重要】プレビューが閉じたので、htmlとbodyのスクロールロックを解除
            document.documentElement.style.overflow = "";
            document.body.style.overflow = "";

            // プレビュー画面が閉じられたので、「プレビューを表示」ボタンを再表示する
            triggerBtn.classList.remove("is-hidden");
        });
    });
});

// =================================================================
// 11. ログイン時間帯セレクター（0〜23時のボタン群）初期化
// =================================================================
function initTimeSelectors() {
    // 平日と休日のグリッド内にあるすべてのボタンを取得
    const timeButtons = document.querySelectorAll('.time-grid .time-selector-btn');

    // 各ボタンにクリックイベントを設定
    timeButtons.forEach(btn => {
        btn.onclick = () => {
            btn.classList.toggle('active');
            renderCanvas(); // 既存のプレビュー描画関数を呼び出す
        };
    });
}
// ページ読み込み時に実行される箇所に追加
document.addEventListener('DOMContentLoaded', initTimeSelectors);

// =================================================================
// 12. 背景画像の移動・拡大縮小（imageTransform）
// =================================================================
// imageTransformに minScale を追加
let imageTransform = {
    img: null,
    x: BASE_WIDTH / 2,
    y: BASE_HEIGHT / 2,
    scale: 1.0,
    minScale: 1.0,
    isDraggingX: false,
    lastX: 0,
    lastY: 0
};

// 画像アップロード時の処理を修正
bgImage.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) {
        imageTransform.img = null;
        drawUserImageLayer();
        return;
    }
    fileNameDisplay.textContent = file.name;
    const reader = new FileReader();
    reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
            imageTransform.img = img;
            imageTransform.x = BASE_WIDTH / 2;
            imageTransform.y = BASE_HEIGHT / 2;

            const canvasAspect = BASE_WIDTH / BASE_HEIGHT;
            const imgAspect = img.width / img.height;

            // 余白を出さない（cover）ための最小拡大率を計算
            // 横長画像なら高さをCanvasに合わせ、縦長画像なら幅をCanvasに合わせる
            imageTransform.minScale = (imgAspect > canvasAspect)
                ? (BASE_HEIGHT / img.height)
                : (BASE_WIDTH / img.width);

            // 初期状態は最小スケール（画面ぴったり）にする
            imageTransform.scale = imageTransform.minScale;

            drawUserImageLayer();
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
});


// Layer 1: ユーザー画像
const drawUserImageLayer = () => {
    bgCtx.setTransform(1, 0, 0, 1, 0, 0);
    bgCtx.clearRect(0, 0, backgroundLayer.width, backgroundLayer.height);
    bgCtx.fillStyle = '#ffffff';
    bgCtx.fillRect(0, 0, backgroundLayer.width, backgroundLayer.height);

    if (imageTransform.img) {
        bgCtx.save();
        bgCtx.translate(imageTransform.x, imageTransform.y);
        bgCtx.scale(imageTransform.scale, imageTransform.scale);
        bgCtx.drawImage(imageTransform.img, -imageTransform.img.width / 2, -imageTransform.img.height / 2);
        bgCtx.restore();
    }

    // マスクの描画設定
    const layoutMask = document.querySelector('input[name="layoutMask"]:checked').value;
    if (layoutMask === 'on') {
        if (maskCanvas) {
            bgCtx.save();
            bgCtx.globalCompositeOperation = 'destination-in';

            const orientation = document.querySelector('input[name="cardOrientation"]:checked')?.value || 'vertical';
            
            if (orientation === 'horizontal') {
                // 横型のときは原点を中心に移して90度回転
                bgCtx.translate(backgroundLayer.width / 2, backgroundLayer.height / 2);
                bgCtx.rotate(90 * Math.PI / 180);
                // 縦横のサイズを入れ替えて描画
                bgCtx.drawImage(
                    maskCanvas, 
                    -backgroundLayer.height / 2, 
                    -backgroundLayer.width / 2, 
                    backgroundLayer.height, 
                    backgroundLayer.width
                );
            } else {
                // 縦型のときはそのまま描画
                bgCtx.drawImage(maskCanvas, 0, 0, backgroundLayer.width, backgroundLayer.height);
            }
            bgCtx.restore();

            //  新しいマスク背景色カラーピッカー（maskColorPicker）の色を反映
            bgCtx.save();
            bgCtx.setTransform(1, 0, 0, 1, 0, 0); // 回転の影響を受けないよう完全にリセット
            bgCtx.globalCompositeOperation = 'destination-over';
            
            // 追加された id="maskColorPicker" から色を取得（無い場合のフォールバックは #ffffff）
            const customMaskBgColor = document.getElementById('maskColorPicker')?.value || '#ffffff';
            bgCtx.fillStyle = customMaskBgColor;
            
            bgCtx.fillRect(0, 0, backgroundLayer.width, backgroundLayer.height);
            bgCtx.restore();
        }
    }
};

//  マスク画像(mask.jpg)が後から読み込み完了した場合にも反映されるようにする
window.addEventListener('maskImageLoaded', drawUserImageLayer);

// マスクの選択（A, B, C）や ON/OFF が変わった時の処理
function handleMaskChange() {
    const layoutMask = document.querySelector('input[name="layoutMask"]:checked')?.value;

    if (layoutMask === 'on') {
        // 選択されているマスクの値（例: 'mask-A.jpg', 'mask-B.jpg' など）を取得
        const selectedMask = document.querySelector('input[name="layoutMaskPattern"]:checked')?.value || 'mask-A.jpg';

        loadMaskImage(selectedMask).catch((err) => {
            console.error(`${selectedMask} の読み込みに失敗しました:`, err);
        });
    } else {
        // マスクOFFならそのまま再描画（マスク処理をスキップさせるため）
        drawUserImageLayer();
    }
}
// 初回読み込み
handleMaskChange();

// 画像アップロード
bgImage.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) {
        imageTransform.img = null;
        drawUserImageLayer();
        return;
    }
    fileNameDisplay.textContent = file.name;
    const reader = new FileReader();
    reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
            imageTransform.img = img;
            imageTransform.x = BASE_WIDTH / 2;
            imageTransform.y = BASE_HEIGHT / 2;

            const canvasAspect = BASE_WIDTH / BASE_HEIGHT;
            const imgAspect = img.width / img.height;

            imageTransform.minScale = (imgAspect > canvasAspect)
                ? (BASE_HEIGHT / img.height)
                : (BASE_WIDTH / img.width);

            // 初期状態は最小スケール（画面ぴったり）にする
            imageTransform.scale = imageTransform.minScale;

            drawUserImageLayer();
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
});

// --- 拡大縮小・移動 (UIレイヤーでのイベント) ---
let X = false;
let animationFrameId = null;
let initialDistance = 0;
let initialScale = 1.0;

const getDistance = (touches) => {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
};

uiLayer.addEventListener('wheel', (e) => {
    if (!imageTransform.img) return;
    e.preventDefault();
    const scaleAmount = 0.1;
    if (e.deltaY < 0) {
        imageTransform.scale += scaleAmount;
    } else {
        // minScale で下限を制限する
        imageTransform.scale = Math.max(imageTransform.minScale, imageTransform.scale - scaleAmount);
    }

    // 縮小した結果、位置がズレて余白が出るのを防ぐため、移動制限関数を呼ぶ（後述）
    checkBounds();

    if (!animationFrameId) {
        animationFrameId = requestAnimationFrame(() => {
            drawUserImageLayer();
            animationFrameId = null;
        });
    }
});

// 移動制限関数
const checkBounds = () => {
    if (!imageTransform.img) return;

    // 現在のスケールでの画像サイズ
    const scaledWidth = imageTransform.img.width * imageTransform.scale;
    const scaledHeight = imageTransform.img.height * imageTransform.scale;

    // 中心座標(x, y)が移動できる限界を計算
    // 例：画像左端が0を超えない ＝ 中心xは (scaledWidth / 2) 以下にはならない
    const minX = BASE_WIDTH - (scaledWidth / 2);
    const maxX = scaledWidth / 2;
    const minY = BASE_HEIGHT - (scaledHeight / 2);
    const maxY = scaledHeight / 2;

    // 算出した範囲内に中心座標を丸める（clamp）
    imageTransform.x = Math.max(minX, Math.min(maxX, imageTransform.x));
    imageTransform.y = Math.max(minY, Math.min(maxY, imageTransform.y));
};

const handleStartX = (e) => {
    if (!imageTransform.img) return;
    e.preventDefault();
    if (e.touches && e.touches.length === 2) {
        isDraggingX = false;
        initialDistance = getDistance(e.touches);
        initialScale = imageTransform.scale;
    } else {
        isDraggingX = true;
        const loc = e.touches ? e.touches[0] : e;
        imageTransform.lastX = loc.clientX;
        imageTransform.lastY = loc.clientY;
    }
};

const handleMoveX = (e) => {
    if (!imageTransform.img) return;
    // 画像をドラッグ/ピンチ操作中でなければ何もしない
    // （これが無いと、画像読み込み後は画面上のどこでマウスを動かしても
    // 　毎回 preventDefault() と重いCanvas再描画が走ってしまい、
    // 　透明度スライダーのつまみドラッグ等が固まって見える原因になっていた）
    const isPinching = e.touches && e.touches.length === 2;
    if (!isPinching && !isDraggingX) return;
    e.preventDefault();
    if (animationFrameId) return;

    if (isPinching) {
        const currentDistance = getDistance(e.touches);
        if (initialDistance > 0) {
            const newScale = initialScale * (currentDistance / initialDistance);
            // minScale に制限する
            imageTransform.scale = Math.max(imageTransform.minScale, newScale);
        }
    } else if (isDraggingX) {
        const loc = e.touches ? e.touches[0] : e;
        // マウスの移動をCanvasの解像度スケールに変換する際、
        // 実際の表示サイズとCanvasの内部解像度（BASE_WIDTH）の比率を考慮する。
        // 固定値（500px）ではなく、その時点の実際の表示幅から動的に算出することで、
        // 　PC版（preview-panel内）でもスマホのオーバーレイプレビュー内でも、
        // 　表示サイズが変わっても同じ感覚でドラッグ移動できるようにする。
        const displayWidth = uiLayer.getBoundingClientRect().width || BASE_WIDTH;
        const displayToInternalScale = BASE_WIDTH / displayWidth;

        const dx = (loc.clientX - imageTransform.lastX) * displayToInternalScale;
        const dy = (loc.clientY - imageTransform.lastY) * displayToInternalScale;

        imageTransform.x += dx;
        imageTransform.y += dy;
        imageTransform.lastX = loc.clientX;
        imageTransform.lastY = loc.clientY;
    }

    // 座標を計算した後に制限をかける
    checkBounds();

    animationFrameId = requestAnimationFrame(() => {
        drawUserImageLayer();
        animationFrameId = null;
    });
};

const handleEndX = () => { isDraggingX = false; initialDistance = 0; };

uiLayer.addEventListener('mousedown', handleStartX);
window.addEventListener('mousemove', handleMoveX);
window.addEventListener('mouseup', handleEndX);
uiLayer.addEventListener('touchstart', handleStartX, { passive: false });
uiLayer.addEventListener('touchmove', handleMoveX, { passive: false });
window.addEventListener('touchend', handleEndX);

// =================================================================
// 13.  向き・パターン切り替え時のサイズ完全同期システム
// =================================================================
// 向き（cardOrientation）のラジオボタンが変更されたタイミングでCanvas全体のサイズを正しく同期させます。
document.querySelectorAll('input[name="cardOrientation"]').forEach(radio => {
    radio.addEventListener('change', () => {
        const orientation = document.querySelector('input[name="cardOrientation"]:checked').value;

        // 1. 向きに応じて基準サイズ（解像度）の数値を更新
        if (orientation === "vertical") {
            BASE_WIDTH = 1000;
            BASE_HEIGHT = 1545;
        } else {
            BASE_WIDTH = 1545;
            BASE_HEIGHT = 1000;
        }

        // 2. プレビュー用の各Canvasの「内部解像度（サイズ）」を新しい向きに完全に更新
        // これにより、横型のときはCanvas自体が最初から「1545x1000」の綺麗な横長になります
        backgroundLayer.width = BASE_WIDTH;
        backgroundLayer.height = BASE_HEIGHT;
        uiLayer.width = BASE_WIDTH;
        uiLayer.height = BASE_HEIGHT;

        // 3. 縦横が変わると「画像がはみ出す限界（最小拡大率）」や中心位置が変わるため再計算
        if (imageTransform.img) {
            imageTransform.x = BASE_WIDTH / 2;
            imageTransform.y = BASE_HEIGHT / 2;

            const canvasAspect = BASE_WIDTH / BASE_HEIGHT;
            const imgAspect = imageTransform.img.width / imageTransform.img.height;

            // 黒い余白を出さないための最小スケール（倍率）を再設定
            imageTransform.minScale = (imgAspect > canvasAspect)
                ? (BASE_HEIGHT / imageTransform.img.height)
                : (BASE_WIDTH / imageTransform.img.width);

            imageTransform.scale = imageTransform.minScale;
        }

        // 4. 新しいサイズに合わせて背景（ユーザー画像含む）とUIレイヤーを綺麗に再描画
        drawUserImageLayer();
        renderCanvas();
    });
});

document.getElementById('save-btn').addEventListener('click', async () => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

    // 2. 向きとサイズ決定
    const orientation = document.querySelector('input[name="cardOrientation"]:checked').value;
    const targetWidth = (orientation === 'vertical') ? 1000 : 1545;
    const targetHeight = (orientation === 'vertical') ? 1545 : 1000;

    const originalWidth = backgroundLayer.width;
    const originalHeight = backgroundLayer.height;

    backgroundLayer.width = targetWidth;
    backgroundLayer.height = targetHeight;
    uiLayer.width = targetWidth;
    uiLayer.height = targetHeight;

    drawUserImageLayer();
    renderCanvas();

    const finalCanvas = document.createElement('canvas');
    finalCanvas.width = targetWidth;
    finalCanvas.height = targetHeight;
    const finalCtx = finalCanvas.getContext('2d');
    finalCtx.drawImage(backgroundLayer, 0, 0);
    finalCtx.drawImage(uiLayer, 0, 0);

    // プレビューを元に戻す
    backgroundLayer.width = originalWidth;
    backgroundLayer.height = originalHeight;
    uiLayer.width = originalWidth;
    uiLayer.height = originalHeight;
    drawUserImageLayer();
    renderCanvas();

    const dataURL = finalCanvas.toDataURL('image/png');

    if (isIOS) {
        // 【重要】新しいタブ/ウィンドウは一切使わず、同じページ内にオーバーレイで表示する。
        // window.open系の方法はSafari本体では動いてもアプリ内ブラウザ(Twitter/Instagram等)で
        // 白紙になることがあるため、この方式なら環境を問わず安定して動く。
        showSaveOverlay(dataURL);
    } else {
        const link = document.createElement('a');
        link.download = 'FRONT-CARD.png';
        link.href = dataURL;
        link.click();
    }
});

function showSaveOverlay(dataURL) {
    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:#000;z-index:99999;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:20px;box-sizing:border-box;';

    const hint = document.createElement('p');
    hint.textContent = '画像を長押しして保存してください';
    hint.style.cssText = 'color:#fff;font-size:14px;margin-bottom:16px;text-align:center;';

    const img = document.createElement('img');
    img.src = dataURL;
    img.style.cssText = 'max-width:100%;max-height:75vh;display:block;';

    const closeBtn = document.createElement('button');
    closeBtn.textContent = '閉じる';
    // width:240px,height:48px,margin-top:16px;padding:10px 24px;font-size:14px,
    closeBtn.style.cssText = `
        background-color: rgba(0, 250, 255, 0.25);
        color: #ffffff;
        border: 1px solid #00f0ff;
        margin-top: 16px;
        width: 240px;
        height: 48px;
        border-radius: 6px;
        font-size: 16px;
        font-family: 'Orbitron', sans-serif;
        cursor: pointer;
        box-shadow: 0 0 6px rgba(0, 0, 0, 0.6);
    `;
    closeBtn.addEventListener('click', () => overlay.remove());

    overlay.appendChild(hint);
    overlay.appendChild(img);
    overlay.appendChild(closeBtn);
    document.body.appendChild(overlay);
}

// 新しいタブに画像を書き込む。読み込みに失敗したら白紙ではなくエラー文言を表示する
function writeImageToWindow(win, src) {
    win.document.open();
    win.document.write(
        '<html><head><title>保存用画像</title></head>' +
        '<body style="margin:0;background:#000;display:flex;justify-content:center;align-items:center;min-height:100vh;">' +
        '<img id="result-img" src="' + src + '" style="max-width:100%;height:auto;display:block;">' +
        '</body></html>'
    );
    win.document.close();

    // 画像読み込み失敗時のフォールバック表示(白紙のまま固まるのを防ぐ)
    const imgEl = win.document.getElementById('result-img');
    if (imgEl) {
        imgEl.onerror = () => {
            showErrorInWindow(win, '画像の読み込みに失敗しました。お手数ですがブラウザの設定でポップアップ/JavaScriptが有効か確認してください。');
        };
    }
}

function showErrorInWindow(win, message) {
    try {
        win.document.open();
        win.document.write(
            '<body style="margin:0;background:#000;color:#fff;display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;padding:16px;text-align:center;">' +
            message +
            '</body>'
        );
        win.document.close();
    } catch (e) {
        // 何もできない場合は無視
    }
}

document.getElementById('saveBack-btn').addEventListener('click', () => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

    try {
        // canvasBack(裏面)の内容をデータURLに変換
        const dataURL = canvasBack.toDataURL('image/png');

        if (isIOS) {
            // 【重要】新しいタブは開かず、同じページ内にオーバーレイで表示する。
            // window.open系はアプリ内ブラウザ(Twitter/Instagram等)で白紙になることがあるため、
            // 表面と同じ「同一ページ内オーバーレイ」方式に統一する。
            showSaveOverlay(dataURL);
        } else {
            // Android/PCは従来通りの自動ダウンロード
            const link = document.createElement('a');
            link.download = 'REAR-CARD.png';
            link.href = dataURL;
            link.click();
        }
    } catch (error) {
        console.error("裏面保存処理中にエラーが発生しました:", error);
        alert('画像の生成に失敗しました。');
    }
});


document.getElementById('x-btn').addEventListener('click', () => {
    const shareText = '// #v_cybercard // #FF14キャラクターカード';
    const intentUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
    window.open(intentUrl, '_blank', 'noopener,noreferrer');
});