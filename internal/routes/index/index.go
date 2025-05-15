package index

import (
	"html/template"
	"net/http"
	"path"

	"github.com/aether-winds/luminary/internal/helpers"
)

var tmpl *template.Template

func init() {
	templates := []string{
		path.Join("web", "templates", "root.html"),
		path.Join("web", "templates", "index.html"),
	}
	tmpl = template.Must(template.New("index").ParseFiles(templates...))
}

func RegisterRoutes(server *http.ServeMux) {
	server.HandleFunc("GET /", func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path != "/" { // Only need to check this on the / route
			http.NotFound(w, r)
			return
		}

		var templateName string
		if helpers.IsHtmxRequest(r) {
			templateName = "page-content"
		} else {
			templateName = "full-page"
		}

		err := tmpl.ExecuteTemplate(w, templateName, nil)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}
	})
}
