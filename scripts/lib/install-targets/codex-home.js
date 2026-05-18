const path = require('path');

const {
  createInstallTargetAdapter,
  createRemappedOperation,
  isForeignPlatformPath,
  normalizeRelativePath,
} = require('./helpers');

module.exports = createInstallTargetAdapter({
  id: 'codex-home',
  target: 'codex',
  kind: 'home',
  rootSegments: ['.codex'],
  installStatePathSegments: ['ecc', 'install-state.json'],
  nativeRootRelativePath: '.codex',
  planOperations(input = {}, adapter) {
    const modules = Array.isArray(input.modules)
      ? input.modules
      : (input.module ? [input.module] : []);

    return modules.flatMap(module => {
      const paths = Array.isArray(module.paths) ? module.paths : [];

      return paths
        .filter(sourcePath => !isForeignPlatformPath(sourcePath, adapter.target))
        .flatMap(sourcePath => {
          const normalized = normalizeRelativePath(sourcePath);
          const targetRoot = adapter.resolveRoot(input);

          if (normalized === '.codex-plugin') {
            return [
              createRemappedOperation(
                adapter,
                module.id,
                '.codex-plugin/plugin.json',
                path.join(targetRoot, 'plugin.json')
              ),
              createRemappedOperation(
                adapter,
                module.id,
                '.codex-plugin/marketplace.json',
                path.join(targetRoot, 'marketplace.json')
              ),
            ];
          }

          if (normalized === 'rules') {
            return createRemappedOperation(
              adapter,
              module.id,
              normalized,
              path.join(targetRoot, 'rules', 'ecc')
            );
          }

          if (normalized.startsWith('rules/')) {
            return createRemappedOperation(
              adapter,
              module.id,
              normalized,
              path.join(targetRoot, 'rules', 'ecc', normalized.slice('rules/'.length))
            );
          }

          if (normalized.startsWith('skills/')) {
            return createRemappedOperation(
              adapter,
              module.id,
              normalized,
              path.join(targetRoot, 'skills', 'ecc', normalized.slice('skills/'.length))
            );
          }

          return adapter.createScaffoldOperation(module.id, normalized, input);
        });
    });
  },
});
