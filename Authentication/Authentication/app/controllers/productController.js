const productUser = require("../models/productModels.js");
const httpstatuscode = require("../utils/httpStatuscode");

// add sucessfully
exports.addProduct = async (req, res) => {
  try {
    const { name, description, price, image, color, size } = req.body;

    if (!name || !description || !price) {
      return res.status(httpstatuscode.UNAUTHORIZED).json({
        success: false,
        message: "These All fields Are Required",
      });
    }

    const newProduct = await productUser.create({
      name,
      description,
      price,
      image,
      color,
      size,
    });

    return res.status(httpstatuscode.CREATED).json({
      success: true,
      message: "Product Add Sucessfully",
      data: newProduct,
      
    });
  } catch (err) {
    console.log(err);
  }
};

// get products

exports.getProduct = async (req, res) => {
  try {
    const productData = await productUser.find({ isDelted: false });

    if (!productData || productData.length == 0) {
      return res.status(httpstatuscode.NOT_FOUND).json({
        success: false,
        message: "NO any Product Data Found",
      });
    }

    return res.status(httpstatuscode.OK).json({
      sucess: true,
      message: "Data Found Sucessfully",
      length:productData.length,
      data: productData,
      
    });
  } catch (err) {
    console.log(err);
  }
};

// get by id

exports.getPrductByid = async (req, res) => {
  try {
    const { id } = req.params;

    const productData = await productUser.findById(id);

    if (!productData) {
      return res.status(httpstatuscode.NOT_FOUND).json({
        sucess: false,
        message: "Data not Found",
      });
    }

    return res.status(httpstatuscode.OK).json({
      sucess: true,
      message: "Data Found Sucessfully",
      data: productData,
    });
  } catch (err) {
    console.log(err);
  }
};

// update

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    console.log("ID from URL:", id);
    console.log("Data from Body:", updateData);

    const updateProduct = await productUser.findOneAndUpdate(
      { _id: id },
      updateData,
      { new: true },
    );

    console.log("Result from DB:", updateProduct);

    if (!updateProduct) {
      return res.status(httpstatuscode.UNAUTHORIZED).json({
        sucess: false,
        message: "Not Update sucessfully",
      });
    }

    return res.status(httpstatuscode.OK).json({
      sucess: true,
      message: "Update sucessfully",
      data: updateProduct,
    });
  } catch (err) {
    console.log(err);
  }
};

// softdelete 


exports.softDeleteProduct = async(req,res)=>{
    try{
        const {id} = req.params
        
        const product = await productUser.findByIdAndUpdate(
            id,
            {isDelted:true},
            {new:true}
        )

        if(!product){
            return res.status(httpstatuscode.UNAUTHORIZED).json({
                sucess:false,
                message:"product not found"
            })
        }


        return res.status(httpstatuscode.OK).json({
            sucess:true,
            message:"product move to trash",
            data:product
        })

    }
    catch(err){
         console.log(err)
    }
}

// patch trash data 


exports.restoreProduct  = async(req,res)=>{
   try{
     
    const { id } = req.params; 

    const updatedProduct = await productUser.findByIdAndUpdate(
      id,
      { isDelted: false }, 
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(httpstatuscode.NOT_FOUND).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(httpstatuscode.OK).json({
        success:true,
        message:"Restore Data sucessfully",
        data:updatedProduct
    })


   }
   catch(err){
      console.log(err)
   }
}


// permanent delete

exports.permanentDeleteProduct = async(req,res)=>{
    try{
        const {id} = req.params
        
        const product = await productUser.findByIdAndDelete(
            id,
          
        )

        if(!product){
            return res.status(httpstatuscode.UNAUTHORIZED).json({
                sucess:false,
                message:"product not found"
            })
        }


        return res.status(httpstatuscode.OK).json({
            sucess:true,
            message:"product erase from database forever",
            data:product
        })

    }
    catch(err){
         console.log(err)
    }
}
