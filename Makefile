main_package_path = ./cmd/luminary
binary_name = luminary

.PHONY: build
build:
	go build -o /tmp/bin/$(binary_name) $(main_package_path)

.PHONY: delete-build
delete-build:
	rm -rf /tmp/bin/$(binary_name)

.PHONY: run
run:
	go run $(main_package_path)

run-build:
	/tmp/bin/$(binary_name)

.PHONY: test
test:
	go test -v ./...

.PHONY: tidy
tidy:
	go mod tidy
	go fmd ./...
