import express from 'express';
import db from '../db.js';

const router = express.Router();

router.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        await db.none(`
            delete from sessionWorkoutExercise where SessionWorkoutId = $1;
            delete from SessionWorkout where id = $1;
        `, id)
        res.send()
    } catch (error) {
        return next(error)
    }
})

router.put('/order', async (req, res, next) => {
    try {
        await Promise.all(req.body.sessionWorkoutIds.map((swid, i) => db.none(`update SessionWorkout set Position = $2 where Id = $1`, swid, i + 1)));
        res.send()
    } catch (error) {
        return next(error)
    }
})

export default router;