import express from 'express';
import db from '../db.js';

const router = express.Router();

router.delete('/:id', async (req, res, next) => {
    console.log('test')
    try {
        const id = req.params.id;
        console.log('delete workout id:', id);
        await db.none(`delete from workoutexercise
        where workoutid = $1;        
        delete from workout
        where Id =  $1;`, id)

        res.send('OK');
    } catch (error) {
        return next(error)
    }
});

export default router;