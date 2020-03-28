// setInterval(function() {
//     chrome.runtime.sendMessage({ data: 'HELLO CONTENT' });
// }, 500);

var find_video = setInterval(function() {
    var video_tag = document.getElementsByTagName('video');
    if (video_tag && video_tag.length > 0) {
        clearInterval(find_video);
        main(video_tag[0]);
    }
}, 100);

REPLY_ALL = {
    VIDEO_FOUND: { found: false },
};

VIDEO_CONTROLS = {
    play: true,
    pause: true,
    trigger: true,
};

chrome.runtime.onMessage.addListener(function(msg, sender, respond) {
    console.log('content script', msg);

    if (!msg.data) {
        console.log('no message data', msg);
    }
    else if (REPLY_ALL[msg.data]) {
        respond(REPLY_ALL[msg.data]);
    }
    else if (VIDEO_CONTROLS[msg.data]) {
        if (REPLY_ALL.VIDEO_FOUND.found) {
            VIDEO_CONTROLS[msg.data](msg);
            respond({ success: true });
        }
        else {
            respond({ error: 'video element not found' });
        }
    }
});

function main(video) {
    REPLY_ALL.VIDEO_FOUND = { found: true };
    VIDEO_CONTROLS = {
        play: function() {
            video.play();
        },
        pause: function() {
            video.pause();
        },
        trigger: function(msg) {
            var target = new Date(msg.date);
            var now = new Date();
            setTimeout(function() {
                video.play();
            }, target - now);
        },
    };
}
