// ==========================================
// ⚙️ 【直感的カスタマイズ設定】
// ここにまとめた数字を変更するだけで、キャンバス内の余白が自動連動します。
// ==========================================
let colorDebounceTimer = null; // カラーピッカーの間引き用タイマー
const CYBER_PANEL_CONFIG = {
    fontSize: 24,            // 点灯式パネルの文字サイズ

    // ↕️ 縦の間隔（上下の詰まり・くっつきを解消する行間）
    rowHeight: 40,           // 以前の48pxよりさらに少し広げて余裕を持たせました

    // ↔️ 横の間隔（各項目が右隣と被らないための列の幅）
    styleColumnWidth: 160,   // PLAY_STYLE（3列）の1列あたりの横幅
    raceColumnWidth: 120,    // FAV_RACE（4列）の1列あたりの横幅
    phaseColumnWidth: 120,   // MSQ_PHASE（2列）の1列あたりの横幅
    
    // 🔠 ラベルからパネル開始位置までの左マージン
    offsetX: 160             // PLAY_STYLE: 等の文字から右にどれだけ離すか
};
// ==========================================



// 1. マスターデータ
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
    { id: "ストーリー", jp: "ストーリー", en: "STORY" }, { id: "雑談/RP", jp: "雑談/RP", en: "CHAT/RP" },
    { id: "ミラプリ", jp: "ミラプリ", en: "GLAMOUR" }, { id: "ハウジング", jp: "ハウジング", en: "HOUSING" },
    { id: "SS撮影", jp: "SS撮影", en: "SCREENSHOT" }, { id: "PvP", jp: "PvP", en: "PVP" },
    { id: "ギャザクラ", jp: "ギャザクラ", en: "CRAFT/GATHER" }, { id: "レイド戦闘", jp: "レイド戦闘", en: "RAID/BATTLE" }
];
const raceMaster = [
    { id: "Hyur", jp: "ヒューラン", en: "Hyur" }, { id: "Elezen", jp: "エレゼン", en: "Elezen" },
    { id: "Lalafell", jp: "ララフェル", en: "Lalafell" }, { id: "Miqo'te", jp: "ミコッテ", en: "Miqo'te" },
    { id: "Roegadyn", jp: "ルガディン", en: "Roegadyn" }, { id: "Au Ra", jp: "アウラ", en: "Au Ra" },
    { id: "Hrothgar", jp: "ロスガル", en: "Hrothgar" }, { id: "Viera", jp: "ヴィエラ", en: "Viera" }
];
const progressMaster = [
    { val: 0, jp: "新生(2.X)", en: "ARR (2.X)" }, { val: 1, jp: "蒼天(3.X)", en: "HW (3.X)" },
    { val: 2, jp: "紅蓮(4.X)", en: "SB (4.X)" }, { val: 3, jp: "漆黒(5.X)", en: "ShB (5.X)" },
    { val: 4, jp: "暁月(6.X)", en: "EW (6.X)" }, { val: 5, jp: "黄金(7.X)", en: "DT (7.X)" }
];

const neonPalettes = [
    { label: "CYAN", c1: "#00f0ff", c2: "#ff007f" }, { label: "SOL_9",  c1: "#ff00a0", c2: "#00f0ff" },
    { label: "TOKYO",  c1: "#9900ff", c2: "#00ff66" }, { label: "MATRIX", c1: "#33ff33", c2: "#ff9900" },
    { label: "GOLD",   c1: "#ffaa00", c2: "#00e5ff" }, { label: "VIOLET", c1: "#d500f9", c2: "#ffff00" },
    { label: "CRIMSN", c1: "#ff0055", c2: "#00ffff" }, { label: "LIGHT",  c1: "#707880", c2: "#131619" }
];

const worldData = {
    Secret: ["Secret"], 
    Elemental: ["Secret", "Aegis", "Atomos", "Carbuncle", "Garuda", "Gungnir", "Kujata", "Tonberry", "Typhon"],
    Gaia: ["Secret", "Alexander", "Bahamut", "Durandal", "Fenrir", "Ifrit", "Ridill", "Tiamat", "Ultima"],
    Mana: ["Secret", "Anima", "Asura", "Chocobo", "Hades", "Ixion", "Mandragora", "Masamune", "Pandaemonium", "Titan"],
    Meteor: ["Secret", "Belias", "Mandragora", "Ramuh", "Shinryu", "Unicorn", "Valefor", "Yojimbo", "Zeromus"]
};

