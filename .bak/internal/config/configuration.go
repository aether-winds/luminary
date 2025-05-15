package config

import (
	"fmt"
	"os"
	"reflect"
)

func Configure(config any) chan bool {
	t := validateConfig(config)
	if t.NumField() == 0 {
		return nil // no fields to configure, no error
	}

	done := make(chan bool, 1)
	go func() {
		defer close(done)
		v := reflect.ValueOf(config).Elem()

		for i := 0; i < t.NumField(); i++ {
			var configVal string

			field := t.Field(i)
			configKey := field.Tag.Get("configKey")
			configDef := field.Tag.Get("configDef")

			if configVal = os.Getenv(configKey); configVal == "" {
				configVal = configDef
			}

			v.FieldByName(field.Name).SetString(configVal)
		}
	}()
	return done
}

func validateConfig(config any) reflect.Type {
	tp := reflect.TypeOf(config)
	if tp.Kind() != reflect.Pointer {
		// configuration failed, so panic
		panic(fmt.Errorf("config must be a pointer to a struct"))
	}

	t := tp.Elem()
	if t.Kind() != reflect.Struct {
		// configuration failed, so panic
		panic(fmt.Errorf("dereferenced config must be a struct"))
	}

	return t
}
