const BookmarksService = {
  getAllBookmarks(knex) {
    return knex.select('*').from('bookmarks');
  },

  getBookmarkById(knex, id) {
    return knex
      .select('*')
      .from('bookmarks')
      .where({ id })
      .first();
  },

  insertBookmark(knex, bookmark) {
    return knex
      .insert(bookmark)
      .into('bookmarks')
      .returning('*')
      .then(rows => rows[0]);
  },

  deleteBookmark(knex, id) {
    return knex('bookmarks')
      .delete()
      .where({ id });
  },

  patchBookmark(knex, id, newBookmarkFields) {
    return knex('bookmarks')
      .where({ id })
      .update(newBookmarkFields);
  }
};

module.exports = BookmarksService;
