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
        switch (answer.userRole) {
            case "Customer":
                console.log("Hello Customer!".red);
                askViewInventory();
                break;

            case "Manager":
                console.log("Hello Manager!".red);
                managerGreeting();
                break;

            case "Supervisor":
                console.log("Hello Supervisor!".red);
                supervisorGreeting();
                break;

            case "EXIT":
                console.log("Thank you for visiting, come back again!".rainbow);
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
            console.log("Thank you for visiting, come back again! Sending you back to the main menu.");
            identifyRole();
        }
    });
}

function displayInventory() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        // console.log(res);
        var table = new Table({
            head: ["Item ID", "Product Name", "Description", "Department", "$ Price", "Stock Qty"],
            colWidths: [9, 30, 70, 12, 12, 12]
        });
        for (var i = 0; i < res.length; i++) {
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
            console.log("OK, sending you back to the customer options menu then.");
            askViewInventory();
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
        connection.query(query, { item_id: desiredItem.itemToBuy }, function (err, res) {
            if (err) throw err;
            // console.log(res);
            // console.log(desiredItem.quantityToBuy);
            // console.log(res[0].stock_quantity);
            if (desiredItem.quantityToBuy <= res[0].stock_quantity) {
                console.log("We have enough in stock!".green);
                var updateQuantity = res[0].stock_quantity - desiredItem.quantityToBuy;
                var orderTotal = res[0].sales_price * desiredItem.quantityToBuy;
                var newProductSales = res[0].product_sales + orderTotal;
                // console.log(updateQuantity);
                // console.log(orderTotal);

                var table2 = new Table({
                    head: ["Product Purchased", "Description", "Quantity Ordered", "$/Unit", "$ Total Cost"],
                    colWidths: [30, 70, 18, 14, 14]
                });
                table2.push(
                    [res[0].product_name, res[0].product_description, desiredItem.quantityToBuy, res[0].sales_price, orderTotal]
                );
                console.log(table2.toString());

                var orderPlaced = "\nYour order for " + desiredItem.quantityToBuy + " " + res[0].product_name + " has been placed. \nYour total cost is $" + orderTotal + ". Thank you for your business!";
                console.log(orderPlaced.green);
                connection.query("UPDATE products SET ? WHERE ?",
                    [{
                        stock_quantity: updateQuantity,
                        product_sales: newProductSales
                    }, {
                        item_id: desiredItem.itemToBuy
                    }],
                    function (error, result) {
                        if (error) throw error;
                    });
                askViewInventory();
                return;
            }
            else {
                console.log("Sorry, insufficient quantity in stock.  Please enter a lower quantity to purchase.".red);
                placeOrder();
                return;
            }
        })
    });
}

// ---------End of Customer Codes--------
// ---------Start of Manager Codes-------

