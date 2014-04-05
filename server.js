var http= require('http'),
    path= require('path'),
    express = require('express'),
    exphbs  = require('express3-handlebars'), //https://www.npmjs.org/package/express3-handlebars
    app = express(),
    server = http.createServer(app);

app.use(express.static(path.resolve(__dirname, 'public')));

app.engine('handlebars', exphbs({defaultLayout: 'main'}));

app.set('view engine', 'handlebars');

app.get('/', function (req, res) {
    res.render('home');
});

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("Server listening at", addr.address + ":" + addr.port);
});
