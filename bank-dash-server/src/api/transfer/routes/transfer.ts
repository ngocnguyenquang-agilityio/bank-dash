export default {
  routes: [
    {
      method: 'POST',
      path: '/transfers',
      handler: 'transfer.create',
      config: {
        auth: false,
      },
    },
  ],
};