let currentLang = "JP"; 

// DOM取得
const dcSelect = document.getElementById('dcSelect'); const worldSelect = document.getElementById('worldSelect');
const mainJobSelect = document.getElementById('mainJob'); const canvas = document.getElementById('cardCanvas');
const ctx = canvas.getContext('2d'); const resultImage = document.getElementById('resultImage');
const canvasBack = document.getElementById('cardCanvasBack'); const ctxBack = canvasBack.getContext('2d');
const resultImageBack = document.getElementById('resultImageBack');
const themeColorPicker = document.getElementById('themeColorPicker'); const themeColorPicker2 = document.getElementById('themeColorPicker2'); 
const textFontName = document.getElementById('textFontName'); const textFontComment = document.getElementById('textFontComment');
const backCommentInput = document.getElementById('backComment'); const xTwitterIDInput = document.getElementById('xTwitterID');
const hiddenQrContainer = document.getElementById('hiddenQrContainer');

const generatedID = `NC-ID-${Math.floor(100000 + Math.random() * 900000)}-SYS`;

let loadedImage = null; 
let imgX = 0; let imgY = 0; let imgScale = 1.0; 
let isDragging = false; let startMouseX = 0; let startMouseY = 0; 
let cachedQrSourceCanvas = null;

function getAutomaticBackTextColor(hexColor) {
    let r = parseInt(hexColor.slice(1, 3), 16); let g = parseInt(hexColor.slice(3, 5), 16); let b = parseInt(hexColor.slice(5, 7), 16);
    let hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));
    return (hsp > 127.5) ? '#131619' : '#ffffff';
}

function initPaletteUI() {
    const container = document.getElementById('paletteContainer'); container.innerHTML = "";
    neonPalettes.forEach(p => {
        const btn = document.createElement('button'); btn.type = "button"; btn.className = "palette-btn"; btn.title = p.label;
        const preview = document.createElement('div'); preview.className = "palette-preview";
        const c1 = document.createElement('div'); c1.className = "palette-color"; c1.style.backgroundColor = p.c1;
        const c2 = document.createElement('div'); c2.className = "palette-color"; c2.style.backgroundColor = p.c2;
        preview.appendChild(c1); preview.appendChild(c2);
        const label = document.createElement('span'); label.className = "palette-label"; label.textContent = p.label;
        btn.appendChild(preview); btn.appendChild(label);
        btn.addEventListener('click', () => { themeColorPicker.value = p.c1; themeColorPicker2.value = p.c2; updateCard(); });
        container.appendChild(btn);
    });
}

const uiLabels = {
    JP: {
        charName: "表示する名前", affiliation: "サーバー", mainJob: "メインジョブ",
        xTwitterID: "X (Twitter) @ユーザーID",
        orientation: "▼ カードの向き", optVert: "縦型", optHoriz: "横型", pattern: "▼ パターン",
        bgImage: "背景画像アップロード", playstyle: "プレイスタイル (複数選択可)", favRace: "好きな種族 (複数選択可)",
        progress: "メインストーリー進行度", comment: "裏面のコメント", footerTerms: "利用規約"
    },
    EN: {
        charName: "Character Name", affiliation: "Server", mainJob: "Main Job",
        xTwitterID: "X (Twitter) @User ID (for QR Code)",
        orientation: "▼ Card Style", optHoriz: "Horizontal", optVert: "Vertical", pattern: "▼ Pattern",
        bgImage: "Upload Background Image", playstyle: "Playstyle (Multiple)", favRace: "Favorite Race (Multiple)",
        progress: "Main Story Progress", comment: "Rear Transmission Comment", footerTerms: "Terms of Service"
    }
};

function updateLanguageLabels() {
    const data = uiLabels[currentLang];
    document.getElementById('lblCharName').textContent = data.charName;
    document.getElementById('lblXID').textContent = data.xTwitterID;
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
    document.getElementById('lblFooterTerms').textContent = data.footerTerms;
}

