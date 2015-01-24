
MOCHA = ./node_modules/.bin/mocha
JSHINT = ./node_modules/.bin/jshint

lint:
	@$(JSHINT) *.js

test:
	@NODE_ENV=test $(MOCHA) \
		--harmony-generators \
		--reporter spec \
		test.js