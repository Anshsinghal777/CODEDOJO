





import { createClient } from 'redis';

const redisClient = createClient({
   username: 'default',
    password: 'mcdD6V6lgDqy2HiaYvOUcVjUWNlVvUls',
    socket: {
        host: 'redis-14503.crce300.ap-south-1-2.ec2.cloud.redislabs.com',
        port: 14503
    }
});

redisClient.on('error', err => console.log('Redis Client Error', err));

export default redisClient;





// const client = createClient({
//     username: 'default',
//     password: 'mcdD6V6lgDqy2HiaYvOUcVjUWNlVvUls',
//     socket: {
//         host: 'redis-14503.crce300.ap-south-1-2.ec2.cloud.redislabs.com',
//         port: 14503
//     }
// });

// client.on('error', err => console.log('Redis Client Error', err));

// await client.connect();

// await client.set('foo', 'bar');
// const result = await client.get('foo');
// console.log(result)  // >>> bar

