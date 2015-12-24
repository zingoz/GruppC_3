

  // CREATE A REFERENCE TO FIREBASE
  var rootUrl = "https://shining-fire-7520.firebaseio.com/"
  var dbRef = new Firebase('https://shining-fire-7520.firebaseio.com/');

  // REGISTER DOM ELEMENTS
  var emailField = $('#email');
  var pwdField = $('#pwd');

  //REGISTER NEW USER
$("#regUser").on("click", function(){

  dbRef.createUser({
  email    : $("#email").val(),
  password    : $("#pwd").val(),
}, function(error, userData) {
  if (error) {
      $("#error").text(error);
    console.log("Error creating user:", error);
  } else {
    console.log("Successfully created user account with uid:", userData.uid);
    var newUser = {
      email: $("#email").val()
    };
    this.saveUser(userData.uid,newUser)
  }
})
});

//SAVE/CREATE USER RECORD
var saveUser = function(id, userData){
  dbRef.child("users").child(id).set(userData);
};

//LOGIN USER
$("#loginUser").on("click", function(){

  dbRef.authWithPassword({
  email    : $("#email").val(),
  password    : $("#pwd").val(),
}, function(error, authData) {
  if (error) {
      $("#error").text(error);
    console.log("Login Failed!", error);


  } else {
    console.log("Login Success!:", authData);
      window.location.href = './views/profile.html';
  }
})
});





//profile
var loadCurrentUser = function(){
  var authData = dbRef.getAuth();

  if (authData) {
    var url = rootUrl + "users/" + authData.uid;
    var ref = new Firebase(url);
    var lessons = 'https://shining-fire-7520.firebaseio.com/users/'+authData.uid+'/lessons/';
    var lessonsRef = new Firebase(lessons);

    ref.once("value", function(user){
      var test = user.val();
        $("#welcome").text('welcome ' + test.email);

    });


    lessonsRef.once("value", function(user){
      var test = getSynchronizedArray(lessonsRef);
        console.log(test);
      var ul = document.getElementById('allLessons') ;

       for (var i = 0; i < test.length; i++) {
         var l = test[i].lesson.name;
         var li = $("<li></li>").text(l);
         $(li).attr({
            id: test[i].$id
        }).appendTo(ul);
         console.log(test[i].$id);

         $(li).bind('click', function() {
     setChoosen(this.id);
   });

       }

    });

  }
}

function setChoosen(id){
  var authData = dbRef.getAuth();
  var lessons = 'https://shining-fire-7520.firebaseio.com/users/'+authData.uid+'/lessons/' + id;
  var lessonsRef = new Firebase(lessons);
  lessonsRef.once("value", function(lesson){
    var test = lesson.val();
  console.log(test.lesson.date);
      $("#choosenTitle").text('Vald föreläsning: ' + test.lesson.name);
      $("#choosenId").text(id);

  });


this.getNote(id);
}

function getNote(argument) {
  // body...
  alert(argument);
}


//GET LESSONS -START-
function getSynchronizedArray(firebaseRef) {
  var list = [];
  syncChanges(list, firebaseRef);
  return list;
}
function syncChanges(list, ref) {
  ref.on('child_added', function _add(snap, prevChild) {
    var data = snap.val();
    data.$id = snap.key();
    var pos = positionAfter(list, prevChild);
    list.splice(pos, 0, data);
  });
}

function positionFor(list, key) {
  for(var i = 0, len = list.length; i < len; i++) {
    if( list[i].$id === key ) {
      return i;
    }
  }
  return -1;
}
//FRÅN FB-API
// using the Firebase API's prevChild behavior, we
// place each element in the list after it's prev
// sibling or, if prevChild is null, at the beginning
function positionAfter(list, prevChild) {
  if( prevChild === null ) {
    return 0;
  }
  else {
    var i = positionFor(list, prevChild);
    if( i === -1 ) {
      return list.length;
    }
    else {
      return i+1;
    }
  }
}
//GET LESSONS -END-

var createLesson = function(){
  var authData = dbRef.getAuth();

  var ref = new Firebase('https://shining-fire-7520.firebaseio.com/' + 'users/'+ authData.uid);


 var lessonRef =  ref.child("lessons");
 lessonRef.push({
   lesson: {
     name    : $("#lesson").val(),
     date    : $("#date").val(),
   }
 })
 loadCurrentUser();
  }


//SAVE/CREATE USER RECORD
var saveLesson = function(id, lessonData){
  dbRef.child("users").child(id).set(userData);
};



var saveNote = function(){
var id = $("#choosenId").text();
  alert(id)
  var authData = dbRef.getAuth();

  var ref = new Firebase('https://shining-fire-7520.firebaseio.com/' + 'users/'+ authData.uid + '/lessons/' + id);


 var noteRef =  ref.child("notes");
 noteRef.push({
   note: $("#note").val(),



 })
}
