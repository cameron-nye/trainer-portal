import express from 'express';
import db from '../db.js';

const router = express.Router();

router.get('/:sessionId', async (req, res, next) => {
    try {
        const { sessionId } = req.params;
        const [
            sessionWorkoutExercises,
            sessionWorkouts,
            {
                id,
                username: trainee,
                duedate: dueDate,
                deadlinedate: deadline,
                completeddate,
                comments
            }
        ] = await Promise.all([
            db.query(`
                select 
                    swe.Id
                    , sw.SessionWorkoutId
                    , e.Name
                    , swe.Sets
                    , swe.Reps
                from SesssionWorkoutExercise swe
                join SessionWorkout sw on sw.Id = swe.SessionWorkoutId
                join Exercise e on e.Id = swe.ExerciseId
                join WorkoutExercise we on we.ExerciseId = e.Id
                order by we.Position
                where sw.SessionId = $1`, sessionId),
            db.query(`
                select 
                    sw.Id
                    , w.Name
                from SessionWorkout sw
                join Workout w on w.Id = sw.WorkoutId
                where sw.SessionId = $1
                order by sw.Position`, sessionId),
            db.one(`
                select 
                    s.Id
                    , u.UserName
                    , s.DueDate
                    , s.DeadlineDate
                    , s.CompletedDate
                    , s.Comments
                from Session s
                join Users u on u.Id = s.UserId
                where sw.SessionId = $1`, sessionId)
        ]);

        res.send({
            id,
            trainee,
            dueDate,
            deadline,
            isCompleted: !!completeddate,
            comments,
            workouts: sessionWorkouts.map(({ id, name }) => ({
                id,
                name,
                exercises: sessionWorkoutExercises
                    .filter(swe => swe.sessionworkoutid === id)
                    .map(({
                        id,
                        name,
                        sets,
                        reps
                    }) => ({
                        id,
                        name,
                        sets,
                        reps
                    }))
            }))
        });
    } catch (error) {
        return next(error)
    }
})

router.put('/:sessionId', async (req, res, next) => {
    try {
        const { dueDate, deadline, comments } = req.body;
        const { sessionId } = req.params;
        await db.none(`
            update Session 
            set 
                DueDate = $2
                , DeadlineDate = $3
                , Comments = $4
            where Id = $1`,
            [
                sessionId,
                dueDate,
                deadline,
                comments
            ])
        res.send()
    } catch (error) {
        return next(error)
    }
})

router.put('/:sessionId/complete', async (req, res, next) => {
    try {
        const { sessionId } = req.params;
        await db.none(`update Session set CompletedDate = CURRENT_TIMESTAMP where Id = $1`, sessionId)
        res.send()
    } catch (error) {
        return next(error)
    }
})

router.delete('/:sessionId', async (req, res, next) => {
    try {
        const { sessionId } = req.params;
        await db.none(`delete Session where Id = $1`, sessionId)
        res.send()
    } catch (error) {
        return next(error)
    }
})

router.get('/:sessionId/workouts', async (req, res, next) => {
    try {
        const { searchText, limit } = req.query;
        const { sessionId } = req.params;
        const workouts = await db.query(`
            select 
                w.Id
                , w.Name
                , w.Tags
            from Workout w 
            left join SessionWorkout sw on sw.WorkoutId = w.Id and sw.SessionId = $1
            where 
                sw.Id is null
                and w.Tags like '%$2%'
            limit $3;
        `, sessionId, searchText, limit)
        res.json({ workouts })
    } catch (error) {
        return next(error)
    }
})

export default router;