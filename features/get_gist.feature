Feature: Get gist details
  As a GitHub API client
  I want to see the details of a gist

  Scenario: Get a gist
    When I get the gist 6305970
    Then $.user.login should equal "basti1302"
