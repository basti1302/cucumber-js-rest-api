'use strict';

var url = require('url')

var GithubStepsWrapper = function () {

  this.World = require('../support/world.js').World

  this.When(/^I GET the issue (\d+) in repository (.*) owned by (.*)$/,
      function(issue, repo, owner, callback) {
    this.get(this.issuePath(owner, repo, issue), callback)
  })

  /* THEN */

  this.Then(/^the http status should be (\d+)$/, function(status, callback) {
    if (!assertResponse(this.lastResponse, callback)) { return }
    // deliberately using != here (no need to cast integer/string)
    /* jshint -W116 */
    if (this.lastResponse.statusCode != status) {
    /* jshint +W116 */
      callback.fail('The last http response did not have the expected ' +
        'status, expected ' + status + ' but got ' +
        this.lastResponse.statusCode)
    } else {
      callback()
    }
  })

  // Check if a certain property of the response is equal to something
  this.Then(/^I should see the (\w+) "([^"]+)"$/,
      function(property, expectedValue, callback) {
    if (!assertPropertyIs(this.lastResponse, property, expectedValue,
        callback)) {
      return
    }
    callback()
  })

  // Check if a substring is contained in a certain property of the response
  this.Then(/^I should see "([^"]+)" in the (\w+)$/,
      function(expectedContent, property, callback) {
    if (!assertPropertyContains(this.lastResponse, property, expectedContent,
        callback)) {
      return
    }
    callback()
  })

  function assertResponse(lastResponse, callback) {
    if (!lastResponse) {
      callback.fail(new Error('No request has been made until now.'))
      return false
    }
    return true
  }

  function assertBody(lastResponse, callback) {
    if (!assertResponse(lastResponse, callback)) { return false }
    if (!lastResponse.body) {
      callback.fail(new Error('The response to the last request had no body.'))
      return null
    }
    return lastResponse.body
  }

  function assertValidJson(lastResponse, callback) {
    var body = assertBody(lastResponse, callback)
    if (!body) {
      return null
    }
    try {
      return JSON.parse(body)
    } catch (e) {
      callback.fail(
        new Error('The body of the last response was not valid JSON.'))
      return null
    }
  }

  function assertPropertyExists(lastResponse, property, expectedValue,
      callback) {
    var bodyObject = assertValidJson(lastResponse, callback)
    if (!bodyObject) { return null }
    if (!bodyObject[property]) {
      callback.fail('The last response did not have the property ' +
        property + '. ' + '\n\nExpected:\n\n' + expectedValue)
      return null
    }
    return bodyObject[property]
  }

  function assertPropertyIs(lastResponse, property, expectedValue, callback) {
    var value = assertPropertyExists(lastResponse, property, expectedValue,
      callback)
    if (!value) { return false }
    if (value !== expectedValue) {
      callback.fail('The last response did not have the expected content in ' +
        'property ' + property + '. ' +
        'Got:\n\n' + value + '\n\nExpected:\n\n' + expectedValue)
      return false
    }
    return true
  }

  function assertPropertyContains(lastResponse, property, expectedValue,
      callback) {
    var value = assertPropertyExists(lastResponse, property, expectedValue,
      callback)
    if (!value) { return false }
    if (value.indexOf(expectedValue) === -1) {
      callback.fail('The last response did not have the expected content in ' +
        'property ' + property + '. ' +
        'Got:\n\n' + value + '\n\nExpected it to contain:\n\n' + expectedValue)
      return false
    }
    return true
  }

  function lastPathElement(uri) {
    var path = url.parse(uri).pathname
    return path.slice(path.lastIndexOf('/') + 1)
  }
}

module.exports = GithubStepsWrapper
