# Playground Deployment Workflow

## How It Works

The `playground` branch always points to the latest release tag and is deployed to Vercel.

**Key principle:** Playground = released version.

## Automatic Sync

### When

- Automatically on every package release (e.g., `@onflow/fcl@1.2.3`)
- Triggered by changesets when tags are created

### What happens

1. Workflow detects new release tag
2. Force-updates playground branch to point at the tag
3. Vercel deploys the tagged release

## Emergency Hotfixes

If demo needs urgent fix before next release:

### Option 1: Patch Release

Create a patch release for demo package only with changeset.

### Option 2: Manual Fix

```bash
git checkout playground
# Fix demo files only (packages/demo/**)
git commit -m "fix(demo): emergency hotfix"
git push origin playground
```

**Warning:** Next release will overwrite playground. Emergency fix MUST go in next release!

## Rules

### DO

- Let the workflow handle normal releases
- Create patch releases for important fixes
- Only manually fix demo files (`packages/demo/**`)
- Ensure emergency fixes go in next release

### DON'T

- Don't let emergency fixes skip the next release
- Don't use manual fixes for non-critical issues
