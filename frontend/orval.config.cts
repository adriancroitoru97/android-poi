module.exports = {
  'backend-endpoints': {
    output: {
      mode: 'single',
      prettier: true,
      clean: true,
      workspace: './api',
      target: './endpoints.ts',
      schemas: './model',
      baseUrl: 'http://192.168.0.106:8080',
      override: {
        mutator: {
          path: '../security/axiosConfig.ts',
          name: 'customInstance',
        },
      },
    },
    input: {
      target: '../backend/target/openapi.json',
    },
  },
};
