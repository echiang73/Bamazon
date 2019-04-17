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
    setTimeout(identifyRole, 1000 * 0.1);
}

function identifyRole() {
    inquirer.prompt({
        name: "userRole",
        type: "rawlist",
        message: "Please identify your role.",
        choices: 
        ["Customer", "Manager", "Supervisor", "EXIT"]
    }).then(function (answer) {
        switch (answer.userRole){
            case "Customer":
            console.log("Hello Customer!");
            askViewInventory();
            break;

            case "Manager":
            console.log("Hello Manager!");
            managerGreeting();
            break;

            case "Supervisor":
            console.log("Hello Supervisor!");
            // supervisorRole();
            break;

            case "EXIT":
            console.log("Thank you for visiting, come back again!");
            connection.end();
            break;
        }
    });
}

// ---------Start of Customer Codes-------
function askViewInventory() {
    inquirer.prompt({
        name: "confirm",
        type: "confirm",
        message: "Would you like to view the current inventory?"
    }).then(function (answer) {
        if (answer.confirm) {
            displayInventory();
            setTimeout(askToPurchase, 1000 * 0.1);
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
            head: ["Item ID", "Product Name", "Description", "Department", "$ Price", "Stock Qty"],
            colWidths: [9, 30, 75, 12, 8, 10]
        });
        for(var i = 0; i < res.length; i++) {
            table.push(
                [res[i].item_id, res[i].product_name, res[i].product_description, res[i].department_name, res[i].sales_price, res[i].stock_quantity]
            );
        };
        console.log(table.toString());
        // askToPurchase();
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
                
                var table2 = new Table({
                    head: ["Product Purchased", "Description", "Quantity Ordered", "$/Unit", "$ Total Cost"],
                    colWidths: [30, 75, 18, 12, 14]
                });
                table2.push(
                    [res[0].product_name, res[0].product_description, desiredItem.quantityToBuy, res[0].sales_price, orderTotal]
                );
                console.log(table2.toString());
        
                var orderPlaced = "\nYour order for " + desiredItem.quantityToBuy + " " + res[0].product_name + " has been placed. \nYour total cost is $" + orderTotal + ". Thank you for your business!";
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
                askViewInventory();
            }
            else{
                console.log("Sorry, insufficient quantity in stock.  Please enter a lower quantity to purchase.".red);
                placeOrder();
            }
        })
    });
}

// ---------End of Customer Codes--------
// ---------Start of Manager Codes-------

function managerGreeting(){
    figlet("Bamazon Manager App", function (err, data) {
        if (err) {
            console.log('Something went wrong...');
            console.dir(err);
            return;
        }
        console.log(data);
    });
    setTimeout(managerOptions, 1000 * 0.1);
};

function managerOptions(){
    inquirer.prompt({
        name: "options",
        type: "rawlist",
        message: "Please select an option!",
        choices: 
        ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Delete Product", "Exit to Main Menu"]
    }).then(function (answer) {
        switch (answer.options){
            case "View Products for Sale":
            console.log("\nView Products Currently for Sale".red);
            displayInventory();
            setTimeout(managerOptions, 1000 * 0.1);
            break;

            case "View Low Inventory":
            console.log("\nTable of Low Inventory Products!".red);
            displayLowInventory();
            setTimeout(managerOptions, 1000 * 0.1);
            break;

            case "Add to Inventory":
            console.log("\nTo ADD to Current Inventory!".red);
            addToInventory();
            break;

            case "Add New Product":
            console.log("\nTo ADD New Products!".red);
            addNewProduct();
            break;

            case "Delete Product":
            console.log("\nTo DELETE Products!".red);
            deleteProduct();
            break;

            case "Exit to Main Menu":
            welcome();
            break;
        }
    });
}

function displayLowInventory(){
    connection.query("SELECT * FROM products WHERE stock_quantity <= 5", function (err, res) {
        if (err) throw err;
        // console.log(res);
        var table = new Table({
            head: ["Item ID", "Product Name", "Description", "Department", "$ Price", "Stock Qty"],
            colWidths: [9, 30, 75, 12, 8, 10]
        });
        for(var i = 0; i < res.length; i++) {
            table.push(
                [res[i].item_id, res[i].product_name, res[i].product_description, res[i].department_name, res[i].sales_price, res[i].stock_quantity]
            );
        };
        console.log(table.toString());
    });
}

