module.exports = {
  hooks: {
    'pre-push': 'node ./scripts/tagVersion.js',
  },
};
