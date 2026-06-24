// ==========================================
// ⚙️ 【直感的カスタマイズ設定】
// ここにまとめた数字を変更するだけで、キャンバス内の余白が自動連動します。
// ==========================================
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
    Mana: ["Secret", "Anima", "Chocobo", "Hades", "Ixion", "Mandragora", "Masamune", "Pandaemonium", "Titan"],
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
        charName: "名前 (キャラクター名)", affiliation: "所属サーバー (DC / WORLD)", mainJob: "メインジョブ",
        orientation: "▼ カード形態", optHoriz: "横型", optVert: "縦型", pattern: "▼ パターン",
        bgImage: "背景画像アップロード", playstyle: "プレイスタイル (複数選択可)", favRace: "好みの種族 (複数選択可)",
        progress: "メインストーリー進行度", comment: "裏面通信コメント", footerTerms: "利用規約"
    },
    EN: {
        charName: "Character Name", affiliation: "Affiliation Server (DC / WORLD)", mainJob: "Main Job",
        orientation: "▼ Card Style", optHoriz: "Horizontal", optVert: "Vertical", pattern: "▼ Pattern",
        bgImage: "Upload Background Image", playstyle: "Playstyle (Multiple)", favRace: "Favorite Race (Multiple)",
        progress: "Main Story Progress", comment: "Rear Transmission Comment", footerTerms: "Terms of Service"
    }
};

