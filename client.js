(() => {
    const messageInput = document.querySelector('#message')
    const messagePrefix = document.querySelector('.message__prefix')
    const messagesBox = document.querySelector('#messages')

    const showMessages = (user, message) => {
        messages.innerHTML += `<br><span class="tag">${user}: </span> ${message}`
        messages.scrollTop = messages.scrollHeight
        messageInput.value = ''
    }

    let ws

    const init = username => {
        if (ws) {
            ws.onerror = ws.onopen = ws.onclose = null
            ws.close()
        } 

        ws = new WebSocket(`ws://localhost:6969/?user=${username}`) 

        ws.onopen = () => {
            messages.innerHTML += `
            --------------------------------------<br>
            Welcome to the chat room ${username}.
            <br>--------------------------------------` 
        }

        ws.onmessage = message => {
            const res = JSON.parse(message['data'])

            console.log(res)

            let messageArr = res.data.data
            let user = res.user
            let text = ''

            messageArr.forEach(element => {
                text += String.fromCharCode(element);
            })

            showMessages(user, text)
        }


        ws.onclose = () => {
            ws.close()
            ws = null
        }
    }

    let localUser = prompt('Set your username', '')
    if (localUser !== null) {
        init(localUser)
        messagePrefix.innerHTML = localUser
    }

    // Send data by pressing enter
    messageInput.addEventListener('keyup', e => {
        if (e.keyCode === 13) {
            if (!ws) return

            ws.send(messageInput.value)
            showMessages(localUser, messageInput.value)
        }
    })

    // Don't let user to focusout of the input
    messageInput.addEventListener('focusout', () => messageInput.focus())
})()