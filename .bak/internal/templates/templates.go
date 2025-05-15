package templates

import (
	"fmt"
	"html/template"
	"log"
	"net/http"
	"path"
)

// ###
// TemplateManager

type TemplateManager interface {
	Get(string) *template.Template
	Register(string)
	ExecuteRootTemplate(w http.ResponseWriter, data RootTemplateData)
	ExecuteError404Template(w http.ResponseWriter)
	ExecuteError500Template(w http.ResponseWriter)
}

type templateManager struct {
	TemplateManager
	tmpl *template.Template
	path string
}

func (tm *templateManager) ExecuteRootTemplate(w http.ResponseWriter, data RootTemplateData) {
	tmpl := tm.Get("root.html")
	if tmpl == nil {
		http.Error(w, "500 Internal Server Error", http.StatusInternalServerError)
		return
	}
	tmpl.Execute(w, data)
}

func (tm *templateManager) ExecuteError404Template(w http.ResponseWriter) {
	tmpl := tm.Get("error404.html")
	if tmpl == nil {
		http.Error(w, "404 Not Found", http.StatusNotFound)
		return
	}
	tmpl.Execute(w, nil)
}

func (tm *templateManager) ExecuteError500Template(w http.ResponseWriter) {
	tmpl := tm.Get("error500.html")
	if tmpl == nil {
		http.Error(w, "500 Internal Server Error", http.StatusInternalServerError)
		return
	}
	tmpl.Execute(w, nil)
}

func (tm *templateManager) Get(name string) *template.Template {
	tmpl := tm.tmpl.Lookup(name)
	if tmpl == nil {
		log.Printf("template %s not found", name)
		return nil
	}
	return tmpl
}

func (tm *templateManager) Register(filepath string) {
	fullPath := path.Join(tm.path, filepath)

	if _, err := tm.tmpl.ParseFiles(fullPath); err != nil {
		log.Fatal(fmt.Errorf("unable to parse template file %s: %w", filepath, err))
	}
}

// ###
// Constructor methods

type TemplateManagerOptionFunc func(*templateManager)

func NewTemplateManager(opts ...TemplateManagerOptionFunc) TemplateManager {
	instance := &templateManager{
		tmpl: template.New("luminary"),
		path: path.Join("internal", "templates", "html"),
	}

	// Register these templates before the calling package can change the template path.
	// This way, we can insure that the root and error templates are always available to all packages.
	instance.Register("root.html")
	instance.Register("error404.html")

	for _, opt := range opts {
		opt(instance)
	}

	return instance
}

func WithTemplateDirectory(directory string) TemplateManagerOptionFunc {
	return func(tm *templateManager) {
		if directory == "" {
			tm.path = path.Join("internal", "templates", "html")
		} else {
			tm.path = directory
		}
	}
}

// ###
// Template data
type RootTemplateData struct {
	Title string
	Path  string
}
