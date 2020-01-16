
// implement your API here

const db = require('./data/db.js');
const express = require('express');

const server = express();
server.listen(4000, () => {
    console.log('------------server listening on port 4000....--------------');
});

server.use(express.json());

// Endpoints

server.get('/', (req, res) => {
    res.status(403).json({success: false, errorMessage: 'Forbidden'});
});

// Add
server.post('/api/users', (req, res) => {
    const { name, bio } = req.body;

    if (!name || !bio) {
        res.status(400).json({success: false, errorMessage: 'Please provide name and bio for the user.'});
    } else {
        db.insert(req.body)
        .then(user => {
            res.status(201).json(user);
        })
        .catch(() => {
            res.status(500).json({success: false, errorMessage: 'There was an error while saving the user to the database'});
          
        });
    }
});

//  Fetch user list

server.get('/api/users', (req, res) =>{
    db.find()
    .then(users => {
        res.status(200).json(users);
    })
    .catch(err => {
        res.status(500).json({success: false, errorMessage: 'The users information could not be retrieved.'})
    });
});

//  fetch user by ID
server.get('/api/users/:id', (req, res) => {
    const id = req.params.is;

    if (!id){
        res.status(404).json({success: false, errorMessage:'The user with the specified ID does not exist.'});
       
    } else {
        db.findById(id)
        .then(user => {
            res
            .status(200)
            .json({success: true, user})
            .catch(err => {
                res.status(500).json({success: false, errorMessage:'User information could not be retrieved'})
            });
        });

        // delete user
        server.delete('api/users/:id', (req, res) =>{
            const id = req.params.is;
            if(!id){
                res.status(404).json({success: false, errorMessage:'The user with the specified ID does not exist.'});
            }else{
                db.remove(id)
                res.status(204).end();
            }
        });

        // edit user

        server.put('api/users/:id', (req, res) => {
            const id = req.params.id;
            const { name, bio } = req.body;
            if (!name || !bio){
                res.status(400).json({success: false, errorMessage: 'Please provide name and bio for the user.'});
            } else {
                db.update(req.params.is, req.body)
                .then(user => {
                    if (user){
                        res.status(200).json(user);
                    }else{
                        res.status(404).json({success: false, errorMessage:'The user with the specified ID does not exist.'});
                    };
                })
                .catch(err=> {
                    res.status(500).json({success: false, errorMessage:'The user information could not be modified.'});
                });
            }
        })
    }

});


