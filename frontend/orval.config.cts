module.exports = {
  'backend-endpoints': {
    output: {
      mode: 'single',
      prettier: true,
      clean: true,
      workspace: './api',
      target: './endpoints.ts',
      schemas: './model',
      baseUrl: 'http://172.20.10.5:8080',
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
