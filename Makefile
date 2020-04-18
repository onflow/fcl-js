PACKAGES := ls -d1 packages/*
RUN := xargs -n1 -t
EXEC := $(PACKAGES) | $(RUN)

.PHONY: default
default:
	$(info Available Make Commands)
	@awk -F: '/^[A-z\-_]+\:/ {print "  - make " $$1}' Makefile | sort

.PHONY: all
all: clean install build test
	$(info TSK all)

.PHONY: doctor
doctor: clean install build test
	$(info TSK: doctor)

.PHONY: clean
clean:
	$(info TSK clean)
	$(info delete packages/*/node_modules)
	$(EXEC) sh -c 'rm -rf $$0/node_modules'
	$(info delete packages/*/dist)
	$(EXEC) sh -c 'rm -rf $$0/dist'

.PHONY: install
install:
	$(info TSK: install)
	$(info run "npm install" in packages/*)
	$(EXEC) sh -c 'npm install --prefix $$0 || exit 255'

.PHONY: build
build:
	$(info TSK: build)
	$(info run "npm run build" in packages/*)
	$(EXEC) sh -c 'npm run build --prefix $$0 || exit 255'

.PHONY: test
test:
	$(info TSK: test)
	$(info run "npm test" in packages/*)
	$(EXEC) sh -c 'npm run test --prefix $$0 || exit 255'

.PHONY: publish
publish:
	$(info TSK: publish)
	$(info run "npm publish" in packages/*)
	$(EXEC) sh -c 'npm publish --dry-run $$0 || exit 255'

.PHONY: ci
ci: clean install build
	$(info TSK: ci)
	$(info run "npm test --ci" in packages/*)
	$(EXEC) sh -c 'npm run test --prefix $$0 -- --ci || exit 255'
