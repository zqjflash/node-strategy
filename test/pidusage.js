var pidusage = require("pidusage");
setInterval(function() {
    pidusage(process.pid, function(err, status) {
        console.log(status);
    });
},1000);

