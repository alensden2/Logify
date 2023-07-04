/**
 * Developer: Alen John
 * Description: This microservice is responsible for user registration and stores user information in the Firestore NoSQL database.
 */

const express = require("express");
const FireStore = require('@google-cloud/firestore');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const bcrypt = require('bcrypt');
const cors = require('cors')


const app = express();

app.use(bodyParser.json());
app.use(helmet());
app.use(cors());

const db = new FireStore({
    projectId: 'assignment-2-391412'
});

const saltRounds = 10;

// Test Endpoint
app.get('/test-service-1', (req, res) => {
    res.send("Hello, World! Service 1");
});

// Endpoint to handle user registration
app.post('/register', async (req, res) => {
    const collectionRef = db.collection('Reg');

    try {
        // Hashing the password
        const password = req.body.password;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Extract registration data from the request body
        const registrationData = {
            Name: req.body.name,
            Password: hashedPassword,
            Email: req.body.email,
            Location: req.body.location,
        };

        // Store the registration data in the Firestore collection
        await collectionRef.add(registrationData);

        console.log('Operation successful');
        res.send('Registration data stored in Firestore');
    } catch (error) {
        console.error('Error storing registration data:', error);
        res.status(500).send('Failed to store registration data in Firestore');
    }
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Server deployed on port ${PORT}`);
});

module.exports = app;


/**
 * References:
 * [1] "Create a Cloud Firestore database", Google Cloud Firestore Documentation,
 *     [Online]. Available: https://cloud.google.com/firestore/docs/create-database-server-client-library#firestore_setup_dataset_pt1-nodejs
 * [2] "bcrypt - npm", [Online]. Available: https://www.npmjs.com/package/bcrypt
 *
 * 
 * Description: This code snippet is based on the official Google Cloud Firestore documentation [1],
 * which provides guidelines for creating a Cloud Firestore database using the server client library in Node.js.
 * The password hashing functionality in this code snippet utilizes the 'bcrypt' library [2],
 * a widely used Node.js library for secure password hashing. For detailed usage instructions, refer to the 'bcrypt' package documentation [2].
 */