function constructFormOptions() {
    const savedJob = mainJobSelect.value; mainJobSelect.innerHTML = "";
    const roleLabels = { JP: { TANK: "タンク", HEALER: "ヒーラー", MELEE_DPS: "近接", PHYSICAL_RANGED_DPS: "遠隔物理", MAGIC_CASTER_DPS: "遠隔魔法" }, EN: { TANK: "TANK", HEALER: "HEALER", MELEE_DPS: "MELEE", PHYSICAL_RANGED_DPS: "PHYS.RANGED", MAGIC_CASTER_DPS: "MAG.CASTER" } };
    
    Object.keys(jobMasterCategorized).forEach(roleKey => {
        const grp = document.createElement("optgroup"); grp.label = roleLabels[currentLang][roleKey];
        jobMasterCategorized[roleKey].forEach(j => {
            const o = document.createElement("option"); o.value = j.id;
            o.textContent = (currentLang === "JP") ? `${j.jp} (${j.code})` : `${j.en} (${j.code})`;
            if (j.id === savedJob) o.selected = true; grp.appendChild(o);
        });
        mainJobSelect.appendChild(grp);
    });
    if(!mainJobSelect.value) mainJobSelect.value = "侍";

    const checkedStyles = Array.from(document.querySelectorAll('input[name="style"]:checked')).map(el => el.value);
    const playstyleGrid = document.getElementById("playstyleGrid"); playstyleGrid.innerHTML = "";
    styleMaster.forEach(s => {
        const lbl = document.createElement("label"); lbl.className = "checkbox-label"; const chk = document.createElement("input"); chk.type = "checkbox"; chk.name = "style"; chk.value = s.id;
        if (checkedStyles.includes(s.id) || (checkedStyles.length === 0 && [].includes(s.id))) chk.checked = true;
        lbl.appendChild(chk); 
        const txtSpan = document.createElement("span"); txtSpan.textContent = (currentLang === "JP") ? s.jp : s.en;
        lbl.appendChild(txtSpan); playstyleGrid.appendChild(lbl);
    });

    const checkedRaces = Array.from(document.querySelectorAll('input[name="race"]:checked')).map(el => el.value);
    const raceGrid = document.getElementById("raceGrid"); raceGrid.innerHTML = "";
    raceMaster.forEach(r => {
        const lbl = document.createElement("label"); lbl.className = "checkbox-label"; const chk = document.createElement("input"); chk.type = "checkbox"; chk.name = "race"; chk.value = r.id;
        if (checkedRaces.includes(r.id) || (checkedRaces.length === 0 && [].includes(r.id))) chk.checked = true;
        lbl.appendChild(chk);
        const txtSpan = document.createElement("span"); txtSpan.textContent = (currentLang === "JP") ? r.jp : r.en;
        lbl.appendChild(txtSpan); raceGrid.appendChild(lbl);
    });

    const checkedProg = document.querySelector('input[name="progress"]:checked')?.value || "0";
    const progressGroup = document.getElementById("progressGroup"); progressGroup.innerHTML = "";
    progressMaster.forEach(p => {
        const lbl = document.createElement("label"); const rad = document.createElement("input"); rad.type = "radio"; rad.name = "progress"; rad.value = p.val; if (String(p.val) === String(checkedProg)) rad.checked = true;
        lbl.className = "radio-label"; lbl.appendChild(rad); 
        const txtSpan = document.createElement("span"); txtSpan.textContent = (currentLang === "JP") ? p.jp : p.en;
        lbl.appendChild(txtSpan); progressGroup.appendChild(lbl);
    });

    // 各フォーム要素への一括イベント登録
    document.querySelectorAll('input, select, textarea').forEach(el => {
        if (el.id === 'themeColorPicker' || el.id === 'themeColorPicker2') {
            // グリグリ動かしている最中(input)に、タイマーを使って描画を間引く
            el.removeEventListener('input', () => {}); // 念のため初期化
            el.addEventListener('input', () => {
                clearTimeout(colorDebounceTimer);
                // ⏱️ マウスの動きが「200ミリ秒（0.2秒）」止まったら自動で描画を実行
                colorDebounceTimer = setTimeout(() => {
                    updateCard();
                }, 200);
            });
            // パレットを閉じた時のための保険
            el.removeEventListener('change', updateCard);
            el.addEventListener('change', updateCard);
        } else {
            el.removeEventListener('input', updateCard);  el.addEventListener('input', updateCard);
            el.removeEventListener('change', updateCard); el.addEventListener('change', updateCard);
        }
    });
}

