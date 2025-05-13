package config_test

import (
	"testing"

	c "github.com/aether-winds/luminary/internal/config"
)

type TestConfig struct {
	Field1 string `configKey:"TEST_FIELD1" configDef:"default1"`
	Field2 string `configKey:"TEST_FIELD2" configDef:"default2"`
	Field3 string `configKey:"TEST_FIELD3" configDef:"default3"`
}

func TestConfigure(t *testing.T) {
	t.Run("should configure given struct from environment based on tags", func(t *testing.T) {
		t.Setenv("TEST_FIELD1", "value1")
		t.Setenv("TEST_FIELD2", "value2")
		t.Setenv("TEST_FIELD3", "value3")

		config := &TestConfig{}
		done := c.Configure(config)
		<-done

		if config.Field1 != "value1" {
			t.Errorf("Expected Field1 to be 'value1', got '%s'", config.Field1)
		}

		if config.Field2 != "value2" {
			t.Errorf("Expected Field2 to be 'value2', got '%s'", config.Field2)
		}

		if config.Field3 != "value3" {
			t.Errorf("Expected Field3 to be 'value3', got '%s'", config.Field3)
		}
	})

	t.Run("should use default values when environment variables are not set", func(t *testing.T) {
		config := &TestConfig{}
		done := c.Configure(config)
		<-done

		if config.Field1 != "default1" {
			t.Errorf("Expected Field1 to be 'default1', got '%s'", config.Field1)
		}

		if config.Field2 != "default2" {
			t.Errorf("Expected Field2 to be 'default2', got '%s'", config.Field2)
		}

		if config.Field3 != "default3" {
			t.Errorf("Expected Field3 to be 'default3', got '%s'", config.Field3)
		}
	})

	t.Run("should panic if config is not a pointer to a struct", func(t *testing.T) {
		defer func() {
			r := recover()
			if r == nil {
				t.Errorf("expected panic for non-pointer config, but no panic occurred")
			} else if _, ok := r.(error); !ok {
				t.Errorf("expected panic to be of type error, but got %T", r)
			}
		}()

		config := TestConfig{}
		done := c.Configure(config)
		<-done
	})

	t.Run("should panic if config is a non-struct pointer", func(t *testing.T) {
		defer func() {
			r := recover()
			if r == nil {
				t.Errorf("expected panic for non-struct pointer, but no panic occurred")
			} else if _, ok := r.(error); !ok {
				t.Errorf("expected panic to be of type error, but got %T", r)
			}
		}()

		config := 42
		done := c.Configure(&config)
		<-done
	})

	t.Run("should panic if config is neither a pointer nor a struct", func(t *testing.T) {
		defer func() {
			r := recover()
			if r == nil {
				t.Errorf("expected panic for neither pointer nor struct, but no panic occurred")
			} else if _, ok := r.(error); !ok {
				t.Errorf("expected panic to be of type error, but got %T", r)
			}
		}()

		config := "not a pointer or struct"
		done := c.Configure(&config)
		<-done
	})
}