function managerGreeting() {
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

function managerOptions() {
    inquirer.prompt({
        name: "options",
        type: "rawlist",
        message: "Please select an option!",
        choices:
            ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Delete Product", "Exit to Main Menu"]
    }).then(function (answer) {
        switch (answer.options) {
            case "View Products for Sale":
                console.log("\nOK, let's view all the Products Currently for Sale".red);
                displayInventory();
                setTimeout(managerOptions, 1000 * 0.1);
                break;

            case "View Low Inventory":
                console.log("\nOK, here is the Table of Low Inventory Products!".red);
                displayLowInventory();
                setTimeout(managerOptions, 1000 * 0.1);
                break;

            case "Add to Inventory":
                console.log("\nOK, let's ADD to Current Inventory!".red);
                addToInventory();
                break;

            case "Add New Product":
                console.log("\nOK, let's ADD a NEW Product!".red);
                addNewProduct();
                break;

            case "Delete Product":
                console.log("\nOK, let's DELETE a Product!".red);
                deleteProduct();
                break;

            case "Exit to Main Menu":
                console.log("\nExiting to Main Menu, Goodbye Manager!".red);
                identifyRole();
                break;
        }
    });
}

function displayLowInventory() {
    connection.query("SELECT * FROM products WHERE stock_quantity <= 5", function (err, res) {
        if (err) throw err;
        // console.log(res);
        var table = new Table({
            head: ["Item ID", "Product Name", "Description", "Department", "$ Price", "Stock Qty"],
            colWidths: [9, 30, 70, 12, 12, 12]
        });
        for (var i = 0; i < res.length; i++) {
            table.push(
                [res[i].item_id, res[i].product_name, res[i].product_description, res[i].department_name, res[i].sales_price, res[i].stock_quantity]
            );
        };
        console.log(table.toString());
    });
}

function addToInventory() {
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
        connection.query(query, { item_id: answer.addItem }, function (err, res) {
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
                if (answer.confirm) {
                    connection.query("UPDATE products SET ? WHERE ?",
                        [{
                            stock_quantity: updateQuantity
                        }, {
                            item_id: updateItem
                        }],
                        function (error, result) {
                            if (error) throw error;
                        });
                    console.log("\nThe item has been succesfully added!".red);
                    managerOptions();
                    return;
                }
                else {
                    console.log("\nThe item has NOT been added!".red);
                    managerOptions();
                    return;
                }
            });
        });

    });
}

function addNewProduct() {
    connection.query("SELECT department_name FROM departments", function (error, result) {
        if (error) throw error;
        // console.log(result);
        var resultArray = [];
        for (var i = 0; i < result.length; i++) {
            resultArray.push(result[i].department_name);
        }
        // console.log(resultArray);

        inquirer.prompt([{
            name: "name",
            type: "input",
            message: "Please enter the NAME of the NEW product that you would like to add!".red,
        }, {
            name: "description",
            type: "input",
            message: "Please enter a DESCRIPTION of the new product!".red,
        }, {
            name: "department",
            type: "rawlist",
            message: "Please select the DEPARTMENT that the new product belows to!",
            choices: resultArray // In order to accommodate for any newly created Department, we would need to make a connection query and group all department_name as a variable of array and reference this a the choices.
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
        }]).then(function (answer) {
            var table4 = new Table({
                head: ["Item ID", "Product Name", "Description", "Department", "$ Price", "Qty to Add"],
                colWidths: [9, 30, 70, 12, 12, 12]
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
                if (toAdd.confirm) {
                    connection.query("INSERT INTO products SET ?",
                        {
                            product_name: answer.name,
                            product_description: answer.description,
                            department_name: answer.department,
                            sales_price: answer.price,
                            stock_quantity: answer.quantityToAdd
                        },
                        function (error, result) {
                            if (error) throw error;
                        });
                    console.log("\nThe NEW product has been succesfully added to the inventory!".red);
                    managerOptions();
                    return;
                }
                else {
                    console.log("\nThe new product has NOT been added!".red);
                    managerOptions();
                    return;
                }
            });
        });
    });
}

function deleteProduct() {
    inquirer.prompt({
        name: "deleteItem",
        type: "input",
        message: "Please enter the item number for the product that you would like to DELETE from inventory!",
        validate: function (value) {
            if (isNaN(value) === false) {
                return true;
            }
            return false
        }
    }).then(function (answer) {
        var query = "SELECT * FROM products WHERE ?";
        connection.query(query, { item_id: answer.deleteItem }, function (err, res) {
            if (err) throw err;
            var msg = "You are requesting to delete " + res[0].product_name + " completely from the inventory!";
            console.log(msg.red);

            var table5 = new Table({
                head: ["Item ID", "Product Name", "Description", "Department", "$ Price", "Stock Qty"],
                colWidths: [9, 30, 75, 12, 8, 10]
            });
            table5.push(
                [res[0].item_id, res[0].product_name, res[0].product_description, res[0].department_name, res[0].sales_price, res[0].stock_quantity]
            );
            console.log(table5.toString());

            inquirer.prompt({
                name: "confirm",
                type: "confirm",
                message: "Please confirm the request to DELETE the product entirely from the inventory!".red
            }).then(function (answer2) {
                if (answer2.confirm) {
                    connection.query("DELETE FROM products WHERE ?",
                        {
                            item_id: res[0].item_id,
                        },
                        function (error, result) {
                            if (error) throw error;
                        });
                    console.log("\nThe product has been succesfully deleted!".red);
                    managerOptions();
                    return;
                }
                else {
                    console.log("\nThe product has NOT been deleted!".red);
                    managerOptions();
                    return;
                }
            });
        });

    });
}