document.getElementById('btnLangJP').addEventListener('click', () => {
    currentLang = "JP";
    document.getElementById('btnLangJP').classList.add('active');
    document.getElementById('btnLangEN').classList.remove('active');
    updateLanguageLabels(); constructFormOptions(); updateCard();
});
document.getElementById('btnLangEN').addEventListener('click', () => {
    currentLang = "EN";
    document.getElementById('btnLangEN').classList.add('active');
    document.getElementById('btnLangJP').classList.remove('active');
    updateLanguageLabels(); constructFormOptions(); updateCard();
});

dcSelect.addEventListener('change', () => {
    const selectedDC = dcSelect.value; worldSelect.innerHTML = '';
    if (selectedDC === '') { worldSelect.disabled = true; return; }
    worldSelect.disabled = false; worldData[selectedDC].forEach(world => { const option = document.createElement('option'); option.value = world; option.textContent = world; worldSelect.appendChild(option); }); updateCard();
});

document.getElementById('bgImage').addEventListener('change', (e) => {
    const file = e.target.files[0]; if (!file) return;
    document.getElementById('file-upload-text').textContent = file.name.toUpperCase();
    const reader = new FileReader(); reader.onload = function(event) { const img = new Image(); img.onload = function() { loadedImage = img; imgX = 0; imgY = 0; imgScale = 1.0; updateCard(); }; img.src = event.target.result; }; reader.readAsDataURL(file);
});

function getClientXY(e) {
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: clientX, y: clientY };
}

function handleStart(e) {
    if (!e.target.classList.contains('interactive-front')) return;
    if (!loadedImage) return; 
    isDragging = true; const pos = getClientXY(e); startMouseX = pos.x - imgX; startMouseY = pos.y - imgY; if (e.cancelable) e.preventDefault();
}

function handleMove(e) {
    if (!isDragging) return; const pos = getClientXY(e); imgX = pos.x - startMouseX; imgY = pos.y - startMouseY; updateCard();
}

function handleEnd() { isDragging = false; }

resultImage.addEventListener('mousedown', handleStart); resultImage.addEventListener('touchstart', handleStart, { passive: false });
window.addEventListener('mousemove', handleMove); window.addEventListener('touchmove', handleMove, { passive: false });
window.addEventListener('mouseup', handleEnd); window.addEventListener('touchend', handleEnd);

resultImage.addEventListener('wheel', (e) => { 
    if (!loadedImage) return; e.preventDefault(); 
    if (e.deltaY < 0) { imgScale *= 1.04; } else { imgScale /= 1.04; }
    if (imgScale < 1.0) imgScale = 1.0; 
    updateCard();
}, { passive: false });

function updateQrAndCard() {
    const rawID = xTwitterIDInput.value.trim().replace('@', ''); if (!rawID) { cachedQrSourceCanvas = null; updateCard(); return; }
    hiddenQrContainer.innerHTML = "";
    // 安定して機能していた元の生成設定
    new QRCode(hiddenQrContainer, { text: `https://x.com/${rawID}`, width: 120, height: 120, colorDark: "#000000", colorLight: "#ffffff", correctLevel: QRCode.CorrectLevel.H });
    setTimeout(() => { const qrCanvasElement = hiddenQrContainer.querySelector('canvas'); if (qrCanvasElement) { cachedQrSourceCanvas = qrCanvasElement; updateCard(); } }, 80);
}
xTwitterIDInput.addEventListener('change', updateQrAndCard); xTwitterIDInput.addEventListener('input', updateQrAndCard);

function updateCard() { renderCanvas(); }

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

