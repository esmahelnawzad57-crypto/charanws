// script.js

// ١. ئەم فەرمانە کار دەکات کاتێک کلیک لە دوگمەی یەکەم دەکەیت
async function generateAIQuestion() {
    const questionInput = document.getElementById('questionInput');
    const sendBtn = document.getElementById('sendBtn');
    const statusMessage = document.getElementById('statusMessage');

    // نیشاندانی نامەی چاوەڕوانی لە ناو بۆکسەکەدا
    if (questionInput) questionInput.value = "🚨 AI خەریکە بیر دەکاتەوە...";
    if (statusMessage) statusMessage.innerText = "";

    try {
        const response = await fetch('/api/game', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'generate_question' })
        });
        const data = await response.json();
        
        if (data.question) {
            // دانانی پرسیارەکە لە ناو بۆکسەکەدا
            if (questionInput) questionInput.value = data.question;
            
            // دەرکەوتنی دوگمەی دووەم (ناردنی لینکەکان)
            if (sendBtn) sendBtn.style.display = "block";
        } else {
            if (questionInput) questionInput.value = "";
            alert('کێشەیەک لە دروستکردنی پرسیار هەبوو.');
        }
    } catch (error) {
        if (questionInput) questionInput.value = "";
        alert('کێشەیەک لە پەیوەندیگرتن بە سێرڤەر هەبوو.');
        console.error(error);
    }
}

// ٢. ئەم فەرمانە کار دەکات کاتێک کلیک لە دوگمەی دووەم دەکەیت (ناردن بۆ تێلێگرام)
async function sendQuestionToAll() {
    const questionInput = document.getElementById('questionInput');
    const statusMessage = document.getElementById('statusMessage');
    const generatedQuestion = questionInput ? questionInput.value : "";

    if (!generatedQuestion || generatedQuestion.includes("AI خەریکە بیر دەکاتەوە")) {
        alert('تکایە سەرەتا چاوەڕێ بکە تا پرسیارەکە دروست دەبێت!');
        return;
    }

    if (statusMessage) {
        statusMessage.style.display = "block";
        statusMessage.innerText = "⏳ خەریکە نامەکان بۆ تێلێگرامی هاوڕێکانت دەنێردرێت...";
    }

    try {
        const response = await fetch('/api/game', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'start_game', question: generatedQuestion })
        });
        const data = await response.json();
        
        if (data.success) {
            if (statusMessage) {
                statusMessage.innerText = "🚀 سەرکەوتووبوو! یارییەکە دەستی پێکرد و لێنکەکان بۆ هاوڕێکانت نێردران.";
                statusMessage.style.background = "rgba(34, 197, 94, 0.2)";
            }
        } else {
            if (statusMessage) statusMessage.innerText = "❌ کێشەیەک لە دەستپێکردنی یارییەکەدا هەبوو.";
        }
    } catch (error) {
        if (statusMessage) statusMessage.innerText = "❌ خەتەکە ببڕا! نەتوانرا نامەکە بنێردرێت.";
        console.error(error);
    }
}
