function send_message(msg, reply) {
    var message = typeof msg === 'string' ? { data: msg } : msg;
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		    if (tabs && tabs.length > 0) {
            chrome.tabs.sendMessage(tabs[0].id, message, reply);
        }
    });
}

// document.querySelector('input[name=pause]').addEventListener('click', function() {
//     var out = document.getElementById('console');
//     send_message('pause', function(reply) {
//         out.innerHTML = JSON.stringify(reply);
//     });
// });

// document.querySelector('input[name=play]').addEventListener('click', function() {
//     var out = document.getElementById('console');
//     send_message('play', function(reply) {
//         out.innerHTML = JSON.stringify(reply);
//     });
// });

function new_date(h, m, s) {
    var now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m, s, 0);
}

function make_date(time) {
    var parsed = time.split(':');
    parsed = [parseInt(parsed[0]), parseInt(parsed[1]), parseInt(parsed[2])];
    return new_date(parsed[0], parsed[1], parsed[2]);
}

document.querySelector('input[name=trigger]').addEventListener('click', function() {
    var time_elem = document.querySelector('input[name=time]');
    var time = time_elem.value.trim();
    var out = document.getElementById('console');
    if (/^[0-9]{2}:[0-9]{2}:[0-9]{2}$/.test(time)) {
        var target = make_date(time);
        out.innerHTML = 'trigger at ' + target;
        send_message({
            data: 'trigger',
            date: target,
        });
    }
    else {
        out.innerHTML = JSON.stringify({ error: 'invalid date' });
    }
});

var clock = document.getElementById('clock');
setInterval(function() {
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    m = m < 10 ? "0" + m : m;
    s = s < 10 ? "0" + s : s;
    clock.innerHTML = h + ":" + m + ":" + s;
}, 100);

var find_video = setInterval(function() {
    send_message('VIDEO_FOUND', function(reply) {
        if (reply.found) {
            clearInterval(find_video);
            var out = document.getElementById('console');
            out.innerHTML = JSON.stringify({status: 'video tag found'});
        }
    });
}, 100);
