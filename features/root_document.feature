Feature: Fetch the root document
  As a GitHub API client
  I want to fetch the root document of the GitHub API
  so I know which API urls I can use

  Scenario: Get the root document
    When I GET the root document
    Then the http status should be 200
    And the issues_url should equal "https://api.github.com/issues"
