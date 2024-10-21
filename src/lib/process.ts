// * Graceful shutdown
export const gracefulShutdown = (callback: NodeJS.SignalsListener) => {
  process.on('SIGINT', callback);
  process.on('SIGTERM', callback);
};
