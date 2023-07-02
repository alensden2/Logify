/**
 * Developer: Alen John
 * Description: This microservice handles user login and authentication by validating credentials against Firestore database.
 */

const express = require("express");
const FireStore = require("@google-cloud/firestore");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const bcrypt = require("bcrypt");

const app = express();
app.use(bodyParser.json());
app.use(helmet());

const sharedSecret = '233njn1oiwdnkjn489hbhwb20019jnjke';

const db = new FireStore({
    projectId: 'assignment-2-391412',
    keyFilename: '../../../../../../cynos/Downloads/assignment-2-391412-7103b50d9c53.json'
})

// Test Endpoint 
app.get('/test-service-2', (req, res) => {
    return res.send("Hello, from service 2");
})

// Endpoint for the login function
app.post('/login', async (req, res) => {
    const collectionRef = db.collection('Reg');

    try {
        // Retrive the user info using the provided email
        const querySnap = await collectionRef.where('Email', '==', req.body.email).get();
        if (querySnap.empty) {
            // User is not present in the DB
            console.log("401 Invalid credentials")
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
        console.log("Login Success")
        return res.status(200).send("Login Success!");
    } catch (error) {
        console.error('Error during process : ', error);
        return res.status(500).send("Login Failed");
    }
})
const PORT = 8081;

app.listen(PORT, () => {
    console.log(`Microservice 2 running on ${PORT}`);
})