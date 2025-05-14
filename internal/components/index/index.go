package index

import (
	"log"
	"net/http"
	"path"

	"github.com/aether-winds/luminary/internal/templates"
	"github.com/aether-winds/luminary/internal/types"
)

func GetRoutes() []types.Route {
	tm := templates.NewTemplateManager(
		templates.WithTemplateDirectory(path.Join("internal", "components", "index")),
	)
	err := tm.Register(path.Join("index.html"))
	if err != nil {
		log.Fatalf("failed to register index.html: %v", err)
	}

	return []types.Route{
		{
			Pattern: "GET /",
			Handler: func(w http.ResponseWriter, r *http.Request) {
				if r.URL.Path != "/" {
					tm.ExecuteError404Template(w)
					return
				}

				tmpl := tm.Get("index.html")
				if tmpl == nil {
					tm.ExecuteError500Template(w)
					return
				}
				tmpl.Execute(w, nil)
			},
		},
	}
}
