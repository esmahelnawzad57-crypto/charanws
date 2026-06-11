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
