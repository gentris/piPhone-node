.PHONY: install run

install:
	@nvm use 8
	@pyenv local 3.8
	@npm install --loglevel silly

run:
	@nvm use 8
	@pyenv local 3.8
	@sudo node index.js
