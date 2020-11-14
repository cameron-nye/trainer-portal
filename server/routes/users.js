import express from 'express';
import db from '../db.js';

const router = express.Router();

router.get('/:trainerId/target-areas', async (req, res, next) => {
    try {
        res.json({
            targetAreas: await db.query(`select id, name from TargetMuscleGroup where userid = $1`, req.params.trainerId)
        })
    } catch (error) {
        return next(error)
    }
});

router.post('/:trainerId/target-areas', async (req, res, next) => {
    try {
        const { name } = req.body;
        const { trainerId } = req.params
        const { targetareaid: targetAreaId } = await db.one(`
            insert into TargetMuscleGroup(Name, UserId) values ($1, $2);
            select lastval() targetAreaId;`,
            name,
            trainerId)
        res.json({ targetAreaId })
    } catch (error) {
        return next(error)
    }
});

router.delete('/:trainerId/users/:traineeId', async (req, res, next) => {
    try {
        const { trainerId, traineeId } = req.params;
        await db.none(`update Users set IsDeleted = '1' where Id = $2 and TrainerId = $1`, trainerId, traineeId)
        res.send()
    } catch (error) {
        return next(error)
    }
})

router.post('/:trainerId/users', async (req, res, next) => {
    try {
        const { firstName, lastName, username } = req.body;
        const { trainerId } = req.params

        const [existingUserId] = await db.query(`select Id from Users where UserName = $1`, username);
        if (existingUserId) {
            res.status(406).send(`Username "${username}" is already taken`);
            return;
        }

        const { userid: userId } = await db.one(`
            insert into Users(UserName, FirstName, LastName, TrainerId)
            values ($1, $2, $3, $4);

            select lastval() UserId;
        `, [firstName, lastName, username, trainerId])
        res.json({ userId })
    } catch (error) {
        return next(error)
    }
});

router.put('/:trainerId/users/:traineeId', async (req, res, next) => {
    try {
        const { trainerId, traineeId } = req.params;
        const { sessions } = req.body;
        await db.none(`udpate users set DailySchedule = $3 where Id = $2 and TrainerId = $1;`, trainerId, traineeId, sessions)
        res.send()
    } catch (error) {
        return next(error)
    }
})

router.post('/', async (req, res, next) => {
    try {
        const { username, firstName, lastName, trainerUsername } = req.body;
        const [trainerId] = await db.query(`select Id from Users where UserName = $1`, trainerUsername);
        if (trainerUsername && !trainerId) {
            res.status(406).send(`Trainer Username "${trainerUsername}" does not exist`);
            return;
        }

        const [existingUserId] = await db.query(`select Id from Users where UserName = $1`, username);
        if (existingUserId) {
            res.status(406).send(`Username "${username}" is already taken`);
            return;
        }

        const { userid: userId } = await db.one(`
            insert into Users(
                UserName
                , FirstName
                , LastName
                , TrainerId
            )
            values (
                $1
                , $2
                , $3
                , $4
            );

            select lastval() UserId;
        `, [username, firstName, lastName, trainerId])
        res.json({ userId })
    } catch (error) {
        return next(error)
    }
});

router.get('/', async (req, res, next) => {
    try {
        const {
            id,
            username,
            firstname: firstName,
            lastname: lastName,
            trainerusername: trainerUsername
        } = await db.one(`
            select u.Id, u.UserName, u.FirstName, u.LastName, t.UserName TrainerUsername
            from Users u
            left join Users t on t.Id = u.TrainerId
            where u.UserName = $1`,
            req.query.username)
        res.json({ id, username, firstName, lastName, trainerUsername })
    } catch (error) {
        return next(error)
    }
});

router.get('/:traineeId/dashboard', async (req, res, next) => {
    try {
        const { startDate, endDate, limit, showArchived } = req.query;
        const { traineeId } = req.params;
        const sessions = await db.query(`
            select 
                Id
                , DueDate
                , DeadlineDate
                , CompletedDate
                , Comments 
            from Session
            where UserId = $1`, traineeId);
        res.json({
            sessions: sessions.map(({
                id,
                duedate: dueDate,
                deadline,
                completeddate,
                comments
            }) => ({
                id,
                dueDate,
                deadline,
                isCompleted: !!completeddate,
                comments
            }))
        })
    } catch (error) {
        return next(error)
    }
});

router.get('/:trainerId/trainer-dashboard', async (req, res, next) => {
    try {
        const { trainerId } = req.params;
        const trainees = await db.query(`
            select 
                Id
                , UserName
                , FirstName
                , LastName
                , DailySchedule
            from Users
            where TrainerId = $1`, trainerId);
        const res = { trainees: [] };
        for (const { id, username, firstname: firstName, lastname: lastName, dailyschedule: scheduledDays } in trainees) {
            const sessionDates = await db.query(`select DueDate from Session where UserId = $1`, id);
            trainees.push({ id, firstName, lastName, username, scheduledDays, sessions: sessionDates.map(s => s.duedate) })
        }
        res.json(res)
    } catch (error) {
        return next(error)
    }
});

