const express = require('express')
const app = express()
const axios = require('axios')
var cors = require('cors')

app.use(cors())
app.use(express.json())

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"

const leaves = [
    {
        id: "L001",
        name: "Jason",
        type: "sick",
        numberLeave: 2
    },
    {
        id: "L002",
        name: "Bean",
        type: "bussiness",
        numberLeave: 5
    },
    {
        id: "L003",
        name: "Mike",
        type: "marry",
        numberLeave: 7
    },
]

app.post('/createLeave', async (req, res, next) => {
    console.log(req.body);
    let {type, accessToken, numberLeave} = req.body

    try {
        //getProfile
    let profileRes = await axios({
        method: 'get',
        // url: "http://localhost:7788/verify",
        url: 'https://localhost:9443/api/profile/verify',
        headers: {
            Authorization: `Bearer ${accessToken}`  
        }
    })

    console.log('profile =>', profileRes.data);

    let profile = profileRes.data
    let leave = {
        id: 'L00' + Math.floor(Math.random() * (100 - 10) + 10),
        name: profile.email,
        type: type,
        numberLeave: numberLeave
    }

    leaves.push(leave)

    res.json({
        message: "create leave success",
        data: leaves
    })

    } catch (error) {
        console.log(error);
        next()
    }
})

app.get('/index', (req, res) => {
    res.send('hello this is api-leave')
})

app.post('/addClientCredential', async (req, res, next) => {
    try {
        let  accessToken = await axios({
            method: 'post',
            // 'https://localhost:9443/api/profile/oauth2/authorize'
            url: 'https://localhost:9443/api/leave/oauth2/token',
            data: {
                cliet_id: "123",
                client_secret: "456",
                grant_type: "client_credentials",
            }
        })

        console.log('accessToken:=>', accessToken);
        next()
    } catch (error) {
        console.log(error);
        next()
    }
})



app.listen('7799', () => {
    console.log('api-leave is listening on port 7799');
})