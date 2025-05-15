package index

import (
	"net/http"
	"path"

	"github.com/aether-winds/luminary/internal/templates"
	"github.com/aether-winds/luminary/internal/types"
)

var tm templates.TemplateManager

func init() {
	tm := templates.NewTemplateManager(
		templates.WithTemplateDirectory(path.Join("internal", "components", "index")),
	)
	tm.Register(path.Join("index.html"))
}

func GetRoutes() []types.Route {
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
