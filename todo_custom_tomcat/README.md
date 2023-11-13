## build Docker Image

* docker build -t javacream/tomcat:1.0 .

## create pod

* kubectl apply -f javacream-tomcat.yaml

## port forward

* kubectl port-forward javacream-tomcat-pod 9090:8080

## check

* open localhost:9090 in a browser window