let currentFriendName = "";
let currentQuestion = "";

// کاتێک پەیجەکە دەکرێتەوە، پشکنین دەکات بزانێت کێ کردوویەتیەوە
window.onload = function() {
    const urlParams = new URLSearchParams(window.location.search);
    const qParam = urlParams.get('q'); // گرتنی پرسیارەکە
    const nParam = urlParams.get('n'); // گرتنی ناوی هاوڕێکە (n وەک ئەوەی لە API نووسیوتە)

    if (qParam && nParam) {
        // ئەگەر هاوڕێیەک بێت: شاشەی ئەدمین دەشارێتەوە و شاشەی هاوڕێ پیشان دەدات
        document.getElementById('adminSection').style.display = 'none';
        document.getElementById('friendSection').style.display = 'block';
        
        currentFriendName = decodeURIComponent(nParam);
        currentQuestion = decodeURIComponent(qParam);
        
        document.getElementById('friendGreeting').innerText = `سڵاو لە تۆ (${currentFriendName}) 👋`;
        document.getElementById('displayQuestion').innerText = currentQuestion;
    }
};

// ١. دروستکردنی پرسیار بە AI
async function generateAIQuestion() {
    const questionInput = document.getElementById('questionInput');
    if (questionInput) questionInput.value = "🚨 AI خەریکە بیر دەکاتەوە...";

    try {
        const response = await fetch('/api/game', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'generate_question' })
        });
        const data = await response.json();
        if (data.question) {
            questionInput.value = data.question;
        } else {
            alert('کێشەیەک لە دروستکردنی پرسیار هەبوو.');
        }
    } catch (error) {
        alert('پەیوەندی لەگەڵ سێرڤەر سەرکەوتوو نەبوو.');
    }
}

// ٢. ناردنی پرسیار بۆ هاوڕێکان لە تێلێگرام
async function sendQuestionToAll() {
    const questionText = document.getElementById('questionInput').value.trim();
    const statusBox = document.getElementById('statusMessage');
    
    if (!questionText || questionText.startsWith("🚨")) {
        alert("تکایە سەرەتا پرسیارێک بنووسە یان بە AI دروستی بکە!");
        return;
    }

    statusBox.style.display = "block";
    statusBox.className = "status-box info";
    statusBox.innerText = "⏳ لینکەکان خەریکە دەنێردرێن بۆ تێلێگرام...";

    try {
        const response = await fetch('/api/game', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'start_game', question: questionText })
        });
        const data = await response.json();
        
        if (data.success) {
            statusBox.className = "status-box success";
            statusBox.innerText = "✅ لینکەکان بە سەرکەوتوویی بۆ تێلێگرام نێردران!";
        } else {
            statusBox.className = "status-box error";
            statusBox.innerText = "❌ کێشەیەک لە ناردندا هەبوو.";
        }
    } catch (error) {
        statusBox.className = "status-box error";
        statusBox.innerText = "❌ پەیوەندی بە سێرڤەرەوە نەکرا.";
    }
}

// ٣. کاتێک هاوڕێیەک وەڵام دەداتەوە و دەنێردرێت بۆ Pipedream
async function submitFriendAnswer() {
    const answerText = document.getElementById('answerInput').value.trim();
    const statusBox = document.getElementById('statusMessage');
    
    if (!answerText) {
        alert("تکایە وەڵامەکەت بنووسە!");
        return;
    }

    statusBox.style.display = "block";
    statusBox.className = "status-box info";
    statusBox.innerText = "⏳ وەڵامەکەت خەریکە تۆمار دەکرێت...";

    try {
        const response = await fetch('/api/game', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                action: 'submit_answer', 
                friendName: currentFriendName, 
                origQuestion: currentQuestion, 
                answer: answerText 
            })
        });
        const data = await response.json();
        
        if (data.success) {
            statusBox.className = "status-box success";
            statusBox.innerText = "🎉 سوپاس! وەڵامەکەت بە سەرکەوتوویی نێردرا.";
            document.getElementById('answerInput').disabled = true;
            document.getElementById('submitBtn').disabled = true;
        } else {
            statusBox.className = "status-box error";
            statusBox.innerText = "❌ ناردنی وەڵامەکە سەرکەوتوو نەبوو.";
        }
    } catch (error) {
        statusBox.className = "status-box error";
        statusBox.innerText = "❌ کێشەی هێڵ هەیە، دووبارە تاقیکەرەوە.";
    }
}
