Feature: Get gist details
  As a GitHub API client
  I want to see the details of a gist

  Scenario: Get a gist
    When I GET the gist 6305970
    Then the http status should be 200
    And $.user.login should equal "basti1302"