function updateLanguageLabels() {
    const data = uiLabels[currentLang];
    document.getElementById('lblCharName').textContent = data.charName;
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
        if (checkedStyles.includes(s.id) || (checkedStyles.length === 0 && ["ストーリー","雑談/RP","SS撮影"].includes(s.id))) chk.checked = true;
        lbl.appendChild(chk); 
        const txtSpan = document.createElement("span"); txtSpan.textContent = (currentLang === "JP") ? s.jp : s.en;
        lbl.appendChild(txtSpan); playstyleGrid.appendChild(lbl);
    });

    const checkedRaces = Array.from(document.querySelectorAll('input[name="race"]:checked')).map(el => el.value);
    const raceGrid = document.getElementById("raceGrid"); raceGrid.innerHTML = "";
    raceMaster.forEach(r => {
        const lbl = document.createElement("label"); lbl.className = "checkbox-label"; const chk = document.createElement("input"); chk.type = "checkbox"; chk.name = "race"; chk.value = r.id;
        if (checkedRaces.includes(r.id) || (checkedRaces.length === 0 && ["Lalafell","Au Ra"].includes(r.id))) chk.checked = true;
        lbl.appendChild(chk);
        const txtSpan = document.createElement("span"); txtSpan.textContent = (currentLang === "JP") ? r.jp : r.en;
        lbl.appendChild(txtSpan); raceGrid.appendChild(lbl);
    });

    const checkedProg = document.querySelector('input[name="progress"]:checked')?.value || "5";
    const progressGroup = document.getElementById("progressGroup"); progressGroup.innerHTML = "";
    progressMaster.forEach(p => {
        const lbl = document.createElement("label"); const rad = document.createElement("input"); rad.type = "radio"; rad.name = "progress"; rad.value = p.val; if (String(p.val) === String(checkedProg)) rad.checked = true;
        lbl.className = "radio-label"; lbl.appendChild(rad); 
        const txtSpan = document.createElement("span"); txtSpan.textContent = (currentLang === "JP") ? p.jp : p.en;
        lbl.appendChild(txtSpan); progressGroup.appendChild(lbl);
    });

    document.querySelectorAll('input, select, textarea').forEach(el => {
        el.removeEventListener('input', updateCard); el.addEventListener('input', updateCard); el.removeEventListener('change', updateCard); el.addEventListener('change', updateCard);
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
    // 1. 各種データの取得
    const name = document.getElementById('charName').value || 'Unknown';
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

    const cardW = (orientation === 'vertical') ? 1000 : 1545; const cardH = (orientation === 'vertical') ? 1545 : 1000;
    const backW = 1000; const backH = 1545;

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
        let maxDeltaX = (finalWidth - cardW) / 2; let maxDeltaY = (finalHeight - cardH) / 2;
        if (imgX > maxDeltaX) imgX = maxDeltaX; if (imgX < -maxDeltaX) imgX = -maxDeltaX;
        if (imgY > maxDeltaY) imgY = maxDeltaY; if (imgY < -maxDeltaY) imgY = -maxDeltaY;
        ctx.drawImage(loadedImage, (cardW - finalWidth)/2 + imgX, (cardH - finalHeight)/2 + imgY, finalWidth, finalHeight); 
        ctx.restore();
    }
    ctx.strokeStyle = themeColor; ctx.lineWidth = 5; ctx.strokeRect(20, 20, cardW - 40, cardH - 40);
    ctx.strokeStyle = alertColor; ctx.lineWidth = 1.5; ctx.strokeRect(28, 28, cardW - 56, cardH - 56);
    
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
        let col = i % 2, row = Math.floor(i / 2); 
        drawCustomCyberPanel(ctx, p.en, profPt.x + CYBER_PANEL_CONFIG.offsetX + (col * CYBER_PANEL_CONFIG.phaseColumnWidth), currentY + (row * CYBER_PANEL_CONFIG.rowHeight), CYBER_PANEL_CONFIG.fontSize, p.val <= progressVal, themeColor); 
    });
    drawCyberBarcode(ctx, 45, cardH - 110, 360, 42, themeColor, alertColor, generatedID);

    // 3. 【裏面】描画
    ctxBack.fillStyle = themeColor; ctxBack.fillRect(0, 0, backW, backH);
    ctxBack.strokeStyle = alertColor; ctxBack.lineWidth = 5; ctxBack.strokeRect(20, 20, backW - 40, backH - 40);
    ctxBack.strokeStyle = backTextColor; ctxBack.lineWidth = 1.5; ctxBack.strokeRect(28, 28, backW - 56, backH - 56);
    ctxBack.textBaseline = 'middle'; ctxBack.textAlign = 'center'; ctxBack.fillStyle = backTextColor; ctxBack.font = 'bold 50px "Orbitron", sans-serif'; ctxBack.fillText('FINAL FANTASY XIV', backW / 2, backH * 0.08);
    
    ctxBack.save(); ctxBack.fillStyle = (backTextColor === '#ffffff') ? 'rgba(255,255,255,0.95)' : 'rgba(0,0,0,0.90)';
    let signFontSize = 285; ctxBack.font = `lighter ${signFontSize}px "Meow Script", "cursive"`;
    let signMetrics = ctxBack.measureText(name).width;
    if (signMetrics > 850) { signFontSize = Math.floor(285 * (850 / signMetrics)); ctxBack.font = `lighter ${signFontSize}px "Meow Script", "cursive"`; }
    ctxBack.translate(backW / 2, backH * 0.27); ctxBack.rotate(-5 * Math.PI / 180); ctxBack.fillText(name, 0, 0); ctxBack.restore();
    
    ctxBack.save(); ctxBack.fillStyle = backTextColor; ctxBack.font = `30px ${fontForComment}`; ctxBack.textAlign = 'left'; ctxBack.textBaseline = 'top';
    wrapAndDrawText(ctxBack, backComment, (backW - 800) / 2, backH * 0.46, 800, 48); ctxBack.restore();
    
    ctxBack.fillStyle = backTextColor; ctxBack.font = `900 54px "Orbitron", sans-serif`; ctxBack.fillText(name, backW / 2, backH - 370); 
    drawCyberBarcode(ctxBack, backW / 2 - 220, backH - 110, 440, 45, alertColor, alertColor, generatedID); 

    // 4. 【QR描画】白背景なし・ドットのみを描画
    if (cachedQrSourceCanvas) {
        drawQrWithoutBase(ctx, cardW - 120 - 45, cardH - 120 - 45, 120, themeColor);
        drawQrWithoutBase(ctxBack, (backW - 130) / 2, backH - 290, 130, alertColor);
    }

    resultImage.src = canvas.toDataURL('image/png');
    resultImageBack.src = canvasBack.toDataURL('image/png');
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
    else { tCtx.fillStyle = 'rgba(0, 0, 0, 0.05)'; tCtx.fillRect(x - 6, y - 4, mWidth, fSize + 8); tCtx.fillStyle = 'rgba(0, 0, 0, 0.25)'; tCtx.fillText(text, x, y + 2); } tCtx.restore(); 
}

initPaletteUI();
updateLanguageLabels();
constructFormOptions();
updateQrAndCard();