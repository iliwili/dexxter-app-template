//
// WordPress REST API wrapper
//
// This service centralises all communication with the WordPress REST API.
// Base URL, credentials, and auth headers are sourced from environment
// variables (WORDPRESS_URL, WORDPRESS_USER, WORDPRESS_APP_PASSWORD).
//
// Usage:
//   const wp = require('./wordpressService');
//   const posts = await wp.getPosts();
//
// Add methods here as needed (getPosts, getPage, createPost, etc.)
// using axios configured with the WordPress Application Password auth scheme.

const axios = require('axios');

const client = axios.create({
  baseURL: process.env.WORDPRESS_URL
    ? `${process.env.WORDPRESS_URL}/wp-json/wp/v2`
    : undefined,
  auth:
    process.env.WORDPRESS_USER && process.env.WORDPRESS_APP_PASSWORD
      ? {
          username: process.env.WORDPRESS_USER,
          password: process.env.WORDPRESS_APP_PASSWORD,
        }
      : undefined,
});

// TODO: add service methods, e.g.:
// exports.getPosts = () => client.get('/posts').then(r => r.data);

module.exports = { client };
