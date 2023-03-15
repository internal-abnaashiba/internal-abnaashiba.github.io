
function signup () {
    // Initialize Firebase
    firebase.initializeApp({
        apiKey: "YOUR_API_KEY",
        authDomain: "YOUR_AUTH_DOMAIN",
        projectId: "YOUR_PROJECT_ID"
      });
      
      // Get a reference to the Firestore database
      const db = firebase.firestore();
      
      // Add a new document to a collection
      db.collection("users").add({
          name: "John Doe",
          email: "johndoe@example.com",
          age: 30
      })
      .then((docRef) => {
          console.log("Document written with ID: ", docRef.id);
      })
      .catch((error) => {
          console.error("Error adding document: ", error);
      });
      

}