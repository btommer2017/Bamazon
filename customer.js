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

    // promt the user after the connection is made
    queryUser();
});

function listItems() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        console.table(res);
        queryUser();
    });
}
console.log("\nWelcome to Bamazon!  The place where all your sporting needs are met!\n")
function queryUser() {
    inquirer
        .prompt([{
            name: "query",
            type: "list",
            message: "Please choose from the following options:",
            choices: ["Purchase Products", "View Inventory", "Exit"]
        }]).then(function (inquirerResponse) {

            switch (inquirerResponse.query) {

                case 'View Inventory':
                    listItems();
                    break;

                case 'Purchase Products':
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
        inquirer
            .prompt([{
                name: "id",
                type: "input",
                message: "Please input the item's ID you would like to purchase.",
                choices: console.table(res),
                validate: function (value) {
                    var numL = res.length;
                    if (value <= numL && value > 0 && res[value - 1].stock_quantity > 0) {
                        console.log("\n\nProduct: " + res[value - 1].product_name + "\nPrice: $" + res[value - 1].price + "\nQuantity Available: " + res[value - 1].stock_quantity + "\n");
                        return true;
                    }
                    console.log("\n\nThe ID you have chosen is either out of stock, or invalid. Please make another selection.\n");

                    return false;

                }
            }])
            .then(function (inquirerResponse) {
                var num = (inquirerResponse.id - 1);
                inquirer
                    .prompt([{
                        name: "quantity",
                        type: "input",
                        message: "How many would you like to purchase?",
                        validate: function (value) {
                            stockQuan = res[num].stock_quantity;

                            if ((value <= stockQuan) && (value > 0)) {
                                return true;
                            }
                            console.log("\n\nPlease enter a valid amount.\n");
                            return false;
                        }

                    }])

                    .then(function (inquirerResponse) {
                        quan = (inquirerResponse.quantity);
                        each = res[num].price;
                        cost = quan * each;
                        console.log(`\nItem: ${res[num].product_name}`);
                        console.log(`Quantity: ${quan}`);
                        console.log(`Cost per item: $${each}`);
                        console.log(`Total Cost: $${cost}\n`);
                        connection.query(
                            "UPDATE products SET ? WHERE ?", [{
                                    stock_quantity: (stockQuan - quan)
                                },
                                {
                                    id: (num + 1)
                                }
                            ],

                            function (error) {
                                if (error) throw err;
                            }
                        );

                        connection.query("INSERT INTO shopping_cart SET ?", {
                            product_name: res[num].product_name,
                            price: each,
                            quantity: quan,
                            total: (quan * each)
                        }, )

                        keepShopping();

                    })
            })
    })
}

function keepShopping() {
    inquirer
        .prompt([{
            name: "continue",
            type: "list",
            message: "Anything else we can help you with?",
            choices: ["Keep shopping", "Exit"]
        }])
        .then(function (inquirerResponse) {

            if (inquirerResponse.continue === "Keep shopping") {

                queryUser();
            } else {
                console.log("");
                exitStore();
            }
        });
}

function exitStore() {
    console.log("\nThank you for shopping!");
    
    connection.query("SELECT * FROM shopping_cart", function (err, res) {
      if (err) throw err;
      // console.log("Number of Lines = " + res.length);
      // console.log(res[0].total);
      if (res.length > 0){
        console.log("Here's your receipt:\n");
        let totalPrice = 0;
        for (i=0; i<res.length; i++){
          totalPrice += res[i].total;
        }
        console.table(res);
        console.log("Total Price = $" + parseFloat(totalPrice).toFixed(2));
      }
    });
    // Clear the order for the next customer
    connection.query("TRUNCATE TABLE shopping_cart", function (err, res) {
        if (err) throw err;
    });

    connection.end();
}