function addToInventory(){
    inquirer.prompt([{
        name: "addItem",
        type: "input",
        message: "Please enter the item number for the product that you would like to ADD to inventory!",
        validate: function (value) {
            if (isNaN(value) === false) {
                return true;
            }
            return false
        }
    }, {
        name: "quantityToAdd",
        type: "input",
        message: "What quantity would you like to ADD to inventory?",
        validate: function (value) {
            if (isNaN(value) === false) {
                return true;
            }
            return false
        }
    }]).then(function (answer) {
        var query = "SELECT * FROM products WHERE ?";
        connection.query(query, {item_id: answer.addItem}, function (err, res) {
            if (err) throw err;
            var msg = "You are adding quantity of " + answer.quantityToAdd + " " + res[0].product_name + " to the inventory!";
            console.log(msg.red);
            var updateItem = answer.addItem;
            var updateQuantity = (parseInt(res[0].stock_quantity) + parseInt(answer.quantityToAdd));
        
            var table3 = new Table({
                head: ["Item ID", "Product Name", "Description", "$ Price", "Qty to Add", "Expected Total Stock"],
                colWidths: [9, 30, 55, 12, 15, 25]
            });
            table3.push(
                [res[0].item_id, res[0].product_name, res[0].product_description, res[0].sales_price, answer.quantityToAdd, (parseInt(res[0].stock_quantity) + parseInt(answer.quantityToAdd))]
            );
            console.log(table3.toString());

            inquirer.prompt({
                name: "confirm",
                type: "confirm",
                message: "Please confirm item and quantity to ADD to inventory!".red
            }).then(function (answer) {
                if (answer.confirm){
                    connection.query("UPDATE products SET ? WHERE ?", 
                        [{
                            stock_quantity: updateQuantity
                        },{
                            item_id: updateItem
                        }], 
                        function(error, result) {
                            if(error) throw error;
                        });
                    console.log("\nThe item has been succesfully added!".red);
                    managerOptions();
                }
                else{
                    console.log("\nThe item has NOT been added!".red);
                    managerOptions();
                }
            });
        });
            
    });
}

function addNewProduct(){
    inquirer.prompt([{
        name: "name",
        type: "input",
        message: "Please enter the NAME of the NEW product that you would like to add!",
    }, {
        name: "description",
        type: "input",
        message: "Please enter a DESCRIPTION of the new product!",
    }, {
        name: "department",
        type: "rawlist",
        message: "Please select the DEPARTMENT that the new product belows to!",
        choices: ["Books", "Cosmetics", "Food", "Toys"]
    }, {
        name: "price",
        type: "input",
        message: "What is the retail PRICE for the new product?",
        validate: function (value) {
            if (isNaN(value) === false) {
                return true;
            }
            return false
        }
    }, {
        name: "quantityToAdd",
        type: "input",
        message: "What QUANTITY would you like to stock in the inventory for the new product?",
        validate: function (value) {
            if (isNaN(value) === false) {
                return true;
            }
            return false
        }
    }]).then(function(answer) {
        var table4 = new Table({
            head: ["Item ID", "Product Name", "Description", "Department", "$ Price", "Qty to Add"],
            colWidths: [9, 30, 75, 12, 8, 10]
        });
        table4.push(
            ["TBD", answer.name, answer.description, answer.department, answer.price, answer.quantityToAdd]
        );
        console.log(table4.toString());

        inquirer.prompt({
            name: "confirm",
            type: "confirm",
            message: "Please confirm the information for the NEW product that you would like to add!".red
        }).then(function (toAdd) {
            if (toAdd.confirm){
                connection.query("INSERT INTO products SET ?", 
                    {
                        product_name: answer.name,
                        product_description: answer.description,
                        department_name: answer.department,
                        sales_price: answer.price,
                        stock_quantity: answer.quantityToAdd
                    }, 
                    function(error, result) {
                        if(error) throw error;
                    });
                console.log("\nThe NEW product has been succesfully added to the inventory!".red);
                managerOptions();
            }
            else{
                console.log("\nThe new product has NOT been added!".red);
                managerOptions();
            }
        });
    });
}

