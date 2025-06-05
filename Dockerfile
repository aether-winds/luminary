# syntax=docker/dockerfile:1.4
FROM golang:1.24.2

WORKDIR /source
COPY src ./
COPY certs /etc/luminary/certs
RUN go mod download

# RUN cd internal/server && pwd && ls -al && exit 1
RUN CGO_ENABLED=0 GOOS=linux go build -o /build ./cmd/luminary

EXPOSE 8443
ENV LUM_PORT=8443

CMD ["/build"]
