import 'zone.js/node';

import { bootstrapApplication, BootstrapContext } from '@angular/platform-browser';
import { AppComponent} from './app/app';
import { appConfig } from './app/app.config.server';

const bootstrap = (context: BootstrapContext) => {
  return bootstrapApplication(AppComponent, appConfig, context);
};

export default bootstrap;
