import {run} from "./src/run";
import orm from "./orm";
import {Main} from "./src/prepare/main";
import {OneToOne} from "./src/prepare/one-to-one";
import {OneToMany} from "./src/prepare/one-to-many";
import {ManyToMany} from "./src/prepare/many-to-many";
import {prompt} from "./src/prompt";

run(async function() {
  await prompt('waiting... ');

  await orm.initialize();

  const x = new Main();

  x.id = 1;
  x.info = 'some info';

  x.oto = new OneToOne();
  x.oto.info = 'info - one';

  x.otm = [];
  x.otm.push(new OneToMany());
  x.otm.push(new OneToMany());
  x.otm[0].id = 1;
  x.otm[0].info = 'info - many - 1';
  x.otm[1].id = 2;
  x.otm[1].info = 'info - many - 2';

  x.mtm = [];
  x.mtm.push(new ManyToMany());
  x.mtm.push(new ManyToMany());
  x.mtm[0].id = 1;
  x.mtm[0].info = 'info - many - 3';
  x.mtm[0].relationship = [x];
  x.mtm[1].id = 2;
  x.mtm[1].info = 'info - many - 4';
  x.mtm[1].relationship = [x];

  await orm.persistenceManager.save(x);

  await orm.close();
});

