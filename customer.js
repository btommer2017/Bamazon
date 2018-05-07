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
  connection.query("SELECT id, product_name, price FROM products", function (err, res) {
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
      console.log(inquirerResponse.query);

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
    // console.log("These are the results before user input and no table");
    // console.log(res[0].id);
    // console.log(res[0].product_name);
    // console.log(res[0].price);
    // console.log(res[0].stock_quantity);
    // console.log("###################################################################################3");
    inquirer
      .prompt([{
          name: "id",
          type: "input",
          message: "Please select the item's ID you would like to purchase.",
          choices: console.table(res)
          }
      ])
      .then(function(inquirerResponse){
        var num = (inquirerResponse.id - 1);
        console.log(`Num = ${num}`);
        inquirer
        .prompt([{

          name: "quantity",
          type: "input",
          message: "How many would you like to purchase? \n",

          validate: function(value) {
            var stockQuan = res[num].stock_quantity+1;
            if ((value < stockQuan) && (value > 0)) {
              return true;
            }
            // console.log("\nError: 0dddddddddddddddddddd ");
            console.log("\nPlease enter a valid amount");
            // console.log("Error: 1dddddddddddddddddddd ");
            // console.log("Error: 2dddddddddddddddddddd ");
            // console.log("Error: 3dddddddddddddddddddd ");
            console.log("")
            return false;
          }

        }])
    
      .then(function (inquirerResponse) {
        //   if(inquirerResponse.l)
        // var num = (inquirerResponse.id - 1);
        var quan = (inquirerResponse.quantity);
        var each = res[num].price;
        var cost = quan * each;
        // console.log(num);
        // console.log(inquirerResponse.id);
        // console.log(inquirerResponse.quantity);
        // console.log(`Item: ${res[num].product_name}, Quantity: ${quan}. Total Cost: $${cost}  `);
        console.log(`Item: ${res[num].product_name}`);
        console.log(`Quantity: ${quan}`);
        console.log(`Cost per item: $${each}`);
        console.log(`Total Cost: $${cost}`);
        // console.log(inquirerResponse.purchase);
        // console.log(inquirerResponse.quantity);
        // console.log("so far stuff is sorta working");
        connection.end();

      })
  })
})
}


function exitStore() {
  console.log("Thank you for shopping!");
  connection.end();

}