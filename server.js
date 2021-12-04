// const express = require('express')
const WebSocket = require('ws')
const url = require('url');

const port = 6969
const wss = new WebSocket.Server({ port })

const getString = data => {
    let msgStr = ''
    data.forEach(element => {
        msgStr += String.fromCharCode(element);
    })

    return msgStr
}

wss.on('connection', (ws, req) => {
    const parameters = url.parse(req.url, true)
    ws.username = parameters.query.user !== null ? parameters.query.user : 'Unknown'

    ws.on('message', data => {
        const theMsg = getString(data)

        // Send private message by username
        if (theMsg.includes('/private')) {
            const name = theMsg.split(' ')[1]
            const msg = theMsg.split(' ').slice(2).join(' ')

            wss.clients.forEach(client => {
                if (client.username == name && client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({
                        data: msg,
                        user: '[Private Message] ' + ws.username
                    }))
                }
            })
        } else {
            // Send message to all clients
            wss.clients.forEach(client => {
                console.log('Client.Username: ' + client.username);

                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({
                        data: theMsg,
                        user: ws.username
                    }))
                }
            })
        }
    })

    ws.on('close', () => {
        clients.delete(ws)
    })
})


/*
const express = require('express')
const http = require('http')
const WebSocket = require('ws')

const port = 6969
const server = http.createServer(express)
const wss = new WebSocket.Server({ server })

wss.on('connection', ws => {

    ws.on('message', data => {
        wss.clients.forEach(client => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(data))
            }
        })
    })

})

server.listen(port, () => {
    console.log(`Server is listening on por ${port}`)
})
*/