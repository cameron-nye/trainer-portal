import express from 'express';
import db from '../db.js';

const router = express.Router();

router.post('/', async (req, res, next) => {
    try {
        const data = await db.one(``)
        res.json({})
    } catch (error) {
        return next(error)
    }
})

router.get('/', async (req, res, next) => {
    try {
        res.send();
    } catch (error) {
        return next(error)
    }
});

export default router;