/**
 * Developer: Alen John
 * Description: This microservice handles user login and authentication by validating credentials against Firestore database.
 */

// All the required dependencies
const express = require("express");
const FireStore = require("@google-cloud/firestore");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const bcrypt = require("bcrypt");

const app = express();
app.use(bodyParser.json());
app.use(helmet());

const db = new FireStore({
    projectId: 'assignment-2-391412',
    keyFilename: '../../../../../../cynos/Downloads/assignment-2-391412-7103b50d9c53.json'
});

// Utility function to update user state with timestamp
const updateUserState = async (email, state) => {
    const collectionRef = db.collection('state');
    try {
        // Getting the timestamp 
        const timestamp = new Date();

        // Checking if the email is already present in the collection 
        const querySnap = await collectionRef.where('Email', '==', email).get();
        if (querySnap.empty) {
            // User is not present in the database, create a new entry
            await collectionRef.add({ Email: email, UserState: state, TimeStamp: timestamp });
            console.log("State Updated");
        } else {
            // User is already present, update the user state
            const docId = querySnap.docs[0].id;
            await collectionRef.doc(docId).update({ UserState: state, TimeStamp: timestamp });
            console.log("State Updated");
        }
    } catch (error) {
        console.error('Error updating user state:', error);
    }
};

// Test Endpoint 
app.get('/test-service-2', (req, res) => {
    return res.send("Hello, from service 2");
});

// Endpoint for the login function
app.post('/login', async (req, res) => {
    const collectionRef = db.collection('Reg');

    try {
        // Retrieve the user info using the provided email
        const querySnap = await collectionRef.where('Email', '==', req.body.email).get();
        if (querySnap.empty) {
            // User is not present in the DB
            console.log("401 Invalid credentials");
            return res.status(401).send("Invalid credentials");
        }

        const user = querySnap.docs[0].data();

        // Validating Password
        const passwordMatch = await bcrypt.compare(req.body.password, user.Password);
        if (!passwordMatch) {
            // Invalid password
            console.log("401 Invalid Credentials");
            return res.status(401).send("Invalid credentials");
        }
        console.log("Login Success");

        // If the user is successfully logged in, the state is changed
        // If the email is not present in the database, a new entry is created and the "userState" is set to "Online"
        // If the user email is already present, the "userState" value is set to "Online"

        await updateUserState(req.body.email, "online");

        return res.status(200).send("Login Success!");
    } catch (error) {
        console.error('Error during process:', error);
        return res.status(500).send("Login Failed");
    }
});

const PORT = 8081;

app.listen(PORT, () => {
    console.log(`Microservice 2 running on ${PORT}`);
});