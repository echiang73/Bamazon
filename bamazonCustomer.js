var mysql = require("mysql");
var inquirer = require("inquirer");
var figlet = require("figlet");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon_DB"
});

connection.connect(function (err) {
    if (err) throw err;
    // console.log("connected as id " + connection.threadId + "\n");
    welcome();
});

function welcome() {
    figlet("Welcome to Bamazon!", function (err, data) {
        if (err) {
            console.log('Something went wrong...');
            console.dir(err);
            return;
        }
        console.log(data);
    });
    setTimeout(displayProducts, 1000 * 0.1);
}

function displayProducts() {
    inquirer.prompt({
        name: "confirm",
        type: "confirm",
        message: "Would you like to view the current inventory?"
    }).then(function (answer) {
        if (answer.confirm) {
            promptCommand();
        }
        else {
            console.log("Thank you for visiting, come back again!");
            return;
        }
    });
}

function promptCommand() {
    inquirer.prompt([{
        name: "itemToBuy",
        type: "input",
        message: "What would you like to buy? Enter the item number.",
        validate: function(value) {
			if (isNaN(value) === false) {
				return true;
			}
			return false
		}
    },{
        name: "quantityToBuy",
        type: "input",
        message: "How many would you like to buy?",
        validate: function(value) {
			if (isNaN(value) === false) {
				return true;
			}
			return false
		}
    }]).then(function (userOrder) {
        var query = "SELECT product_name, department_name, sales_price, stock_quantity FROM products WHERE ?";
		connection.query(query, {item_id: userOrder.itemToBuy}, function(err, res) {
            if (err) throw err;
            console.log(res);
        })
        });
}
