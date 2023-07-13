# product-authentication-dapp
 create a transparent and secure ecosystem that ensures consumer confidence using blockchain technology

## Objective
The objective of this project is to develop and implement a smart contract-based product 
authentication system that revolutionizes the way we verify the authenticity of products.

for that we propose leveraging smart contracts based on blockchain technology for product 
authentication. By utilizing decentralized networks and cryptographic protocols, we can establish a 
trustless and tamper-resistant system that verifies the authenticity of products at each stage of 
the supply chain
##  Development tools 
Ganache.
Truffle.
React.
Django: We have used Django to build an APIs, so that users are able to upload images of their products as 
well as to reduce gas fees
## General system architecture 
Companies:
In our application, the first phase is the registration of companies and 
verification from them by the admin. A hashed database of campanies information is stored in the 
Blockchain through a mapping to ensure the authenticity of the campanies.

Products:
Each product is assigned a unique identifier and its information is stored in the Blockchain
and only verified companies can perform this transaction. This information includes details such as 
the product's manufacturer, serial number, and current owner. The product's information is 
hashed and recorded in a mapping within the Blockchain. This ensures that the product's data 
cannot be tampered with or modified. Each product with a valid registration can be verified by 
entering its identifier in our application interface. Our smart contract verifies the matching of the 
entered identifier with the hashed information stored in the Blockchain. After data verification, 
the smart contract determines whether the product is authentic.

Users: The users plays important role in our dapp. Each user can own products and 
perform transactions on them such as transferring the ownership or making them for sale, or
buying them from the marketplace. Using their credentials through our application interface. Our 
smart contract verifies the user's information, such as access rights, through the mapping stored in 
the blockchain. After data verification, the smart contract decides whether they are be able to do 
some transactions or not


## terminal instruction
windows: <br />
py -m pip install --user virtualenv <br />
python -m venv venv <br />
venv\Scripts\activate.bat <br />
Unix/macOS: <br />
python3 -m pip install --user virtualenv <br />
source myvenv/bin/activate <br />

then: <br />
pip install -r requirements.txt <br />

python manage.py makemigrations <br />
python manage.py migrate  <br />
python manage.py runserver  <br />
new terminal :  <br />
truffle migrate --rest      <br />
cd my-app  <br />
yarn install  <br />
yarn start  <br />













