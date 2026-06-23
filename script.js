const worldData = {
    Elemental: ["Carbuncle", "Kujata", "Typhon", "Atomos", "Garuda", "Tonberry", "Aegis", "Gungnir"],
    Gaia: ["Alexander", "Bahamut", "Durandal", "Fenrir", "Ifrit", "Ridill", "Tiamat", "Ultima"],
    Mana: ["Anima", "Chocobo", "Hades", "Ixion", "Mandragora", "Masamune", "Pandaemonium", "Titan"],
    Meteor: ["Belias", "Mandragora", "Ramuh", "Shinryu", "Unicorn", "Valefor", "Yojimbo", "Zeromus"]
};

const dcSelect = document.getElementById('dcSelect');
const worldSelect = document.getElementById('worldSelect');
const canvas = document.getElementById('cardCanvas');
const ctx = canvas.getContext('2d');
const resultImage = document.getElementById('resultImage');

const slideR = document.getElementById('slideR');
const slideG = document.getElementById('slideG');
const slideB = document.getElementById('slideB');
const colorPreview = document.getElementById('colorPreview');

// 読み込んだ画像データを保持する変数
let loadedImage = null;

// DC選択時の処理
dcSelect.addEventListener('change', () => {
    const selectedDC = dcSelect.value;
    worldSelect.innerHTML = '';

    if (selectedDC === '') {
        worldSelect.disabled = true;
        const option = document.createElement('option');
        option.value = '';
        option.textContent = '先にDCを選択してください';
        worldSelect.appendChild(option);
        updateCard(); // 再描画
        return;
    }

    worldSelect.disabled = false;
    worldData[selectedDC].forEach(world => {
        const option = document.createElement('option');
        option.value = world;
        option.textContent = world;
        worldSelect.appendChild(option);
    });
    updateCard(); // 再描画
});

// 画像ファイルの読み込み監視
document.getElementById('bgImage').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
            loadedImage = img; // 画像をメモリに保存
            updateCard();      // 描画実行
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
});

// 🎨 メインの自動再描画関数
function updateCard() {
    // フォームパーツの状態を取得
    const name = document.getElementById('charName').value || '未入力';
    const dc = dcSelect.value || '未選択';
    const world = worldSelect.value || '未選択';
    const job = document.getElementById('mainJob').value;
    const orientation = document.querySelector('input[name="cardOrientation"]:checked').value;

    const selectedStyles = Array.from(document.querySelectorAll('input[name="style"]:checked')).map(el => el.value);
    const styleText = selectedStyles.length > 0 ? selectedStyles.join(', ') : '未設定';

    const selectedRaces = Array.from(document.querySelectorAll('input[name="race"]:checked')).map(el => el.value);
    const raceText = selectedRaces.length > 0 ? selectedRaces.join(', ') : '未設定';

    const progressText = document.querySelector('input[name="progress"]:checked').value;
    const themeColor = `rgb(${slideR.value}, ${slideG.value}, ${slideB.value})`;

    // スライダーのミニプレビュー色を更新
    colorPreview.style.backgroundColor = themeColor;

    // キャンバスサイズ設定
    if (orientation === 'vertical') {
        canvas.width = 1000;
        canvas.height = 1545;
    } else {
        canvas.width = 1545;
        canvas.height = 1000;
    }

    // まだ背景画像がない場合は、仮の背景（黒）でカードを生成する
    if (!loadedImage) {
        ctx.fillStyle = '#1a1a1e';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else {
        // 画像がある場合はフィット描画
        const scale = Math.max(canvas.width / loadedImage.width, canvas.height / loadedImage.height);
        const x = (canvas.width - loadedImage.width * scale) / 2;
        const y = (canvas.height - loadedImage.height * scale) / 2;
        ctx.drawImage(loadedImage, x, y, loadedImage.width * scale, loadedImage.height * scale);
    }

    // 控えめな半透明の黒幕
    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // テーマカラーの外枠
    ctx.strokeStyle = themeColor;
    ctx.lineWidth = 6;
    ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);

    ctx.textBaseline = 'top';

    // レイアウトの自動計算
    let startX = 80;
    let startY = 80;
    let lineGap = (orientation === 'vertical') ? 160 : 110; 
    let fontSizeTitle = 28;
    let fontSizeMain = 48;
    let fontSizeSub = 36;

    if (orientation === 'vertical') {
        fontSizeTitle = 32;
        fontSizeMain = 56;
        fontSizeSub = 40;
        startY = 120;
    }

    // 1. タイトル
    ctx.fillStyle = themeColor;
    ctx.font = `bold ${fontSizeTitle}px sans-serif`;
    ctx.fillText('FINAL FANTASY XIV CHARACTER CARD', startX, startY);

    // 2. キャラクター名
    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${fontSizeMain}px sans-serif`;
    ctx.fillText('Name: ' + name, startX, startY + lineGap * 1);

    // 3. ワールド
    ctx.fillStyle = '#e0e0e0';
    ctx.font = `${fontSizeSub}px sans-serif`;
    ctx.fillText('World: ' + dc + ' / ' + world, startX, startY + lineGap * 2);

    // 4. メインジョブ
    ctx.fillStyle = '#ffffff';
    ctx.font = `${fontSizeSub}px sans-serif`;
    ctx.fillText('Main Job: ' + job, startX, startY + lineGap * 3);
    
    // 5. プレイスタイル
    ctx.fillStyle = '#e0e0e0';
    ctx.font = `${fontSizeSub}px sans-serif`;
    ctx.fillText('Play Style: ' + styleText, startX, startY + lineGap * 4);

    // 6. 好きな種族
    ctx.fillStyle = '#e0e0e0';
    ctx.font = `${fontSizeSub}px sans-serif`;
    ctx.fillText('Favorite Race: ' + raceText, startX, startY + lineGap * 5);

    // 7. ストーリー進行度
    ctx.fillStyle = themeColor;
    ctx.font = `bold ${fontSizeSub}px sans-serif`;
    ctx.fillText('Progress: ' + progressText, startX, startY + lineGap * 6);
    
    // コピーライト
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = '20px sans-serif';
    ctx.fillText('(C) SQUARE ENIX CO., LTD.', canvas.width - 340, canvas.height - 70);

    // プレビューイメージを即座に更新
    resultImage.src = canvas.toDataURL('image/png');
}

// フォーム内の全てのパーツに入力された瞬間（または変更された瞬間）にupdateCardを実行する
document.querySelectorAll('input[type="text"], input[type="radio"], input[type="checkbox"], input[type="range"], select').forEach(element => {
    element.addEventListener('input', updateCard);
    element.addEventListener('change', updateCard);
});

// 初回起動時にも一度描画を走らせてプレビュー枠を準備しておく
updateCard();