# Online Marketplace
Hello! My name is Michael and this is my backend mockup of a online marketplace API. This app was built using
the Express framework for node.js, leveraging mongoDB as my database and Mocha/Chai for my testing. 

## Table of Contents
1. [ Setup ](#setup)
2. [ Testing Notes ](#testing)
3. [ Database Schema ](#database)
4. [ Endpoints ](#endpoints)
5. [ How-Tos ](#howtos)
6. [ To-do List ](#todos)

<a name="setup"></a>
## Setup
1) Clone the repository.
2) Install [mongoDB](https://docs.mongodb.com/manual/installation/)
3) Navigate into online_shop folder with `cd online_shop`.
4) Install dependencies with `npm install`. A list of dependencies can be found in package.json
5) Start the application with `npm run start`. The api runs on localhost, port 9999.

<a name="testing"></a>
## Testing Notes
1) Placeholder

<a name="database"></a>
## Database Schema
I use mongoDB as my noSQL database for storing values in the shop. It runs on localhost, port 27017. 

The data is hosted in the `shop` collection of the `local` database. Data entries have the following schema:

```
{   
    _id:    ObjectId,
    title:  String,
    price   Number,
    inventory: Number
}
```

**_id** is the primary key for the database.

**Note**: I treat title + price as a composite key that uniquely
defines an entry. Therefore, it is possible to have, for example, a
banana that costs $2.00 and a banana that costs $3.00 as seperate entries in the table. 

<a name="endpoints"></a>
## Endpoints

#### POST /api/addItem
- **Description**: Add an item to the database.
- **Body**:
    - **title**: Title of the product *(required)*
    - **price**: Price of the product *(required)*
    - **inventory**: Inventory of the product *(required)*
- **Expected Response**:
    - **status**: 201
    - **reponse body**:
        - **success**: true
        - **message**: item created successfully
        - **item**: new item
- **Errors by Status**:
    - **400**: Missing parameters

#### POST /api/incrementItemById
- **Description**: Find an item by passed ID then update its inventory by an incremental value
- **Body**:
    - **id**: ID of the product *(required)*
    - **increment**: How much to increment the product's inventory *(default: 1)*
- **Expected Response**:
    - **status**: 200
    - **reponse body**:
        - **success**: true
        - **message**: Item inventory incremented successfully
- **Errors by Status**:
    - **400**: Missing parameters, ID not found, ID not valid

#### POST /api/incrementItemByTitleAndPrice
- **Description**: Find an item by passed title & price then update its inventory by an incremental value
- **Body**:
    - **title**: Title of the product *(required)*
    - **price**: Price of the product *(required)*
    - **increment**: How much to increment the product's inventory *(default: 1)*
- **Expected Response**:
    - **status**: 200
    - **reponse body**:
        - **success**: true
        - **message**: Item inventory incremented successfully
- **Errors by Status**:
    - **400**: Missing parameters, parameters not found in db, parameters not valid

#### POST /api/upsertItemByTitleAndPrice
- **Description**: Takes in a product's title and price. If an item does not exist with that title and price, make an entry with one inventory. Otherwise, update the inventory of that item by 1. 
- **Body**:
    - **title**: Title of the product *(required)*
    - **price**: Price of the product *(required)*
- **Expected Response**:
    - **status**: 201
    - **reponse body**:
        - **success**: true
        - **message**: Item inventory incremented successfully / Item created successfully
- **Errors by Status**:
    - **400**: Missing parameters, parameters not found in db, parameters not valid

#### POST /api/decrementItemById
- **Description**: Find an item by passed ID then decrement its inventory by a given value. Note that this is equivalent to incrementItemById with the opposite number. **NOTE**: You cannot decrement into negative numbers. If you want to decrement more than the inventory has, an error will occur, and the item will not be decremented.  
- **Body**:
    - **id**: ID of the product *(required)*
    - **decrement**: How much to decrement the product's inventory *(default: 1)*
- **Expected Response**:
    - **status**: 200
    - **reponse body**:
        - **success**: true
        - **message**: Item inventory decremented successfully
- **Errors by Status**:
    - **400**: Missing parameters, ID not found, ID not valid, insuccifient inventory

#### POST /api/decrementItemByTitleAndPrice
- **Description**: Find an item by passed title & price then decrement its inventory by a passed value. **NOTE**: You cannot decrement into negative numbers. If you want to decrement more than the inventory has, an error will occur, and the item will not be decremented.  
- **Body**:
    - **title**: Title of the product *(required)*
    - **price**: Price of the product *(required)*
    - **increment**: How much to decrement the product's inventory *(default: 1)*
- **Expected Response**:
    - **status**: 200
    - **reponse body**:
        - **success**: true
        - **message**: Item inventory decremented successfully
- **Errors by Status**:
    - **400**: Missing parameters, parameters not found in db, parameters not valid, insuccifient inventory

#### POST /api/deleteItemById
- **Description**: Find an item by passed ID then delete it from the database. 
- **Body**:
    - **id**: ID of the product *(required)*
- **Expected Response**:
    - **status**: 200
    - **reponse body**:
        - **success**: true
        - **message**: Item deleted successfully
- **Errors by Status**:
    - **400**: Missing parameters, ID not found, ID not valid

#### POST /api/deleteItemByTitleAndPrice
- **Description**: Find an item by passed title & price then delete it from the database. 
- **Body**:
    - **title**: Title of the product *(required)*
    - **price**: Price of the product *(required)*
- **Expected Response**:
    - **status**: 200
    - **reponse body**:
        - **success**: true
        - **message**: Item deleted successfully
- **Errors by Status**:
    - **400**: Missing parameters, ID not found, ID not valid

#### POST /api/amountGtInventory
- **Description**: Checks if a given amount passed in strictly exceeds the given inventory of an item (found by passed ID)
- **Body**:
    - **id**: ID of the product *(required)*
    - **price**: Amount to compare to *(required)*
- **Expected Response**:
    - **status**: 200
    - **reponse body**:
        - **success**: true
        - **response**: true if amount > inventory, else false
- **Errors by Status**:
    - **400**: Missing parameters, ID not found, ID not valid, amount not valid

#### GET /api/getItems
- **Description**: Get all items according to the passed query parameters
- **Query Parameters**:
    - **id**: ID of the product
    - **title**: Amount to compare to
    - **available**: If item is in stock (ie inventory > 0) *(default: false)*
    - **lowerprice**: lower bound on price (inclusive)
    - **upperprice**: upper bound on price (inclusive)
- **Expected Response**:
    - **status**: 200
    - **reponse body**:
        - **success**: true
        - **response**: object that looks like:
        ```
        {
            items: [array of item objects]
            count: integer # of results
        }
        ```
- **Errors by Status**:
    - **400**: Missing parameters, invalid parameters

####

<a name="howtos"></a>
## How-Tos

- Make a Purchase

- Query for All Products

- Query for Available Products

<a name="todos"></a>
## To-do List
1) Flesh out API - Done
2) Create a shopping cart using the API - Done
3) Create an API for the shopping cart? - Done
3b) Refactor Code - Done
4) Unit Tests (in mocha + chai)
5) Documentation (in code as well as in the README) - Done

Extra
5) GraphQL
6) Adding security (passport)


