dev:
	rm -rf ./public/static/presentations/* # Static folder has some problematic .md files that need to be removed before the GraphQL plugin tries to query them
	gatsby develop
debug:
	node-inspect ./node_modules/gatsby/dist/gatsby-cli.js develop
build:
	rm -rf ./public/*
	gatsby build
	cp -r ./static/* ./public/static/
pf:
	@MAKE build
	cd ${PWD}/public
	python -m SimpleHTTPServer 6969
s3:
	@MAKE build
	aws s3 sync ./public s3://htmldrum.com --acl public-read

