# Object-relational mapper

Library made as a part of "Design Patterns" subject. Subject is a part of BSc Computer Science programme at AGH UST.

## Branching strategy

All branches should start from `develop`.  
Name convention: `type/issue_id/comment`, where:
* `type` describe branch purpose. Types:
    * `build`
    * `chore`
    * `ci`
    * `docs`
    * `feat`
    * `fix`
    * `refactor`
    * `test`
    * `revert`
* `issue_id` github issue id.
* `comment` briefly description (2-3 keywords).

Example: `docs/5/add-readme`

## Commit naming convention

For this project [commitlint](https://github.com/conventional-changelog/commitlint) is configured. Commit summary should have below structure:  
`type: subject`  
where:
* `type` describe commit purpose. Same as `type` in branching strategy.
* `subject` quick commit summary written in an imperative mood. Summary should start from lower case and end without dot.  

Example: `docs: add readme`

Further commit description can be added after blank line.

## Workflow

Any issue should have own branch.  
One can merge a branch when tip commit pass all pipelines and code is approved by codereview.    