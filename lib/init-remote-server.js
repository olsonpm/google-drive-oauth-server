import https from 'https'
import clientId from '../client-id.json'
import clientSecret from '../client-secret.json'
import { OAuth2Client } from 'google-auth-library'
import { URL } from 'url'
import fs from 'fs'
import path from 'path'

const port = 8000,
  localServerPort = 59940,
  redirectUri = `http://127.0.0.1:${localServerPort}/auth-success`,
  { readFile } = fs.promises

/**
 * Create a new OAuth2Client, and go through the OAuth2 content
 * workflow.  Return the full client to the callback.
 */
const initRemoteServer = async () =>
  new Promise(async (resolve, reject) => {
    try {
      const pfx = await readFile(path.resolve(__dirname, './nss/server.p12'))

      // create an oAuth client to authorize the API call.  Secrets are kept in a `keys.json` file,
      // which should be downloaded from the Google Developers Console.
      const serverSideOauth2Client = new OAuth2Client({
        clientId,
        clientSecret,
        redirectUri,
      })

      // Open an http server to accept the oauth callback. In this simple example, the
      // only request to our webserver is to /oauth2callback?code=<code>
      https
        .createServer({ pfx }, async (req, res) => {
          try {
            // acquire the code from the querystring, and close the web server.
            const qs = new URL(req.url, redirectUri).searchParams,
              code = qs.get('code')

            // if there's no code then this is an unexpected request
            if (!code) return

            // Now that we have the code, use that to acquire tokens.
            res.send({ tokens: await serverSideOauth2Client.getToken(code) })
          } catch (e) {
            reject(e)
          }
        })
        .listen(port, () => {
          resolve()
        })
    } catch (e) {
      reject(e)
    }
  })

export default initRemoteServer