function renderCanvas() {
    // ... (前略：データの取得やキャンバスサイズ、背景画像描画などは同じ)
    const name = document.getElementById('charName').value || 'Cellica Flame';
    const dc = dcSelect.value || '---'; const world = worldSelect.value || '---';
    const orientation = document.querySelector('input[name="cardOrientation"]:checked').value;
    const layoutPattern = document.querySelector('input[name="layoutPattern"]:checked').value;
    const backComment = backCommentInput.value || '';
    const themeColor = themeColorPicker.value; const alertColor = themeColorPicker2.value; 
    const backTextColor = getAutomaticBackTextColor(themeColor);
    const fontForName = textFontName.value; const fontForComment = textFontComment.value;

    let targetJobObj = { code: "N/A", en: "UNKNOWN" };
    Object.keys(jobMasterCategorized).forEach(rk => {
        const found = jobMasterCategorized[rk].find(j => j.id === mainJobSelect.value); if(found) targetJobObj = found;
    });

    const cardW = (orientation === 'vertical') ? 1000 : 1545; 
    const cardH = (orientation === 'vertical') ? 1545 : 1000;
    const backW = cardW; 
    const backH = cardH;

    canvas.width = cardW; canvas.height = cardH; canvasBack.width = backW; canvasBack.height = backH;

    const selectedStylesIDs = Array.from(document.querySelectorAll('input[name="style"]:checked')).map(el => el.value);
    const selectedRacesIDs = Array.from(document.querySelectorAll('input[name="race"]:checked')).map(el => el.value);
    const progressVal = parseInt(document.querySelector('input[name="progress"]:checked')?.value || "0", 10);

// 2. 【表面】描画
    ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, cardW, cardH);
    if (loadedImage) {
        ctx.save();
        const minScaleX = cardW / loadedImage.width; const minScaleY = cardH / loadedImage.height; const baseScale = Math.max(minScaleX, minScaleY);
        const finalWidth = loadedImage.width * baseScale * imgScale; const finalHeight = loadedImage.height * baseScale * imgScale;
        ctx.drawImage(loadedImage, (cardW - finalWidth)/2 + imgX, (cardH - finalHeight)/2 + imgY, finalWidth, finalHeight); 
        ctx.restore();
    }

    // ⚡【表面】レイアウトパターン連動で1箇所だけにツインウェーブ目盛りを配置
    let surfaceWavePt = { x: 105, y: 175 }; // デフォルト：パターンA（左上）
    if (layoutPattern === 'B') {
        surfaceWavePt = { x: cardW - 105, y: 105 }; // パターンB（右上）
    }
    drawCyberTwinWaveScale(ctx, surfaceWavePt.x, surfaceWavePt.y, alertColor);

    ctx.strokeStyle = themeColor; ctx.lineWidth = 5; ctx.strokeRect(20, 20, cardW - 40, cardH - 40);
    ctx.strokeStyle = alertColor; ctx.lineWidth = 1.5; ctx.strokeRect(28, 28, cardW - 56, cardH - 56);    
    // ... (中略：ステータスや文字、バーコードなどの描画はそのまま)
    ctx.textBaseline = 'top'; ctx.fillStyle = themeColor; ctx.font = '900 24px "Orbitron", sans-serif'; ctx.textAlign = 'left';
    ctx.fillText('NEO CITIZEN IDENTIFICATION CARD /////', 45, 45);
    ctx.fillStyle = alertColor; ctx.font = 'bold 16px "Share Tech Mono", monospace'; ctx.fillText(`ID_NO: ${generatedID}`, 45, 75);

    let padding = 70; let namePt = { x: cardW - padding, y: cardH - 350 }; let profPt = { x: padding, y: padding + 120 };
    if (orientation === 'vertical') { namePt.y = cardH - 450; profPt.y = padding + 160; }
    if (layoutPattern === 'A') { namePt.y = padding + 60; profPt.y = (orientation === 'horizontal') ? cardH - 560 : cardH - 580; }

    ctx.textAlign = 'right'; ctx.fillStyle = alertColor; ctx.font = `900 70px ${fontForName}`; ctx.fillText(name, namePt.x, namePt.y);
    ctx.fillStyle = themeColor; ctx.font = '900 32px "Orbitron", sans-serif'; ctx.fillText(`JOB: [ ${targetJobObj.en} ]`, namePt.x, namePt.y + 85); 
    ctx.fillStyle = '#a0aab5'; ctx.font = 'bold 22px "Share Tech Mono", monospace'; ctx.fillText(`SECTOR: ${dc} // NODE: ${world}`, namePt.x, namePt.y + 125); 

    ctx.font = `bold ${CYBER_PANEL_CONFIG.fontSize}px "Share Tech Mono", monospace`; 
    let currentY = profPt.y; ctx.textAlign = 'left';
    ctx.fillStyle = alertColor; ctx.fillText('PLAY_STYLE:', profPt.x, currentY);
    styleMaster.forEach((s, i) => { 
        let col = i % 3, row = Math.floor(i / 3); 
        drawCustomCyberPanel(ctx, s.en, profPt.x + CYBER_PANEL_CONFIG.offsetX + (col * CYBER_PANEL_CONFIG.styleColumnWidth), currentY + (row * CYBER_PANEL_CONFIG.rowHeight), CYBER_PANEL_CONFIG.fontSize, selectedStylesIDs.includes(s.id), themeColor); 
    });
    currentY += (Math.ceil(styleMaster.length / 3) * CYBER_PANEL_CONFIG.rowHeight) + 40; 
    ctx.fillStyle = alertColor; ctx.fillText('FAV_RACE:', profPt.x, currentY);
    raceMaster.forEach((r, i) => { 
        let col = i % 4, row = Math.floor(i / 4); 
        drawCustomCyberPanel(ctx, r.en, profPt.x + CYBER_PANEL_CONFIG.offsetX + (col * CYBER_PANEL_CONFIG.raceColumnWidth), currentY + (row * CYBER_PANEL_CONFIG.rowHeight), CYBER_PANEL_CONFIG.fontSize, selectedRacesIDs.includes(r.id), themeColor); 
    });
    currentY += (Math.ceil(raceMaster.length / 4) * CYBER_PANEL_CONFIG.rowHeight) + 30; 
    ctx.fillStyle = alertColor; ctx.fillText('MSQ_PHASE:', profPt.x, currentY);
    progressMaster.forEach((p, i) => { 
        let col = i % 3, row = Math.floor(i / 3); 
        drawCustomCyberPanel(ctx, p.en, profPt.x + CYBER_PANEL_CONFIG.offsetX + (col * CYBER_PANEL_CONFIG.phaseColumnWidth), currentY + (row * CYBER_PANEL_CONFIG.rowHeight), CYBER_PANEL_CONFIG.fontSize, p.val <= progressVal, themeColor); 
    });
    drawCyberBarcode(ctx, 45, cardH - 110, 360, 42, themeColor, alertColor, generatedID);

