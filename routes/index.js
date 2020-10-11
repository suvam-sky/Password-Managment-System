var express = require('express');
var router = express.Router();
var userModule = require('../modules/user')
var passCatModel = require('../modules/password_category')
var passModel = require('../modules/add_password')
var bcrypt = require('bcryptjs')
var jwt = require('jsonwebtoken');

const { check, validationResult } = require('express-validator');
var getPasscat = passCatModel.find({})
var getAllPass = passModel.find({})


function checkLoginUser(req,res,next){
  var userToken=localStorage.getItem('userToken');
  try {
    var decoded = jwt.verify(userToken, 'loginToken');
  } catch(err) {
    res.redirect('/');
  }
  next();
}
if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}


function checkEmail(req,res,next){
  var email=req.body.email
  var checkExitsEmail = userModule.findOne({email:email})
  checkExitsEmail.exec((err,data)=>{
    if(err) throw err
    if(data){
      return res.render('signup', { 
        title: 'Password Managment System' ,
        msg:"Email already exists"});
    }
    next()
  })
}

function checkUserName(req,res,next){
  var username=req.body.uname
  var checkExitsEmail = userModule.findOne({username:username})
  checkExitsEmail.exec((err,data)=>{
    if(err) throw err
    if(data){
      return res.render('signup', { 
        title: 'Password Managment System' ,
        msg:"username already exists"});
    }
    next()
  })
}

router.get('/', function(req, res, next) {
  var loginUser = localStorage.getItem('loginUser')
  if(loginUser)
  {
    res.redirect('./dashboard')
  }
  else
  {
  res.render('index', { title: 'Password Managment System' ,msg:''});
  }
});

router.post('/', function(req, res, next) {
  var username=req.body.uname;
  var password=req.body.password;
  var checkUser=userModule.findOne({username:username});
  checkUser.exec((err, data)=>{
   if(data==null){
    res.render('index', { title: 'Password Management System', msg:"Invalid Username and Password." });

   }else{
if(err) throw err;
var getUserID=data._id;
var getPassword=data.password;
if(bcrypt.compareSync(password,getPassword)){
  var token = jwt.sign({ userID: getUserID }, 'loginToken');
  localStorage.setItem('userToken', token);
  localStorage.setItem('loginUser', username);
  res.redirect('/dashboard');
}else{
  res.render('index', { title: 'Password Management System', msg:"Invalid Username and Password." });

}
  }
  });
});


router.get('/dashboard',checkLoginUser, function(req, res, next) {
  var loginUser = localStorage.getItem('loginUser')
  res.render('dashboard', { title: 'Password Managment System' , loginUser:loginUser,msg:''});
});


router.get('/signup', function(req, res, next) {
  var loginUser = localStorage.getItem('loginUser')
  if(loginUser)
  {
    res.redirect('./dashboard')
  }
  else
  {
  res.render('signup', { 
    title: 'Password Managment System',
    msg:''
  });
}
});


router.post('/signup',checkUserName, checkEmail,function(req, res, next) {
  
  var username=req.body.uname
  var email=req.body.email
  var password=req.body.password
  var confirmpassword=req.body.confpassword

  if(password!=confirmpassword){
    res.render('signup', { 
      title: 'Password Managment System' ,
      msg:"password does not match"});
  }
  else{
    password = bcrypy.hashSync(req.body.password,10)
  var userDetails =  new userModule({
    username:username,
    email:email,
    password:password
  })
  userDetails.save((err,doc)=>{
    if(err) throw err
    res.render('signup', { 
      title: 'Password Managment System' ,
      msg:"user ragister successfully"});
  })
}
});




router.get('/add-new-category', function(req, res, next) {
  var loginUser = localStorage.getItem('loginUser')
    res.render('addNewCategory', { title: 'Password Managment System',loginUser:loginUser,errors:'' ,success:''});
});

router.post('/add-new-category',[check('passwordCategory','Enter password category name').isLength({min:1})], function(req, res, next) {
  var loginUser = localStorage.getItem('loginUser')
  const errors = validationResult(req)
  if(!errors.isEmpty())
  {
    console.log(errors.mapped());
    res.render('addNewCategory', { title: 'Password Managment System',loginUser:loginUser , errors:errors.mapped(),success:''});
  }
  else
  {
    var passCatName = req.body.passwordCategory
    var passCatDetails = new passCatModel({
      password_category:passCatName
    })
    passCatDetails.save((err,doc)=>{
      if(err) throw err
      res.render('addNewCategory', { title: 'Password Managment System',loginUser:loginUser,errors:'' , success:'password category inserted successfully'});
    })
}

});




