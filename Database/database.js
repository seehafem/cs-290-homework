/************************************************************************
 * Name: Michael Seehafer
 * Date: 3/11/19
 * Project: Database Interactions
 ***********************************************************************/

let express = require('express');
let mysql = require('./dbcon.js');

let app = express();
let handlebars = require('express-handlebars').create({defaultLayout:'main'});
let bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 4987);

app.get('/', function(req, res, next) {
    //Returns the full table from the database
    if (req.query.mode == "table") {
        mysql.pool.query("SELECT * FROM workouts", function(err, rows, fields) {
            if(err) {
                next(err);
                return;
            }
            res.send(rows);
        });
    }
    //Returns just the indicated row from the database
    else if (req.query.mode == "row") {
        mysql.pool.query("SELECT * FROM workouts WHERE id = " + req.query.id, function(err, rows, fields) {
            if(err) {
                next(err);
                return;
            }
            res.send(rows);
        });
    }
    //Renders the home page when the webpage is first loaded
    else {
        res.render('home', null);
    }
});

app.post('/', function(req, res, next) {
    //Inserts a new entry into the database
    if (req.query.mode == "insert") {
        mysql.pool.query("INSERT INTO workouts (name, reps, weight, date, lbs) VALUES (?, ?, ?, ?, ?)",
                        [req.body.name, req.body.reps, req.body.weight, req.body.date, req.body.lbs], function(err, result) {
            if(err){
                next(err);
                return;
            }
            res.send(result);
        });
    }
    //Deletes the indicated value from the database
    else if (req.query.mode == "delete") {
        mysql.pool.query("DELETE FROM workouts WHERE id=?", [req.body.id], function(err, result) {
            if(err){
                next(err);
                return;
            }
            res.send(result);
        });
    }
    //Updates the indicated value from the database
    else if (req.query.mode == "update") {
        mysql.pool.query("SELECT * FROM workouts WHERE id=?", [req.body.id], function(err, result) {
            if(err){
                next(err);
                return;
            }
            //Idea for a safe update adapated from lecture material
            if(result.length == 1){
                let current = result[0];
                mysql.pool.query("UPDATE workouts SET name = ?, reps = ?, weight = ?, date = ?, lbs = ? WHERE id=? ",
                    [req.body.name || current.name, req.body.reps || current.reps, req.body.weight || current.weight,
                    req.body.date || current.date, req.body.lbs || current.lbs, req.body.id],
                    function(err, result){
                    if(err){
                        next(err);
                        return;
                    }
                    res.send(result);
                });
            }
        });
    }
});

//Resets or initiates a table for use in this application
app.get('/reset-table',function(req,res,next){
    //Replace your connection pool with the your variable containing the connection pool
    mysql.pool.query("DROP TABLE IF EXISTS workouts", function(err){
        let createString = "CREATE TABLE workouts("+
        "id INT PRIMARY KEY AUTO_INCREMENT,"+
        "name VARCHAR(255) NOT NULL,"+
        "reps INT,"+
        "weight INT,"+
        "date DATE,"+
        "lbs BOOLEAN)";

    mysql.pool.query(createString, function(err){
        res.render('home', null);
    })
  });
});

app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
