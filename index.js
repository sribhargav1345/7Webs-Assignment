import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

// As there are only 3 routes, I directly wrote them in index.js file, instead of creating route.js

import { userAuthRoutes } from './controllers/UserAuthentication.js'; 
import { Availability } from './controllers/Availability.js';
import { Schedules } from './controllers/Schedules.js';

import mongoDB from "./db.js";

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());
app.use(helmet());

mongoDB();

app.get('/', (req, res) => {
  res.send("For testing GET operation, go to the endpoint: /api/availability/2024-05-11");
});

app.use('/api', userAuthRoutes);
app.use('/api', Availability);
app.use('/api', Schedules);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export { app };
