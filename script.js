// --- ئەم بەشە زیاد بکە بۆ ناردنی پرسیار ---
async function sendQuestionToAll() {
    const questionText = document.getElementById('questionInput').value.trim();
    if (!questionText) return alert("تکایە سەرەتا پرسیارێک بنووسە!");

    const res = await fetch('/api/game', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'start_game', question: questionText })
    });
    
    if ((await res.json()).success) {
        alert("✅ لینکەکان بۆ هەمووان نێردران!");
    } else {
        alert("❌ کێشەیەک لە ناردندا هەبوو.");
    }
}

// --- ئەم بەشەش بۆ دروستکردنی پرسیار بە AI ---
async function generateAIQuestion() {
    const res = await fetch('/api/game', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'generate_question' })
    });
    const data = await res.json();
    document.getElementById('questionInput').value = data.question;
}

// --- کۆدی خۆت (کە پێشتر ناردت) ---
window.onload = function() {
    const params = new URLSearchParams(window.location.search);
    if (params.get('q') && params.get('n')) {
        localStorage.setItem('q', decodeURIComponent(params.get('q')));
        localStorage.setItem('n', decodeURIComponent(params.get('n')));
        document.getElementById('adminSection').style.display = 'none';
        document.getElementById('friendSection').style.display = 'block';
        document.getElementById('displayQuestion').innerText = localStorage.getItem('q');
    }
};

async function submitFriendAnswer() {
    const payload = {
        action: 'submit_answer',
        friendName: localStorage.getItem('n'),
        origQuestion: localStorage.getItem('q'),
        votedFriend: document.getElementById('votedFriendSelect').value,
        reason: document.getElementById('reasonInput').value
    };

    if (!payload.votedFriend || payload.votedFriend === "") {
        return alert("تکایە هاوڕێیەک هەڵبژێرە!");
    }

    const res = await fetch('/api/game', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload)
    });
    
    if ((await res.json()).success) {
        alert("بە سەرکەوتوویی نێردرا!");
        location.reload();
    }
}
