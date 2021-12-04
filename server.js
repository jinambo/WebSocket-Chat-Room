// const express = require('express')
const WebSocket = require('ws')
const url = require('url');

const port = 6969
const wss = new WebSocket.Server({ port })

wss.on('connection', (ws, req) => {
    const parameters = url.parse(req.url, true)
    ws.username = parameters.query.user !== null ? parameters.query.user : 'Unknown'

    ws.on('message', data => {
        // Send message to all clients
        wss.clients.forEach(client => {
            console.log('Client.Username: ' + client.username);
            console.log(data)

            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({
                    data: data,
                    user: ws.username
                }))
            }
        })
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