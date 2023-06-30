/**
 * 
 * 
 * Developer - alen john
 * This microservice is responsible for registration, this stores all the user info in the firestore NoSQL DB
 * 
 * 
 */
const express = require("express");
const FireStore = require('@google-cloud/firestore')

const app = express();
const db = new FireStore({
    projectId: 'assignment-2-391412',
    keyFilename: '../../../../../../cynos/Downloads/assignment-2-391412-7103b50d9c53.json',
})

// Test Endpoint
app.get('/test-service-1', (req, res) => {
    res.send("hello, world service 1!!");
});

// Endpoint to handle user registration
app.post('/register', async (req, res) => {
    const collectionRef = db.collection('Reg');

    // Extract registration data from the request body
    const registrationData = {
        Name: req.body.name,
        Password: req.body.password,
        Email: req.body.email,
        Location: req.body.location,
    };

    try {
        // Store the registration data in the Firestore collection
        await collectionRef.add(registrationData);
        res.send('Registration data stored in Firestore');
    } catch (error) {
        console.error('Error storing registration data:', error);
        res.status(500).send('Failed to store registration data in Firestore');
    }
})

const PORT = 8080;

app.listen(PORT, () => {
    console.log(`Server deployed ${PORT}`);
})


/**
 * Reference: 
 * [1] "Create a Cloud Firestore database", Google Cloud Firestore Documentation, 
 *     https://cloud.google.com/firestore/docs/create-database-server-client-library#firestore_setup_dataset_pt1-nodejs
 *
 * Description: This code snippet is based on the official Google Cloud Firestore documentation [1].
 * It provides a reference to the documentation page that explains how to create a Cloud Firestore database
 * using the server client library in Node.js.
 */
