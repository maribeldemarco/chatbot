const dialogflow = require('dialogflow');
const path = require('path');

const sessionClient = new dialogflow.SessionsClient({
  keyFilename: path.join(__dirname, 'credenciales/credenciales.dialogflow.json'),
});

const projectId = 'botheladeria-uudf';

async function enviarMensajeDialogflow(texto, sessionId = '123456') {
  const sessionPath = sessionClient.sessionPath(projectId, sessionId);

  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: texto,
        languageCode: 'es'
      }
    }
  };

  const responses = await sessionClient.detectIntent(request);
  const result = responses[0].queryResult;
  return result.fulfillmentText;
}

module.exports = { enviarMensajeDialogflow, sessionClient, projectId };
