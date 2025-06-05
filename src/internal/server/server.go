package server

import (
	"context"
	"fmt"
	"html/template"
	"log"
	"net/http"
	"os"
	"path"

	"github.com/aether-winds/luminary/internal/logger"
	"github.com/google/uuid"
)

var certFile string
var csp string
var keyFile string
var l logger.Logger
var port string
var server *http.ServeMux
var wd string

type ContextValue string

func init() {
	certFile = os.Getenv("LUM_CERT_FILE")
	if certFile == "" {
		certFile = "/etc/luminary/certs/cert.pem"
	}

	keyFile = os.Getenv("LUM_KEY_FILE")
	if keyFile == "" {
		keyFile = "/etc/luminary/certs/server.key"
	}

	port = os.Getenv("LUM_PORT")
	if port == "" {
		port = "8443"
	}

	csp = os.Getenv("LUM_CSP")
	if csp == "" {
		// Content Security Policy Settings
		base := "base-uri 'none'"
		object := "object-src 'none'"
		report := "report-uri /api/v1/security/csp/report"
		script := "script-src 'nonce-%s' 'strict-dynamic' https: http:"
		styles := "style-src 'nonce-%s' 'strict-dynamic' https: http:"
		csp = fmt.Sprintf("%s; %s; %s; %s; %s", object, script, styles, base, report)
	}

	l = logger.NewLogger(logger.LOG_LEVEL_INFO)

	var err error
	wd, err = os.Getwd()
	if err != nil {
		l.Fatal(context.Background(), "failed to get working directory: %v", err)
	}

	server = http.NewServeMux()
	server.Handle("GET /static/", http.StripPrefix("/static/", http.FileServer(http.Dir(path.Join(wd, "internal", "static")))))
}

func RegisterRoutes(routes ...Route) {
	for _, route := range routes {
		var t *template.Template
		if route.TemplatePath == "" {
			t = template.Must(template.ParseFiles(path.Join(wd, "internal", "server", "root.html")))
		} else {
			t = template.Must(template.ParseFiles(
				path.Join(wd, "internal", "server", "root.html"),
				path.Join(wd, route.TemplatePath),
			))
		}

		server.HandleFunc(route.Pattern, func(w http.ResponseWriter, r *http.Request) {
			l.Info(r.Context(), "REQUEST: %s %s from %s", r.Method, r.URL.Path, r.RemoteAddr)
			nonce := uuid.New().String()
			ctx := context.WithValue(r.Context(), ContextValue("Route"), &RouteContext{Nonce: nonce})

			w.Header().Set("Content-Security-Policy", fmt.Sprintf(csp, nonce, nonce))

			if r.Method == "GET" && r.Header.Get("HX-Request") != "true" {
				if err := t.ExecuteTemplate(w, "root", ctx.Value(ContextValue("Route"))); err != nil {
					l.Error(r.Context(), "failed to execute template: %v", err)
					http.Error(w, "internal server error", http.StatusInternalServerError)
					return
				}
				return
			}
			route.Handler(w, r.WithContext(ctx))
		})
	}
}

func GetRouteContextFromRequest(r *http.Request) (*RouteContext, bool) {
	routeCtx, ok := r.Context().Value(ContextValue("Route")).(*RouteContext)
	if !ok {
		return nil, false
	}

	return routeCtx, true
}

func Start() {
	ctx := context.Background()
	l.Info(ctx, "Starting server with certFile: %s", certFile)
	l.Info(ctx, "Starting server with keyFile: %s", keyFile)
	l.Info(ctx, "Starting server on port: %s", port)
	log.Fatal(http.ListenAndServeTLS(":"+port, certFile, keyFile, server))
}

type Route struct {
	Handler      func(w http.ResponseWriter, r *http.Request)
	Pattern      string
	TemplatePath string
}

type RouteContext struct {
	Nonce string
}
