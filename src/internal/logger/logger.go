package logger

import (
	"context"
	"fmt"
	"log"
	"os"
)

type LogLevel uint8

const (
	LOG_LEVEL_DEBUG LogLevel = iota
	LOG_LEVEL_INFO
	LOG_LEVEL_WARN
	LOG_LEVEL_ERROR
	LOG_LEVEL_FATAL
)

type Logger interface {
	Debug(ctx context.Context, msg string, args ...any)
	Info(ctx context.Context, msg string, args ...any)
	Warn(ctx context.Context, msg string, args ...any)
	Error(ctx context.Context, msg string, args ...any)
	Fatal(ctx context.Context, msg string, args ...any)
}

type logger struct {
	Logger
	level LogLevel
}

func (l *logger) log(thresh LogLevel, ctx context.Context, msg string, args ...any) {
	if l.level > thresh {
		return // Skip logs if the level is higher than the threshold
	}
	m := fmt.Sprintf(msg, args...)
	log.Printf("level=%s msg='%s'", l.getLogLevelName(thresh), m)
}

func (l *logger) getLogLevelName(level LogLevel) string {
	switch level {
	case LOG_LEVEL_DEBUG:
		return "DEBUG"
	case LOG_LEVEL_INFO:
		return "INFO"
	case LOG_LEVEL_WARN:
		return "WARN"
	case LOG_LEVEL_ERROR:
		return "ERROR"
	case LOG_LEVEL_FATAL:
		return "FATAL"
	default:
		return "UNKNOWN"
	}
}

func (l *logger) Debug(ctx context.Context, msg string, args ...any) {
	l.log(LOG_LEVEL_DEBUG, ctx, msg, args...)
}

func (l *logger) Info(ctx context.Context, msg string, args ...any) {
	l.log(LOG_LEVEL_INFO, ctx, msg, args...)
}

func (l *logger) Warn(ctx context.Context, msg string, args ...any) {
	l.log(LOG_LEVEL_WARN, ctx, msg, args...)
}

func (l *logger) Error(ctx context.Context, msg string, args ...any) {
	l.log(LOG_LEVEL_ERROR, ctx, msg, args...)
}

func (l *logger) Fatal(ctx context.Context, msg string, args ...any) {
	l.log(LOG_LEVEL_DEBUG, ctx, msg, args...)
	os.Exit(1)
}

func NewLogger(level LogLevel) Logger {
	return &logger{level: level}
}
