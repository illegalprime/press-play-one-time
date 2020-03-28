function send_message(msg, reply) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		    if (tabs && tabs.length > 0) {
            chrome.tabs.sendMessage(tabs[0].id, {data: msg}, reply);
        }
    });
}

document.querySelector('input[name=pause]').addEventListener('click', function() {
    var out = document.getElementById('console');
    send_message('pause', function(reply) {
        out.innerHTML = JSON.stringify(reply);
    });
});

document.querySelector('input[name=play]').addEventListener('click', function() {
    var out = document.getElementById('console');
    send_message('play', function(reply) {
        out.innerHTML = JSON.stringify(reply);
    });
});


var find_video = setInterval(function() {
    send_message('VIDEO_FOUND', function(reply) {
        if (reply.found) {
            clearInterval(find_video);
            var out = document.getElementById('console');
            out.innerHTML = JSON.stringify({status: 'video tag found'});
        }
    });
}, 100);
