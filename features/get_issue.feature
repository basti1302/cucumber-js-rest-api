Feature: Access an issue details
  As a GitHub API client
  I want to see the details of an issue

  Scenario: Get an issue
    When I GET the issue 119 in repository cucumber-js owned by cucumber
    Then the http status should be 200
    And I should see the title "Update README.md to correct error in example for zombie initialization"
    And I should see "No zombie.Browser() object in zombie anymore." in the body
