package templates_test

import (
	"errors"
	"html/template"
	"net/http/httptest"
	"os"
	"testing"

	"github.com/aether-winds/luminary/internal/templates"
)

type TemplateManager interface {
	Get(string) *template.Template
}

func TestTemplateManager(t *testing.T) {
	var manager templates.TemplateManager

	beforeEach := func(t *testing.T) {
		manager = templates.Manager()
	}

	afterEach := func(t *testing.T) {}

	tests := []struct {
		name string
		test func(t *testing.T)
	}{
		{
			"should initlialize root templates",
			func(t *testing.T) {
				tmpl := manager.Get("root")
				if tmpl == nil {
					t.Error("expected root template to be initlialized, got nil")
				}
			},
		},
		{
			"should register a given template",
			func(t *testing.T) {
				err := manager.Register("./test/my-template.html")
				if err != nil {
					t.Errorf("unexpected error registering template: %v", err)
				}
				tmpl := manager.Get("my-template")
				if tmpl == nil {
					t.Errorf("expected my-template.html to be registered, got nil")
				}
			},
		},
		{
			"should return an error if the template file does not exist",
			func(t *testing.T) {
				err := manager.Register("./test/nonexistent-template.html")
				if err == nil {
					t.Errorf("expected error registering nonexistent template, got nil")
				}

				unwrappedErr := errors.Unwrap(err)
				if unwrappedErr == nil {
					t.Errorf("expected unwrapped error to be non-nil, got nil")
				}

				if !errors.Is(unwrappedErr, os.ErrNotExist) {
					t.Errorf("expected unwrapped error to be os.ErrNotExist, got %v", unwrappedErr)
				}
			},
		},
		{
			"should execute a template",
			func(t *testing.T) {
				w := httptest.NewRecorder()

				tmpl := manager.Get("my-template")
				if tmpl == nil {
					t.Errorf("expected my-template to be registered, got nil")
				}

				err := tmpl.Execute(w, struct{ Name string }{"Test"})
				if err != nil {
					t.Errorf("unexpected error executing template: %v", err)
				}

				expectedOutput := "<h1>Hello, Test!</h1>"
				if w.Body.String() != expectedOutput {
					t.Errorf("expected output to be %q, got %q", expectedOutput, w.Body.String())
				}
			},
		},
		{
			"should return an error if the template does not exist",
			func(t *testing.T) {
				tmpl := manager.Get("nonexistent-template")
				if tmpl != nil {
					t.Errorf("expected nonexistent-template to be nil, got %v", tmpl)
				}
			},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			beforeEach(t)
			defer afterEach(t)

			tt.test(t)
		})
	}
}