router.get('/:trainerId/workouts', async (req, res, next) => {
    try {
        const { searchText, limit } = req.query;
        const { trainerId } = req.params;
        res.json({
            workouts: await db.query(`
                select
                    Id
                    , Name
                    , Tags
                from Workout
                where Tags like '%$2%' and UserId = $1
                limit $3;`,
                trainerId,
                searchText,
                limit || 10)
        })
    } catch (error) {
        return next(error)
    }
})

router.get('/:trainerId/exercises', async (req, res, next) => {
    try {
        const { searchText, limit } = req.query;
        const { trainerId } = req.params;

        const [exercises, exerciseTargetAreas] = await Promise.all([
            db.query(`
                select 
                    Id
                    , Name
                    , Tags,
                    , LinkUrl
                from Exercise
                where Tags like '%$2%' and UserId = $1
                limit $3;`,
                trainerId, workoutId, name, tags, targets),
            db.query(`
                select distinct
                    etmg.Id
                    , tmg.Name
                    , etmg.ExerciseId
                from ExerciseTargetMuscleGroup etmg
                join TargetMuscleGroup tmg on tmg.Id = etmg.TargetMuscleGroupId
                where etmg.ExerciseId in (
                    select 
                        Id
                        , Name
                        , Tags,
                        , LinkUrl
                    from Exercise
                    where Tags like '%$2%' and UserId = $1
                    limit $3
                );`,
                trainerId, workoutId, targets)
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
})

router.post('/:trainerId/exercises', async (req, res, next) => {
    try {
        const { trainerId } = req.params;
        const { name, tags, linkUrl, targetAreaIds } = req.body;
        const { exerciseid: exerciseId } = await db.one(`
            insert into Exercise(UserId, Name, Tags, LinkUrl) values ($1, $2, $3, $4);
            select lastval() ExerciseId;`, trainerId, name, tags, linkUrl);
        await Promise.all(targetAreaIds.map(taid => db.none(`insert into ExerciseTargetMuscleGroup (ExerciseId, TargetMuscleGroupId)`, exerciseId, taid)));
        res.json({ exerciseId })
    } catch (error) {
        return next(error)
    }
})

router.post('/:trainerId/workouts', async (req, res, next) => {
    try {
        const { trainerId } = req.params;
        const { name, tags, linkUrl, targetAreaIds } = req.body;
        const { exerciseid: exerciseId } = await db.one(`
            insert into Exercise(UserId, Name, Tags, LinkUrl) values ($1, $2, $3, $4);
            select lastval() ExerciseId;`, trainerId, name, tags, linkUrl);
        await Promise.all(targetAreaIds.map(taid => db.none(`insert into ExerciseTargetMuscleGroup (ExerciseId, TargetMuscleGroupId)`, exerciseId, taid)));
        res.json({ exerciseId })
    } catch (error) {
        return next(error)
    }
})

router.post('/:trainerId/workouts/:workoutId/exercises', async (req, res, next) => {
    try {
        const { trainerId, workoutId } = req.params;
        const { name, tags, targets } = req.query;
        const [exercises, exerciseTargetAreas] = await Promise.all([
            db.query(`
                select distinct
                    e.Id
                    , e.Name
                    , e.Tags,
                    , e.LinkUrl
                from Exercise e 
                join ExerciseTargetMuscleGroup etmg on etmg.ExerciseId = e.Id
                join TargetMuscleGroup tmg on tmg.Id = etmg.TargetMuscleGroupId
                left join WorkoutExercise we on we.ExerciseId = e.Id and we.WorkoutId = $2
                where 
                    we.Id is null 
                    and e.UserId = $1
                    and ($3 is null or e.Name like '%$3%')
                    and ($4 is null or e.Tags like '%$4%')
                    and ($5 is null or tmg.Name like '%$5%');`,
                trainerId, workoutId, name, tags, targets),
            db.query(`
                select distinct
                    etmg.Id
                    , tmg.Name
                    , etmg.ExerciseId
                from ExerciseTargetMuscleGroup etmg
                join TargetMuscleGroup tmg on tmg.Id = etmg.TargetMuscleGroupId
                left join WorkoutExercise we on we.ExerciseId = etmg.ExerciseId and we.WorkoutId = $2
                where 
                    we.Id is null 
                    and tmg.UserId = $1
                    and ($3 is null or tmg.Name like '%$3%');`,
                trainerId, workoutId, targets)
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
        res.json({ exerciseId })
    } catch (error) {
        return next(error)
    }
})

export default router;