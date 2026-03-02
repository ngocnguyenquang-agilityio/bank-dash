export default () => ({
  upload: {
    config: {
      sizeLimit: 5 * 1024 * 1024, // 5MB
      // Disable Sharp image processing to avoid EPERM temp file errors on Windows
      // See: https://github.com/strapi/strapi/issues/25078
      sizeOptimization: false,
      responsiveDimensions: false,
      breakpoints: {},
      security: {
        allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
      },
    },
  },
});
