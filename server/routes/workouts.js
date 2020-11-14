import express from 'express';
import db from '../db.js';

const router = express.Router();

router.post('/:trainerId/target-areas', async (req, res, next) => {
    try {

        const { workoutId, exerciseId } = req.params
        const { workoutexerciseid: workoutExerciseId } = await db.one(`
            insert into WorkoutExercise(
                WorkoutId
                , ExerciseId
            )
            values (
                $1
                , $2
            );

            select lastval() WorkoutExerciseId;
        `, workoutId, exerciseId)
        res.json({ workoutExerciseId })
    } catch (error) {
        return next(error)
    }
});

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