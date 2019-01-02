
lib: $(shell find src -name \*.ts)
	rm -R lib || true
	mkdir -p $@ 
	cp -R src/* $@;
	./node_modules/.bin/tsc -p $@
	chmod +x lib/main.js
