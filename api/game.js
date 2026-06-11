// فایلی api/game.js
const BOT_TOKEN = '8329299504:AAFQbJKcvsEZQzyOwgD5G7eJJRaU810hmpI';
const CHAT_ID = '-1003938847730'; // ناسنامەی گروپ چاتەکەت بە ڕێکی داندراوە

// فەنکشن بۆ قسەکردن لەگەڵ AI بە شێوەی بەلاش و بێ کلیل
async function callFreeAI(promptText) {
    try {
        const response = await fetch('https://text.pollinations.ai/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                messages: [{ role: 'user', content: promptText }]
            })
        });
        return await response.text();
    } catch (e) {
        console.error("AI Error:", e);
        return null;
    }
}

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    if (req.method === 'OPTIONS') return res.status(200).end();

    try {
        const body = req.body;

        // ١. دروستکردنی پرسیاری ڕاستەقینە بە AI (هەمەجۆر و جیاواز)
        if (body.action === "generate_question") {
            const prompt = "تۆ ئەی ئای یارییەکی کۆمیدی و سەیری. یەک پرسیاری کورت، زۆر سەیر و دەگمەن بە زمانی کوردی دروست بکە بۆ ئەوەی هاوڕێکان وەڵامی بدەنەوە (بۆ نموونە: ئەگەر ناچار بن کێ لە فڕۆکە فڕێ دەدەنە خوارەوە...). تەنها پرسیارەکە خۆی بنووسە، بەبێ هیچ پێشەکییەک یان سڵاوێک یان هێمای زیادە.";
            const aiQuestion = await callFreeAI(prompt);
            
            const finalQuestion = aiQuestion ? aiQuestion.trim() : "ئەگەر زۆمبی هێرش بکات، کێ دەکەنە قوربانی بۆ ئەوەی خۆتان ڕزگار بکەن؟ 🧟‍♂️";
            return res.status(200).json({ question: finalQuestion });
        }

        // ٢. ناردنی لێنک و پرسیارەکە بۆ تێلێگرام
        if (body.action === "start_game") {
            const answerLink = `https://ismail-vercel.vercel.app/?q=${encodeURIComponent(body.question)}`;
            const messageText = `🚨 یاری نوێ دەستی پێکرد!\n\n❓ پرسیاری چارەنووسساز:\n"${body.question}"\n\n👇 هاوڕێیان خێرا لێرەوە وەڵام بدەنەوە:\n${answerLink}`;

            await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ chat_id: CHAT_ID, text: messageText })
            });
            
            return res.status(200).json({ success: true });
        }

        // ٣. دروستکردنی شیکاری و پێشنیاری کۆتایی بە AI و ناردنی بۆ گروپ
        if (body.action === "final_judgment") {
            const prompt = `ئەمە پرسیاری یارییەکەیە: "${body.question}"\n\nئەمەش وەڵامی هاوڕێکانمە:\n${body.answers}\n\nتۆ وەک AI سەیری ئەم وەڵامانە بکە و بە زمانی کوردییەکی زۆر کۆمیدی، گاڵتەجاڕی، و زۆر سەرنجڕاکێش بڕیار و پێشنیاری کۆتایی بدە کە کێ لێهاتووە و کێ فێڵبازە! دەقەکە کورت و گونجاو بێت بۆ ناو گروپ چاتی تێلێگرام و ئیمۆجی زۆری تێدا بێت.`;
            
            const aiJudgment = await callFreeAI(prompt);
            
            if (!aiJudgment) return res.status(500).json({ error: "AI failed" });

            const finalMessage = `📊 ئەنجامی کۆتایی یاری بڕیاردانی چارەنووسساز:\n\n${aiJudgment.trim()}`;

            // ناردنی ڕاستەوخۆی پێشنیارەکە بۆ ناو گروپ چاتی تێلێگرام
            await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ chat_id: CHAT_ID, text: finalMessage })
            });

            return res.status(200).json({ success: true });
        }

        return res.status(400).json({ error: 'Bad Request' });
    } catch (e) { 
        return res.status(500).json({ error: e.message }); 
    }
};
