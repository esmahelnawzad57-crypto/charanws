// api/game.js
const BOT_TOKEN = '8329299504:AAFQbJKcvsEZQzyOwgD5G7eJJRaU810hmpI'; //
const PIPEDREAM_WEBHOOK_URL = 'https://eonpq38cwigxpcf.m.pipedream.net'; //

// لیستی هاوڕێکان (بۆ تاقیکردنەوە تەنها خۆتت داناوە، دواتر لێرەدا زیادیان بکە)
const FRIENDS = [
    { name: "اسماعیل", id: "8471929492" } //
];

module.exports = async (req, res) => {
    // ڕێگەدان بە پەیوەندی دەرەکی (CORS) بۆ ئەوەی فێچەکە ئێرۆر نەدات
    res.setHeader('Access-Control-Allow-Origin', '*'); //
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS'); //
    if (req.method === 'OPTIONS') return res.status(200).end(); //

    try {
        const body = req.body; //

        // ١. دروستکردنی پرسیار بە AI (لێرەدا وەک نموونە دانراوە)
        if (body.action === "generate_question") { //
            const sampleQuestions = [ //
                "ئەگەر فڕۆکەکەتان تێکبچێت و تەنها ٦ چاکەتی فریاکەوتن هەبێت، کێ فڕێ دەدەنە خوارەوە و بۆچی؟", //
                "ئەگەر لە بیابانێکدا بن و تەنها یەک قوم ئاو مابێت، کێ دەکوژن بۆ ئەوەی ئاوەکە بۆ خۆتان بێت؟", //
                "ئەگەر زۆمبی هێرش بکات، کێ دەکەنە قوربانی بۆ ئەوەی خۆتان ڕزگار بکەن؟" //
            ]; //
            const randomQuestion = sampleQuestions[Math.floor(Math.random() * sampleQuestions.length)]; //
            return res.status(200).json({ question: randomQuestion }); //
        }

        // ٢. ناردنی پرسیار بۆ تێلێگرامی هاوڕێکان
        if (body.action === "start_game") { //
            for (const friend of FRIENDS) { //
                // لێرەدا پیتەکانی q و n بەکارهاتوون بۆ URL
                const answerLink = `https://ismail-vercel.vercel.app/?q=${encodeURIComponent(body.question)}&n=${encodeURIComponent(friend.name)}`; //
                
                await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, { //
                    method: 'POST', //
                    headers: {'Content-Type': 'application/json'}, //
                    body: JSON.stringify({ 
                        chat_id: friend.id, 
                        text: `🚨 یاری نوێ دەستی پێکرد!\n\n❓ پرسیار:\n"${body.question}"\n\n👇 خێرا لێرەوە وەڵام بدەرەوە:\n${answerLink}` //
                    })
                });
            }
            return res.status(200).json({ success: true }); //
        }

        // ٣. ناردنی وەڵامەکان بۆ Pipedream
        if (body.action === "submit_answer") { //
            await fetch(PIPEDREAM_WEBHOOK_URL, { //
                method: 'POST', //
                headers: {'Content-Type': 'application/json'}, //
                body: JSON.stringify({
                    friendName: body.friendName, //
                    origQuestion: body.origQuestion, //
                    answer: body.answer //
                })
            });
            return res.status(200).json({ success: true }); //
        }

        return res.status(400).json({ error: 'Bad Request' }); //
    } catch (e) { 
        return res.status(500).json({ error: e.message }); //
    }
};
