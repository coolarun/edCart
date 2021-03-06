
$(document).ready(function(){
	
	// LOAD USER DETAILS
	$.ajax({url:"/api/user",
		success: function(response){
			let uname = response.data.userName;
			let email = response.data.email;
			$('#uname').html(uname);
			$('#email').html(email);
		}
        
        });




         // LOAD ALL THE PRODUCTS
	 $.ajax({url: "/api/allproducts", 
	 	success: function(response){
        console.log(response);

        $.allproducts = response.data;
        console.log($.allproducts);
        let card;
        for(let i in $.allproducts){
        	
        	 card = "<div class='col-md-4'><div class='well productcard'><img class='productImg' src="+$.allproducts[i].productImage+">"+
         "<h6 style='text-align:left;font-size:0.9em;color:crimson'>"+$.allproducts[i].productName+"</h6>"+
          "<h6 style='text-align:left;font-size:0.9em'>Price:<span style='color:crimson'>"+$.allproducts[i].productPrice+" Rupees</span></h6>"+
          "<h6 style='text-align:left;font-size:0.9em'>Quantity:<span style='color:crimson' id="+$.allproducts[i]._id+">"+$.allproducts[i].productQuantity+"</span></h6>"+
          "<h6 style='text-align:left;font-size:0.9em'>Category:<span style='color:crimson' >"+$.allproducts[i].productCategory+"</span></h6>"+
          "<h6 class='btn btn-primary addcart cool' style='text-align:left;font-size:0.9em;cursor:pointer;' productId= "+$.allproducts[i]._id+">Add to cart</h6>"+
           "</div></div>";
           $('#parentCard').prepend(card);

        }
             $(".productcard").fadeIn('slow');
         

           // FUNCTION FOR ADD PRODUCT TO THE CART
	 $('.addcart').click(function(){
        
	 	$.productId = $(this).attr('productid');
	 	console.log($.productId);

	 
    $.post("/api/addproducttocart",
    {
        id:$.productId,
        
    },
    function(response, status){
    	console.log(response);
    	 if(response.status===200){
          let QuantityUpdate = response.data.productQuantity;
          let id ="#"+$.productId;
           $('#notification').fadeIn();
          // SHOW NOTIFICATION AND REMOVE IT AFTER FEW SECONDS
           $('#notification').html('product has been successfully added to the cart');
          setInterval(()=>{
             $('#notification').fadeOut();
          }, 5000)
          
         $(id).html(String(QuantityUpdate));
       } else{
         console.log('this prouduct is out of stock');

           $('#notification').fadeIn();
          // SHOW NOTIFICATION AND REMOVE IT AFTER FEW SECONDS
           $('#notification').html('Sorry, this product is out of stock');
          setInterval(()=>{
             $('#notification').fadeOut();
          }, 5000)
       }
        
    });



	 });




      }});

	 // LOGOUT FUNCTION

    $('#logout').click(function(){
          
          $.ajax({url:"/api/logout",
		success: function(response){
			console.log(response);
		    //location.reload();
		}
        
        });

    });

});