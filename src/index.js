const apiKeyInput = document.getElementById('apiKey')
const gameSelect = document.getElementById('gameSelect')
const questionInput = document.getElementById('questionInput')
const askButton = document.getElementById('askButton')
const aiResponse = document.getElementById('aiResponse')
const form = document.getElementById('form')


const markdownToHTML = (text) => {
    const converter = new showdown.Converter()
    return converter.makeHtml(text)
}


//AIzaSyAOquPuiSqFVd6HxljLcPkrIhAuk9WGTl8

const perguntarAI = async (question, game, apiKey) => {
    const model = "gemini-2.0-flash"
    const geminiURL = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`

    const perguntaLOL = `
            ## Especialidade
                Você é um especialista assistente de meta para o jogo ${game}
            ## Tarefa
                Você deve responder as perguntas do usuário com base no seu conhecimento do jogo, estratégias, build e dicas
            ## Regras
                - Se você nao sabe a resposta, responde com 'Nao sei!' e nao tente inverntar uma resposta.
                - Se a pergunta nao está relacionada ao jogo, responde 'Essa pergunta não está relacionada ao jogo!'
                - Considere a data atual ${new Date().toLocaleDateString()}
                - Faça pesquisas atualizadas sobre o patch atual, baseado na data atual, para dar uma resposta coerente.
                - Nunca responda itens que você nao tem certeza de que existe no patch atual.
            ## Resposta
                - Economize na resposta, seja direto e responda no máximo 650 caracteres
                - Responda em markdown
                - Não precisa fazer nenhum tipo de saudação ou despedida, apenas responda o que o usuário está querendo.
            ## Exemplo de resposta
                Pergunta do usuário: Melhor build rengar jungle
                Resposta: A build mais atual é: \n\n **Itens:** \n\n coloque os itens aqui.\n\n**Runas**\n\nexemplos de runas\n\n


                --
                Aqui está a pergunta do usuário: ${question}
       `
    const perguntaValorant = `
            ## Especialidade
                Você é um especialista assistente de meta para o jogo ${game}
            ## Tarefa
                Você deve responder as perguntas do usuário com base no seu conhecimento do jogo, estratégias, build e dicas
            ## Regras
                - Se você nao sabe a resposta, responde com 'Nao sei!' e nao tente inverntar uma resposta.
                - Se a pergunta nao está relacionada ao jogo, responde 'Essa pergunta não está relacionada ao jogo!'
                - Considere a data atual ${new Date().toLocaleDateString()}
                - Faça pesquisas atualizadas sobre o patch atual, baseado na data atual, para dar uma resposta coerente.
                - Nunca responda itens que você nao tem certeza de que existe no patch atual.
            ## Resposta
                - Economize na resposta, seja direto e responda no máximo 650 caracteres
                - Responda em markdown
                - Não precisa fazer nenhum tipo de saudação ou despedida, apenas responda o que o usuário está querendo.
            ## Exemplo de resposta
                Pergunta do usuário: Melhor agente para subir de elo solo
                Resposta: O agente mais recomendado atualmente é: \n\n
                **Agente:** Exemplo de agente (como Reyna, Jett ou Raze)\n\n
                **Estilo de jogo:** Jogadores solo geralmente se dão bem com duelistas que conseguem criar impacto sozinhos.\n\n
                **Dica extra:**Tente focar em melhorar seu posicionamento e timing de habilidades para ter mais impacto nas partidas ranqueadas.


                --
                Aqui está a pergunta do usuário: ${question}
        `
    const perguntaCsgo = `
            ## Especialidade
                Você é um especialista assistente de meta para o jogo ${game}
            ## Tarefa
                Você deve responder as perguntas do usuário com base no seu conhecimento do jogo, estratégias, build e dicas
            ## Regras
                - Se você nao sabe a resposta, responde com 'Nao sei!' e nao tente inverntar uma resposta.
                - Se a pergunta nao está relacionada ao jogo, responde 'Essa pergunta não está relacionada ao jogo!'
                - Considere a data atual ${new Date().toLocaleDateString()}
                - Faça pesquisas atualizadas sobre o patch atual, baseado na data atual, para dar uma resposta coerente.
                - Nunca responda itens que você nao tem certeza de que existe no patch atual.
            ## Resposta
                - Economize na resposta, seja direto e responda no máximo 650 caracteres
                - Responda em markdown
                - Não precisa fazer nenhum tipo de saudação ou despedida, apenas responda o que o usuário está querendo.
            ## Exemplo de resposta
                Pergunta do usuário: Melhor arma para economizar no segundo round
                Resposta: A arma mais recomendada é: **Arma:**\n\n 
                Exemplo de arma (como Deagle, Tec-9 ou Five-Seven)\n\n
                **Motivo:** Essas armas oferecem bom custo-benefício e alto poder de dano em rounds econômicos.\n\n
                **Dica extra:** Combine com colete leve ou flashbang para aumentar suas chances de impactar o round.




                --
                Aqui está a pergunta do usuário: ${question}
        `
    

    let pergunta = ''


    if (game == "lol"){
        pergunta = perguntaLOL;
    } else if (game == "valorant"){
        pergunta = perguntaValorant;
    } else{
        pergunta = perguntaCsgo;
    }

    const contents = [{
        role: "user",
        parts: [{
            text: pergunta
        }]
    }]

    const tools = [{
        google_search: {}
    }]


    const response = await fetch(geminiURL, {
        method: 'POST',
        header: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            contents,
            tools
        })
    })

    const data = await response.json()
    return data.candidates[0].content.parts[0].text
}

const enviarFormulario = async (event) => {
    event.preventDefault()

    const apiKey = apiKeyInput.value
    const game = gameSelect.value
    const question = questionInput.value

    console.log({apiKey, game, question})

    if (apiKey == '' || game == '' || question == ''){
        alert('Por favor, preencha todos os campos!')
        return
    }

    askButton.disabled = true
    askButton.textContent = 'Analisando...'
    askButton.classList.add('loading')


    try {
        const text = await perguntarAI(question, game, apiKey)
        aiResponse.querySelector('.response-content').innerHTML = markdownToHTML(text)
        aiResponse.classList.remove('hidden')
    } catch(error) {
        console.log('Erro: ', error)
    } finally {
        askButton.disabled = false
        askButton.textContent = 'Perguntar'
        askButton.classList.remove('loading')
    }
}

form.addEventListener('submit', enviarFormulario)