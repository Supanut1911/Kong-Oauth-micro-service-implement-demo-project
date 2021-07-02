const fs = require('fs')
const express = require('express')
const app = express()
const data = require('./data.json')
const SSL_CERT = fs.readFileSync('./certificates/cert.pem')
const SSL_KEY =  fs.readFileSync('./certificates/key.pem')
const port = 7788
const axios = require('axios')
var cors = require('cors')
const https = require('https')

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: false}))

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"

const getCurrentUser = ({ headers }) => {
    return headers['mock-logged-in-as'] ||
           headers['x-authenticated-userid']
}

app.get('/index',(req, res) => {
    res.send('hello this api-profile')
})

//API RESOURCE SERVER
app.get('/verify', (req, res) => {
    console.log(req.headers)
    const user = getCurrentUser(req)
    if (!user) {
      res.status(401).send('Not authorized')
      return
    }
    res.send(data[user] || [])
})

//OAuth Authorize Server
app.post('/exchangeToken', async (req, res, next) => {
    //1 request Auth Token
    let {clientId, scope, provisionKey, userId} = req.body
    try {
      let authTokenResponse = await axios({
        method: 'post',
        url: 'https://localhost:9443/api/profile/oauth2/authorize',
        data: {
          'client_id': clientId,
          "response_type": "code",
          "scope": scope,
          "provision_key": provisionKey,
          "authenticated_userid": userId
        }
      })

      console.log('authTokenResponse:=>', authTokenResponse.data);

      let authencode = authTokenResponse.data.redirect_uri
      let indexEqual = authencode.indexOf('=')
      authencode = authencode.substring(indexEqual + 1, )

    //2 request Access Token
      let accessTokenReponse = await axios({
        method: 'post',
        url: 'https://localhost:9443/api/profile/oauth2/token',
        data: {
          "grant_type": "authorization_code",
          "code": authencode,
          "client_id":"PYbB8OSG7kS7d69y7VFfDlepRYkvoodK",
          "client_secret": "m5Aln5kdI3qfwtNUWAn5yBcSDWec2Axo"
        }
      })

      console.log('accessTokenReponse:=>', accessTokenReponse.data);

      res.json(accessTokenReponse.data)
    } catch (error) {
      console.log(error);
      next()
    }
})





const server = https.createServer({ key: SSL_KEY, cert: SSL_CERT }, app)
server.listen(port, () => {
  console.log(`api-profile listening on https://localhost:${port} `)
})