import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'

import userRoutes from './routes/users.js';
import sessionRoutes from './routes/sessions.js';
import exerciseRoutes from './routes/exercises.js';
import workoutsRoutes from './routes/workouts.js';
import sessionWorkouts from './routes/sessionWorkouts.js';


const app = express();

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

app.use('/users', userRoutes);
app.use('/sessions', sessionRoutes);
app.use('/exercises', exerciseRoutes);
app.use('/workouts', workoutsRoutes);
app.use('/session-workouts', sessionWorkouts)



const PORT = process.env.PORT || 8081;

app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));

