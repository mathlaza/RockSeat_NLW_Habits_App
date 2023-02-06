import Fastify from 'fastify';
import cors from '@fastify/cors';
import { appRoutes } from './routes';

const app = Fastify();

app.register(cors);
app.register(appRoutes);

app.listen({
  port: 6991,
  host: "0.0.0.0"
}).then(() => {
  console.log('HTTP Server running on port 6991')
})
