package main

import (
	"log"
	"net/http"

	"github.com/aether-winds/luminary/internal/components/index"
	c "github.com/aether-winds/luminary/internal/config"
	"github.com/aether-winds/luminary/internal/templates"
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
	routes = append(routes, index.GetRoutes()...)
}

func main() {
	if done := c.Configure(config); done != nil {
		<-done // wait for configuration to finish
	}

	mux.Handle("GET /assets/", http.StripPrefix("/assets/", fs))

	tm := templates.NewTemplateManager()

	for _, route := range routes {
		mux.HandleFunc(route.Pattern, func(w http.ResponseWriter, r *http.Request) {
			isHxRequest := r.Header.Get("HX-Request") != ""
			if !isHxRequest {
				tm.ExecuteRootTemplate(w, templates.RootTemplateData{
					Title: "Luminary",
					Path:  r.URL.Path,
				})
				return
			}

			route.Handler(w, r)
		})
	}

	log.Printf("Server starting on port %s", config.Port)
	log.Fatal(http.ListenAndServe(":"+config.Port, mux))
}
