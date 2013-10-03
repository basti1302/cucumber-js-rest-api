'use strict';

var request = require('request')
var traverson = require('traverson')
var walker = new traverson.JsonWalker()

var env = require('./env')

var World = function World(callback) {

  var self = this

  this.lastResponse = null
  this.lastDocument = null

  this.get = function(path, callback) {
    this.clear()
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

  this.walkToDocument = function(links, templateParams, callback) {
    this.clear()
    var startUri = this.rootUri()
    walker.walk(startUri, links, templateParams, function(error, document) {
      if (error) {
        return callback.fail(new Error('Error while walking from ' + startUri +
            ' along the links ' + links + ': ' + error.message))
      }
      self.lastDocument = document
      callback()
    })
  }

  this.post = function(path, requestBody, callback) {
    this.clear()
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
    this.clear()
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
    this.clear()
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
    this.clear()
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

  this.clear = function() {
    this.lastResponse = null
    this.lastDocument = null
  }

  this.rootPath = function() {
    return '/'
  }

  this.rootUri = function() {
    return this.uri(this.rootPath())
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
