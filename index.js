const telegramApiUrl = "https://api.telegram.org/bot";
const botApiKey = "1234567890:ABCDEF-ABCDEFGHIJKLMNOPQRSTU_ABCDE";

/**
 * Faz uma requisição pra API do Telegram.
 *
 * @param {string} endpoint
 * @param {object} body
 */
const request = async (endpoint, body) => {

    try {

        let options;
        if (typeof body !== "undefined") {

            options = {
                method : "POST",
                headers : { "Content-type" : "application/json" },
                body : JSON.stringify(body)
            };
        }

        const response = await fetch(`${telegramApiUrl}${botApiKey}/${endpoint}`, options);
        const content = await response.json();
        return content;

    } catch(err) {
        console.error(`Ocorreu um erro ao fazer a requisição: ${err}`);
        return {};
    }
}

/**
 * Obtém atualizações do Telegram.
 *
 * @param {number} lastUpdateId
 */
const getUpdates = async (lastUpdateId) => {

    console.log("Getting updates...");

    let body;
    if (typeof lastUpdateId !== "undefined") {
        body = {
            offset : lastUpdateId
        };
    }

    const content = await request("getUpdates", body);

    let updateId;
    for (let update of content.result) {
        updateId = Number(update.update_id);
        updateId++;

        answer(update);
    }

    console.log(JSON.stringify(content, null, 4));
    getUpdates(updateId);
}

/**
 * Responde a uma mensagem.
 *
 * @param {object} update
 */
const answer = async (update) => {

    const chat = update.message.chat;
    const sender = update.message.from;

    const message = `Olá ${sender.first_name} ${sender.last_name}!`;
    const body = {
        chat_id : chat.id,
        text : message
    };

    await request("sendMessage", body);
}

/**
 * Inicializa o robô.
 */
const manu = async () => {
    await getUpdates();
}

manu();
