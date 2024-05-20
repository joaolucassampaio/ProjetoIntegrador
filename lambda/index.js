//Inicializando a biblioteca da Alexa
const Alexa = require('ask-sdk-core');

const sentencas = [
            {
                sentenca: "I eat apple every day",
                opcoes: [
                    "Eu compro maçã todos os dias",
                    "Eu como maçã todos os dias",
                    "Eu como maçã toda semana"
                ],
                resposta: "2"
            },
            {
                sentenca: "Her baby is a boy",
                opcoes: [
                    "Nosso bebê é um garoto",
                    "O bebê dele é um garoto",
                    "O bebê dela é um garoto"
                ],
                resposta: "3"
            }
        ]

// Inicializando a função Launch Request / Resposta direta ao usuário chamar a Skill
const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speakOutput = 'Seja bem-vindo à Minha English School! Diga "menu" para saber as opções.';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

// Intenção MENU para nortear o usuário sobre as opções de intenções da SKILL
const MenuIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'MenuIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'As opções são: jogo da tradução, repetição e conversação (incompleto). O que deseja jogar?';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};

// Intenção MENU para nortear o usuário sobre as opções de criação do jogo de conversação
const MenuConversacaoIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'MenuConversacaoIntent';
    },
    handle(handlerInput) {
        const speakOutput = `Bem vindo ao menu de criação de histórias. Para você criar a sua própria história, diga os seguintes passos:
        Primeiro: Registrar título e personagens. Segundo: Registrar contextualização. Terceiro: Registrar diálogos (ainda falta implementar). Quarto: Registrar encerramento.
        Para ouvir a sua história completa diga "ouvir história" (ainda falta implementar).`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};

// Intenção 10: Adivinhação/Tradução
const TraducaoIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'TraducaoIntent';
    },
     handle(handlerInput) {
        /*
        const dicionarioTraducao = [
        { pergunta: 'car', traducao: 'carro' },
        { pergunta: 'lion', traducao: 'leão' },
        { pergunta: 'hammer', traducao: 'martelo' },
        { pergunta: 'sunflower', traducao: 'girassol' },
        { pergunta: 'guitar', traducao: 'violão' },
        { pergunta: 'butterfly', traducao: 'borboleta' }
        ];
        */
        
        let speakOutput = '';
        const listaTraducao = ['lion', 'hammer', 'car', 'sunflower', 'guitar', 'butterfly'];
       
        const respostaUserCode = Alexa.getSlotValue(handlerInput.requestEnvelope, 'respostaUserSlot');

       if(listaTraducao.includes(respostaUserCode)) {
           speakOutput = `Resposta correta! ${respostaUserCode} é uma tradução válida. Caso queira jogar novamente, diga 'jogo da tradução'.`
       } else {
           speakOutput = `Resposta errada! ${respostaUserCode} não é uma tradução válida. Caso queira tentar novamente, diga 'jogo da tradução'.`
       }

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
    //O que falta fazer -> trocar lista por dicionário, checar se a respostaUserCode é válida apenas para palavra em português solicitada
    //remover par de pergunta e resposta conforme utilizado, fazer perguntas em sequências até usuário interromper
};

// Intenção 11: Repetição
const StartRepeticaoIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'StartRepeticaoIntent';
    },
     handle(handlerInput) {
        let speakOutput = '';
    
        //Obtendo o índice da sentença atual da sessão
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        let currentSentenceIndex = sessionAttributes.currentSentenceIndex || 0;

        //Obtendo a sentença atual
        if (currentSentenceIndex < sentencas.length) {
            const sentenca = sentencas[currentSentenceIndex];
            speakOutput = `Certo, vamos começar! "${sentenca.sentenca}" 
            Essa frase significa: Opção 1: "${sentenca.opcoes[0]}"; Opção 2: "${sentenca.opcoes[1]}"; Opção 3: "${sentenca.opcoes[2]}".`;

            //Incrementa o índice e salva na sessão
            sessionAttributes.currentSentenceIndex = currentSentenceIndex + 1;
            handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
            
        } else {
            //Reinicie ou finalize a interação
            speakOutput = 'Todas as sentenças foram faladas.';
            sessionAttributes.currentSentenceIndex = 0; // Reinicie o índice se desejar
            handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
        }

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};

