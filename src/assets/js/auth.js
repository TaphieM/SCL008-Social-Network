/*  En este archivo creamos todas las funciones referentes a la autentificación del usuario */

import {checkNewUser} from '../js/validation.js'
import {checkInitSession} from '../js/validation.js'




//Función para iniciar sesión, usuario ya registrado
export const signInSession=(userEmail,userPassword)=>{
    if (checkInitSession (userEmail,userPassword)){
        alert('Bienvenido, haz iniciado sesión')
        //getUserData(userEmail);
        //console.log(userEmail);
    firebase.auth().signInWithEmailAndPassword(userEmail, userPassword)
    .then(function(){
        window.location.hash='#/wall';
    }).catch(function(error){
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        alert(error.message)
        // ...   
      });
    
    }
}  

//Función para iniciar sesión con gmail
export const  signInGmail=()=> {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
    .then(function(result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        let token = result.credential.accessToken;
        // The signed-in user info.
        let user = result.user;
        // ...
        window.location.hash='#/wall';
      }).catch(function(error) {
        // Handle Errors here.
        let errorCode = error.code;
        let errorMessage = error.message;
        // The email of the user's account used.
        let email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        let credential = error.credential;
        // ...
      }); 
      return 'login con Google';
      
    }



//Función para registro de nuevo usuario
export const newUser = (name, lastname, email, password, confirmPassword) => {

    if (checkNewUser(name, lastname, email, password, confirmPassword)){
         alert('Creación de usuario exitosa')
        firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(function(){
            let db = firebase.firestore();
            db.collection("users").add({
             first: name,
             last: lastname,
             email: email,
             password: password,

        })
        .then(function(docRef) {
            console.log("Document written with ID: ", docRef.id);
        })
        
        .catch(function(error) {
            console.error("Error adding document: ", error);
        });
        window.location.hash='#/wall';
        })

        
        .catch(function(error) {
            // Handle Errors here.
            let errorCode =alert (error.code);
            let errorMessage = alert(error.message);
            // ...
        }); 
    }
   
} 

export const logout =() => {
    firebase.auth().signOut()
    .then(function() {
      }).catch(function(error) {
        // An error happened.
      });
      
    }

//Función que ingresa a firestore para obtener nombre y apellido del usuario registrado
export const getUserData=(email)=>{
	let db = firebase.firestore();
	db.collection('users').where('email', '==', email).get()    
	.then((querySnapshot)=> {
	querySnapshot.forEach((doc)=> {
			firebase.auth().currentUser.name = doc.data().first + " " +doc.data().last;
            console.log('Aquí está pasando por el getUserData');
            //console.log(firebase.auth().currentUser.name);
	});
})
 .catch(function(error) {
	console.log("Error getting documents: ", error);
});

} 
   

    

//Función para confirmar si hay usuario logueado
export const observer =()=>{
    firebase.auth().onAuthStateChanged(function(user) { 
        if (user) {    
        console.log('inicio de sesión exitosa')
    
          // User is signed in.
     let displayName=user.displayName   
      if(displayName == undefined){
          getUserData(user.email);
      }


     let photoURL= user.photoURL;
     if(user.photoURL == undefined){
        photoURL= 'http://img.fenixzone.net/i/zwc5Wfh.png';
      } 
      if (document.getElementById('avatar')){
        document.getElementById('avatar').src = photoURL;
      }      

          
        } else {
         console.log('no existe usuario activo')
         window.location.hash="";
        }
      });
}

   


  




