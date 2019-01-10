# shopify_challenge
Shopify Web Api Challenge

# Notes
So one thing I wasn't sure of was whether the title of a product is supposed to be a unique key for a product. 
So basically if you can have like one banana cost $2.00 and another cost $3.00 in the shop. 
I assumed that the title of a product is not a unique key for a product, rather that title and price as a composite 
key will uniquely define a product. So if you try to push a product with a same title with a different price, it will still be possible. 
The primary key of the collection a seperate id. 

To-do List:
1) Flesh out API - Done
2) Create a shopping cart using the API
3) Create an API for the shopping cart?
4) Unit Tests (in jest?)
5) Documentation (in code as well as in the README)

Extra
5) GraphQL
6) Adding security (passport)
