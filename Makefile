current_dir := $(dir $(abspath $(firstword $(MAKEFILE_LIST))))

build: clean
	@echo "Building Luminary Docker Image..."
	docker build --tag luminary:latest .

clean:
	@echo "Cleaning up Docker images..."
	docker image rm -f luminary:latest

run: clean build
	@echo "Running Luminary..."
	docker run --rm -p 8443:8443 luminary:latest

cleandevkeys:
	@echo "Cleaning up generated keys..."
	rm -rf certs

gendevkeys:
	@echo "Generating local dev keys..."
	mkdir -p certs
	openssl genrsa -out certs/server.key 2048
	openssl req -new -key certs/server.key -out certs/csr.pem -subj "/CN=localhost"
	openssl x509 -req -days 365 -in certs/csr.pem -signkey certs/server.key -out certs/cert.pem

dev:
	@echo "Running Luminary in development mode..."
	@echo "Using directory: $(current_dir)"
	@LUM_CERT_FILE=$(current_dir)certs/cert.pem LUM_KEY_FILE=$(current_dir)certs/server.key go run -C ./src cmd/luminary/luminary.go
