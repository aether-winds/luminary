package templates

import (
	"fmt"
	"html/template"
)

type TemplateManagerConfiguration struct {
}

type TemplateManager interface {
	Get(string) *template.Template
	Register(string) error
}

type templateManager struct {
	TemplateManager
	tmpl *template.Template
}

var instance TemplateManager

func (tm *templateManager) Get(name string) *template.Template {
	return tm.tmpl.Lookup(name)
}

func (tm *templateManager) Register(filename string) error {
	if _, err := tm.tmpl.ParseFiles(filename); err != nil {
		return fmt.Errorf("unable to parse template file %s: %w", filename, err)
	}
	return nil
}

func Manager() TemplateManager {
	if instance == nil {
		instance = &templateManager{tmpl: template.New("luminary")}
		instance.Register("./common/root.html")
	}
	return instance
}

// import (
// 	"fmt"
// 	"net/http"
// 	"text/template"
// )

// var tmpl *template.Template

// func RegisterTemplates(filenames ...string) error {
// 	if tmpl == nil {
// 		tmpl = template.New("luminary")
// 		_, err := tmpl.ParseFiles("./common/root.html")
// 		if err != nil {
// 			return fmt.Errorf("unable to parse template files: %w", err)
// 		}
// 	}

// 	if _, err := tmpl.ParseFiles(filenames...); err != nil {
// 		return fmt.Errorf("unable to parse template files: %w", err)
// 	}
// 	return nil
// }

// func GetTemplate(name string) *template.Template {
// 	return tmpl.Lookup(name)
// }

// func ExecuteTemplate(w http.ResponseWriter, name string, data any) error {
// 	if err := tmpl.ExecuteTemplate(w, name, data); err != nil {
// 		return fmt.Errorf("could not execute template '%s': %w", name, err)
// 	}
// 	return nil
// }
