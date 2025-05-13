package types

import "net/http"

type Route struct {
	Pattern string
	Handler http.HandlerFunc
}
