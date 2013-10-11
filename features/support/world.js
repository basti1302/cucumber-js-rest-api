'use strict';

var request = require('request')
var traverson = require('traverson')

var traverson = require('traverson')

var env = require('./env')

var World = function World(callback) {

  var self = this
  var api = new traverson.json.from(env.BASE_URL + '/')

  this.lastResponse = null

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
    api.newRequest()
       .walk(links)
       .withTemplateParameters(templateParams)
       .get(function(error, response) {
      if (error) {
        return callback.fail(new Error('Error while walking along the links ' +
            links + ': ' + error.message))
      }
      self.lastResponse = response
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
  }

  this.rootPath = function() {
    return '/'
  }

  this.rootUri = function() {
    return this.uri(this.rootPath())
  }

  this.uri = function(path) {
    return env.BASE_URL + path
  }

  callback()
}

exports.World = World