// Intenção 11: Repetição (continuação)
const EndRepeticaoIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'EndRepeticaoIntent';
    },
     handle(handlerInput) {
        let speakOutput = ``;
        
        const opcaoCode = Alexa.getSlotValue(handlerInput.requestEnvelope, 'opcao');
        
        //Obtendo e atualizando o índice atual da sessão
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        let currentSentenceIndex = sessionAttributes.currentSentenceIndex - 1;
        
        const sentenca = sentencas[currentSentenceIndex];
        
        if (opcaoCode.toLowerCase() === sentenca.resposta) {
            speakOutput = `Isso mesmo, você acertou! A resposta é a opção "${opcaoCode}". Repita comigo: "${sentenca.sentenca}.". Caso queira jogar novamente, diga "jogo da repetição".`
        } else {
            speakOutput = `Não foi dessa vez! A opção correta é a "${sentenca.resposta}"; "${sentenca.opcoes[sentenca.resposta - 1]}.". Para fixar, repita comigo:
            "${sentenca.sentenca}.". Caso queira jogar novamente, diga "jogo da repetição.`
        }
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
    //O que falta fazer -> fazer perguntas em sequências até usuário interromper, opção de poder escutar novamente a pergunta
};

//Intenção 12: Registro de título e personagens para histórias.
const TitleAndCharIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'TitleAndCharIntent';
    },
    handle(handlerInput) {
        const titleCode = Alexa.getSlotValue(handlerInput.requestEnvelope, 'titleSlot');
        const firstCharCode = Alexa.getSlotValue(handlerInput.requestEnvelope, 'firstCharSlot');
        const secondCharCode = Alexa.getSlotValue(handlerInput.requestEnvelope, 'secondCharSlot');
        const speakOutput = `Título "${titleCode}", personagens "${firstCharCode}" e "${secondCharCode}" registrados com sucesso!`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

//Intenção 13: Registro de contextualização para histórias
const ContextIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ContextIntent';
    },
    handle(handlerInput) {
        let titleCodeDois = Alexa.getSlotValue(handlerInput.requestEnvelope, 'titleSlotDois');
        let contextCode = Alexa.getSlotValue(handlerInput.requestEnvelope, 'contextSlot');
        const speakOutput = `Contextualização para a história "${titleCodeDois}" salva com sucesso!`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

//Intenção 15: Registro de encerramento para histórias
const EndConversationIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'EndConversationIntent';
    },
    handle(handlerInput) {
        let speakOutput = ''
        let opcaoCode = Alexa.getSlotValue(handlerInput.requestEnvelope, 'opcaoSlot');
        
        if(opcaoCode.toLowerCase() === "sim" || opcaoCode.toLowerCase() === undefined) {
            let titleCode = Alexa.getSlotValue(handlerInput.requestEnvelope, 'titleSlot');
            let nomeCode = Alexa.getSlotValue(handlerInput.requestEnvelope, 'nomeSlot');
            speakOutput = `Encerramento para a história "${titleCode}" salvo com sucesso!`;
        } else {
            speakOutput = 'Diga "menu" caso queira voltar ao menu de opções.';
        }

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

//Jogo da repetição (o que falta fazer?) -> intenção de diálogos e intenção de ouvir história

////////////////////////////////////////////////////////////INTENÇÕES PADRÕES//////////////////////////////////////////////////////////////////////////////////////////////////////////
const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'You can say hello to me! How can I help?';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = 'Goodbye!';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet 
 * */
const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Sorry, I don\'t know about that. Please try again.';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open 
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not 
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs 
 * */
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
    }
};
/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents 
 * by defining them above, then also adding them to the request handler chain below 
 * */
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};
/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below 
 * */
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speakOutput = 'Sorry, I had trouble doing what you asked. Please try again.';
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
////////////////////////////////////////////////////////////INTENÇÕES PADRÕES//////////////////////////////////////////////////////////////////////////////////////////////////////////


exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        MenuIntentHandler,
        TraducaoIntentHandler,
        StartRepeticaoIntentHandler,
        EndRepeticaoIntentHandler,
        TitleAndCharIntentHandler,
        MenuConversacaoIntentHandler,
        ContextIntentHandler,
        EndConversationIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
    .addErrorHandlers(
        ErrorHandler)
    .withCustomUserAgent('sample/hello-world/v1.2')
    .lambda();