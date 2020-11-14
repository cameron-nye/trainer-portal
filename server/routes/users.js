import express from 'express';

const router = express.Router();

router.post('/', (req, res) => {
    if (req.body.username) {
        res.status(201).send({ userId: 1 })
    } else {
        res.status(400).send("Missing Username")
    }
});

export default router;