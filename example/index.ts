import orm from './orm';
import Client from './src/client';
import Composition from './src/composition';
import CompositionDetails from './src/composition-details';
import Order from './src/order';
import ExtraDetails from './src/extra-details';
import CompositionCreator from './src/composition-creator';


// @ts-ignore
(async function() {
  await orm.initialize();

  const x = [Composition, Client, CompositionCreator, Order, ExtraDetails, CompositionDetails];
})()

