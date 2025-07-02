const { SessionsClient } = require('@google-cloud/dialogflow');

// Parseamos las credenciales desde la variable de entorno
const credentials = JSON.parse(process.env.DIALOGFLOW_CREDENTIALS);

const sessionClient = new SessionsClient({
  credentials: {
    private_key: credentials.private_key,
    client_email: credentials.client_email,
  },
});

const projectId = credentials.project_id;

async function enviarMensajeDialogflow(texto, sessionId = '123456') {
  const sessionPath = sessionClient.sessionPath(projectId, sessionId);

  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: texto,
        languageCode: 'es',
      },
    },
  };

  const responses = await sessionClient.detectIntent(request);
  const result = responses[0].queryResult;
  return result.fulfillmentText;
}

module.exports = { enviarMensajeDialogflow, sessionClient, projectId };

