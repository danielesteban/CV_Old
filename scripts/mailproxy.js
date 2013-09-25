var http = require('http'), 
    qs = require('querystring'),
    nodemailer = require('nodemailer'),
    smtpTransport = nodemailer.createTransport("SMTP",{
        service: "Gmail",
        auth: {
            user: "dani@hellacoders.com",
            pass: "xxxxxxxxxxxxxxxxxxxx"
        }
    }),
    srv = http.createServer(function (req, res) {
        if(req.method === "POST") {
            var data = '';
            req.on("data", function(chunk) {
                data += chunk;
            });
            req.on("end", function() {
                data = qs.parse(data);
                if(!data.name || data.name === '' || !data.name || data.email === '' || !data.subject || data.subject === '' || !data.message || data.message === '') return res.end();
                var date = new Date(),
                    mailOptions = {
                        from : "CV <dani@hellacoders.com>",
                        to : "dani@hellacoders.com",
                        subject : "Mensaje " + date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes(),
                        html : "<dl>" +
                            "<dt><b>Nombre:</b></dt><dd>" + data.name + "</dd>" +
                            "<dt><b>Email:</b></dt><dd>" + data.email + "</dd>" +
                            "<dt><b>Asunto:</b></dt><dd>" + data.subject + "</dd>" +
                            "<dt><b>Mensaje:</b></dt><dd>" + data.message + "</dd>" +
                            "</dl>"
                    };

                smtpTransport.sendMail(mailOptions, function(err, mailres){
                    if(err) return res.end();
                    res.writeHead(200, {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'http://localhost:8080'});
                    res.end('1');
                });
            });
        }
    });

srv.listen(process.env.OPENSHIFT_NODEJS_PORT || 8090, process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0');
