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

func (tm *templateManager) Get(name string) *template.Template {
	return tm.tmpl.Lookup(name)
}

func (tm *templateManager) Register(filename string) error {
	if _, err := tm.tmpl.ParseFiles(filename); err != nil {
		return fmt.Errorf("unable to parse template file %s: %w", filename, err)
	}
	return nil
}

func NewTemplateManager() TemplateManager {
	instance := &templateManager{tmpl: template.New("luminary")}
	instance.Register("./common/root.html")

	return instance
}
