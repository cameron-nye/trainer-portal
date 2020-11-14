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

router.post('/:sessionId', async (req, res, next) => {
    try {
        const { sessionId } = req.params;
        const { workoutId, exerciseId } = req.body;
        if (!workoutId && !exerciseId) {
            res.status(400).send("must specify workoutId OR exerciseId when creating a SessionWorkout");
            return;
        }

        const { sessionworkoutid: id } = await db.one(`                
                insert into SessionWorkout(SessionId, WorkoutId, Position)
                select 
                    $1
                    , $2
                    , (
                        select count(sw.Id) + 1
                        from Session s 
                        join SessionWorkouts sw on sw.SessionId = s.Id
                        where s.Id = $1
                    ) Count;

                select lastval() SessionWorkoutId;`,
            sessionId,
            workoutId
        )

        const res = { sessionWorkout: { id } }
        if (workoutId) {
            const exercises = await db.query(`                
                insert into SesssionWorkoutExercise(SessionWorkoutId, ExerciseId)
                select 
                    $1,
                    ExerciseId 
                from WorkoutExercise 
                where WorkoutId = $2;
                
                select 
                    swe.Id
                    , e.Name 
                from SessionWorkoutExercise swe 
                join Exercise e on e.Id = swe.ExerciseId
                where swe.SessionWorkoutId = $1`,
                res.sessionWorkout.id,
                workoutId);
            res.sessionWorkout.exercises = exercises;
        } else if (exerciseId) {
            const { sesssionworkoutexerciseid: sesssionWorkoutExerciseId, name } = await db.one(`                
                insert into SesssionWorkoutExercise(SessionWorkoutId, ExerciseId) values ($1, $2);
                select 
                    lastval() SesssionWorkoutExerciseId
                    , (select Name from Exercise where Id = $2) Name;`,
                res.sessionWorkout.id,
                exerciseId);
            res.sessionWorkout.exercises = [{ sesssionWorkoutExerciseId, name }];
        }

        res.json(res);
    } catch (error) {
        return next(error)
    }
})

export default router;