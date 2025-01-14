import './style.css';

const tchat = document.getElementById('tchat');

window.addEventListener('onEventReceived', function (obj) {
    const event = obj.detail.event;

    // Gestion des événements Twitch et YouTube
    if (event.listener === 'widget-button' && event.field === 'testMessage') {
        simulateTestMessage();
        return;
    }

    if (event.listener === 'delete-message') {
        const msgId = event.msgId;
        document.querySelectorAll(`#message-${msgId}`).forEach((e) => e.remove());
        return;
    }

    if (event.listener === 'delete-messages') {
        const sender = event.userId;
        document.querySelectorAll(`.message[data-sender="${sender}"]`).forEach((e) => e.remove());
        return;
    }

    if (event.listener === 'message') {
        const service = event.service; // Twitch ou YouTube
        const data = event.data;
        const renderedText = event.renderedText || data.message;

        if (service === 'twitch') {
            addMessage(data, renderedText, 'twitch');
        } else if (service === 'youtube') {
            addMessage(data, renderedText, 'youtube');
        }
    }
});

function addMessage(data, message, platform) {
    console.log(data, message, platform);
    let color = '#FFFFFF'; // Couleur par défaut
    let badges = '';
    let displayName = '';
    let userId = '';
    let msgId = '';

    if (platform === 'twitch') {
        color = data.displayColor || `#${md5(data.displayName).substring(26)}`;
        displayName = data.displayName;
        userId = data.userId;
        msgId = data.msgId;

        badges = data.badges.reduce(
            (acc, badge) =>
                acc +
                `<img src="${badge.url}" class="badge" title="${badge.description}" />`,
            ''
        );
    } else if (platform === 'youtube') {
        color = data.authorPhoto ? 'transparent' : '#FFFFFF';
        displayName = data.authorName;
        userId = data.channelId;
        msgId = `youtube-${Date.now()}`;

        if (data.isModerator) {
            badges += `<img src="https://example.com/mod_badge.png" class="badge" title="Modérateur YouTube" />`;
        }
        if (data.isOwner) {
            badges += `<img src="https://example.com/owner_badge.png" class="badge" title="Propriétaire du canal" />`;
        }
    }

    tchat.insertAdjacentHTML(
        'beforeend',
        `
        <div id="message-${msgId}" data-sender="${userId}" class="message" style="--color: ${color}">
            <div class="meta">
                <div class="name">${displayName}</div>
                <div class="badges">${badges}</div>
            </div>
            <div class="content">${message}</div>
        </div>
    `
    );

    // Limiter les messages visibles à 20
    const messages = document.querySelectorAll('.message');
    if (messages.length > 20) {
        messages[0].remove();
    }
}

function simulateTestMessage() {
    const simulatedTwitchEvent = new CustomEvent('onEventReceived', {
        detail: {
            listener: 'message',
            event: {
                service: 'twitch',
                data: {
                    time: Date.now(),
                    tags: {
                        "badge-info": "",
                        badges: "moderator/1,partner/1",
                        color: "#5B99FF",
                        "display-name": "StreamElements",
                        emotes: "25:46-50",
                        flags: "",
                        id: "43285909-412c-4eee-b80d-89f72ba53142",
                        mod: "1",
                        "room-id": "85827806",
                        subscriber: "0",
                        "tmi-sent-ts": "1579444549265",
                        turbo: "0",
                        "user-id": "100135110",
                        "user-type": "mod"
                    },
                    nick: "lazarefortune",
                    userId: "100135110",
                    displayName: "lazarefortune",
                    displayColor: "#5B99FF",
                    badges: [
                        {
                            type: "moderator",
                            version: "1",
                            url: "https://static-cdn.jtvnw.net/badges/v1/3267646d-33f0-4b17-b3df-f923a41db1d0/3",
                            description: "Moderator"
                        },
                        {
                            type: "partner",
                            version: "1",
                            url: "https://static-cdn.jtvnw.net/badges/v1/d12a2e27-16f6-41d0-ab77-b780518f00a3/3",
                            description: "Verified"
                        }
                    ],
                    channel: "lazarefortune",
                    text: "Howdy! My name is Bill and I am here to serve Kappa",
                    isAction: false,
                    emotes: [
                        {
                            type: "twitch",
                            name: "Kappa",
                            id: "25",
                            gif: false,
                            urls: {
                                1: "https://static-cdn.jtvnw.net/emoticons/v1/25/1.0",
                                2: "https://static-cdn.jtvnw.net/emoticons/v1/25/1.0",
                                4: "https://static-cdn.jtvnw.net/emoticons/v1/25/3.0"
                            },
                            start: 46,
                            end: 50
                        }
                    ],
                    msgId: "43285909-412c-4eee-b80d-89f72ba53142"
                },
                renderedText: 'Hello from Twitch!',
            },
        },
    });

    const simulatedYouTubeEvent = new CustomEvent('onEventReceived', {
        detail: {
            listener: 'message',
            event: {
                service: 'youtube',
                data: {
                    channelId: 'UC123456789',
                    authorName: 'YouTubeUser',
                    authorPhoto: 'https://yt3.ggpht.com/photo.jpg',
                    isModerator: true,
                    isOwner: false,
                    message: 'Hello from YouTube!',
                },
            },
        },
    });

    window.dispatchEvent(simulatedTwitchEvent);
    window.dispatchEvent(simulatedYouTubeEvent);
}

