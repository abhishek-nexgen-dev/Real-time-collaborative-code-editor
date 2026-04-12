import app from './src/app.mjs';
import httpServer from './src/config/socket.config.mjs';

httpServer.listen(3000, () => {
  console.log('Server is running on port 3000');
});
