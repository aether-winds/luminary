package index

import (
	"context"
	"html/template"
	"net/http"
	"os"
	"path"

	"github.com/aether-winds/luminary/internal/logger"
	"github.com/aether-winds/luminary/internal/server"
)

var l logger.Logger
var routes []server.Route
var t *template.Template

func init() {
	l = logger.NewLogger(logger.LOG_LEVEL_INFO)

	wd, err := os.Getwd()
	if err != nil {
		l.Fatal(context.Background(), "failed to get working directory: %v", err)
	}
	t = template.Must(template.ParseFiles(path.Join(wd, "internal", "routes", "index", "index.html")))

	routes = []server.Route{
		{
			Handler: func(w http.ResponseWriter, r *http.Request) {
				if r.URL.Path != "/" {
					http.NotFound(w, r)
					return
				}

				t.ExecuteTemplate(w, "content", nil)
			},
			Pattern:      "GET /",
			TemplatePath: path.Join("internal", "routes", "index", "index.html"),
		},
	}
}

func GetRoutes() []server.Route {
	return routes
}
