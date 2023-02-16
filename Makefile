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
	$(info delete packages/*/types)
	$(EXEC) sh -c 'rm -rf $$0/types'

.PHONY: install
install:
	$(info TSK: install)
	sh -c 'npm ci || exit 255'

.PHONY: build
build:
	$(info TSK: build)
	sh -c 'npm run build || exit 255'

.PHONY: test
test:
	$(info TSK: test)
	sh -c 'npm run test || exit 255'

.PHONY: publish
publish:
	$(info TSK: publish)
	$(info run "npm publish" in packages/*)
	$(EXEC) sh -c 'npm publish $$0'

.PHONY: ci
ci: clean install build
	$(info TSK: ci)
	sh -c 'npm run test -- --ci || exit 255'
