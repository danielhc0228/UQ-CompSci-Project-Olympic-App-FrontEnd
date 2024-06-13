import OpenAI from 'openai'

const openai = new OpenAI({apiKey: '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'});


async function main() {
    const chatCompletion = await openai.chat.completions.create({
        messages: [{ role: 'user', content: 'Say this is a test' }],
        model: 'gpt-3.5-turbo',
    });
    console.log(chatCompletion.choices);
}

main();