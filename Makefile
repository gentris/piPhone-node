SHELL := /bin/bash

.PHONY: install run

NVM_DIR ?= $(HOME)/.nvm

install:
	@source "$(NVM_DIR)/nvm.sh" && nvm use 8
	@pyenv local 3.8
	@npm install --loglevel silly

run:
	@source "$(NVM_DIR)/nvm.sh" && nvm use 8
	@pyenv local 3.8
	@sudo $$(which node) index.js

sync:
	rsync -av --delete --exclude=‘.git/’ ./ pi@192.168.100.188:~/piPhone-node/
