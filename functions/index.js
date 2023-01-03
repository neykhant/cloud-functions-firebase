const functions = require("firebase-functions");
const admin = require("firebase-admin")

var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const express = require("express")
const cors = require("cors");

//Main App
const app = express();
app.use(cors({ origin: true }))

//Main database functions
const db = admin.firestore();

//Routes
app.get("/", (req, res) => {
    return res.status(200).send("Hi there how are yoy?...");
})

//create -> post
app.post("/api/create", (req, res) => {
    (async () => {
        try {
            await db.collection('userDetails').doc(`/${Date.now()}/`).create({
                id: Date.now(),
                name: req.body.name,
                mobile: req.body.mobile,
                address: req.body.address
            })
            return res.status(200).send({ status: "Success", msg: "Data Saved" })
        } catch (error) {
            console.log(error)
            return res.status(500).send({ status: "Fail", msg: error })
        }
    })()
})

//get -> get()
//fetch single data from firestore using specific ID
app.get('/api/get/:id', (req, res) => {
    (async () => {
        try {
            const reqDoc = db.collection('userDetails').doc(req.params.id);
            let userDetail = await reqDoc.get();
            let response = userDetail.data();

            return res.status(200).send({ status: "Success", data: response })
        } catch (error) {
            console.log(error)
            return res.status(500).send({ status: "Fail", msg: error })
        }
    })()
})

//fetch all data from firestore 
app.get('/api/getAll', (req, res) => {
    (async () => {
        try {
            const query = db.collection('userDetails');
            let response = [];
            await query.get().then((data) => {
                let docs = data.docs;

                docs.map((doc) => {
                    const selectedData = {
                        name: doc.data().name,
                        mobile: doc.data().mobile,
                        address: doc.data().address
                    }
                    response.push(selectedData)
                });
                return response;
            })
            return res.status(200).send({ status: "Success", data: response })
        } catch (error) {
            console.log(error)
            return res.status(500).send({ status: "Fail", msg: error })
        }
    })()
})

//update -> put()
app.put("/api/update/:id", (req, res) => {
    (async () => {
        try {
            const reqDoc = db.collection('userDetails').doc(req.params.id);
            await reqDoc.update({
                name: req.body.name,
                mobile: req.body.mobile,
                address: req.body.address
            })
            return res.status(200).send({ status: "Success", msg: "Data Updated" })
        } catch (error) {
            console.log(error)
            return res.status(500).send({ status: "Fail", msg: error })
        }
    })()
})


//delete -> delete()
app.delete("/api/delete/:id", (req, res) => {
    (async () => {
        try {
            const reqDoc = db.collection('userDetails').doc(req.params.id);
            await reqDoc.delete();
            return res.status(200).send({ status: "Success", msg: "Data Removed" })
        } catch (error) {
            console.log(error)
            return res.status(500).send({ status: "Fail", msg: error })
        }
    })()
})


exports.app = functions.https.onRequest(app);
