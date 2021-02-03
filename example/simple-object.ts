import orm from './orm';
import {Car} from "./src/simple-object/car";
import {run} from "./src/run";
import {prompt} from "./src/prompt";
import {Between, Field} from "dp-orm/dist/database/postgresql/database/condition";

run(async function() {
  await prompt('waiting... ');

  await orm.initialize();

  let fiat = new Car();
  fiat.id = 1;
  fiat.name = 'fiat 126p';
  fiat.productionDate = new Date(1973, 8, 22);

  let multipla = new Car();
  multipla.id = 2;
  multipla.name = 'fiat M300';
  multipla.productionDate = new Date(1998, 5, 13);

  let mini = new Car();
  mini.id = 3;
  mini.name = 'Mini Cooper I';
  mini.productionDate = new Date(2002, 5, 13);

  await orm.persistenceManager.save(fiat);
  await orm.persistenceManager.save(multipla);
  await orm.persistenceManager.save(mini);

  await prompt('waiting... ');

  const someCar = await orm.persistenceManager.get(Car, 3);

  console.log('Reference equality: ', someCar === mini);

  await prompt('waiting... ');

  await orm.close();

  await orm.initialize();

  const car = await orm.persistenceManager.select(Car,
      new Between(
          new Field('productionDate'),
          new Date(1990, 5, 13),
          new Date(2010, 5, 13)
      )
  );

  console.log(car);

  await orm.close();

});

