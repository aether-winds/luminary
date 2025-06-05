package cspreporter

import (
	"io"
	"net/http"

	"github.com/aether-winds/luminary/internal/logger"
	"github.com/aether-winds/luminary/internal/server"
)

var l logger.Logger
var routes []server.Route

func init() {
	l = logger.NewLogger(logger.LOG_LEVEL_INFO)

	routes = []server.Route{
		{
			Handler: func(w http.ResponseWriter, r *http.Request) {
				body, err := io.ReadAll(r.Body)
				if err != nil {
					l.Error(r.Context(), "failed to read request body: %v", err)
					http.Error(w, "internal server error", http.StatusInternalServerError)
					return
				}

				l.Info(r.Context(), "CSP report received from %s at path %s", r.RemoteAddr, r.URL.Path)
				l.Info(r.Context(), "CSP Violation: %s", body)
				w.WriteHeader(http.StatusCreated)
				w.Write([]byte("201 Created"))
			},
			Pattern:      "POST /api/v1/security/csp/report",
			TemplatePath: "",
		},
	}
}

func GetRoutes() []server.Route {
	return routes
}
