var express = require("express"),
    sqlite3 = require('sqlite3').verbose(),
    app = express();

/* Prepping SQLite */
var db = new sqlite3.Database(':memory:');
db.run("DROP TABLE IF EXISTS Foo", function(err, row) {
  if (err) { console.log(err); }
});
db.run("CREATE TABLE Foo(name TEXT)", function(err, row) {
  if (err) { console.log(err); }
});

/* Routes */
app.get("/", function (req, res) {
  res.send("Hey buddy!");
});

app.get("/:name", function (req, res) {
  db.get("SELECT name FROM Foo", function (err, row) {
    console.log(err);
    if (row === undefined) {
      db.serialize(function() {
        db.run("INSERT INTO Foo(name) VALUES('" + req.params.name + "')", function(err, row) {
          if (err) {
            res.send(500);
          } else {
            res.send("Created a new thing with name " + req.params.name);
          }
        });
      });
    } else {
      res.send(row);
      db.close();
    }
  });
});

app.listen(3000, function () {
  console.log('Express listening on port 3000');
});
