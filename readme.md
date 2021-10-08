# Object-relational mapper

Extendable, and modular object–relational mapping library written in TypeScript.

## Setup
1. run `npm i` in main folder
2. run `npm i` in `library` directory

### Tests
To run test suites use `npm run test`

### Build 
To build library use `npm run build`

## Usage
1. Create setup file and export new instance
```ts
const db = new PostgresqlDatabase({
  connection: {
    user: "postgres",
    password: "",
    host: "localhost",
    port: 5432,
    database: "postgres",
  }
});

const ormInstance = new ORM(db);

export default ormInstance;
```

2. Setup entities using exported in setup file instance
```ts
import ORM from 'setup-file';

@ORM.Entity()
export class Student {
  @ORM.PrimaryKey({type: JsType.string})
  public index: string;

  @ORM.Attribute({type: JsType.string})
  public name: string;

  @ORM.Relationship({type: RelationshipType.manyToMany, with: { class: Subject, field: 'students' } })
  public subjects: Subject[];
}
```

3. Initialize connection
```ts
await orm.initialize();
```

4. Right now you can interact with db by using `persistenceManager`
```ts
await orm.persistenceManager.save(student);
const student = await orm.persistenceManager.get(Student, 1);
const result = await orm.persistenceManager.select(Order, new Greater(new Field('cost'), 10));
```

5. Close connection
```ts
await orm.close();
```

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