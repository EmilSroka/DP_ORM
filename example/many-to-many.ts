import orm from './orm';
import {Student} from "./src/many-to-many/student";
import {Subject} from "./src/many-to-many/subject";
import {prompt} from "./src/prompt";
import {run} from "./src/run";

run(async function() {
  await prompt('waiting... ');

  await orm.initialize();

  const students: Student[] = [];
  const subjects: Subject[] = [];

  students.push(new Student());
  students.push(new Student());
  students.push(new Student());

  subjects.push(new Subject());
  subjects.push(new Subject());
  subjects.push(new Subject());

  students[0].index = '111';
  students[0].name = 'Steve';
  students[0].subjects = [subjects[0], subjects[1]];

  students[1].index = '222';
  students[1].name = 'William';
  students[1].subjects = [subjects[1], subjects[2]];

  students[2].index = '333';
  students[2].name = 'Harper';
  students[2].subjects = [subjects[2], subjects[0]];

  subjects[0].code = 12;
  subjects[0].shortName = 'BOiKWD';
  subjects[0].students = [students[0], students[2]];

  subjects[1].code = 14;
  subjects[1].shortName = 'PSI';
  subjects[1].students = [students[0], students[1]];

  subjects[2].code = 18;
  subjects[2].shortName = 'POC';
  subjects[2].students = [students[1], students[2]];

  await orm.persistenceManager.save(students[0]);

  await prompt('waiting... ');

  students[0].subjects = [subjects[0], subjects[1]];
  students[1].subjects = [subjects[1]];
  students[2].subjects = [];

  subjects[0].students = [students[0]];
  subjects[1].students = [students[1]];
  subjects[2].students = [students[1]];

  await orm.persistenceManager.save(students[0]);

  await prompt('waiting... ');

  await orm.close();
});

