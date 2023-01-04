
const blogModel = require("../models/blogModel")
let moment = require('moment')
let date = new Date()

//CREATE
const createblog = async function(req, res){
  try{
  let data = req.body
  let created = await blogModel.create(data)
  res.send({status: true, data: created})
  }
  catch(err){
    res.send(err.message)
  }
}

//GET

const getblog = async (req,res)=> {

    let data = req.query
    
    let finder = await blogModel.find({isDeleted : false , isPublished :true,...data})
    if(finder.length==0) return res.status(404).send({
        status: false,
        msg: "Blog doesnt exits in database"
      })
       return res.status(200).send({
        status: true,
        data:  
           finder
        
      })
} 

//DELETE

const isdeletebyId=async function(req,res){
  let blogId=req.params.blogId
  let finder = await blogModel.findById(blogId)
  if(!finder)return res.send(400).send({error : "BlogId doesnt exist in database"})

}

//UPDATE
//updating blog data 
const updateBlogData = async function(req,res){
  try
  {    
       
      // checking if there is data in request's body or not
       if(Object.keys(req.body).length != 0) 
       {
           blogId = req.params.blogId //storing blog id into variable
           let blogIDExist = await blogModel.findById(blogId) //validation - if user id valid or not
           //checking if user is deleted or not
           if(blogIDExist.isDeleted==true) res.status(400).send({status:false,msg: "This Blog ID Doesn't Exist"})
           let updatedBlogData = await blogModel.findByIdAndUpdate
           (
             blogId,
             {$set:{
               ...req.body,
               isPublished: true,
               publishedAt : moment().format() //inserting date with moment library
               }},
             {new:true}
           )
           res.status(200).send(updatedBlogData)
       }
       else 
       {
              res.status(400).send({status:false,msg: "There is no Data in request's Body"})
       }
    }
 catch
 {
   res.status(404).send({status:false,msg:"Please Enter Correct Blog ID"})
 }
}



// module.exports.createblog=createblog

module.exports.getblog=getblog
module.exports.createblog = createblog 
module.exports.isdeletebyId=isdeletebyId
module.exports.updateBlogData = updateBlogData