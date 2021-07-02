const express = require('express')
const app = express()

app.use(express.json())

const users = [
    {
        id: "001",
        username: "alice",
        password: "111"
    },
    {
        id: "002",
        username: "bob",
        password: "222"
    },
    {
        id: "003",
        username: "cat",
        password: "333"
    },
]

app.get('/index', (req, res) => {
    res.send('hello this api-auth app')
})

app.post('/login', (req, res) => {
    let {username, password} = req.body
    let userFound = users.find( (e) => {
        return e.username == username && e.password == password
    })

    if(userFound) {
        res.send(userFound)
    } else {
        res.send('not found user')
    }
})


app.listen(3300, () => {
    console.log('api-auth runing on 3300');
})