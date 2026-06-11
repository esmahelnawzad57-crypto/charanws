// script.js - ئەمە کۆدی ڕاستەقینەی ناو شاشەکەیە بۆ کارپێکردنی دوگمەکان

let generatedQuestion = "";

// کاتێک کلیک لەسەر دوگمەی دروستکردنی پرسیار دەکرێت
document.querySelector('.btn-primary')?.addEventListener('click', async () => {
    const questionBox = document.querySelector('.question-box p');
    if (questionBox) questionBox.innerText = "🚨 AI خەریکە بیر دەکاتەوە...";

    try {
        const response = await fetch('/api/game', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'generate_question' })
        });
        const data = await response.json();
        
        if (data.question) {
            generatedQuestion = data.question;
            if (questionBox) questionBox.innerText = generatedQuestion;
        } else {
            alert('کێشەیەک لە دروستکردنی پرسیار هەبوو.');
        }
    } catch (error) {
        alert('کێشەیەک لە پەیوەندیگرتن بە سێرڤەر هەبوو.');
    }
});