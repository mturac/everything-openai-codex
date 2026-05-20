#!/usr/bin/env node

const {
  getInstallComponent,
  listInstallComponents,
  listInstallModules,
  listInstallProfiles,
} = require('./lib/install-manifests');

const FAMILY_ALIASES = Object.freeze({
  baseline: 'baseline',
  baselines: 'baseline',
  language: 'language',
  languages: 'language',
  lang: 'language',
  framework: 'framework',
  frameworks: 'framework',
  capability: 'capability',
  capabilities: 'capability',
  agent: 'agent',
  agents: 'agent',
  skill: 'skill',
  skills: 'skill',
});

function showHelp(exitCode = 0) {
  console.log(`
Discover ecc install components and profiles

Usage:
  node scripts/catalog.js profiles [--json]
  node scripts/catalog.js components [--family <family>] [--target <target>] [--json]
  node scripts/catalog.js search <query> [--family <family>] [--target <target>] [--json]
  node scripts/catalog.js show <component-id> [--json]

Examples:
  node scripts/catalog.js profiles
  node scripts/catalog.js components --family language
  node scripts/catalog.js search security
  node scripts/catalog.js show framework:nextjs
`);

  process.exit(exitCode);
}

function normalizeFamily(value) {
  if (!value) {
    return null;
  }

  const normalized = String(value).trim().toLowerCase();
  return FAMILY_ALIASES[normalized] || normalized;
}

function parseArgs(argv) {
  const args = argv.slice(2);
  const parsed = {
    command: null,
    componentId: null,
    query: [],
    family: null,
    target: null,
    json: false,
    help: false,
  };

  if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
    parsed.help = true;
    return parsed;
  }

  parsed.command = args[0];

  for (let index = 1; index < args.length; index += 1) {
    const arg = args[index];

    if (arg === '--help' || arg === '-h') {
      parsed.help = true;
    } else if (arg === '--json') {
      parsed.json = true;
    } else if (arg === '--family') {
      if (!args[index + 1]) {
        throw new Error('Missing value for --family');
      }
      parsed.family = normalizeFamily(args[index + 1]);
      index += 1;
    } else if (arg === '--target') {
      if (!args[index + 1]) {
        throw new Error('Missing value for --target');
      }
      parsed.target = args[index + 1];
      index += 1;
    } else if (parsed.command === 'show' && !parsed.componentId) {
      parsed.componentId = arg;
    } else if (parsed.command === 'search') {
      parsed.query.push(arg);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return parsed;
}

function printProfiles(profiles) {
  console.log('Install profiles:\n');
  for (const profile of profiles) {
    console.log(`- ${profile.id} (${profile.moduleCount} modules)`);
    console.log(`  ${profile.description}`);
  }
}

function printComponents(components) {
  console.log('Install components:\n');
  for (const component of components) {
    console.log(`- ${component.id} [${component.family}]`);
    console.log(`  targets=${component.targets.join(', ')} modules=${component.moduleIds.join(', ')}`);
    console.log(`  ${component.description}`);
  }
}

function printComponent(component) {
  console.log(`Install component: ${component.id}\n`);
  console.log(`Family: ${component.family}`);
  console.log(`Targets: ${component.targets.join(', ')}`);
  console.log(`Modules: ${component.moduleIds.join(', ')}`);
  console.log(`Description: ${component.description}`);

  if (component.modules.length > 0) {
    console.log('\nResolved modules:');
    for (const module of component.modules) {
      console.log(`- ${module.id} [${module.kind}]`);
      console.log(
        `  targets=${module.targets.join(', ')} default=${module.defaultInstall} cost=${module.cost} stability=${module.stability}`
      );
      console.log(`  ${module.description}`);
    }
  }
}

function normalizeSearchText(value) {
  return String(value || '').trim().toLowerCase();
}

function includesQuery(value, query) {
  return normalizeSearchText(value).includes(query);
}

function scoreMatch(fields, query) {
  return fields.reduce((score, field, index) => {
    const normalized = normalizeSearchText(field);
    if (!normalized.includes(query)) {
      return score;
    }
    return score + (index === 0 ? 4 : 1);
  }, 0);
}

function searchCatalog(options) {
  const query = normalizeSearchText(options.query.join(' '));
  if (!query) {
    throw new Error('Catalog search requires a query');
  }

  const components = listInstallComponents({
    family: options.family,
    target: options.target,
  }).map(component => ({
    type: 'component',
    id: component.id,
    family: component.family,
    targets: component.targets,
    description: component.description,
    score: scoreMatch(
      [component.id, component.family, component.description, component.moduleIds.join(' ')],
      query
    ),
  }));

  const modules = listInstallModules()
    .filter(module => !options.target || module.targets.includes(options.target))
    .map(module => ({
      type: 'module',
      id: module.id,
      family: module.kind,
      targets: module.targets,
      description: module.description,
      score: scoreMatch(
        [module.id, module.kind, module.description, module.stability, module.cost],
        query
      ),
    }));

  const profiles = listInstallProfiles().map(profile => ({
    type: 'profile',
    id: profile.id,
    family: 'profile',
    targets: [],
    description: profile.description,
    score: scoreMatch([profile.id, profile.description], query),
  }));

  return [...components, ...modules, ...profiles]
    .filter(result => result.score > 0 || includesQuery(result.id, query))
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score;
      }
      return left.id.localeCompare(right.id);
    })
    .map(result => {
      const publicResult = { ...result };
      delete publicResult.score;
      return publicResult;
    });
}

function printSearchResults(results, query) {
  if (results.length === 0) {
    console.log(`No catalog matches for "${query}".`);
    return;
  }

  console.log(`Catalog search results for "${query}":\n`);
  for (const result of results.slice(0, 25)) {
    const targetText = result.targets.length > 0 ? ` targets=${result.targets.join(', ')}` : '';
    console.log(`- ${result.id} [${result.type}:${result.family}]${targetText}`);
    console.log(`  ${result.description}`);
  }

  if (results.length > 25) {
    console.log(`\nShowing 25 of ${results.length} matches. Use --json for the full result set.`);
  }
}

function main() {
  try {
    const options = parseArgs(process.argv);

    if (options.help) {
      showHelp(0);
    }

    if (options.command === 'profiles') {
      const profiles = listInstallProfiles();
      if (options.json) {
        console.log(JSON.stringify({ profiles }, null, 2));
      } else {
        printProfiles(profiles);
      }
      return;
    }

    if (options.command === 'components') {
      const components = listInstallComponents({
        family: options.family,
        target: options.target,
      });
      if (options.json) {
        console.log(JSON.stringify({ components }, null, 2));
      } else {
        printComponents(components);
      }
      return;
    }

    if (options.command === 'search') {
      const results = searchCatalog(options);
      const query = options.query.join(' ');
      if (options.json) {
        console.log(JSON.stringify({ query, results }, null, 2));
      } else {
        printSearchResults(results, query);
      }
      return;
    }

    if (options.command === 'show') {
      if (!options.componentId) {
        throw new Error('Catalog show requires an install component ID');
      }
      const component = getInstallComponent(options.componentId);
      if (options.json) {
        console.log(JSON.stringify(component, null, 2));
      } else {
        printComponent(component);
      }
      return;
    }

    throw new Error(`Unknown catalog command: ${options.command}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

main();
