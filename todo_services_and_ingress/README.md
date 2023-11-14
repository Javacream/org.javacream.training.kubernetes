## build Docker Image
* index.html with "... 1.0"
* docker build -t javacream/webapp:1.0 .
* index.html with "... 1.1"
* docker build -t javacream/webapp:1.1 .

## create deployments

* kubectl apply -f webapps.yml

## check
* kubectl get pods
* kubectl port-forward <pod> 8080:8080
* open localhost:8080 in a browser window

## create service

* kubectl apply -f webapps-service.yml

## check
* open localhost:30002 in a browser window

## change label and check 
* kubectl apply -f webapps-service.yml
* open localhost:30002 in a browser window

## create ingress
* kubectl apply -f webapps-ingress.yml

## check
* open localhost/app in a browser window

## change label in service and check 
* kubectl apply -f webapps-service.yml
* open localhost/app in a browser window
