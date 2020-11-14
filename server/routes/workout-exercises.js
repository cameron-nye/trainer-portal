import express from 'express';
import db from '../db.js';

const router = express.Router();

router.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        await db.none(`delete from WorkoutExercise where id = $1;`, id)
        res.send()
    } catch (error) {
        return next(error)
    }
})

router.delete('/order', async (req, res, next) => {
    try {
        await Promise.all(req.body.workoutExerciseIds.map((weid, i) => db.none(`update WorkoutExercise set Position = $2 where Id = $1`, weid, i + 1)));
        res.send()
    } catch (error) {
        return next(error)
    }
})

export default router;