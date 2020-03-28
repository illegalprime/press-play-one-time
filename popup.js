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

function make_date(time) {
    var now = new Date();
    return new Date(
        now.getFullYear(), now.getMonth(), now.getDate(),
        time[0], time[1], time[2], 0
    );
}

function parse_time(time) {
    var trimmed = time.trim().split(':');
    if (trimmed.length === 3) {
        var ints = trimmed.map(function(i) { return parseInt(i); });
        var nanned = trimmed.find(function(i) { return isNaN(i); });
        if (!nanned) {
            return ints;
        }
    }
    return null;
}

document.querySelector('input[name=trigger]').addEventListener('click', function() {
    var out = document.getElementById('console');
    var time_elem = document.querySelector('input[name=time]');
    var parsed = parse_time(time_elem.value);
    if (parsed) {
        var target = make_date(parsed);
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

document.querySelector('input[name=seekbtn]').addEventListener('click', function() {
    var out = document.getElementById('console');
    var time_elem = document.querySelector('input[name=seek]');
    var parsed = parse_time(time_elem.value);
    if (parsed) {
        send_message({
            data: 'seek',
            seek: parsed[0] * 60 * 60 + parsed[1] * 60 + parsed[2],
        });
    }
    else {
        out.innerHTML = JSON.stringify({ error: 'invalid seek time' });
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
