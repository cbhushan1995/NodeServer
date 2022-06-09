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
window.writeDataToDB = writeDataToDB
