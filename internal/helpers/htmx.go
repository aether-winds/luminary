package helpers

import "net/http"

func IsHtmxRequest(r *http.Request) bool {
	return r.Header.Get("HX-Request") == "true"
}
