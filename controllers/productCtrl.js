const Products = require('../models/productModel')

class APIfeatures{
    constructor(query,queryString){
        this.query = query;
        this.queryString= queryString
    }
    filtering(){
        const queryObj = {...this.queryString}
        
        const excludedFields = ['page', 'sort', 'limit']
        excludedFields.forEach(el => delete(queryObj[el]))

        let queryStr = JSON.stringify(queryObj)
        queryStr = queryStr.replace(/\b(gte|gt|lt|lte|regex)\b/g, match => '$' + match)

        
        
        this.query.find(JSON.parse(queryStr))

        return this
    }
    sorting(){
        if(this.queryString.sort){
            const sortBy = this.queryString.sort.split(',').join('')

            this.query = this.query.sort(sortBy)

            console.log(sortBy);
            
        }else{
            this.query = this.query.sort('-createdAt')
        }

        return this

    }

    pagination(){
        const page = this.queryString.page * 1|| 1;
        const limit = this.queryString.limit * 1 || 9;

        const skip = (page-1) * limit;

        this.query = this.query.skip(skip).limit(limit)

        return this;
    }
}

const productCtrl = {
    getProducts: async(req,res) =>{
        try {
            const features = new APIfeatures(Products.find(), req.query).filtering().sorting().pagination();
            const products = await features.query;
            res.json({result:products.length})
        } catch (err) {
            return res.status(500).json({msg:err.message})
        }
    },
    createProducts: async(req,res) =>{
        try {
            const {product_id, title, price, description, content, images, category} = req.body;

            if(!images) return res.status(400).json({msg:"No image Upload"})

            const product = await Products.findOne({product_id})

            if(product)
            return res.status(400).json({msg:"This product already exists"})

            const newProduct = new Products({
                product_id,
                title: title.toLowerCase(),
                price,
                description, content,
                images, 
                category
            })

            await newProduct.save();

            res.json({msg:"Create a product"})
            
        } catch (err) {
            return res.status(500).json({msg:err.message})
        }
    },
    deleteProduct: async(req,res) =>{
        try {
            await Products.findByIdAndDelete(req.params.id)
            res.json({msg:"Deleted a Post"})
        } catch (err) {
            return res.status(500).json({msg:err.message})
        }
    },
    updateProduct: async(req,res) =>{
        try {
            const {title, price, description, content, images, category} = req.body;

            if(!images) return res.status(500).json({msg:"No Image Upload"})

            await Products.findOneAndUpdate({_id:req.params.id},
                {title:title.toLowerCase(), price,description, content, images, category})

            res.json({msg:"Updated a Product"})

        } catch (err) {
            return res.status(500).json({msg:err.message})
        }
    }
}
module.exports = productCtrl;