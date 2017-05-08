.SILENT:
help:
	echo
	echo "  Commands: "
	echo
	echo "    help - show this message"
	echo "    run - Start this service, and all of its deps, locally (docker)"
	echo "   	dev - Development"
	echo "    deps - Check for all dependencies"

build:
	docker build -t alex-milanov/alphapm ./

build-dev: build
	docker build -t alex-milanov/alphapm-dev -f ./Dev.Dockerfile ./

run: build
	docker run -it -p 8080:8080 alex-milanov/alphapm

dev: build-dev
	docker run -it -p 8089:8089 alex-milanov/alphapm-dev

deps:
	echo "  Dependencies: "
	echo
	echo "    * docker $(shell which docker > /dev/null || echo '- \033[31mNOT INSTALLED\033[37m')"
	echo
