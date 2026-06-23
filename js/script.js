const generateBtn = document.getElementById('generateBtn');
const canvas = document.getElementById('cardCanvas');
const ctx = canvas.getContext('2d');
const resultImage = document.getElementById('resultImage');
const downloadNote = document.getElementById('downloadNote');

generateBtn.addEventListener('click', () => {
    const file = document.getElementById('bgImage').files[0];
    const name = document.getElementById('charName').value || '未入力';
    const server = document.getElementById('serverName').value || '未入力';
    const job = document.getElementById('mainJob').value;

    if (!file) {
        alert('背景画像をアップロードしてください！');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
            // カードの基準サイズ（横1200px × 縦630px）
            canvas.width = 1200;
            canvas.height = 630;

            // 1. 背景画像をCanvas全面に描画（トリミングしつつフィット）
            const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
            const x = (canvas.width - img.width * scale) / 2;
            const y = (canvas.height - img.height * scale) / 2;
            ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

            // 2. 文字用レイヤー（半透明の黒い座布団）
            ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
            ctx.fillRect(50, 50, 1100, 530);
            
            // 枠線（ゴールド）
            ctx.strokeStyle = '#c59b4c';
            ctx.lineWidth = 4;
            ctx.strokeRect(50, 50, 1100, 530);

            // 3. テキストの描画
            ctx.textBaseline = 'top';

            // 見出しタイトル
            ctx.fillStyle = '#c59b4c';
            ctx.font = 'bold 32px sans-serif';
            ctx.fillText('FINAL FANTASY XIV CHARACTER CARD', 90, 90);

            // キャラクター名
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 54px sans-serif';
            ctx.fillText('Name: ' + name, 90, 180);

            // サーバー名
            ctx.fillStyle = '#e0e0e0';
            ctx.font = '40px sans-serif';
            ctx.fillText('World: ' + server, 90, 280);

            // ジョブ名
            ctx.fillStyle = '#f3c66f';
            ctx.font = '40px sans-serif';
            ctx.fillText('Main Job: ' + job, 90, 380);
            
            // クレジット
            ctx.fillStyle = '#888888';
            ctx.font = '24px sans-serif';
            ctx.fillText('(C) SQUARE ENIX CO., LTD.', 820, 530);

            // 4. Canvasを画像に変換して表示
            const dataURL = canvas.toDataURL('image/png');
            resultImage.src = dataURL;
            resultImage.style.display = 'block';
            downloadNote.style.display = 'block';
            
            // 生成位置までスクロール
            resultImage.scrollIntoView({ behavior: 'smooth' });
        }
        img.src = event.target.result;
    }
    reader.readAsDataURL(file);
});