const getPagination = (page, limit) => {
  const p = page && page > 0 ? page : 1;
  const l = limit && limit > 0 ? limit : 10;
  const offset = (p - 1) * l;

  return { limit: parseInt(l), offset: parseInt(offset) };
};

const getPagingData = (data, page, limit) => {
  const { count: totalItems, rows: items } = data;
  const currentPage = page ? +page : 1;
  const totalPages = Math.ceil(totalItems / limit);

  return { totalItems, items, totalPages, currentPage };
};

module.exports = {
  getPagination,
  getPagingData,
};
