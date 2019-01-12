# Online Marketplace

<img src="https://nisrockk.files.wordpress.com/2016/02/cropped-ms-banner1.jpg" />

Hello! My name is Michael and this is my backend mockup of a online marketplace API. This app was built using
the Express framework for node.js, leveraging mongoDB as my database, mocha and chai for my testing, and passport-local with bcrypt hashing for authentication.

This app allows you to make requests to a shop database, that stores information about products, such as their title, price, and inventory. You can add new products, remove products, purchase products, etc. If you are logged in, this app also allows you to use a cart feature, which you can queue up products you want to buy. By completing your purchase, these items are removed from the shop, and your purchase price and items are displayed. 

## Table of Contents

1. [ Setup ](#setup)
2. [ Testing Notes ](#testing)
3. [ Authentication Notes ](#auth)
4. [ Schemas and Structures ](#database)
5. [ Endpoints ](#endpoints)
    - [ Shop ](#shopapi)
    - [ Cart ](#cartapi)
    - [ Auth ](#authapi)
6. [ Usage Guide ](#howtos)
    - [ Sign Up ](#signup)
    - [ Login ](#login)
    - [ View User Info ](#userinfo)
    - [ Make a Single Purchase ](#makepurchase)
    - [ Query for All Products ](#queryall)
    - [ Query for Available Products Only](#queryavailable)
    - [ Query for Products with a Price in a Range ](#queryrange)
    - [ Query for a Single Item ](#queryid)
    - [ Add to Your Shopping Cart ](#addcart)
    - [ View Your Shopping Cart ](#viewcart)
    - [ Remove From Your Shopping Cart ](#removecart)
    - [ Empty Your Shopping Cart ](#deletecart)     
    - [ Complete Your Purchase ](#completecart)
    - [ Logout ](#logout)
7. [ More Info and References](#misc)

<a name="setup"></a>
## Setup

1) Clone the repository with `git clone git@github.com:mikeyin97/online_marketplace.git`
2) Install [mongoDB](https://docs.mongodb.com/manual/installation/)
3) Spin up mongoDB with `sudo mongod`. 
4) Navigate into online_shop folder with `cd online_shop`.
5) Install dependencies with `npm install`. A list of dependencies can be found in package.json
6) Start the application with `npm run start`. The api runs on localhost, port 9999.

<a name="testing"></a>
## Testing Notes

Tests are written using mocha and chai. In the testing environment, endpoints use a different mongo collection `shopTest` than in the non-testing environment. Tests are located in `online_shop/test/test.js`. As of now, testing bypasses authentication. 

1) Spin up mongoDB with `sudo mongod`. 
2) Navigate into online_shop folder with `cd online_shop`.
3) Run tests with `npm run test`.

<a name="auth"></a>
## Authentication Notes

Authentication is implemented using passport-local. A user can signup with a new username and password or login with previous credentials used in the signup. The password is hashed using the `bcrypt` library, and the username and hashed password are stored in the `users` collection of the `local` database on mongo. Authorization errors occur if 

1) You try to sign up with an existing username
2) You login with incorrect or missing credentials

Most endpoints in the api require authorization, however, some do not. The ones that do not require authorization are:

- `/`
- `/api/incrementItemById`
- `/api/incrementItemByTitleAndPrice`
- `/api/upsertItemByTitleAndPrice`
- `/api/decrementItemById`
- `/api/decrementItemByTitleAndPrice`
- `/api/incrementItemById`
- `/api/getItems`

as well as both the login and signup page at, respectively, 

- `/login`
- `/signup`

<a name="database"></a>
## Schemas

I use mongoDB as my noSQL database for storing items in the shop. It runs on localhost, port 27017. 

The non-testing data is hosted in the `shop` collection of the `local` database. Testing data uses the `shopTest` collection of the `local` database. Data entries `items` will have the following schema:

```
{   
    _id:    ObjectId,
    title:  String,
    price   Number,
    inventory: Number
}
```

**_id** is the primary key for the database.

**Note**: I treat `title` + `price` as a composite key that uniquely
defines an entry. Therefore, it is possible to have, for example, a
banana that costs $2.00 and a banana that costs $3.00 as seperate entries in the table. 

When using the shopping cart, your `cart` will look like:

```
{   
    items: [items],
    price: Number
}
```

Where items is a list of items in the cart currently, and price is the running sum of the price of items in the cart. 

<a name="endpoints"></a>
## Endpoints

<a name="shopapi"></a>
### SHOP

#### POST /api/addItem
- **Description**: Add an item to the database. If id is not specified, mongo will make a default ObjectID. Otherwise, id must be a string of 24 hex characters (so it can be converted to ObjectID). **WARNING** THIS IS A DEV TOOL ONLY FOR QUICKLY MAKING DATABASES TO TEST AS YOU CAN DUPLICATE UNIQUE KEYS. FOR REGULAR USAGE USE upsertItemByTitleAndPrice.
- **Authentication**: Required
- **Body**:
    - **title**: Title of the product *(required)*
    - **price**: Price of the product *(required)*
    - **inventory**: Inventory of the product *(required)*
    - **id**: ID of the product *(default: ObjectId())*
- **Expected Response**:
    - **status**: 201
    - **reponse body**:
        - **success**: true
        - **message**: item created successfully
        - **item**: new item
- **Errors by Status**:
    - **400**: Missing parameters, ID not valid, trying to insert a duplicate ID
    - **401**: Unauthenticated

#### POST /api/incrementItemById
- **Description**: Find an item by passed ID then update its inventory by an incremental value
- **Authentication**: Optional
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
- **Authentication**: Optional
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
- **Description**: Takes in a product's title and price. If an item does not exist with that title and price, make an entry with an inventory equal to increment passed in. Otherwise, update the inventory of that item by that increment. Essentially it mimics adding increment # of the item to the shop, regardless of whether it exists or not. Increment MUST be positive.
- **Authentication**: Optional
- **Body**:
    - **title**: Title of the product *(required)*
    - **price**: Price of the product *(required)*
    - **increment**: Amount to update the inventory *(default:1)*
- **Expected Response**:
    - **status**: 201
    - **reponse body**:
        - **success**: true
        - **message**: Item inventory incremented successfully / Item created successfully
- **Errors by Status**:
    - **400**: Missing parameters, parameters not found in db, parameters not valid, negative increment

#### POST /api/decrementItemById
- **Description**: Find an item by passed ID then decrement its inventory by a given value. Note that this is equivalent to incrementItemById with the opposite number. **NOTE**: You cannot decrement into negative numbers. If you want to decrement more than the inventory has, an error will occur, and the item will not be decremented. 
- **Authentication**: Optional
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
- **Authentication**: Optional
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
- **Authentication**: Required
- **Body**:
    - **id**: ID of the product *(required)*
- **Expected Response**:
    - **status**: 200
    - **reponse body**:
        - **success**: true
        - **message**: Item deleted successfully
- **Errors by Status**:
    - **400**: Missing parameters, ID not found, ID not valid
    - **401**: Unauthenticated

#### POST /api/deleteItemByTitleAndPrice
- **Description**: Find an item by passed title & price then delete it from the database. 
- **Authentication**: Required
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
    - **401**: Unauthenticated

#### POST /api/amountGtInventory
- **Description**: Checks if a given amount passed in strictly exceeds the given inventory of an item (found by passed ID)
- **Authentication**: Optional
- **Body**:
    - **id**: ID of the product *(required)*
    - **amount**: Amount to compare to *(required)*
- **Expected Response**:
    - **status**: 200
    - **reponse body**:
        - **success**: true
        - **response**: true if amount > inventory, else false
- **Errors by Status**:
    - **400**: Missing parameters, ID not found, ID not valid, amount not valid

#### GET /api/getItems
- **Description**: Get all items according to the passed query parameters.
- **Authentication**: Optional
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

<a name="cartapi"></a>
### CART

#### POST /api/emptyCart
- **Description**: Completely clears the cart
- **Authentication**: Required
- **Body**:
- **Expected Response**:
    - **status**: 200
    - **reponse body**:
        - **success**: true
        - **message**: Cart successfully emptied
        - **current_cart**: cart
- **Errors by Status**:

#### POST /api/addToCartById
- **Description**: Adds a provided amount of a product specified by given product id to the cart. 
- **Authentication**: Required
- **Body**:
    - **id**: ID of the product *(required)*
    - **amount**: Amount to be added to the cart *(default:1)*
- **Expected Response**:
    - **status**: 200
    - **reponse body**:
        - **success**: true
        - **message**: Your cart has been updated
        - **current_cart**: cart
- **Errors by Status**:
    - **400**: Missing parameters, ID not found, ID not valid, amount not valid, total amount + cart amount exceeds inventory
    - **401**: Unauthenticated

#### POST /api/removeFromCartById
- **Description**: Removes a provided amount of a product specified by given product id to the cart. 
- **Authentication**: Required
- **Body**:
    - **id**: ID of the product *(required)*
    - **amount**: Amount to be added to the cart *(default:1)*
- **Expected Response**:
    - **status**: 200
    - **reponse body**:
        - **success**: true
        - **message**: Your cart has been updated
        - **current_cart**: cart
- **Errors by Status**:
    - **400**: Missing parameters, ID not found, ID not valid, amount not valid, removing more than what is in the cart, removing an object not in the cart
    - **401**: Unauthenticated

#### POST /api/completeCartPurchase
- **Description**: Completes the purchase by finalizing the cart and making reflected changes in the shop. 
- **Authentication**: Required
- **Body**:
- **Expected Response**:
    - **status**: 200
    - **reponse body**:
        - **success**: true
        - **response**: purchase complete
        - **purchase**: cart
        - **current_cart**: (empty) cart
- **Errors by Status**:
    - **401**: Unauthenticated

#### GET /api/ViewCart
- **Description**: Views your current cart.
- **Authentication**: Required
- **Expected Response**:
    - **status**: 200
    - **reponse body**:
        - **success**: true
        - **current_cart**: cart
- **Errors by Status**:
    - **401**: Unauthenticated

<a name="authapi"></a>
### AUTH

#### POST /login
- **Description**: Login with stored credentials to access endpoints requiring authentication.
- **Authentication**: optional
- **Body**:
    - **username**: Your username *(required)*
    - **password**: Your password *(required)*
- **Expected Response**:
    - **status**: 200
    - **reponse body**:
        - **success**: true
        - **message**: logged in
- **Errors by Status**:
    - **400**: missing or invalid credentials

#### POST /signup
- **Description**: Signup with new credentials (new username) to access endpoints requiring authentication.
- **Authentication**: optional
- **Body**:
    - **username**: Your username *(required)*
    - **password**: Your password *(required)*
- **Expected Response**:
    - **status**: 200
    - **reponse body**:
        - **success**: true
        - **message**: signed up
- **Errors by Status**:
    - **400**: missing or invalid credentials, username in use

#### GET /profile
- **Description**: Get your user profile
- **Authentication**: Required
- **Expected Response**:
    - **status**: 200
    - **reponse body**:
        - **success**: true
        - **message**: object that looks like
        ```
            {
                id: id string,
                username: username string
            }
        ```
- **Errors by Status**:
    - **401**: Unauthenticated

#### GET /logout
- **Description**: Logout of the current session
- **Authentication**: Required
- **Expected Response**:
    - **status**: 200
    - **reponse body**:
        - **success**: true
        - **message**: logged out
- **Errors by Status**:
    - **401**: Unauthenticated

<a name="howtos"></a>
## Usage Guide

<a name="signup"></a>
- Sign Up

You can sign up by making a POST request to `localhost:9999/signup` with body containing your username and password, eg:

```
    {
        "username": "mike",
        "password": "yin"
    }
```

You must pick a username that is not registered in the database, or else you will get an unauthorized error. 

<a name="login"></a>
- Login

You can login by making a POST request to `localhost:9999/login` with body containing your username and password, eg:

```
    {
        "username": "mike",
        "password": "yin"
    }
```

If the credentials are not found, an unauthorized error will be sent back. 

<a name="userinfo"></a>
- View User Info

To view your user information while logged in, make a GET request to `localhost:9999/profile`. The message should contain your user `id` and `username`. 

<a name="makepurchase"></a>
- Make a Single Purchase

To make a single purchase, ie, to reduce the inventory of a product by 1, there are 2 ways to do it. 

If you know the item id (which you can get by querying for the product, explained later), you can POST to `/api/decrementItemById` with the id in the body, eg:

```
    {
        "id": "000000000000000000000000"
    }
```

If you do not know the item id, but you know the title and price (which as mentioned earlier, should uniquely identify a product), you can POST to `/api/decrementByTitleAndPrice` with the title and price in the body, eg:

```
    {
        "title": "pencil",
        "price": 1.00
    }
```

Note, if there's no more inventory of that product, or that product was never stocked, it will return error `Item was not found / had insufficient inventory`.

<a name="queryall"></a>
#### Query for All Products

To query for all products, make a GET request to `localhost:9999/api/getItems`. This will return a list of items and a count of the number of items in the list.

<a name="queryavailable"></a>
#### Query for Available Products Only

To query for available products only, make a GET request to `localhost:9999/api/getItems` with query parameter `available=true`. (ie make GET request to `localhost:9999/api/getItems?available=true`). Only items with positive inventory will be returned. 

<a name="queryrange"></a>
#### Query for Products with a Price in a Range

To query for products at or above a certain price, add the query parameter `lowerprice=#` and make the GET request to `localhost:9999/api/getItems?lowerprice=#`.

To query for products at or below a certain price, add the query parameter `upperprice=#` and make the GET request to `localhost:9999/api/getItems?upperprice=#`.

To query for products only between a lowerprice `a` and an upperprice `b`, add both query parameters and make a GET request to `localhost:9999/api/getItems?lowerprice=a&upperprice=b`. Only items with positive inventory will be returned. 

For any of these, if you only want available products only, add the query parameter `available=true`.

<a name="queryid"></a>
#### Query for a Single Item 

If you know the id of a single item, you can directly query for that single item by making a GET request to `localhost:9999/api/getItems?id=<your item id>`

If you do not know the id of the item, but you do know its title and price, you can query for that item by making a GET request to `localhost:9999/api/getItems?title=<your item title>&price=<your item price>`

<a name="viewcart"></a>
#### View Your Shopping Cart

If you are logged in, you can view your current shopping cart. This is done by making a GET request to `localhost:9999/api/viewCart`. Your shopping cart defaults to empty when you first login. 

<a name="addcart"></a>
#### Add to Your Shopping Cart

If you are logged in, you can add to your shopping cart. Get the id of the item you want to add, then POST to `localhost:9999/api/addToCartById` with the id and the amount you want to buy in the body, eg:

```
    {
        "id": "000000000000000000000000",
        "amount": 10
    }
```

This will be added to your cart, and the price of your cart will change to reflect it. 

If the amount currently in your cart plus the amount you want to add to your cart would exceed the inventory of that item, it won't be added and you will get an error. It will also error if the id isn't valid or in the store, for example. 

<a name="removecart"></a>
#### Remove From Your Shopping Cart

If you are logged in, you can remove items your shopping cart. Get the id of the item you want to remove, then POST to `localhost:9999/api/removeFromCartById` with the id and the amount you want to buy in the body, eg:

```
    {
        "id": "000000000000000000000000",
        "amount": 5
    }
```

This amount of product will be removed from your cart, and the price of your cart will change to reflect it. 

If you want to remove more than what's in your cart, this will throw an error and nothing will be remved. It will also error if the id isn't valid or it isn't in your cart. 

<a name="deletecart"></a>
#### Empty Your Shopping Cart

If you are logged in and want to empty your shopping cart, make a POST request to `localhost:9999/api/emptyCart`. No body is required. 

<a name="completecart"></a>
#### Complete Your Purchase

If you are logged in and want to complete your purchase and have your cart changes reflected in the story inventory, make a POST request to `localhost:9999/api/completeCartPurchase`. No body is required. You will see your purchase "receipt", consisting of your items and price. Your cart will then revert to its original empty state. 

<a name="logout"></a>
#### Logout

To logout and end your session, make a GET request to `localhost:9999/logout`.

<a name="misc"></a>
## More Info and References
- image taken from: [https://nisrockk.wordpress.com/2018/08/24/maplestory-m-a-mobile-leveling-guide/](https://nisrockk.wordpress.com/2018/08/24/maplestory-m-a-mobile-leveling-guide/)
- testing references: [https://scotch.io/tutorials/test-a-node-restful-api-with-mocha-and-chai](https://scotch.io/tutorials/test-a-node-restful-api-with-mocha-and-chai)
- auth references : [https://scotch.io/tutorials/easy-node-authentication-setup-and-local](https://scotch.io/tutorials/easy-node-authentication-setup-and-local)

Thanks for reading!! Some extensions for this project would be:
1) use mongoose
2) integrate graphql
3) implement modern authentication

