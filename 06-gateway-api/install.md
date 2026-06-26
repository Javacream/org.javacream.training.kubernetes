* Check Gateway Classes

    kubectl get gc
    
* Install
    kubectl kustomize \
  "https://github.com/nginx/nginx-gateway-fabric/config/crd/gateway-api/standard?ref=v2.3.0" \
  | kubectl apply -f -

  * Check

    kubectl api-resources --api-group=gateway.networking.k8s.io

* Install Gateway with helm

    helm install ngf oci://ghcr.io/nginx/charts/nginx-gateway-fabric \
  --version 2.3.0 \
  --namespace nginx-gateway \
  --create-namespace

  * Check Gateway is running

    kubectl get pods -n nginx-gateway


* Check Gateway Classes

    kubectl get gc
    
