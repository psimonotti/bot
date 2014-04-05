var express = require('express'),
    path = require('path'),
    exphbs  = require('express3-handlebars'), //https://www.npmjs.org/package/express3-handlebars
    app = express();

app.use(express.static(path.resolve(__dirname, 'public')));

app.engine('handlebars', exphbs({defaultLayout: 'main'}));

app.set('view engine', 'handlebars');

app.get('/', function (req, res) {
    res.render('home');
});


app.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = app.address();
  console.log("Server listening at", addr.address + ":" + addr.port);
});
