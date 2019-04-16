const dotenv = require("dotenv").config();
var mysql = require("mysql");
var inquirer = require("inquirer");
var figlet = require("figlet");
var Table = require("cli-table");
var colors = require("colors");
var keys = require("./keys.js");
var fs = require("fs");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: keys.mysqlPassword,
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
    setTimeout(viewInventory, 1000 * 0.1);
}

function viewInventory() {
    inquirer.prompt({
        name: "confirm",
        type: "confirm",
        message: "Would you like to view the current inventory?"
    }).then(function (answer) {
        if (answer.confirm) {
            displayInventory();
        }
        else {
            console.log("Thank you for visiting, come back again!");
            connection.end();
        }
    });
}

function displayInventory() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        // console.log(res);
        var table = new Table({
            head: ["Item ID", "Product Name", "Description", "Department", "Price", "Stock"],
            colWidths: [9, 30, 75, 12, 8, 10]
        });
        for(var i = 0; i < res.length; i++) {
            table.push(
                [res[i].item_id, res[i].product_name, res[i].product_description, res[i].department_name, res[i].sales_price, res[i].stock_quantity]
            );
        };
        console.log(table.toString());
        askToPurchase();
    });

}

function askToPurchase() {
    inquirer.prompt({
        name: "confirm",
        type: "confirm",
        message: "Would you like to make a purchase?"
    }).then(function (answer) {
        if (answer.confirm) {
            placeOrder();
        }
        else {
            console.log("Thank you for visiting, come back again!");
            connection.end();
        }
    });
}

function placeOrder() {
    inquirer.prompt([{
        name: "itemToBuy",
        type: "input",
        message: "Please enter the item number for the product that you would like to purchase.",
        validate: function (value) {
            if (isNaN(value) === false) {
                return true;
            }
            return false
        }
    }, {
        name: "quantityToBuy",
        type: "input",
        message: "How many would you like to buy?",
        validate: function (value) {
            if (isNaN(value) === false) {
                return true;
            }
            return false
        }
    }]).then(function (desiredItem) {
        // var query = "SELECT product_name, department_name, sales_price, stock_quantity FROM products WHERE ?";
        var query = "SELECT * FROM products WHERE ?";
        connection.query(query, {item_id: desiredItem.itemToBuy}, function (err, res) {
            if (err) throw err;
            // console.log(res);
            // console.log(desiredItem.quantityToBuy);
            // console.log(res[0].stock_quantity);
            if (desiredItem.quantityToBuy <= res[0].stock_quantity){
                console.log("We have enough in stock!".rainbow);
                var updateQuantity = res[0].stock_quantity - desiredItem.quantityToBuy;
                var orderTotal = res[0].sales_price * desiredItem.quantityToBuy;
                // console.log(updateQuantity);
                // console.log(orderTotal);
                var orderPlaced = "Your order for " + desiredItem.quantityToBuy + " " + res[0].product_name + " has been placed. \nYour total cost is $" + orderTotal + ". Thank you for your business!";
                console.log(orderPlaced.green);
                connection.query("UPDATE products SET ? WHERE ?", 
                    [{
                        stock_quantity: updateQuantity
                    },{
                        item_id: desiredItem.itemToBuy
                    }], 
                    function(error, result) {
                        if(error) throw error;
                    });
                viewInventory();
            }
            else{
                console.log("Sorry, insufficient quantity in stock.  Please enter a lower quantity to purchase.".red);
                placeOrder();
            }
        })
    });
}
