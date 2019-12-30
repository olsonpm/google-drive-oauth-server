import enableDestroy from 'server-destroy'
import http from 'http'
import open from 'open'
import clientId from './client-id.json'
import { log } from './fes'
import { OAuth2Client } from 'google-auth-library'
import { URL } from 'url'

// full access
// https://developers.google.com/drive/api/v2/about-auth#OAuth2Scope
const scope = 'https://www.googleapis.com/auth/drive',
  port = 59940,
  redirectUri = `http://127.0.0.1:${port}/auth-success`

/**
 * Create a new OAuth2Client, and go through the OAuth2 content
 * workflow.  Return the full client to the callback.
 */
const getAuthenticatedClient = () =>
  new Promise(async (resolve, reject) => {
    try {
      const oAuth2Client = new OAuth2Client({
          clientId,
          redirectUri,
        }),
        // Generate the url that will be used for the consent dialog.
        authorizeUrl = oAuth2Client.generateAuthUrl({
          access_type: 'offline',
          scope,
        })

      // Open an http server to accept the oauth callback. In this simple example, the
      // only request to our webserver is to /oauth2callback?code=<code>
      const server = http
        .createServer(async (req, res) => {
          try {
            // acquire the code from the querystring, and close the web server.
            const qs = new URL(req.url, redirectUri).searchParams,
              code = qs.get('code')

            // if there's no code then this is an unexpected request
            if (!code) return

            log(`Code is ${code}`)
            res.end('Authentication successful! Please return to the console.')
            server.destroy()

            // Now that we have the code, use that to acquire tokens.
            const r = await oAuth2Client.getToken(code)
            // Make sure to set the credentials on the OAuth2 client.
            oAuth2Client.setCredentials(r.tokens)
            log('Tokens acquired.')
            resolve(oAuth2Client)
          } catch (e) {
            reject(e)
          }
        })
        .listen(port, () => {
          // open the browser to the authorize url to start the workflow
          open(authorizeUrl, { wait: false }).then(cp => cp.unref())
        })
      enableDestroy(server)
    } catch (e) {
      reject(e)
    }
  })

export default getAuthenticatedClient
