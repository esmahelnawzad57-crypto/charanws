const BOT_TOKEN = '8329299504:AAFQbJKcvsEZQzyOwgD5G7eJJRaU810hmpI';
const PIPEDREAM_WEBHOOK_URL = 'https://eonpq38cwigxpcf.m.pipedream.net'; 

const FRIENDS = [
    { name: "سۆنیا", id: "8356643097" },
    { name: "عبدالباست", id: "8094239190" },
    { name: "شەهین", id: "8294302530" },
    { name: "شەنیار", id: "5285811533" },
    { name: "ڕاز", id: "6675931933" },
    { name: "اسماعیل", id: "8471929492" },
    { name: "لێزان", id: "5901076708" }
];

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    if (req.method === 'OPTIONS') return res.status(200).end();

    try {
        const body = req.body;

        if (body.action === "generate_question") {
            const questions = [
                "ئەگەر زۆمبی هێرش بکات، کێ دەکەنە قوربانی بۆ ئەوەی خۆتان ڕزگار بکەن؟",
                "ئەگەر فڕۆکەکەتان تێکبچێت و تەنها یەک چاکەتی فریاکەوتن هەبێت، کێ فڕێ دەدەنە خوارەوە؟"
            ];
            return res.status(200).json({ question: questions[Math.floor(Math.random() * questions.length)] });
        }

        if (body.action === "start_game") {
            for (const friend of FRIENDS) {
                const link = `https://project-k13a3.vercel.app/?q=${encodeURIComponent(body.question)}&n=${encodeURIComponent(friend.name)}`;
                await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ chat_id: friend.id, text: `🚨 پرسیار:\n"${body.question}"\n\nوڵام بدەرەوە:\n${link}` })
                });
            }
            return res.status(200).json({ success: true });
        }

        if (body.action === "submit_answer") {
            // ئەگەر داتا نەهاتبوو بەتاڵ نەبێت
            await fetch(PIPEDREAM_WEBHOOK_URL, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    friendName: body.friendName || "نادیار",
                    origQuestion: body.origQuestion || "پرسیار نییە",
                    votedFriend: body.votedFriend || "نادیار",
                    reason: body.reason || "هۆکار نییە"
                })
            });
            return res.status(200).json({ success: true });
        }
        return res.status(400).json({ error: 'Bad Request' });
    } catch (e) { return res.status(500).json({ error: e.message }); }
};
