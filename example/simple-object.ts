import orm from './orm';
import {Car} from "./src/simple-object/car";



// @ts-ignore
(async function() {
  await orm.initialize();

  const fiat = new Car();
  fiat.id = 1;
  fiat.name = 'fiat 126p';
  fiat.productionDate = new Date(1973, 8, 22);

  const multipla = new Car();
  multipla.id = 2;
  multipla.name = 'fiat M300';
  multipla.productionDate = new Date(1998, 5, 13);

  await orm.persistenceManager.save(fiat);
  await orm.persistenceManager.save(multipla);

  await orm.close();
})()

