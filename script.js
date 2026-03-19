const MODEL_ID = "normalpurpose3/Ignite-AI"; 

async function sendMessage() {
    const input = document.getElementById('user-input');
    const chatBox = document.getElementById('chat-box');
    const text = input.value.trim();
    if (!text) return;

    // Add User Message
    chatBox.innerHTML += `<div class="flex justify-end"><div class="ignite-gradient px-5 py-3 rounded-2xl rounded-tr-none shadow-xl text-sm font-medium animate-in fade-in slide-in-from-right-4">${text}</div></div>`;
    input.value = '';
    chatBox.scrollTop = chatBox.scrollHeight;

    // Thinking Indicator
    const aiId = "ai-" + Date.now();
    chatBox.innerHTML += `<div class="flex justify-start"><div id="${aiId}" class="bg-white/5 px-5 py-3 rounded-2xl rounded-tl-none border border-white/10 text-zinc-300 text-sm shadow-sm"><span class="animate-pulse">Analyzing...</span></div></div>`;

    try {
        // Calling the API (Replace TOKEN_HERE with your secret token if pasting directly)
        const response = await fetch(`https://api-inference.huggingface.co/models/${MODEL_ID}`, {
            headers: { 
                "Authorization": `Bearer ${window.localStorage.getItem('HF_TOKEN') || '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'}`,
                "Content-Type": "application/json" 
            },
            method: "POST",
            body: JSON.stringify({ inputs: text }),
        });

        const result = await response.json();
        const aiText = result[0]?.generated_text || result.generated_text || "Ignite Pro: Model loading... please wait 20 seconds.";

        document.getElementById(aiId).innerText = aiText;
        chatBox.scrollTop = chatBox.scrollHeight;

    } catch (e) {
        document.getElementById(aiId).innerHTML = "<span class='text-red-400'>Connection failed. Check your API token in script.js.</span>";
    }
}

// Enter Key Support
document.getElementById('user-input').addEventListener('keypress', (e) => { if (e.key === 'Enter') sendMessage(); });
