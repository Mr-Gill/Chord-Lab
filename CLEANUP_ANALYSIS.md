# Repository Cleanup Analysis

## Current State (September 10, 2025)

### Branch Count: 47 branches total
### Pull Request Count: 8+ open PRs

## Branch Categories

### 1. Codex Branches (Automated/Generated) - **~30+ branches**
These appear to be automatically generated branches from code generation tools:

- `codex/add-ci-workflow-configuration`
- `codex/add-generic-shuffle-helper-function`
- `codex/add-teacher-games-dashboard-component`
- `codex/add-tests-for-genrequiz-component-vvhr2j`
- `codex/change-key-in-songs.map-loop-cv6qjp`
- `codex/convert-audio-clips-to-additional-formats`
- `codex/create-practicesummary-component-and-nav-link`
- `codex/create-quickquiz-component-for-teacher-dashboard`
- `codex/create-shared-chord-data-module-9pajw3`
- `codex/create-shared-chord-data-module-ot38i4`
- `codex/create-shared-chord-data-module-v77wzc`
- `codex/create-shuffle-utility-and-update-genrequiz`
- `codex/create-song-data-and-practice-component-qyu64f`
- `codex/create-tests-for-genrequiz-component`
- `codex/decide-and-update-official-chord-set`
- `codex/define-quickquizquestion-generic-type`
- `codex/define-quickquizquestion-generic-type-6b98rf`
- `codex/define-quickquizquestion-with-generics`
- `codex/define-score-interface-and-update-usestate`
- `codex/define-score-interface-and-update-usestate-8p1kgz`
- `codex/ensure-chord-state-is-initialized-properly-8porrk`
- `codex/extend-guitarchorddiagram-props-for-color`
- `codex/extend-guitarchorddiagram-props-for-color-v2`
- `codex/refactor-guitarchorddiagram-styling`
- `codex/refactor-guitarpositions-to-include-finger-numbers`
- `codex/refactor-instrument-selection-to-use-userprofilecontext`
- `codex/refactor-pianochorddiagram-to-use-pianodiagram`
- `codex/remove-audio-files-and-convert-to-base64`
- `codex/remove-unused-practicechord-interface-6im880`
- `codex/remove-unused-practicechord-interface-6qk0q3`
- `codex/remove-unused-practicechord-interface-m2f32n`
- `codex/shuffle-questions-array-on-quiz-start`
- `codex/update-activenotes-computation-in-pianochorddiagram`
- `codex/update-button-label-to-high-contrast-mode`
- `codex/update-color-computation-in-pianochorddiagram`
- `codex/update-guitarchorddiagram-styling`
- `codex/update-node-version-in-deploy.yml`
- `codex/update-pianochorddiagram-styles-and-structure`
- `codex/update-pianochorddiagram-with-new-key-layout`
- `codex/update-vitest-import-in-tests`
- `codex/wrap-map-call-in-usememo-44l97l`
- `codex/wrap-playaudio-in-usecallback`

**Recommendation**: Most of these can likely be deleted if the changes have been integrated into main or other active branches.

### 2. Copilot Fix Branches - **5 branches**
These are automated fix branches from Copilot:

- `copilot/fix-4fe61066-b95f-470a-8230-d321cc13636c`
- `copilot/fix-5da2a8c1-1bed-4c89-b6e0-b41122585b6e` (current branch)
- `copilot/fix-9a9f9edb-4bb7-4972-b765-8bed547054c9`
- `copilot/fix-19136f76-53c3-4148-871a-b1256d8ecdfc`
- `copilot/fix-cc0f2e8e-8b54-4529-8665-14afd812fcfe`

**Recommendation**: Keep active ones with open PRs, delete completed/merged ones.

### 3. Feature Branches - **2+ branches**
- `feat/practice-enhancements`
- `pr-121-manual-merge`

**Recommendation**: Review for merge readiness or stale status.

### 4. Main Branch - **1 branch**
- `main`

**Status**: Protected, keep.

## Open Pull Requests Analysis

### Active PRs Requiring Attention:

1. **PR #135** - Current cleanup task (this PR)
   - **Status**: Work in progress
   - **Action**: Complete cleanup task

2. **PR #130** - Fix CI test runner conflicts
   - **Status**: Draft, addresses Vitest/Playwright conflicts
   - **Action**: Review for merge readiness

3. **PR #129** - Fix all ESLint issues causing CI failures
   - **Status**: Draft, comprehensive ESLint fixes
   - **Action**: Could be merged to improve code quality

4. **PR #128** - Fix TypeScript strict mode compliance
   - **Status**: Draft, TypeScript improvements
   - **Action**: Could be merged for better type safety

5. **PR #121** - feat: make root note color configurable
   - **Status**: Open (not draft), feature enhancement
   - **Action**: Review for merge or close if superseded

6. **PR #120** - Use chord theme color by default in piano diagram
   - **Status**: Open (not draft), UI enhancement
   - **Action**: Could be consolidated with other UI PRs

7. **PR #119** - refactor: use shared piano diagram
   - **Status**: Open (not draft), refactoring improvement
   - **Action**: Could be consolidated with other piano diagram PRs

8. **PR #118** - style: enhance piano diagram styling
   - **Status**: Open (not draft), styling improvements
   - **Action**: Could be consolidated with other piano diagram PRs

9. **PR #111** - fix: update song practice instrument panel usage
   - **Status**: Open (not draft), bug fix
   - **Action**: Review for merge readiness

## Cleanup Strategy

### Phase 1: Consolidate Related PRs
- Group piano diagram PRs (#118, #119, #120) for potential consolidation
- Review code quality PRs (#128, #129, #130) for sequential merging

### Phase 2: Branch Cleanup
- Delete stale codex branches that have been superseded
- Remove completed copilot fix branches
- Clean up unused feature branches

### Phase 3: PR Consolidation
- Merge ready PRs in logical order
- Close superseded or duplicate PRs
- Consolidate related changes where appropriate

## Target Goals
- **Branches**: Reduce from 47 to ~10-15 active branches
- **Pull Requests**: Reduce from 8+ to 2-3 active PRs
- **Code Quality**: Ensure main branch remains stable throughout cleanup