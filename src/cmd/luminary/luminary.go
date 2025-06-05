package main

import (
	"github.com/aether-winds/luminary/internal/routes/cspreporter"
	"github.com/aether-winds/luminary/internal/routes/index"
	"github.com/aether-winds/luminary/internal/server"
)

func main() {
	server.RegisterRoutes(cspreporter.GetRoutes()...)
	server.RegisterRoutes(index.GetRoutes()...)

	server.Start()
}

/*

TODO:
- Make log level a configurable option

*/