// ---------End of Manager Codes--------
// ---------Start of Supervisor Codes-------

function supervisorGreeting() {
    figlet("Bamazon Supervisor App", function (err, data) {
        if (err) {
            console.log('Something went wrong...');
            console.dir(err);
            return;
        }
        console.log(data);
    });
    setTimeout(supervisorOptions, 1000 * 0.1);
};

function supervisorOptions() {
    inquirer.prompt({
        name: "options",
        type: "rawlist",
        message: "Please select an option!",
        choices:
            ["View Product Sales by Department", "Create New Department", "Delete Department", "View Existing Departments and or Change Over Head Costs", "Exit to Main Menu"]
    }).then(function (answer) {
        switch (answer.options) {
            case "View Product Sales by Department":
                console.log("\nOK, let's view PRODUCT SALES by Department".red);
                displayDepartmentSales();
                setTimeout(supervisorOptions, 1000 * 0.1);
                break;

            case "Create New Department":
                console.log("\nOK, let's create a NEW Department".red);
                createDepartment();
                break;

            case "Delete Department":
                console.log("\nOK, let's DELETE a Department".red);
                deleteDepartment();
                break;

            case "View Existing Departments and or Change Over Head Costs":
                console.log("\nOK, let's view the Departments and the Over Head Costs".red);
                viewDeptOverHeadCosts();
                break;

            case "Exit to Main Menu":
                console.log("\nExiting to Main Menu, Goodbye Supervisor!".red);
                identifyRole();
                break;
        }
    });
}

function displayDepartmentSales() {
    var query = "SELECT * FROM departments JOIN (SELECT department_name, SUM(product_sales) AS totalDeptProdSales FROM products GROUP BY department_name) AS tableProd ON departments.department_name = tableProd.department_name";
    connection.query(query, function (err, res) {
        if (err) throw err;
        // console.log(res);
        var table6 = new Table({
            head: ["Department ID", "Department Name", "$ Over Head Costs", "$ Product Sales", "$ Total Profit"],
            colWidths: [20, 20, 20, 20, 20]
        });
        for (var i = 0; i < res.length; i++) {
            if (res[i].totalDeptProdSales === null) {
                res[i].totalDeptProdSales = 0;
                // console.log(res[i].totalDeptProdSales);
            }
            var totalDeptProfit = (parseInt(res[i].totalDeptProdSales - parseInt(res[i].over_head_costs)));
            table6.push(
                [res[i].department_id, res[i].department_name, res[i].over_head_costs, res[i].totalDeptProdSales, totalDeptProfit]
            );
        };
        console.log(table6.toString());
        console.log();
    });
}

function createDepartment() {
    inquirer.prompt([{
        name: "department_name",
        type: "input",
        message: "Please enter the NAME of the NEW department that you would like to CREATE!".red,
    }, {
        name: "over_head_costs",
        type: "input",
        message: "Please enter the starting Over Head Cost for the New Department!".red,
        validate: function (value) {
            if (isNaN(value) === false) {
                return true;
            }
            return false
        }
    }]).then(function (answer) {
        var msg = "You have entered the creation of the " + answer.department_name + " department with a starting budget of $" + answer.over_head_costs + "!";
        console.log(msg.red);
        inquirer.prompt({
            name: "confirm",
            type: "confirm",
            message: "Please confirm that you would like to add the information for the NEW DEPARTMENT!".red
        }).then(function (answer2) {
            if (answer2.confirm) {
                connection.query("INSERT INTO departments SET ?",
                    {
                        department_name: answer.department_name,
                        over_head_costs: answer.over_head_costs
                    },
                    function (error, result) {
                        if (error) throw error;
                    });
                console.log("\nThe NEW department has been succesfully created!".red);
                supervisorOptions();
                return;
            }
            else {
                console.log("\nThe new department has NOT been created!".red);
                supervisorOptions();
                return;
            }
        });
    });
}

