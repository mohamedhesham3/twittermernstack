const express=require('express')
const upload=require('../confgis/multer')
const Router=express.Router()
const {register,login,findUser, verifyToken, findallusers, getuserbyname, changeuseravatar}=require('../Controllers/Auth')
const {Post, getpost, likes, getallposts, getpostbyId, comment, bookmark }=require('../Controllers/Post')
const { makechat, findroom, getallrooms } = require('../Controllers/Chat')
const { follow, findFollowers } = require('../Controllers/UserStatus')


Router.post('/register',upload.single('Avatar'), register);
Router.post('/login', login);


Router.get('/finduser/:userid',verifyToken,findUser)

Router.get('/findusers',verifyToken,findallusers)

Router.get('/getUserbyname/',verifyToken,getuserbyname)  

Router.put('/avatar/:userid',verifyToken,upload.single('Avatar'),changeuseravatar)



Router.post('/post/:userid',upload.single('Image'),verifyToken,Post)

Router.get('/getpost/:userid',verifyToken,getpost)

Router.get('/grtall',verifyToken,getallposts)




Router.get('/getpostbyid/:postid',verifyToken,getpostbyId)




Router.post('/like/:postid',verifyToken,likes)




Router.post('/comment/:postid',verifyToken,comment)



Router.post('/bookmark',verifyToken,bookmark)





Router.post('/createchat',verifyToken,makechat)

Router.get('/getroomsbyuser/:userid',verifyToken,getallrooms)

Router.get('/chat/:roomid',findroom)




Router.post('/follow/:profileId',verifyToken,follow)


Router.get('/isfollowing/:profileId',findFollowers)



module.exports=Router
