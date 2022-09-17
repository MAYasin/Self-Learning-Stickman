var express = require('express');
var reload = require('reload');

var app = express();
var sever = app.listen(process.env.PORT || 3000);

app.use(express.static('src'));

app.get('/', (req, res) => {
    res.sendFile('index.html', { root: path.join(__dirname, 'src') });
})

console.log("sever running");

console.log("http://localhost:3000/");

reload(app);

module.exports = app;