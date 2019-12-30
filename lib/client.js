import open from 'open'
import { OAuth2Client } from 'google-auth-library'

// full access
// https://developers.google.com/drive/api/v2/about-auth#OAuth2Scope
const scope = 'https://www.googleapis.com/auth/drive',
  oauth2Client = new OAuth2Client(),
  // generate the url that will be used for the consent dialog.
  authorizeUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope,
  })
