# Bamazon
Command Line Interface App: Amazon-like Storefront using Node.js and MySQL


## Overview
This application implements a CLI based Storefront for the retail company "Bamazon".  The app has 3 interfaces: one for the **customer**, one for the **manager**, and one for the **supervisor**.  The app will allow: 1) a customer to place orders; 2) a manager to add new products or update inventory; 3) a supervisor to view sales and profit.  Beyond the proposed levels of challenges, several more features are added to make the app more functional for real-world use as described below. The app uses Node.js and npm inquirer package to execute prompt-directed commands with the backend MySQL database of the product inventory to retrieve and display information.

## How to Run Bamazon:

1. Clone down repository.
2. Navigate to the root of your project and run `npm install` to install the required versions of third party npm packages as instructed in the `package.json` file.
3. Note that this app will only work if you provide the MySQL connection password in the `keys.js` file or password on line 14 of `bamazon.js`.
4. Create the database in MySQL by opening and executing the schema.sql file.  Once the products table is created, import the product information from the products.csv file.  Once the departments table is created, execute the seeds.sql to insert the department data into the table.
5. Run command `node bamazon.js`.  Note that the original intent to use 3 js files `bamazonCustomer.js`, `bamazonManager.js`, `bamazonSupervisor.js` have all been merged into a single js file with shared codes.


## Detail Instructions:
1. Option 1 for Customer Interface: :credit_card: :package: :shipit:

   The **Customer** interface allows the user/customer to view the current inventory, specifically : product name, description, price, and stock quantity. The customer is then able to purchase an item and the desired quantity. If the selected quantity is currently in stock, the customer's order is fulfilled, displaying the total purchase price and updating the store database. If the desired quantity is not available, the customer is prompted to modify the order

2. Option 2 for Manager Interface: :spiral_notepad: :writing_hand:
     
   The **Manager** interface allows the user/manager to view list of products for sale or with low inventory as well as to add to inventory or add new products. The manager will be presented with a set of menu options:

    * View Products for Sale - Display a list of very available item with: item ID, names, description, prices, and quantities.
    * View Low Inventory - Display all itmes with an inventory count lower than five.
    * Add to Inventory - Prompt manager to add more of any item currently in store.
    * Add New Product - Prompt manager to add a completely new product to the store.
    * Delete Product - Prompt manager to delete any product from the store.

3. Option 3 for Supervisor Interface: :chart_with_upwards_trend: :dollar:
     
   The **Supervisor** interface allows the user/supervisor to view list of product sales by Department as well as to create new Department for the store. The supervisor will be presented with a set of menu options:

    * View Product Sales by Department - Display a summarized table with overhead cost, product sales, and the calculated total profit for each Department.
    * Create New Department - Prompt supervisor to create a completely new Department for the store.
    * Delete Department - Prompt supervisor to delete any Department from the store.
    * View Exisitng Department and/or Change Over Head Costs - Display all Departments including newly created without products as well as prompt supervisor to change the over head costs for any Department in the store.


## Built with:
* JavaScript
* Node.js
* Node Package Manager (npm)
* MySQL

## npm packages: 
* [Inquirer.js](https://www.npmjs.com/package/inquirer) - A collection of common interactive command line user interfaces to provide inquiry session flow. :question: :speech_balloon:
* [mysql](https://www.npmjs.com/package/mysql) - A node.js driver for mysql, written in JavaScript, to interface with MySQL databases.
* [CLI-Table](https://www.npmjs.com/package/cli-table) - A utility to render unicode-aided tables on the command line from the node.js scripts.
* [Figlet](https://www.npmjs.com/package/figlet) - Create ASCII text banners from plain text, using command-line utilities to fully implement the FIGfont spec in JavaScript. :pencil: :computer:
* [DotEnv](https://www.npmjs.com/package/dotenv) - Dotenv store your sensitive credentials and load in environment variables in .env file to merge into your process.env runtime variables. :closed_lock_with_key:


## Author
* Eddie Chiang
* Click on the GitHub link!
https://github.com/echiang73/Bamazon


## Here are the previews of the node application:

Customer Interface:

![](nodepreview1.gif "gif")


Manager Interface:

![](nodepreview2.gif "gif")


Supervisor Interface:

![](nodepreview3.gif "gif")
