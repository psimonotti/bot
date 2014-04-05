var http = require('http'),
    path = require('path'),
    express = require('express'),
    exphbs = require('express3-handlebars'), //https://www.npmjs.org/package/express3-handlebars
    app = express(),
    server = http.createServer(app);

app.configure(function() {
    app.use(express.static(path.resolve(__dirname, 'public')));
    app.use(express.cookieParser());
    app.use(express.bodyParser());
    app.use(app.router);
});

app.engine('handlebars', exphbs({defaultLayout: 'main'}));

app.set('view engine', 'handlebars');

var auth = express.basicAuth(function (user, pass, callback) {
    var result = (user === 'testUser' && pass === 'testPass');
    if (result) {
        callback(null , user);
    } else {
        callback('wrong usr or pwd');
    }
    
});

app.get('/', auth, function (req, res) {
    res.render('editor', {user: req.user});
});



server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("Server listening at", addr.address + ":" + addr.port);
});
