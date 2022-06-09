
  
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  
  const firebaseConfig = {
    apiKey: "AIzaSyBa3VGW81oLtDi3FAbro98DU8dX0odlfLM",
    authDomain: "oneassistnonprod-app.firebaseapp.com",
    databaseURL: "https://oneassistnonprod-app.firebaseio.com",
    projectId: "oneassistnonprod-app",
    storageBucket: "oneassistnonprod-app.appspot.com",
    messagingSenderId: "687799930952",
    appId: "1:687799930952:web:fd5712c1f4ef25200a087d",
    measurementId: "G-DYBNLWJ1CC"
  };

  firebase.initializeApp(firebaseConfig)
  // const mainDB = firebase.database().ref('SDTHashCodeData')
 const dbRef = firebase.database().ref();
console.log(dbRef.child("SDTHashCodeData"))

 // var pushing = mainDB.push()
 // console.log("----setting values")
 // pushing.set({"xyz": "value1"})

//  mainDB.child("iOS").child(userId).get().then((snapshot) => {
//   if (snapshot.exists()) {
//     console.log(snapshot.val());
//   } else {
//     console.log("No data available");
//   }
// }).catch((error) => {
//   console.error(error);
// });

