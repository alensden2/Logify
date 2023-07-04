/**
 * Developer: Alen John
 * Description: This microservice handles which users are online 
 */

// All the required dependencies

const express = require('express');
const FireStore = require("@google-cloud/firestore");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(helmet());
app.use(cors());

const db = new FireStore({
    projectId: 'assignment-2-391412'
});

// Utility function to update user state
const updateUserState = async (email, state) => {
    try {
        const collectionRef = db.collection("state");

        // Check if the email is already present in the collection
        const querySnap = await collectionRef.where('Email', '==', email).get();
        if (querySnap.empty) {
            // User is not present in the database, create a new entry
            await collectionRef.add({ Email: email, UserState: state });
        } else {
            // User is already present, update the user state
            querySnap.docs[0].ref.update({ UserState: state });
        }
        console.log(`User state updated: ${email} -> ${state}`);
    } catch (error) {
        console.error('Error updating user state:', error);
    }
};

// Endpoint for home page
app.post("/home", async (req, res) => {
    try {
        const currentUserEmail = req.body.email; // Current logged-in user's email
        const collectionRef = db.collection("state");

        // Retrieve all user documents
        const querySnap = await collectionRef.get();

        // Filter the documents to get online users excluding the current user
        const onlineUsers = [];
        querySnap.forEach((doc) => {
            const userData = doc.data();
            if (userData.UserState === 'online' && userData.Email !== currentUserEmail) {
                onlineUsers.push({
                    Email: userData.Email,
                    UserState: userData.UserState
                });
            }
        });

        console.log("Operation Successful");
        res.status(200).json(onlineUsers);
    } catch (error) {
        console.error('Error fetching online users:', error);
        res.status(500).send("Error fetching online users");
    }
});

// Logout End point
app.post("/logout", async (req, res) => {
    const email = req.body.email;

    try {
        // Update user state to "offline"
        await updateUserState(email, "offline");

        console.log("User logged out:", email);
        res.status(200).send("Logout success");
    } catch (error) {
        console.error('Error logging out user:', error);
        res.status(500).send("Error logging out user");
    }
});


const PORT = process.env.PORT || 8082;
app.listen(PORT, () => {
    console.log(`Service 3 running @ ${PORT}`);
})

/**
 * References:
 * [1] "Query a Cloud Firestore database", Google Cloud Firestore Documentation,
 *     [Online]. Available: https://googleapis.dev/nodejs/firestore/latest/Query.html
 *
 * Description: This code snippet is based on the official Google Cloud Firestore documentation [1],
 * which provides guidelines for Querying a Cloud Firestore database using the server client library in Node.js.
 */
