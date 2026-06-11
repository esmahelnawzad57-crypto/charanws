// script.js - کۆدی ڕێکخراو بۆ کارپێکردنی دوگمەکانی وێبسایتەکە

// ١. ئەگەر ویستت AI پرسیارێکت بۆ پێشنیاز بکات (دوگمەی یەکەم)
async function generateAIQuestion() {
    const questionInput = document.getElementById('questionInput');
    const sendBtn = document.getElementById('sendBtn');
    
    if (questionInput) questionInput.value = "🚨 AI خەریکە بیر دەکاتەوە و پرسیار دروست دەکات...";

    try {
        const response = await fetch('/api/game', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'generate_question' })
        });
        const data = await response.json();
        
        if (data.question) {
            questionInput.value = data.question;
            // کاتێک پرسیارەکە ئامادە بوو، دوگمەی دووەم (ناردن) پیشان دەدات
            if (sendBtn) sendBtn.style.display = 'block';
        } else {
            alert('کێشەیەک لە دروستکردنی پرسیار هەبوو لە لایەن AI.');
        }
    } catch (error) {
        alert('کێشەیەک لە پەیوەندیگرتن بە سێرڤەر هەبوو.');
    }
}

// ٢. ناردنی پرسیارەکە بۆ هەر ٧ هاوڕێکەت (چ خۆت نووسیبێتت یان AI دروستی کردبێت)
async function sendQuestionToAll() {
    const questionText = document.getElementById('questionInput').value.trim();
    const statusBox = document.getElementById('statusMessage');
    
    // ڕێگری دەکات لە ناردنی دەقی بەتاڵ
    if (!questionText || questionText.startsWith("🚨")) {
        alert("تکایە سەرەتا پرسیارێک بنووسە یان کلیک لە دروستکردنی پرسیار بە AI بکە!");
        return;
    }

    if (statusBox) {
        statusBox.style.display = "block";
        statusBox.className = "status-box info";
        statusBox.innerText = "⏳ خەریکە لینکەکان بۆ هەر ٧ هاوڕێکەت دەنێردرێت لە تێلێگرام...";
    }

    try {
        const response = await fetch('/api/game', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'start_game', question: questionText })
        });
        const data = await response.json();
        
        if (data.success) {
            if (statusBox) {
                statusBox.className = "status-box success";
                statusBox.innerText = "✅ لینکەکان بە سەرکەوتوویی بۆ هەر ٧ هاوڕێکەت نێردران لە تێلێگرام!";
            }
        } else {
            if (statusBox) {
                statusBox.className = "status-box error";
                statusBox.innerText = "❌ کێشەیەک ڕوویدا لە ناردنی نامەکان بۆ تێلێگرام.";
            }
        }
    } catch (error) {
        if (statusBox) {
            statusBox.className = "status-box error";
            statusBox.innerText = "❌ نەتوانرا پەیوەندی بە سێرڤەری ڤێرسێلەوە بکرێت.";
        }
    }
}
