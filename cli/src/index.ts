import { Command } from 'commander';
import { init } from './commands/init.js';
import { list } from './commands/list.js';
import { update } from './commands/update.js';
import { add } from './commands/add.js';
import { registerSyncCommand } from './commands/sync.js';

const program = new Command();

program
  .name('ai-dev')
  .description('AI Dev System - Cross-stack AI development workflow')
  .version('1.0.0');

program
  .command('init')
  .description('Initialize ai-dev-system in a project')
  .option('-s, --stack <stack>', 'Technology stack (react-typescript, php-laravel, node-express)')
  .option('-a, --ai <tool>', 'AI tool bridge (claude, opencode, cursor, agent, all)', 'all')
  .option('-d, --dir <directory>', 'Target directory', '.')
  .option('--no-bridge', 'Skip creating bridge directories')
  .action(init);

program
  .command('list')
  .description('List available stacks, skills, agents, workflows, and standards')
  .option('-t, --type <type>', 'Filter by type (stacks, skills, agents, workflows, standards)')
  .action(list);

program
  .command('update')
  .description('Update ai-dev-system to latest version')
  .option('-s, --stack <stack>', 'Update specific stack only')
  .option('-f, --force', 'Force update (overwrite local changes)')
  .action(update);

program
  .command('add')
  .description('Add a specific stack or skill to existing project')
  .argument('<type>', 'Type to add (stack, skill)')
  .argument('<name>', 'Name of stack or skill')
  .action(add);

// Register sync subcommands
registerSyncCommand(program);

program.parse();
