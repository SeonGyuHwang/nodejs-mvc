const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const fs = require('fs');

// view engine setup
app.set('views', VIEWS);
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(PUBLIC));

require(RESOURCE+'/models')(fs);
require(RESOURCE+'/services')(fs);
require(RESOURCE+'/controller')(fs);

module.exports = app;
