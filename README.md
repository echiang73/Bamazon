# Bamazon
Command Line Interface App: Amazon-like Storefront using Node.js and MySQL


## Overview
This application implements a CLI based Storefront for the retail company "Bamazon".  The app has 3 interfaces: one for the **customer**, one for the **managers**, and one for the **supervisor**.  The app will allow: 1) customers to place orders; 2) the managers to add new products or update inventory; 3) the supervisor to view sales and profit.  The app uses Node.js and npm inquirer package to execute prompt-directed commands with the backend MySQL database of the product inventory to retrieve and display information.

## How to Run Bamazon:

1. Clone down repository.
2. Navigate to the root of your project and run `npm install` to install the required versions of third party npm packages as instructed in the `package.json` file.
3. Note that this app will only work if you provide the MySQL connection user name and password in the `keys.js`.
4. Run command `node` with one of the commands below.
   * `bamazonCustomer.js`
   * `bamazonManager.js`
   * `bamazonSupervisor.js`


## Detail Instructions:
1. Option 1 for Customer Interface: `node bamazonCustomer.js` :credit_card: :package: :shipit:

   The **Customer** interface allows the user/customer to view the current inventory, specifically : product name, description, price, and stock quantity. The customer is then able to purchase an item and the desired quantity. If the selected quantity is currently in stock, the customer's order is fulfilled, displaying the total purchase price and updating the store database. If the desired quantity is not available, the customer is prompted to modify the order.

   Just for fun, purchase all of the following pregnancy prediction products: "lotion, vitamin, scent-free soap, and hand-sanitizer" and receive a promotional discount for diapers and upcoming pregnancy/baby products! :tada: :baby: :baby_bottle:

2. Option 2 for Manager Interface: `node bamazonManager.js` :spiral_notepad: :writing_hand:
     
   The **Manager** interface allows the user/manager to view list of products for sale or with low inventory as well as to add to inventory or add new products. The manager will be presented with a set of menu options:

    * View Products for Sale - Display a list of very available item with: item ID, names, description, prices, and quantities.
    * View Low Inventory - Display all itmes with an inventory count lower than five.
    * Add to Inventory - Prompt manager to add more of any item currently in store.
    * Add New Product - Prompt manager to add a completely new product to the store.

3. Option 3 for Supervisor Interface: `node bamazonSupervisor.js` :chart_with_upwards_trend: :dollar:
     
   The **Supervisor** interface allows the user/supervisor to view list of product sales by Department as well as to create new Department for the store. The supervisor will be presented with a set of menu options:

    * View Product Sales by Department - Display a summarized table with overhead cost, product sales, and the calculated total profit for each Department.
    * Create New Department - Prompt supervisor to create a completely new Department for the store.


## Built with:
* JavaScript
* Node.js
* Node Package Manager (npm)
* MySQL

## npm packages: 
* [Inquirer.js](https://www.npmjs.com/package/inquirer) - A collection of common interactive command line user interfaces to provide inquiry session flow. :question: :speech_balloon:
* [mysql](https://www.npmjs.com/package/mysql) - A node.js driver for mysql, written in JavaScript, to interface with MySQL databases.
* [Table](https://www.npmjs.com/package/table) - Formats data into a string table. Table data is described using an array (rows) of array (cells).
* [Figlet](https://www.npmjs.com/package/figlet) - Create ASCII text banners from plain text, using command-line utilities to fully implement the FIGfont spec in JavaScript. :pencil: :computer:
* [Moment](https://www.npmjs.com/package/moment) - A lightweight JavaScript date library for parsing, validating, manipulating, and formatting dates. :calendar:
* [DotEnv](https://www.npmjs.com/package/dotenv) - Dotenv store your sensitive credentials and load in environment variables in .env file to merge into your process.env runtime variables. :closed_lock_with_key:


## Author
* Eddie Chiang
* Click on the GitHub link!
https://github.com/echiang73/Bamazon


## Here is the preview of the node application:

![](nodepreview.gif "gif")
