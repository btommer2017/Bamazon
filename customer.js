var mysql = require("mysql");
var inquirer = require("inquirer");

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "bamazonDB"
});

// connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
   
  // run the start function after the connection is made to prompt the user
  listItems();
});


function listItems(){
    connection.query("SELECT id, product_name, price FROM products", function(err, res) {
      if (err) throw err;
      console.log(res);
      userPurchase();
    });
  }
  
function userPurchase(){

  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;

    inquirer
    .prompt([
         {
        name: "purchase",
        type: "list",
        message: "Please select the item's ID you would like to purchase.",

        choices: function(){
          var choiceArray = [];
          for (var i = 0; i < res.length; i++){
            choiceArray.push(res[i].product_name);
          }
          return choiceArray;
        }

      },
      {
        name: "quantity",
        type: "input",
        message: "How many would you like to purchase?",
      }
    ])
  
      .then(function(inquirerResponse) {
//   if(inquirerResponse.l)
console.log(inquirerResponse.purchase);
console.log(inquirerResponse.quantity);
console.log("so far stuff is sorta working");
connection.end();

})
  })
}




