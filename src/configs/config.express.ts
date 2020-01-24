export default {
  httpPort: process.env.HTTP_PORT ? parseInt(process.env.HTTP_PORT) : 8080,  
  httpMetricsPort : process.env.HTTP_METRICS_PORT ? parseInt(process.env.HTTP_METRICS_PORT) : 9100,    
};
