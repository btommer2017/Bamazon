var mysql = require("mysql");
var inquirer = require("inquirer");
require("console.table");

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "bamazonDB"
});

// connect to the mysql server and sql database
connection.connect(function (err) {
  if (err) throw err;

  // run the start function after the connection is made to prompt the user
  queryUser();
});

function listItems() {
  connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;
    console.table(res);
    queryUser();
    // userPurchase();
  });
}

function queryUser() {
  inquirer
    .prompt([{
      name: "query",
      type: "list",
      message: "Please choose from the following options",
      choices: ["See Inventory", "Purchase products", "Exit"]
    }]).then(function (inquirerResponse) {
      
      switch (inquirerResponse.query) {

        case 'See Inventory':
          listItems();
          break;

        case 'Purchase products':
          userPurchase();
          break;

        case 'Exit':
          exitStore();
          break;
      }
    });
}

function userPurchase() {

  connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;
    console.log(res.length + "console.log the length");
      inquirer
      .prompt([{
          name: "id",
          type: "input",
          message: "Please select the item's ID you would like to purchase.",
          choices: console.table(res),
          validate: function(value) {
              var numL = res.length;
            if (value <= numL && value >0) {
             return true;
            }
             console.log("\n\nPlease enter a valid ID.\n");
             return false;
          }
          }
      ])
      .then(function(inquirerResponse){
        var num = (inquirerResponse.id - 1);
        inquirer
        .prompt([{
          name: "quantity",
          type: "input",
          message: "How many would you like to purchase?",
          validate: function(value) {
            var stockQuan = res[num].stock_quantity+1;
            if ((value < stockQuan) && (value > 0)) {
              return true;
            }
             console.log("\n\nPlease enter a valid amount.\n");
             return false;
          }

        }])
    
      .then(function (inquirerResponse) {
        var quan = (inquirerResponse.quantity);
        var each = res[num].price;
        var cost = quan * each;
        console.log(`\nItem: ${res[num].product_name}`);
        console.log(`Quantity: ${quan}`);
        console.log(`Cost per item: $${each}`);
        console.log(`Total Cost: $${cost}\n`);

        keepShopping();

      })
  })
})
}

function keepShopping(){
    inquirer
        .prompt([{
          name: "continue",
          type: "confirm",
          message: "Anything else we can help you with?\n"
}])
.then(function (inquirerResponse){
   
if (inquirerResponse.continue === true) {
    
   queryUser();
}
else
{
console.log("");
exitStore();
}
});
}

function exitStore() {
  console.log("Thank you for shopping!");
  connection.end();
}