// 3. 【裏面】描画
    ctxBack.fillStyle = themeColor; ctxBack.fillRect(0, 0, backW, backH);
    ctxBack.strokeStyle = alertColor; ctxBack.lineWidth = 5; ctxBack.strokeRect(20, 20, backW - 40, backH - 40);
    ctxBack.strokeStyle = backTextColor; ctxBack.lineWidth = 1.5; ctxBack.strokeRect(28, 28, backW - 56, backH - 56);
    
    // ⚡【裏面】縦型と横型で数値を切り替えて1箇所だけに配置
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

    ctxBack.textBaseline = 'middle'; ctxBack.textAlign = 'center'; ctxBack.fillStyle = alertColor;
    ctxBack.font = 'bold 50px "Orbitron", sans-serif'; ctxBack.fillText('FINAL FANTASY XIV', backW / 2, backH * 0.15);
    
ctxBack.save(); ctxBack.fillStyle = (backTextColor === '#ffffff') ? 'rgba(255,255,255,0.95)' : 'rgba(0,0,0,0.90)';
    let signFontSize = 300; 
    const maxSignWidth = backW * 0.8; // ⚡ これ以上はみ出してほしくない最大横幅（裏面幅の80%）

    // まずは最大の大きさ(300px)でフォントを設定
    ctxBack.font = `lighter ${signFontSize}px "Meow Script", "cursive"`;

    // ⚡ 文字の横幅を測定し、最大幅（裏面の8割）を超える場合は自動で小さくする
    // 元のサイズが大きいため、3pxずつ高速に削り落とします（最低40pxでストップ）
    while (ctxBack.measureText(name).width > maxSignWidth && signFontSize > 40) {
        signFontSize -= 3;
        ctxBack.font = `lighter ${signFontSize}px "Meow Script", "cursive"`;
    }

    ctxBack.translate(backW / 2, backH * 0.45); ctxBack.rotate(-2 * Math.PI / 180); ctxBack.fillText(name, 0, 0); ctxBack.restore();    
    ctxBack.save(); ctxBack.fillStyle = backTextColor; ctxBack.font = `30px ${fontForComment}`; ctxBack.textAlign = 'center'; ctxBack.textBaseline = 'top';
    wrapAndDrawText(ctxBack, backComment, backW / 2, backH * 0.65, 800, 48); ctxBack.restore();
    
    ctxBack.fillStyle = backTextColor; ctxBack.font = `900 54px "Orbitron", sans-serif`; ctxBack.fillText(name, backW / 2, backH * 0.85); 
    drawCyberBarcode(ctxBack, backW / 2 - 220, backH - 110, 440, 45, alertColor, alertColor, generatedID); 

    if (cachedQrSourceCanvas) {
        drawQrWithoutBase(ctx, cardW - 120 - 45, cardH - 120 - 45, 120, themeColor);
        drawQrWithoutBase(ctxBack, backW - 130 - 45, backH - 130 - 45, 130, alertColor);
    }
    resultImage.src = canvas.toDataURL('image/png');
    resultImageBack.src = canvasBack.toDataURL('image/png');
}

