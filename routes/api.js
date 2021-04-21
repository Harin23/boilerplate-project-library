/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';
const mongoose = require('mongoose');

const URI = process.env.DB;
mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

const bookSchema = new mongoose.Schema({
  title: {type: String, required: true},
  comments: [String]
});

const BOOKS = mongoose.model("books", bookSchema);

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      BOOKS.find({}, (err, documents)=>{
        if(err || documents==null){
          console.log(err)
          res.send('error')
        }else{
          res.json(documents);
        }
      })
    })
    
    .post(function (req, res){
      let title = req.body.title;
      //response will contain new book object including atleast _id and title
      if(!title){
        res.send('missing required field title');
      }else{
      let book = new BOOKS({
        title: title
      });
      book.save((err, doc)=>{
        if(err || doc==null){
          console.log(err)
          res.send('error')
        }else{
          res.json(doc);
        }
      })
      }
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
      BOOKS.deleteMany({}, (err)=>{
        if(err){
          res.json(err)
        }else{
          res.send('complete delete successful')
        }
      })
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      if(!bookid){
        res.send('missing required field id');
      }else{
        BOOKS.findById(bookid, (err, doc)=>{
          if(err || doc==null){
            res.send('no book exists')
          }else{
            res.json(doc)
          }
        })
      }
    })
    
    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
      if(!bookid){
        res.send('missing required field id');
      }else if(!comment){
        res.send('missing required field comment')
      }else{
        BOOKS.findById(bookid, (err, doc)=>{
          if(err || doc==null){
            res.send('no book exists'); 
          }else{
            doc.comments.push(comment);
            doc.save((err, doc)=>{
              res.json(doc);
            })
          }
        })
      }
    })
    
    .delete(function(req, res){
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      if(!bookid){
        res.send('missing required field id');
      }else{
        BOOKS.findByIdAndRemove(bookid, (err, doc)=>{
          if(err || doc==null){
            res.send('no book exists');
          }else{
            res.send('delete successful')
          }
        })
      }
    });
  
};
