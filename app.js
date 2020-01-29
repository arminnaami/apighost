var restify = require('restify');
var gddirect = require('gddirecturl');
var gauth = require('./gauth')

async function gdriveHandler(req, res, next) {
    try {
        var o = await gddirect.getMediaLink(req.params.gdriveid);
        res.send(o);
    } catch (error) {
        res.send('error');
    }
}

async function gdrivestreamHandler(req, res, next) {
    try {
        var o = await gddirect.getMediaLink(req.params.gdriveid);
        res.redirect(o.src, next)
    } catch (error) {
        console.log('Unable to fetch the stream of google id');
        res.send('error');
    }
}

async function tokenHandler(req, res, next) {
    try {
        var o = gauth.generateAuthUrl();
        res.redirect(o, next);
    } catch (error) {
        console.log(error);
        console.log('Unable to generate the auth url for google');
        res.send('Unable to generate the auth url for google');
    }
}

async function tokenCallbackHandler(req, res, next) {
    try {
        var code = req.query.code;
        const {tokens} = await gauth.getToken(code);
        res.send(tokens);    
    } catch (error) {
        console.log(error);
        console.log('Unable to get the token for google');
        res.send('Unable to get the token for google');
    }
}

var server = restify.createServer();
server.use(restify.plugins.queryParser());
server.get('/:gdriveid', gdriveHandler);
server.get('/dl/:gdriveid', gdrivestreamHandler);

server.get('/auth/google/token', tokenHandler);
server.get('/auth/google/callback', tokenCallbackHandler);

server.get('/', function (req, res) {
    res.send('Welcome to api ghost!!!');
});
var port = normalizePort(process.env.PORT || '3000');

server.listen(port, function () {
    console.log('%s listening at %s', server.name, server.url);
});

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}
