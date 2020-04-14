const bodyParser = require('body-parser');
const compression = require('compression');
const fs = require('fs');
const express = require('express');
const helmet = require('helmet');
const template = require('./lib/template.js');
const topicRouters = require('./routers/topicRouters');
const homeRouters = require('./routers/homeRouters');

const app = express();

app.use(helmet());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(compression());
app.get('*', (req, res, next) => {
  fs.readdir('./data', (error, filelist) => {
    req.list = filelist;
    next();
  });
});

app.use('/topic', topicRouters);
app.use('/', homeRouters);

app.use((req, res, next) => res.status(404).send('Sorry cant find that!'));

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('something broke!')
});

app.listen(3000, () => console.log('Example app listening on port 3000!'))
