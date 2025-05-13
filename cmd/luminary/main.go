package main

import (
	"log"
	"net/http"

	c "github.com/aether-winds/luminary/internal/config"
	t "github.com/aether-winds/luminary/internal/types"
)

type ApplicationConfiguration struct {
	Port string `configKey:"LUMINARY_PORT" configDef:"3000"`
}

var config *ApplicationConfiguration
var fs http.Handler
var mux *http.ServeMux
var routes []t.Route

func init() {
	config = &ApplicationConfiguration{}
	fs = http.FileServer(http.Dir("internal/assets"))
	mux = http.NewServeMux()
	routes = []t.Route{}
}

func main() {
	if done := c.Configure(config); done != nil {
		<-done // wait for configuration to finish
	}

	mux.Handle("GET /assets/", http.StripPrefix("/assets/", fs))

	for _, route := range routes {
		mux.HandleFunc(route.Pattern, route.Handler)
	}

	log.Printf("Server starting on port %s", config.Port)
	log.Fatal(http.ListenAndServe(":"+config.Port, mux))
}
