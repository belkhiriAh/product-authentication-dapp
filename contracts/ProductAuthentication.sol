// SPDX-License-Identifier: MIT 
pragma solidity >=0.4.21 <0.9.0;




contract ProductAuthentication {
    address public admin;
    uint256 companyCount;
    uint256 soldCount;

    constructor() public {
        // Initilizing default values
        admin = msg.sender;
  
        companyCount = 0;
        soldCount=0;
        
    }

    function getAdmin() public view returns (address) {
        // Returns account address used to deploy contract (i.e. admin)
        return admin;
    }

    modifier onlyAdmin() {
        // Modifier for only admin access
        require(msg.sender == admin);
        _;
    }
    
    struct Product {
        address manufacturer;
        string serialNumber;
        bool isAuthentic;
        address currentOwner;
        string proofOfOwnership;

        uint256 price;
        bool sell;

        
        int rate;
        int usesCount;



        


    }

    
    
    mapping(bytes32 => Product) public products; 

 

    
    
    address[] public companies;
 
    
    
     // Array of address to store address of Company
    mapping(address => Company) public companyDetails;
    
   
     // Modeling a Company
    struct Company {
        address companyAddress;
        string name;
        string email;
        bool isVerified;
 
        bool isRegistered;
        uint256 productCount;
        bytes32[]  productList;


        int rate;
       


    }


    // Request to be added as company
    function registerAsCompany(string memory _name, string memory _email)  public {
        require(companyDetails[msg.sender].isRegistered ==false);
        Company memory newCompany =
            Company({
                companyAddress: msg.sender,
                name: _name,
                email: _email,
                isVerified: false,
                isRegistered: true,
                productCount:0,
                productList:new bytes32[](0),
                rate:0

            });
        companyDetails[msg.sender] = newCompany;
        companies.push(msg.sender);
        companyCount += 1;
    }
    
    
    // Verify company
    function verifyCompany(bool _verifedStatus, address companyAddress)
        public
        // Only admin can verify
        onlyAdmin
    {
        companyDetails[companyAddress].isVerified = _verifedStatus;
    }
    function getCompanyName(address companyAddress)
       public view returns ( string memory)
       
    {
        return companyDetails[companyAddress].name;
    }

  
 
    

    function addProduct( string memory _serialNumber) public returns (bytes32) {
        require(companyDetails[msg.sender].isVerified == true);

        bytes32 productId = keccak256(abi.encodePacked(msg.sender, _serialNumber)); // generate unique ID
        require(products[productId].manufacturer == address(0), "Product already exists");
        products[productId] = Product(msg.sender, _serialNumber, true, msg.sender, "blank blank",0,false,0,0);
        
        
        productsByManufacturer[msg.sender].push(productId); 
        productsByOwner[msg.sender].push(productId); 

      
    }
     mapping(address => bytes32[]) productsByManufacturer; 
     function getProductsByManufacturer(address _manufacturer) public view returns (bytes32[] memory) {
        require(companyDetails[_manufacturer].isVerified == true);
        return productsByManufacturer[_manufacturer];
    }
     mapping(address => bytes32[]) productsByOwner; 
     function getProductsByOwner(address owner) public view returns (bytes32[] memory) {

        return productsByOwner[owner];
    }


    

     function transferOwnership(bytes32 _productId, address _newOwner,string memory proofOfOwnership) public {
        require(products[_productId].isAuthentic, "Product does not exist or is counterfeit");
        require(products[_productId].currentOwner == msg.sender, "Only current owner can transfer ownership");
        products[_productId].currentOwner = _newOwner;
        products[_productId].proofOfOwnership = proofOfOwnership;
        products[_productId].sell = false;
        products[_productId].usesCount = products[_productId].usesCount+1;
        
        productsByOwner[_newOwner].push(_productId); 
        
    }
    
    
    function checkProduct(bytes32 _productId) public view returns (bytes32, address, string memory, address, string memory,bool,uint256,int,int) {
        Product memory product = products[_productId];
        return (_productId, product.manufacturer, product.serialNumber, product.currentOwner,product.proofOfOwnership,product.sell,product.price,product.rate,product.usesCount);
    }



  

// Get candidates count
    function getTotalCompany() public view returns (uint256) {
        // Returns total number of candidates
        return companyCount;
    }
  

    // Get  count from each company
    function getTotalProduct() public view returns (uint256) {
        // Returns total number of voters
        return companyDetails[msg.sender].productCount;
    }
  


    function buyProduct(bytes32 _productId,string memory proofOfOwnership) public payable {
        require(products[_productId].isAuthentic, "Product does not exist or is counterfeit");
        require(products[_productId].sell ,"Product is not for selling ");
       
        require(msg.value >= products[_productId].price, "Insufficient funds");


        address payable _receiver = payable(products[_productId].currentOwner);
         _receiver.transfer(msg.value);
        products[_productId].currentOwner = msg.sender;
        products[_productId].proofOfOwnership = proofOfOwnership;
        products[_productId].sell = false;
         products[_productId].usesCount = products[_productId].usesCount+1;


        productsByOwner[msg.sender].push(_productId); 

      


    }



    mapping(address=>mapping(address=>bool)) public rated_accounts_company;

    

    function companyRate(address companyAddress,bool b) public  {
     require(!rated_accounts_company[msg.sender][companyAddress]);
      if (b){
companyDetails[companyAddress].rate =companyDetails[companyAddress].rate+1;

      }else{
companyDetails[companyAddress].rate =companyDetails[companyAddress].rate-1;

      }
      rated_accounts_company[msg.sender][companyAddress]=true;
        
      
 
    }
    mapping(address=>mapping(bytes32=>bool)) public rated_accounts;

    

    function productRate(bytes32 _productId,bool b) public  {
     require(!rated_accounts[msg.sender][_productId]);
      if (b){
products[_productId].rate =products[_productId].rate+1;

      }else{
products[_productId].rate =products[_productId].rate-1;

      }
      rated_accounts[msg.sender][_productId]=true;
        
      
 
    }

   
        // Get  count from each company
    function getSoldProduct() public view returns (uint256) {
        // Returns total number of voters
        return soldCount;
    }
  
    bytes32[] public soldProducts;
    function sellProduct(bytes32 _productId, uint256 _price) public {
        require(products[_productId].isAuthentic, "Product does not exist or is counterfeit");
        require(!products[_productId].sell ,"Product is already in the marketplace ");
        require(products[_productId].currentOwner == msg.sender, "Only current owner can transfer ownership");

        require(_price>0, "product must have a price");

        products[_productId].price= _price;
        products[_productId].sell = true;
        soldCount += 1;
        soldProducts.push(_productId);

        


        
    }

}

