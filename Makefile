.PHONY: all dist

all: dist

dist:
	npm ci
	npm run build
	npm run package
