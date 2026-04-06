//
// WordPress REST API wrapper — OPTIONAL INTEGRATION
//
// Copy this file to src/services/ and adapt it when your app needs to
// communicate with the WordPress REST API.
//
// Requires env vars: WORDPRESS_URL, WORDPRESS_USER, WORDPRESS_APP_PASSWORD
//

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
