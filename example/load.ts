import {run} from "./src/run";
import orm from "./orm";
import {Main} from "./src/prepare/main";

run(async function() {
  await orm.initialize();

  const main = await orm.persistenceManager.get<Main>('main', 1);

  console.log(main);

  await orm.close();
});

