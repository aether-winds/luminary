package main

import (
	"log"
	"net/http"
	"os"
	"path"

	"github.com/aether-winds/luminary/internal/routes/index"
)

var serveFile http.Handler
var serveMux *http.ServeMux
var port string

func init() {
	serveFile = http.FileServer(http.Dir(path.Join("web", "static")))
	serveMux = http.NewServeMux()

	port = os.Getenv("LUMINARY_PORT")
	if port == "" {
		port = "3000"
	}
}

func main() {
	serveMux.Handle("GET /static/", http.StripPrefix("/static/", serveFile))

	index.RegisterRoutes(serveMux)

	log.Printf("Server starting on port %s...", port)
	log.Fatal(http.ListenAndServe(":"+port, serveMux))
}
