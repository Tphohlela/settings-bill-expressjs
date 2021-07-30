let express = require('express');
let app = express();
let exphbs = require('express-handlebars');
let bodyParser = require('body-parser');
let BillWithSettings = require("./settingsBill");
let moment = require('moment');

let settingsBill = BillWithSettings();
moment().format()

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use(express.static('public'));

app.get("/", function (req, res) {
    res.render("index", {
        setting1: settingsBill.getSettings(),
        total: settingsBill.totals(),
        critical: settingsBill.totalClassNameCritical(),
        warning: settingsBill.totalClassNameWarning(),

    });


});
app.post("/settings", function (req, res) {
    settingsBill.setSettings({
        callCost: req.body.callCost,
        smsCost: req.body.smsCost,
        warningLevel: req.body.warningLevel,
        criticalLevel: req.body.criticalLevel
    });

    console.log(settingsBill.getSettings());

});

app.post("/action", function (req, res) {


    console.log(req.body.actionType);

    settingsBill.recordAction(req.body.actionType);
 

    res.redirect("/");
});


app.get("/actions", function (req, res) {

    const newArray = settingsBill.actions();

    newArray.forEach(function (element) {
        element.time = moment(element.timestamp).fromNow()
    });

    
    //console.log(req);
    console.log(settingsBill.actions)

    res.render("actions", {

        actions: newArray,
        
    });

});
app.get("/actions/:actionType", function (req, res) {

    const actionType = req.params.actionType;
    
    res.render("actions", {
        actions: settingsBill.actionsFor(actionType)
    });

});

let PORT = process.env.PORT || 3011;

app.listen(PORT, function () {
    console.log('App starting on port', PORT);
});
