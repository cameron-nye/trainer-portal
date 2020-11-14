import express from 'express';
import db from '../db.js';

const router = express.Router();

router.put('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, tags, targetAreaIds, linkUrl } = req.body;
        await db.none(`
            udpate exercise set name = $2, tags = $3, linkUrl = $4 where id = $1;
            delete from ExerciseTargetMuscleGroup where exerciseId = $1;
        `, id, name, tags, linkUrl)

        await Promise.all(targetAreaIds.map((taid, i) => db.none(`update SessionWorkout set Position = $2 where Id = $1`, taid, i + 1)));
        res.send()
    } catch (error) {
        return next(error)
    }
})


router.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        await db.none(`
            delete from ExerciseTargetMuscleGroup where exerciseId = $1;
            delete from Exercise where exerciseId = $1;
        `, id)
        res.send()
    } catch (error) {
        return next(error)
    }
})


export default router;