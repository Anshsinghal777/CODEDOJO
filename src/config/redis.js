

import { createClient } from 'redis';

const redisClient = createClient({
    username: 'default',
    password: 'pnVSA6tTt25eLNCgeQ4sXSqba4bH0u3b',
    socket: {
        host: 'redis-17284.c305.ap-south-1-1.ec2.cloud.redislabs.com',
        port: 17284
    }
});

export default redisClient;