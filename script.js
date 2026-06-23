const worldData = {
    Secret: ["Secret"], 
    Elemental: ["Secret", "Carbuncle", "Kujata", "Typhon", "Atomos", "Garuda", "Tonberry", "Aegis", "Gungnir"],
    Gaia: ["Secret", "Alexander", "Bahamut", "Durandal", "Fenrir", "Ifrit", "Ridill", "Tiamat", "Ultima"],
    Mana: ["Secret", "Anima", "Chocobo", "Hades", "Ixion", "Mandragora", "Masamune", "Pandaemonium", "Titan"],
    Meteor: ["Secret", "Belias", "Mandragora", "Ramuh", "Shinryu", "Unicorn", "Valefor", "Yojimbo", "Zeromus"]
};

const dcSelect = document.getElementById('dcSelect');
const worldSelect = document.getElementById('worldSelect');
const mainJobSelect = document.getElementById('mainJob');
const canvas = document.getElementById('cardCanvas');
const ctx = canvas.getContext('2d');
const resultImage = document.getElementById('resultImage');
const canvasBack = document.getElementById('cardCanvasBack');
const ctxBack = canvasBack.getContext('2d');
const resultImageBack = document.getElementById('resultImageBack');

const themeColorPicker = document.getElementById('themeColorPicker');
const textFontFamily = document.getElementById('textFontFamily');
const textColorPicker = document.getElementById('textColorPicker');
const backCommentInput = document.getElementById('backComment');

const expansions = ["新生", "蒼天", "紅蓮", "漆黒", "暁月", "黄金"];
const allStyles = ["ストーリー", "レイド戦闘", "ギャザクラ", "SS撮影", "ハウジング", "雑談/RP", "PvP", "ミラプリ"];
const allRaces = ["Hyur", "Elezen", "Lalafell", "Miqo'te", "Roegadyn", "Au Ra", "Hrothgar", "Viera"];

let loadedImage = null;    
let cachedJobIcons = {};   

document.fonts.ready.then(() => { updateCard(); });

