import {run} from "./src/run";
import orm from "./orm";
import {Main} from "./src/prepare/main";
import {prompt} from "./src/prompt";

run(async function() {
  await prompt('waiting... ');

  await orm.initialize();

  const main = await orm.persistenceManager.get(Main, 1);

  console.log(main);
  console.log(main.mtm[0].relationship);

  await orm.close();
});

