import express from 'express';
import db from '../db.js';

const router = express.Router();

router.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        await db.none(`
            delete from workoutexercise where workoutid = $1;        
            delete from workout where Id = $1;`,
            id);
        res.send();
    } catch (error) {
        return next(error)
    }
});

export default router;