dcSelect.addEventListener('change', () => {
    const selectedDC = dcSelect.value;
    worldSelect.innerHTML = '';
    if (selectedDC === '') {
        worldSelect.disabled = true;
        const option = document.createElement('option');
        option.value = '';
        option.textContent = '先にDCを選択してください';
        worldSelect.appendChild(option);
        updateCard();
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
    const reader = new FileReader();
    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() { loadedImage = img; updateCard(); };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
});

function getJobIconAndRender(jobName) {
    if (cachedJobIcons[jobName]) {
        renderCanvas(cachedJobIcons[jobName]);
        return;
    }
    const img = new Image();
    img.src = `icons/${jobName}.png`; 
    img.onload = function() { cachedJobIcons[jobName] = img; renderCanvas(img); };
    img.onerror = function() { renderCanvas(null); };
}

function updateCard() { getJobIconAndRender(mainJobSelect.value); }

function getLayoutPositions(pattern, nameW, nameH, profW, profH, canvasW, canvasH) {
    const padding = 60; 
    let namePt = { x: 0, y: 0 };
    let profPt = { x: 0, y: 0 };
    if (pattern === 'A') {
        namePt.x = canvasW - nameW - padding;
        namePt.y = padding;
        profPt.x = padding;
        profPt.y = canvasH - profH - padding;
    } else {
        namePt.x = canvasW - nameW - padding;
        namePt.y = canvasH - nameH - padding;
        profPt.x = padding;
        profPt.y = padding;
    }
    return { namePt, profPt };
}

function fillTextWrapManual(targetCtx, text, x, y, maxWidth, lineHeight) {
    const lines = text.split('\n');
    let currentY = y;

    for (let i = 0; i < lines.length; i++) {
        let line = '';
        let chars = lines[i].split('');
        
        for (let j = 0; j < chars.length; j++) {
            let testLine = line + chars[j];
            let testWidth = targetCtx.measureText(testLine).width;
            
            if (testWidth > maxWidth && j > 0) {
                targetCtx.fillText(line, x, currentY);
                line = chars[j];
                currentY += lineHeight;
            } else {
                line = testLine;
            }
        }
        targetCtx.fillText(line, x, currentY);
        if (i < lines.length - 1) {
            currentY += lineHeight;
        }
    }
    return currentY - y; 
}

function getDynamicSignFontSize(targetCtx, text, targetWidth) {
    let fontSize = 200; 
    // 🆕 フォントを細く指定（lighter）
    targetCtx.font = `lighter ${fontSize}px "Meow Script", "cursive"`;
    let currentWidth = targetCtx.measureText(text).width;
    let optimizedSize = fontSize * (targetWidth / currentWidth);
    return Math.min(optimizedSize, 320);
}

function renderCanvas(jobIconImg) {
    const name = document.getElementById('charName').value || '未入力';
    const dc = dcSelect.value || '---';
    const world = worldSelect.value || '---';
    const orientation = document.querySelector('input[name="cardOrientation"]:checked').value;
    const layoutPattern = document.querySelector('input[name="layoutPattern"]:checked').value;
    const backComment = backCommentInput.value || '';
    const themeColor = themeColorPicker.value; 
    
    const backTextColorRadio = document.querySelector('input[name="backTextColor"]:checked');
    const backTextColor = backTextColorRadio ? backTextColorRadio.value : '#ffffff';
    
    const customFont = textFontFamily.value;
    const customTextColor = textColorPicker.value;

    const fontSizeSub = 20;
    const fontSizeMain = 40;

    const cardW = (orientation === 'vertical') ? 1000 : 1545;
    const cardH = (orientation === 'vertical') ? 1545 : 1000;
    const backW = 1000;
    const backH = 1545;

    canvas.width = cardW; canvas.height = cardH;
    canvasBack.width = backW; canvasBack.height = backH;

    const selectedStyles = Array.from(document.querySelectorAll('input[name="style"]:checked')).map(el => el.value);
    const selectedRaces = Array.from(document.querySelectorAll('input[name="race"]:checked')).map(el => el.value);
    const progressIndex = parseInt(document.querySelector('input[name="progress"]:checked').value, 10);

    // ==========================================
    // 🟩 【表面】レンダリング
    // ==========================================
    if (!loadedImage) { ctx.fillStyle = '#1a1a1e'; ctx.fillRect(0, 0, cardW, cardH); }
    else {
        const scale = Math.max(cardW / loadedImage.width, cardH / loadedImage.height);
        const x = (cardW - loadedImage.width * scale) / 2;
        const y = (cardH - loadedImage.height * scale) / 2;
        ctx.drawImage(loadedImage, x, y, loadedImage.width * scale, loadedImage.height * scale);
    }
    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)'; ctx.fillRect(0, 0, cardW, cardH);
    ctx.textBaseline = 'top';

    let combinedText = (dc === "Secret" && world === "Secret") ? `${name}` : (world === "Secret") ? `${name}@${dc}` : `${name}@${world}`;
    ctx.font = `bold ${fontSizeMain}px ${customFont}`;
    let nameTextWidth = ctx.measureText(combinedText).width;
    let iconSize = fontSizeMain + 6;
    let nameBlockWidth = nameTextWidth + (jobIconImg ? iconSize + 10 : 0);
    let nameBlockHeight = fontSizeMain;

    ctx.font = `bold ${fontSizeSub}px sans-serif`;
    let labelWidth = Math.max(ctx.measureText("Play Style:").width, ctx.measureText("Fav Race:").width, ctx.measureText("Progress:").width) + 12;
    let colGap = 110, rowGap = fontSizeSub + 8, blockSpacing = 15;
    let profileBlockWidth = labelWidth + (4 * colGap);
    let profileBlockHeight = (2 * rowGap) + blockSpacing + (2 * rowGap) + blockSpacing + rowGap;

    let pts = getLayoutPositions(layoutPattern, nameBlockWidth, nameBlockHeight, profileBlockWidth, profileBlockHeight, cardW, cardH);

    ctx.font = `bold ${fontSizeMain}px ${customFont}`;
    ctx.textAlign = 'left'; ctx.fillStyle = customTextColor;
    ctx.fillText(combinedText, pts.namePt.x, pts.namePt.y);
    if (jobIconImg) ctx.drawImage(jobIconImg, pts.namePt.x + nameTextWidth + 10, pts.namePt.y - 2, iconSize, iconSize);

    ctx.font = `bold ${fontSizeSub}px sans-serif`;
    let currentY = pts.profPt.y;
    ctx.fillStyle = '#a0a0a0'; ctx.fillText('Play Style:', pts.profPt.x, currentY);
    allStyles.forEach((styleName, i) => {
        let col = i % 4, row = Math.floor(i / 4);
        drawFitLightPanel(ctx, styleName, pts.profPt.x + labelWidth + (col * colGap), currentY + (row * rowGap), fontSizeSub, selectedStyles.includes(styleName), themeColor);
    });
    currentY += (2 * rowGap) + blockSpacing;
    ctx.fillStyle = '#a0a0a0'; ctx.fillText('Fav Race:', pts.profPt.x, currentY);
    allRaces.forEach((raceName, i) => {
        let col = i % 4, row = Math.floor(i / 4);
        drawFitLightPanel(ctx, raceName, pts.profPt.x + labelWidth + (col * 90), currentY + (row * rowGap), fontSizeSub, selectedRaces.includes(raceName), themeColor);
    });
    currentY += (2 * rowGap) + blockSpacing;
    ctx.fillStyle = '#a0a0a0'; ctx.fillText('Progress:', pts.profPt.x, currentY);
    expansions.forEach((expName, i) => {
        drawFitLightPanel(ctx, expName, pts.profPt.x + labelWidth + (i * 65), currentY, fontSizeSub, i <= progressIndex, themeColor);
    });
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)'; ctx.font = '16px sans-serif'; ctx.fillText('(C) SQUARE ENIX CO., LTD.', cardW - 280, cardH - 40);
    resultImage.src = canvas.toDataURL('image/png');


    // ==========================================
    // 🟨 【裏面】レンダリング
    // ==========================================
    ctxBack.fillStyle = themeColor; ctxBack.fillRect(0, 0, backW, backH);
    ctxBack.textBaseline = 'middle'; ctxBack.textAlign = 'center'; 

    ctxBack.fillStyle = backTextColor;

    // 1. FINAL FANTASY XIV
    ctxBack.font = 'bold 52px "Times New Roman", "Georgia", serif';
    ctxBack.fillText('FINAL FANTASY XIV', backW / 2, backH * 0.10);

    // 2. サイン風の名前 (🆕 font-weightを lighter にして繊細な細筆に変更)
    ctxBack.save();
    ctxBack.fillStyle = backTextColor === '#ffffff' ? 'rgba(255, 255, 255, 0.95)' : 'rgba(0, 0, 0, 0.90)';
    let dynamicSize = getDynamicSignFontSize(ctxBack, name, 900);
    ctxBack.font = `lighter ${dynamicSize}px "Meow Script", "cursive"`; 
    let signY = backH * 0.26; 
    ctxBack.translate(backW / 2, signY);
    ctxBack.rotate(-7 * Math.PI / 180); 
    ctxBack.fillText(name, 0, 0);
    ctxBack.restore();

    // 3. 自由コメント
    ctxBack.save();
    ctxBack.fillStyle = backTextColor;
    ctxBack.font = '34px "Hachi Maru Pop", sans-serif';
    let commentStartY = backH * 0.44; 
    ctxBack.translate(backW / 2, commentStartY);
    ctxBack.rotate(0.5 * Math.PI / 180); 
    let commentEndY = fillTextWrapManual(ctxBack, backComment, 0, 0, 780, 52);
    ctxBack.restore();

    // 4. 下の名前 (🆕 余白を 70px ➔ 115px に大幅拡大してゆったり配置)
    ctxBack.fillStyle = backTextColor === '#ffffff' ? 'rgba(255, 255, 255, 0.75)' : 'rgba(0, 0, 0, 0.70)';
    ctxBack.font = `bold 42px ${customFont}`;
    let finalNameY = commentStartY + commentEndY + 115; 
    ctxBack.fillText(name, backW / 2, finalNameY);

    // 5. コピーライト
    ctxBack.fillStyle = backTextColor === '#ffffff' ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)';
    ctxBack.font = '18px sans-serif';
    ctxBack.fillText('(C) SQUARE ENIX CO., LTD. All Rights Reserved.', backW / 2, backH - 60);

    resultImageBack.src = canvasBack.toDataURL('image/png');
}

function drawFitLightPanel(tCtx, text, x, y, fSize, active, tCol) {
    tCtx.save(); tCtx.font = `bold ${fSize - 2}px sans-serif`;
    let mWidth = tCtx.measureText(text).width, pX = 6, pY = 3;
    let r = parseInt(tCol.slice(1, 3), 16), g = parseInt(tCol.slice(3, 5), 16), b = parseInt(tCol.slice(5, 7), 16);
    if (active) { tCtx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.35)`; tCtx.fillRect(x - pX, y - pY, mWidth + (pX * 2), fSize + (pY * 2)); tCtx.fillStyle = '#ffffff'; }
    else { tCtx.fillStyle = 'rgba(255, 255, 255, 0.04)'; tCtx.fillRect(x - pX, y - pY, mWidth + (pX * 2), fSize + (pY * 2)); tCtx.fillStyle = 'rgba(255, 255, 255, 0.15)'; }
    tCtx.textAlign = 'left'; tCtx.fillText(text, x, y + 1); tCtx.restore();
}

document.querySelectorAll('input, select, textarea').forEach(el => {
    el.addEventListener('input', updateCard);
    el.addEventListener('change', updateCard);
});
updateCard();