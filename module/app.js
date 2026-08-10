const fs=require('fs')
// const path=require('path')

//path module------------------------------

// console.log(path.basename(__filename));
// console.log(path.dirname(__filename));

// http module-----------------------------

// const http=require('http')
// http.createServer((req,res)=>{
//     res.write('welcome to NOdejs class')
//     res.end()
// }).listen(3006)


//fs module------------------------------

//create file

// fs.writeFile('hello.txt','hello world',function(err){
//     if(err) throw err;
//     console.log('file created')
// })


//read file

// fs.readFile('hello.txt','utf8',function(err,data){
//     if(err) throw err;
//     console.log(data)
// })


//append file

// fs.appendFile('hello.txt',' welcome to webskitters',function(err){
//     if(err) throw err;
//     console.log('file created')
// })



// delete file


// fs.unlink('hello.txt',function(err){
//     if(err) throw err;
//     console.log('file deleted')
// })