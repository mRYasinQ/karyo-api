import { CommandFactory } from 'nest-commander';

import CliModule from './modules/cli.module';

async function bootstrap() {
  await CommandFactory.run(CliModule, ['log', 'error', 'warn']);
}

void bootstrap();
