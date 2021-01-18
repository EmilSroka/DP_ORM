import orm from './orm';
import Client from './src/client';
import Composition from './src/composition';
import CompositionDetails from './src/composition-details';
import Order from './src/order';
import ExtraDetails from './src/extra-details';
import CompositionCreator from './src/composition-creator';
import {StandAlone} from "./src/stand-alone";
import Sub from "./src/oto/sub";
import Owner from "./src/oto/owner";
import Many from "./src/otm/many";
import One from "./src/otm/one";
import M1 from "./src/mtm/m1";
import M2 from "./src/mtm/m2";



// @ts-ignore
(async function() {
  await orm.initialize();

  const result = await orm.persistenceManager.get<StandAlone>('StandAlone', 1);

  console.log('1', result);

  const result2 = await orm.persistenceManager.get<Owner>('Owner', 1);

  console.log('2', result2);

  const result3 = await orm.persistenceManager.get<One>('one', 1);

  console.log('3', result3);

  const result4 = await orm.persistenceManager.get<One>('one', 2);

  console.log('4', result4);

  const result5 = await orm.persistenceManager.get<M1>('m1', 1);

  console.log('5', result5);

  for(const m of result5.rel) {
    console.log('5s -> ', m);
    for(const m2 of m.rel) {
      console.log('5ss -> ', m2);
    }
  }

  const x = [Composition, Client, CompositionCreator, Order, ExtraDetails, CompositionDetails, StandAlone,
            Sub, Owner,
            One, Many,
            M1, M2];
})()

