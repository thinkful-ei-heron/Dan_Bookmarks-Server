/* eslint-disable strict */
const express = require('express');
const logger = require('../logger');
const bookmarksRouter = express.Router();
const bodyParser = express.json();
const BookmarksService = require('./bookmarks-service');
const xss = require('xss');

const sanitizeBookmark = function(bookmark) {
  return {
    id: bookmark.id,
    title: xss(bookmark.title),
    url: xss(bookmark.url),
    description: xss(bookmark.description),
    rating: bookmark.rating
  };
};

bookmarksRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db');
    BookmarksService.getAllBookmarks(knexInstance)
      .then(bookmarks => res.json(bookmarks.map(sanitizeBookmark)))
      .catch(next);
  })
  .post(bodyParser, (req, res, next) => {
    const knexInstance = req.app.get('db');
    const { title, url, description, rating } = req.body;

    if (!title) {
      const error = `Missing 'title' in request body`;
      logger.error(error);
      return res.status(400).json({
        error: { message: error }
      });
    }

    if (!url) {
      const error = `Missing 'url' in request body`;
      logger.error(error);
      return res.status(400).json({
        error: { message: error }
      });
    }
    if (!rating) {
      const error = `Missing 'rating' in request body`;
      logger.error(error);
      return res.status(400).json({
        error: { message: error }
      });
    }

    const bookmark = {
      title,
      url,
      description,
      rating
    };

    BookmarksService.insertBookmark(req.app.get('db'), bookmark)
      .then(bookmark => {
        logger.info(`Bookmark with id ${bookmark.id} created`);
        res.status(201).location(`http://localhost:8000/bookmarks/${bookmark.id}`);
        res.json(sanitizeBookmark(bookmark));
      })
      .catch(next);
  });

bookmarksRouter
  .route('/:id')
  .all((req, res, next) => {
    const knexInstance = req.app.get('db');
    const { id } = req.params;
    BookmarksService.getBookmarkById(knexInstance, id)
      .then(bookmark => {
        if (!bookmark) {
          logger.error(error);
          return res.status(404).json({ errors: { message: 'Bookmark does not exist' } });
        }
        res.bookmark = bookmark;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.json(sanitizeBookmark(res.bookmark));
  })
  .delete((req, res, next) => {
    const knexInstance = req.app.get('db');
    const { id } = req.params;
    BookmarksService.deleteBookmark(knexInstance, id)
      .then(() => res.status(204).end())
      .catch(next);
  });
module.exports = bookmarksRouter;
