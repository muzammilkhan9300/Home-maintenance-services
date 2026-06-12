let bootstrapCache = null;

module.exports = {
  getCache: () => bootstrapCache,
  setCache: (data) => {
    bootstrapCache = data;
  },
  clearCache: () => {
    bootstrapCache = null;
  }
};
