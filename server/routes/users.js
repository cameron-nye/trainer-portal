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
        const { id, username, firstname: firstName, lastname: lastName, trainerid: trainerId } = await db.one(`
            select Id, UserName, FirstName, LastName, TrainerId 
            from Users 
            where UserName = $1`,
            req.query.username)
        res.json({ id, username, firstName, lastName, trainerId })
    } catch (error) {
        return next(error)
    }
});

export default router;