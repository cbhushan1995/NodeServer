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
const dbRef = firebase.database().ref();
const writeDataToDB = (data) => {
  dbRef.child("IMEI_POC").set(data)
}

const updateData = (data) => {
  firebase.database().ref().update(data)
}


// dbRef.child("IMEI_POC").get().then((snapshot) => {
//   if (snapshot.exists()) {
//     console.log(snapshot.val());
//   } else {
//     console.log("No data available");
//   }
// }).catch((error) => {
//   console.error(error);
// })



function readAllIMEIData () {
  return new Promise((resolve,reject)=>{
    dbRef.child("IMEI_POC").once('value',   function(snapshot) {
      resolve(snapshot);
    });
  });
}

window.writeDataToDB = writeDataToDB
window.updateData = updateData
window.readAllIMEIData = readAllIMEIData
