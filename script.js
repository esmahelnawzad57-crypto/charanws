// script.js
let generatedQuestion = "";

// کاتێک کلیک لە دوگمەی دروستکردنی پرسیار دەکرێت
document.addEventListener('DOMContentLoaded', () => {
    // دۆزینەوەی دوگمەی پرسیار لە ڕێگەی دەقەکەیەوە
    const actionBtn = Array.from(document.querySelectorAll('button')).find(el => el.textContent.includes('دروستکردنی پرسیار'));
    const questionText = document.querySelector('.question-box p') || document.querySelector('.question-box');

    if (actionBtn) {
        actionBtn.addEventListener('click', async () => {
            if (questionText) questionText.innerText = "🚨 AI خەریکە بیر دەکاتەوە...";

            try {
                const response = await fetch('/api/game', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'generate_question' })
                });
                const data = await response.json();
                
                if (data.question) {
                    generatedQuestion = data.question;
                    if (questionText) questionText.innerText = generatedQuestion;
                } else {
                    if (questionText) questionText.innerText = "❌ کێشەیەک لە وەرگرتنی پرسیار هەبوو.";
                }
            } catch (error) {
                if (questionText) questionText.innerText = "❌ نەتوانرا پەیوەندی بە باکەندەوە بکرێت.";
                console.error(error);
            }
        });
    }
});
