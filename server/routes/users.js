import express from 'express';
import db from '../db.js';

const router = express.Router();

router.post('/:trainerId/users', async (req, res, next) => {
    try {
        const { firstName, lastName, username } = req.body;
        const { trainerId } = req.params
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
        `, [firstName, lastName, username, trainerId])
        res.json({ userId })
    } catch (error) {
        return next(error)
    }
});



router.post('/', async (req, res, next) => {
    try {
        const { username, firstName, lastName, trainerUsername } = req.body;
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
                , (select Id from Users where UserName = $4)
            );

            select lastval() UserId;
        `, [username, firstName, lastName, trainerUsername])
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
            trainerid: trainerId
        } = await db.one(`
            select Id, UserName, FirstName, LastName, TrainerId 
            from Users 
            where UserName = $1`,
            req.query.username)
        res.json({ id, username, firstName, lastName, trainerId })
    } catch (error) {
        return next(error)
    }
});

router.get('/:userId/workouts', async (req, res, next) => {
    try {
        const workouts =
            await db.query(`
            select id, name, tags, userid
            from workout 
            where userid = $1`,
                req.params.userId)
        res.json({
            workouts: workouts.map(({
                id,
                name,
                tags,
                userid: userId
            }) => ({
                id,
                name,
                tags,
                userId
            }))
        })
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

export default router;