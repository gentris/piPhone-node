.PHONY: install run

install:
	@nvm use 10
	@pyenv local 3.8
	@npm install --loglevel silly

run:
	@nvm use 10
	@pyenv local 3.8
	@sudo node index.js
