package templates_test

import (
	"net/http/httptest"
	"path"
	"testing"

	"github.com/aether-winds/luminary/internal/templates"
)

func TestTemplateManager(t *testing.T) {
	t.Run("should initlialize root templates", func(t *testing.T) {
		manager := templates.NewTemplateManager(
			templates.WithTemplateDirectory(path.Join(".", "html")),
		)
		tmpl := manager.Get("root.html")
		if tmpl == nil {
			t.Error("expected root template to be initialized, got nil")
		}
	})

	t.Run("should register a given template", func(t *testing.T) {
		manager := templates.NewTemplateManager(
			templates.WithTemplateDirectory(path.Join("..", "testdata", "templates")),
		)

		manager.Register("my-template.html")

		tmpl := manager.Get("my-template")
		if tmpl == nil {
			t.Errorf("expected my-template.html to be registered, got nil")
		}
	})

	// t.Run("should return an error if the template file does not exist", func(t *testing.T) {
	// 	manager := templates.NewTemplateManager(
	// 		templates.WithTemplateDirectory(path.Join("..", "testdata", "templates")),
	// 	)

	// 	err := manager.Register("nonexistent-template.html")
	// 	if err == nil {
	// 		t.Errorf("expected error registering nonexistent template, got nil")
	// 	}

	// 	unwrappedErr := errors.Unwrap(err)
	// 	if unwrappedErr == nil {
	// 		t.Errorf("expected unwrapped error to be non-nil, got nil")
	// 	}

	// 	if !errors.Is(unwrappedErr, os.ErrNotExist) {
	// 		t.Errorf("expected unwrapped error to be os.ErrNotExist, got %v", unwrappedErr)
	// 	}
	// })

	t.Run("should execute a template", func(t *testing.T) {
		w := httptest.NewRecorder()
		manager := templates.NewTemplateManager(
			templates.WithTemplateDirectory(path.Join("..", "testdata", "templates")),
		)

		manager.Register("my-template.html")
		tmpl := manager.Get("my-template")
		if tmpl == nil {
			t.Errorf("expected my-template to be registered, got nil")
		}

		err := tmpl.Execute(w, struct{ Name string }{"World"})
		if err != nil {
			t.Errorf("unexpected error executing template: %v", err)
		}

		expectedOutput := "<p>Hello, World!</p>"
		if w.Body.String() != expectedOutput {
			t.Errorf("expected output to be %q, got %q", expectedOutput, w.Body.String())
		}
	})

	t.Run("should return nil if the template does not exist", func(t *testing.T) {
		manager := templates.NewTemplateManager()
		tmpl := manager.Get("nonexistent-template")
		if tmpl != nil {
			t.Errorf("expected nonexistent-template to be nil, got %v", tmpl)
		}
	})
}
