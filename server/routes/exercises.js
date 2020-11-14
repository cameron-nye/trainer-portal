import express from 'express';
import db from '../db.js';

const router = express.Router();

router.put('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, tags, targetAreaIds } = req.body;
        await db.none(`
            udpate exercise set name = $2, tags = $3 where id = $1;
            delete from ExerciseTargetMuscleGroup where exerciseId = $1;
        `, id, name, tags)
        db.each('insert into ExerciseTargetMuscleGroup(ExerciseId, TargetMuscleGroupId) values($1, $2)', targetAreaIds.map(taid => [id, taid]))
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