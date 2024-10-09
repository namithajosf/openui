package main

import (
	"fmt"
	"net/http"
)

func messageHandler(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintf(w, "Hello from Go!")
}

func main() {
    http.HandleFunc("/message", messageHandler)
    http.ListenAndServe(":8080", nil)
}
