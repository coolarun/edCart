let express = require('express');
let router = express.Router(); // INITIALIZE EXPRESS ROUTER
let isLoggedIn = require('../../middlewares/isLogged');
let mongoose = require('mongoose');
let productModel = mongoose.model('productModel');
let userModel = mongoose.model('userModel');


module.exports = function(app,passport,responseGenerator){
	

	// LOGIN PAGE
	router.get('/profile',isLoggedIn, (req, res)=>{
		
	    // DELETE THE PASSWORD BEFORE SENT IT TO THE CLIENT SIDE
	    delete req.user.local.password
	    res.render('profile', {'message':req.flash('profileMessage')});
	});


    // ADD NEW PRODUCT PAGE
    router.get('/addproduct',isLoggedIn, (req, res)=>{

    	res.render('product',{'message': req.flash('productDetailsMissing')});
    })
    
	// GET USER INFO
	router.get('/api/user',isLoggedIn, (req, res)=>{
		let data = {}
		data.userName = req.user.local.firstName;
		data.email = req.user.local.email;
		let response = responseGenerator(false,"successful",200,data);
		res.json(response);
	});

	// PRODUCT UPDATE PAGE
	router.get('/updateproduct/:productId',isLoggedIn, (req,res)=>{
              

	
           // VERIFY THE USER PRODUCT (THIS PROMISE GOING TO BE USED IN ASYNC AWAIT )

		let verifyProduct = function(productId){
               
               
			return new Promise((resolve, reject)=>{
               
              userModel.findById(req.user._id, function(err, user){
              	if(err){
              		throw err;
              		console.log(err);

              	}
                
              	
               let checkIndex = user.local.userProducts.indexOf(req.params.productId);

               if(checkIndex===-1){
               	// RESOLVE IS FALSE (PRODUCT NOT AVAILABLE IN USER PRODUCTS)
               	resolve(false);
               } else {
               	// RESOLVE IS TRUE (PRODUCT IS AVAILABLE IN USER PRODUCTS)
               	resolve(true);
               }

              });
	    });

		};



let getProduct = function(productId){

      return new Promise((resolve, reject)=>{


         //CHECK THE CURRENT PRODUCT DETAILS IN DATABASE
         productModel.findById(req.params.productId, function(err,product){

          if(err){
            throw err;
            console.log(err);
          }
         
          // RESOLVE THE PRODUCT
          resolve(product);      

         });


      });
     
     };



// VERIFY THE OWNER (EXPRIEMENTAL USE OF ASYNC AND AWAIT FUNCTION);
      async function checkOwner(productId){

        let condition = await verifyProduct(productId);
        if(condition){
               
               let productDetails = await getProduct(productId); 
              return  res.render('updateProduct', {'message':productDetails});

        } else {
          let response = responseGenerator(true,"Yor are not authorized to delete this product",400,null);
          return res.json(response);
        }
                 
  };
     

  checkOwner(req.params.productId);

       

         
	}); // END

	// MOUNT OUR ROUTER IN APP AS APP LEVEL MIDDLEWARE
	app.use('/',router);
}
