import express from 'express';
import db from '../db.js';

const router = express.Router();

router.get('/:workoutId', async (req, res, next) => {
    try {
        res.json(await db.one(`select Id, Name, Tags from Workout where Id = $1;`, req.params.workoutId))
    } catch (error) {
        return next(error)
    }
})

router.put('/:workoutId', async (req, res, next) => {
    try {
        const { workoutId } = req.params;
        const { name, tags } = req.body;
        await db.query(`
            update Workout 
            set 
                Name = $2
                , Tags = $3 
            where Id = $1;`, [workoutId, name, tags])
        res.send()
    } catch (error) {
        return next(error)
    }
})

router.post('/:workoutId/excercises/:exerciseId', async (req, res, next) => {
    try {
        const { workoutId, exerciseId } = req.params
        const { workoutexerciseid: workoutExerciseId } = await db.one(`
            insert into WorkoutExercise(WorkoutId, ExerciseId) values ($1, $2);
            select lastval() WorkoutExerciseId;`,
            [workoutId, exerciseId])
        res.json({ workoutExerciseId })
    } catch (error) {
        return next(error)
    }
});

router.delete('/:workoutId', async (req, res, next) => {
    try {
        const { workoutId } = req.params;
        await db.none(`
            delete from workoutexercise where workoutid = $1;        
            delete from workout where Id = $1;`,
            workoutId);
        res.send();
    } catch (error) {
        return next(error)
    }
});

router.get('/:workoutId/exercises', async (req, res, next) => {
    try {
        const { workoutId } = req.params;
        const [exercises, exerciseTargetAreas] = await Promise.all([
            db.query(`
                select 
                    Id
                    , Name
                    , Tags
                    , LinkUrl
                from WorkoutExercise we
                join Exercise e on e.Id = we.ExerciseId
                where we.WorkoutId = $1`,
                workoutId),
            db.query(`
                select 
                    etmg.Id
                    , tmg.Name
                    , etmg.ExerciseId
                from ExerciseTargetMuscleGroup etmg
                join TargetMuscleGroup tmg on tmg.Id = etmg.TargetMuscleGroupId
                join WorkoutExercise we on we.ExerciseId = etmg.ExerciseId
                where we.WorkoutId = $1`,
                workoutId)
        ]);
        res.json({
            exercises: exercises.map(({
                id,
                name,
                tags,
                linkurl: linkUrl
            }) => ({
                id,
                name,
                tags,
                linkUrl,
                targetAreas: exerciseTargetAreas
                    .filter(eta => eta.exerciseid === id)
                    .map(({ id, name }) => ({ id, name }))
            }))
        });
    } catch (error) {
        return next(error)
    }
});

export default router;