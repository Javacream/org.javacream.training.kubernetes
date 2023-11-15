## install via http

* kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/v2.7.0/aio/deploy/recommended.yaml

## create user and binding

* kubectl apply -f dashboard-user.yaml
* kubectl apply -f rbac.yaml

## create token

* kubectl -n kubernetes-dashboard create token admin-user
* save token

## start proxy
* kubectl proxy 
## open browser
* http://localhost:8001
* authenticate using the created token