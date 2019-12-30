import getAuthenticatedClient from './get-authenticated-client'
import { jstring, log, logError } from './fes'

run()

async function run() {
  try {
    const oAuth2Client = await getAuthenticatedClient(),
      url = 'https://www.googleapis.com/drive/v2/files/root/children'

    const res = await oAuth2Client.request({ url })
    log('data: ' + jstring(res.data))

    // After acquiring an access_token, you may want to check on the audience, expiration,
    // or original scopes requested.  You can do that with the `getTokenInfo` method.
    const tokenInfo = await oAuth2Client.getTokenInfo(
      oAuth2Client.credentials.access_token
    )
    log('tokenInfo: ' + jstring(tokenInfo))
  } catch (e) {
    logError(e)
  }
}