router.get('/passwordCategory', function(req, res, next) {
  var loginUser = localStorage.getItem('loginUser')
  getPasscat.exec((err,data)=>{
    if(err) throw err

    res.render('password_category', { title: 'Password Managment System',loginUser:loginUser, records:data});
  })
});

//for delete password category
router.get('/passwordCategory/delete/:id', function(req, res, next) {
  var loginUser = localStorage.getItem('loginUser')
  var passcat_id = req.params.id
  console.log(passcat_id)
  var passDelete= passCatModel.findByIdAndDelete(passcat_id)
  passDelete.exec((err,doc)=>{
    if(err) throw err
    res.redirect('/passwordCategory')
  })
});


router.get('/passwordCategory/edit/:id', function(req, res, next) {
  var loginUser = localStorage.getItem('loginUser')
  var passcat_id = req.params.id
  console.log(passcat_id)
  var getpassCat= passCatModel.findById(passcat_id)
  getpassCat.exec((err,data)=>{
    if(err) throw err
    res.render('edit_pass_category', { title: 'Password Managment System',loginUser:loginUser,errors:'',success:'', records:data, id:passcat_id});
  })
});

router.post('/passwordCategory/edit/', function(req, res, next) {
  var loginUser = localStorage.getItem('loginUser')
  var passcat_id=req.body.id;
  var passwordCategory=req.body.passwordCategory;
  console.log(passcat_id,passwordCategory)
 var update_passCat= passCatModel.findByIdAndUpdate({_id:passcat_id},{passord_category:passwordCategory},{ new: true });
 update_passCat.exec(function(err,doc){
    if(err) throw err;
    res.redirect('/passwordCategory');
  });
});


router.get('/add-new-password', function(req, res, next) {
  var loginUser = localStorage.getItem('loginUser')
  getPasscat.exec((err,data)=>{
    if(err) throw err
    res.render('add-new-password', { title: 'Password Managment System',loginUser:loginUser , records:data, success:''});

  })
});

router.post('/add-new-password', function(req, res, next) {
  var loginUser = localStorage.getItem('loginUser')
  var pass_cat = req.body.pass_cat
  var pass_details = req.body.pass_details
  var project_name = req.body.project_name
  var password_details = new passModel({
    password_category:pass_cat,
    project_name:project_name,
    password_detail:pass_details
  })

  password_details.save((err,doc)=>{
      getPasscat.exec((err,data)=>{
        if(err) throw err
        res.render('add-new-password', { title: 'Password Managment System',loginUser:loginUser , records:data,success:"password inserted successfully"});

    })
    
  })
});



router.get('/view-all-password', function(req, res, next) {
  var loginUser = localStorage.getItem('loginUser')

  getAllPass.exec(function( err , data) {
    if(err) throw err
    res.render('view-all-password', { title: 'Password Managment System',
    loginUser:loginUser, 
    records:data ,
    
  });
  })
  });





  router.get('/password-detail', function(req, res, next) {
    res.redirect('/dashboard')
    });

  router.get('/password-detail/edit/:id', function(req, res, next) {
      var loginUser = localStorage.getItem('loginUser')
      var id = req.params.id
      var getPassDetail =  passModel.findById({_id:id})
      getPassDetail.exec((err,data)=>{
    if(err) throw err
    getPasscat.exec((err,data1)=>{
      res.render('edit_password_detail', { title: 'Password Managment System',loginUser:loginUser,records:data1, record:data ,success:''});
    })
  })
});



router.post('/password-detail/edit/:id', function(req, res, next) {
  var loginUser = localStorage.getItem('loginUser')
  var id = req.params.id
  var passcat = req.body.pass_cat
  var project_name = req.body.project_name
  var pass_details = req.body.pass_details
  passModel.findByIdAndUpdate(id,{password_category:passcat,project_name:project_name,password_detail:pass_details}).exec((err)=>{
    if(err) throw err
  var getPassDetail =  passModel.findById({_id:id})
  getPassDetail.exec((err,data)=>{
if(err) throw err
getPasscat.exec((err,data1)=>{
  res.render('edit_password_detail', { title: 'Password Managment System',loginUser:loginUser,records:data1, record:data ,success:''});
})
}) 
})
});



router.get('/password-detail/delete/:id', function(req, res, next) {
  var loginUser = localStorage.getItem('loginUser')
  var id = req.params.id
  var passDelete= passModel.findByIdAndDelete(id)
  passDelete.exec((err,doc)=>{
    if(err) throw err
    res.redirect('/view-all-password')
  })
});

router.get('/logout', function(req, res, next) {
  localStorage.removeItem('userToken')
  localStorage.removeItem('loginUser')
  res.redirect('/')
});



module.exports = router;
