// script.js

// ١. دروستکردنی پرسیار بە AI
async function generateAIQuestion() {
    const questionInput = document.getElementById('questionInput');
    const sendBtn = document.getElementById('sendBtn');
    const statusMessage = document.getElementById('statusMessage');

    if (questionInput) questionInput.value = "🚨 AI خەریکە پرسیارێکی ناوازە بیر لێ دەکاتەوە...";
    if (statusMessage) { statusMessage.style.display = "none"; statusMessage.innerText = ""; }

    try {
        const response = await fetch('/api/game', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'generate_question' })
        });
        const data = await response.json();
        
        if (data.question) {
            if (questionInput) questionInput.value = data.question;
            if (sendBtn) sendBtn.style.display = "block";
        } else {
            alert('کێشەیەک لە دروستکردنی پرسیار هەبوو.');
        }
    } catch (error) {
        alert('کێشەیەک لە پەیوەندیگرتن بە سێرڤەر هەبوو.');
        console.error(error);
    }
}

// ٢. ناردنی لینکەکان بۆ تێلێگرام
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
        statusMessage.className = "status-box";
        statusMessage.style.background = "rgba(56, 189, 248, 0.1)";
        statusMessage.style.color = "#38bdf8";
        statusMessage.innerText = "⏳ خەریکە نامەی دەستپێکردن بۆ تێلێگرام دەنێردرێت...";
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
                statusMessage.innerText = "🚀 سەرکەوتووبوو! لێنکی یارییەکە بۆ هاوڕێکەت نێردرا.";
                statusMessage.style.background = "rgba(34, 197, 94, 0.2)";
                statusMessage.style.color = "#4ade80";
            }
        } else {
            if (statusMessage) statusMessage.innerText = "❌ کێشەیەک لە ناردنی نامەکەدا هەبوو.";
        }
    } catch (error) {
        if (statusMessage) statusMessage.innerText = "❌ خەتەکە ببڕا! نەتوانرا بنێردرێت.";
    }
}

// ٣. ناردنی پێشنیاری کۆتایی AI (تەنها بۆ ئیسماعیل)
async function sendFinalAISuggestion() {
    const adminAnswersInput = document.getElementById('adminAnswersInput');
    const questionInput = document.getElementById('questionInput');
    const statusMessage = document.getElementById('statusMessage');
    
    const answers = adminAnswersInput ? adminAnswersInput.value : "";
    const question = questionInput ? questionInput.value : "";

    if (!answers.trim()) {
        alert('تکایە سەرەتا چەند وەڵامێکی هاوڕێکانت لێرە بنووسە یان پەیست بکە!');
        return;
    }

    if (statusMessage) {
        statusMessage.style.display = "block";
        statusMessage.className = "status-box";
        statusMessage.style.background = "rgba(244, 63, 94, 0.1)";
        statusMessage.style.color = "#f43f5e";
        statusMessage.innerText = "⏳ AI خەریکە شیکاری بۆ وەڵامەکان دەکات و بڕیاری کۆتایی دەنێرێت بۆ گروپ چات...";
    }

    try {
        const response = await fetch('/api/game', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'final_judgment', question: question, answers: answers })
        });
        const data = await response.json();
        
        if (data.success) {
            if (statusMessage) {
                statusMessage.innerText = "🎉 سەرکەوتووبوو! پێشنیاری کۆمیدی AI ڕاستەوخۆ نێردرا بۆ ناو گروپ چاتەکە.";
                statusMessage.style.background = "rgba(34, 197, 94, 0.2)";
                statusMessage.style.color = "#4ade80";
            }
            if (adminAnswersInput) adminAnswersInput.value = "";
        } else {
            if (statusMessage) statusMessage.innerText = "❌ کێشەیەک لە دروستکردنی شیکاری AI هەبوو.";
        }
    } catch (error) {
        if (statusMessage) statusMessage.innerText = "❌ کێشەیەک لە پەیوەندیگرتن بە سێرڤەر هەبوو.";
    }
}
