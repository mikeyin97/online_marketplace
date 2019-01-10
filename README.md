# Online Marketplace
Hello! My name is Michael and this is my backend mockup of a online marketplace API. This app was built using
the Express framework for node.js, leveraging mongoDB as my database and Mocha/Chai for my testing. 

## Setup
1) Clone the repository.
2) Install mongoDB
3) Navigate into online_shop folder with `cd online_shop`.
4) Install dependencies with `npm install`. A list of dependencies can be found in package.json
5) Start the application with `npm run start`. The api runs on localhost, port 9999.

## Testing
1) Placeholder

## Database Schema
The data is hosted in the `shop` collection of the `local` database. Data entries have the following schema:

```
{   _id:    ObjectId,
    title:  String,
    price   Number,
    inventory: Number
}
```

**_id** is the primary key for the database.

**Note**: I treat title + price as a composite key that uniquely
defines an entry. Therefore, it is possible to have, for example, a
banana that costs $2.00 and a banana that costs $3.00 as seperate entries in the table. 

## Endpoints

#### POST /api/addItem
- **Description**:Add an item to the database.
- **Body**:
    - **title**: Title of the product *(required)*
    - **price**: Price of the product *(required)*
    - **inventory**: Inventory of the product *(required)*
- **Expected Response: 201**:
    - **success**: true
    - **message**: item created successfully
    - **item**: new item
- **Errors by Status**:
    - **400**: Missing parameters

#### POST /api/incrementItemById

#### POST /api/incrementItemByTitleAndPrice

#### POST /api/upsertItemByTitleAndPrice

#### POST /api/decrementItemById

#### POST /api/decrementItemByTitleAndPrice

#### POST /api/deleteItemByTitleAndPrice

####

####

####

####



## To-do List
1) Flesh out API - Done
2) Create a shopping cart using the API - Done
3) Create an API for the shopping cart? - Done
3b) Refactor Code (make helper functions for checking)
4) Unit Tests (in mocha + chai)
5) Documentation (in code as well as in the README)

Extra
5) GraphQL
6) Adding security (passport)


