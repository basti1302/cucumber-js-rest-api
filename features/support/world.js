'use strict';

var request = require('request')

var env = require('./env')

var World = function World(callback) {

  var self = this

  this.lastResponse = null

  this.get = function(path, callback) {
    var uri = this.uri(path)
    request.get(uri, function(error, response) {
      if (error) {
        return callback.fail(new Error('Error on GET request to ' + uri +
          ': ' + error.message))
      }
      self.lastResponse = response
      callback()
    })
  }

  this.post = function(path, requestBody, callback) {
    var uri = this.uri(path)
    request({url: uri, body: requestBody, method: 'POST'},
        function(error, response) {
      if (error) {
        return callback(new Error('Error on POST request to ' + uri + ': ' +
          error.message))
      }
      self.lastResponse = response
      callback(null, self.lastResponse.headers.location)
    })
  }

  this.put = function(path, requestBody, callback) {
    var uri = this.uri(path)
    request({url: uri, body: requestBody, method: 'PUT'},
        function(error, response) {
      if (error) {
        return callback(new Error('Error on PUT request to ' + uri + ': ' +
            error.message))
      }
      self.lastResponse = response
      callback(null, self.lastResponse.headers.locations)
    })
  }

  this.delete = function(path, callback) {
    var uri = this.uri(path)
    request({url: uri, method: 'DELETE'},
        function(error, response) {
      if (error) {
        return callback(new Error('Error on DELETE request to ' + uri + ': ' +
            error.message))
      }
      self.lastResponse = response
      callback()
    })
  }

  this.options = function(path, callback) {
    var uri = this.uri(path)
    request({'uri': uri, method: 'OPTIONS'}, function(error, response) {
      if (error) {
        return callback.fail(new Error('Error on OPTIONS request to ' + uri +
            ': ' + error.message))
      }
      self.lastResponse = response
      callback()
    })
  }

  this.rootPath = function() {
    return '/'
  }

  this.gistPath = function(gist) {
    return '/gists/' + gist
  }

  this.repoPath = function(owner, repo) {
    return '/repos/' + owner + '/' + repo
  }

  this.issuePath = function(owner, repo, issue) {
    return this.repoPath(owner, repo) + '/issues/' + issue
  }

  this.uri = function(path) {
    return env.BASE_URL + path
  }

  callback()
}

exports.World = World