function deleteDepartment() {
    connection.query("SELECT department_name FROM departments", function (error, result) {
        if (error) throw error;
        // console.log(result);
        var resultArray = [];
        for (var i = 0; i < result.length; i++) {
            resultArray.push(result[i].department_name);
        }
        // console.log(resultArray);
        inquirer.prompt({
            name: "department_name",
            type: "rawlist",
            message: "Please enter the NAME of the department that you would like to DELETE!".red,
            choices: resultArray
        }).then(function (answer) {
            console.log(answer.department_name);
            inquirer.prompt({
                name: "confirm",
                type: "confirm",
                message: "Please confirm that you would like to DELETE that entire DEPARTMENT!".red
            }).then(function (answer2) {
                if (answer2.confirm) {
                    connection.query("DELETE FROM departments WHERE ?",
                        {
                            department_name: answer.department_name
                        },
                        function (error, result) {
                            if (error) throw error;
                        });
                    console.log("\nThe department has been succesfully deleted!".red);
                    supervisorOptions();
                    return;
                }
                else {
                    console.log("\nThe department has NOT been deleted!".red);
                    supervisorOptions();
                    return;
                }
            });
        });
    });
}

function viewDeptOverHeadCosts() {
    connection.query("SELECT * FROM departments", function (error, result) {
        if (error) throw error;
        // console.log(result);
        var table7 = new Table({
            head: ["Department ID", "Department Name", "Over Head Costs"],
            colWidths: [20, 20, 20]
        });
        for (var i = 0; i < result.length; i++) {
            table7.push(
                [result[i].department_id, result[i].department_name, result[i].over_head_costs]
            );
        };
        console.log(table7.toString());

        var resultArray = [];
        for (var x = 0; x < result.length; x++) {
            resultArray.push(result[x].department_name);
        }
        // console.log(resultArray);

        inquirer.prompt([{
            name: "department",
            type: "rawlist",
            message: "Please select the DEPARTMENT that you would like to change the over head cost!",
            choices: resultArray // In order to accommodate for any newly created Department, we would need to make a connection query and group all department_name as a variable of array and reference this a the choices.
        }, {
            name: "overheadcost",
            type: "input",
            message: "What ($) amount would you like to change the OVER HEAD COST to?",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false
            }
        }]).then(function (answer) {
            var table8 = new Table({
                head: ["Department ID", "Department Name", "Over Head Costs"],
            colWidths: [20, 20, 20]
            });
            table8.push(
                ["N/A", answer.department, answer.overheadcost] // is this correct with i instead of x?????? 
            );
            console.log(table8.toString());

            inquirer.prompt({
                name: "confirm",
                type: "confirm",
                message: "Please confirm that you would like to revise the information for the department over head cost!".red
            }).then(function (toAdd) {
                if (toAdd.confirm) {
                    connection.query("UPDATE departments SET ? WHERE ?",
                        [{
                            over_head_costs: answer.overheadcost
                        }, {
                            department_name: answer.department
                        }],
                        function (error, result) {
                            if (error) throw error;
                        });
                    console.log("\nThe updated overhead cost has been succesfully added to the specified department!".red);
                    supervisorOptions();
                    return;
                }
                else {
                    console.log("\nThe updated overhead cost has NOT been added!".red);
                    supervisorOptions();
                    return;
                }
            });
        });
    });
}