// （ここに先ほどの drawCyberTwinWaveScale(targetCtx, cx, cy, color) 関数を貼り付けてください）

// ⭕ 最終リファイン：内側増量高密度・11時開放・3点局所電撃＆全体さざ波システム
function drawCyberTwinWaveScale(targetCtx, cx, cy, color) {
    targetCtx.save();
    targetCtx.strokeStyle = color;
    targetCtx.lineWidth = 3.5; 
    targetCtx.globalAlpha = 0.9;

    // --- コンパクトサイズ＆超内側近接パラメーター ---
    const innerTickCount = 48;   // ⚡ 内側の目盛り数を36から48に増量して高密度化
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
        if (finalWaveLength < 6)  finalWaveLength = 6;  
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
            data[i] = r; data[i + 1] = g; data[i + 2] = b;
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
            data[i] = r; data[i + 1] = g; data[i + 2] = b;
        }
    }
    tCtx.putImageData(imgData, 0, 0);
    targetCtx.drawImage(tempCanvas, x, y, size, size);
}



function drawCyberBarcode(targetCtx, x, y, width, height, color, subColor, codeText) {
    targetCtx.save(); 
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
        targetCtx.font = 'bold 14px "Share Tech Mono", monospace';
        targetCtx.textAlign = 'center';
        targetCtx.textBaseline = 'top';
        targetCtx.fillText(codeText, x + (width / 2), y + height + 8);
    }
    targetCtx.restore();
}

function drawCustomCyberPanel(tCtx, text, x, y, fSize, active, tCol) { 
    tCtx.save(); tCtx.font = `bold ${fSize - 4}px "Share Tech Mono", monospace`; let mWidth = tCtx.measureText(text).width + 12;
    if (active) { tCtx.fillStyle = tCol; tCtx.fillRect(x - 6, y - 4, mWidth, fSize + 8); tCtx.fillStyle = (getAutomaticBackTextColor(tCol) === '#ffffff') ? '#000000' : '#ffffff'; tCtx.fillText(text, x, y + 2); } 
    else { tCtx.fillStyle = 'rgba(0, 0, 0, 0.25)'; tCtx.fillRect(x - 6, y - 4, mWidth, fSize + 8); tCtx.fillStyle = 'rgba(255, 255, 255, 0.45)'; tCtx.fillText(text, x, y + 2); } tCtx.restore(); 
}

initPaletteUI();
updateLanguageLabels();
constructFormOptions();
updateQrAndCard();



// ========================================================
// 📱 スマホ用：元の位置を残したまま、独立したオーバーレイプレビューを表示（スクロール完全ロック版）
// ========================================================
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

    // ⚡「プレビューを表示」ボタンタップ時の処理
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
        overlay.appendChild(closeBtn);

        // 4. 元のプレビュー画像（最新の状態のもの）を探して複製(clone)してオーバーレイに突っ込む
        const originalFront = document.getElementById("resultImage");
        const originalBack = document.getElementById("resultImageBack");

        if (originalFront) {
            const cloneFront = originalFront.cloneNode(true);
            cloneFront.removeAttribute("id"); // IDの重複を避ける
            overlay.appendChild(cloneFront);
        }
        if (originalBack) {
            const cloneBack = originalBack.cloneNode(true);
            cloneBack.removeAttribute("id");
            overlay.appendChild(cloneBack);
        }

        // 5. 画面にオーバーレイを表示
        document.body.appendChild(overlay);
        
        // ⚡ 【重要】背後のメニューがスクロールするのを絶対に防ぐため、htmlとbodyの両方をロック
        document.documentElement.style.overflow = "hidden";
        document.body.style.overflow = "hidden";

        // 6. 「閉じる」タップ時の処理
        closeBtn.addEventListener("click", () => {
            overlay.remove(); // オーバーレイを消去
            
            // ⚡ 【重要】プレビューが閉じたので、htmlとbodyのスクロールロックを解除
            document.documentElement.style.overflow = "";
            document.body.style.overflow = "";
            
            // プレビュー画面が閉じられたので、「プレビューを表示」ボタンを再表示する
            triggerBtn.classList.remove("is-hidden");
        });
    });
});