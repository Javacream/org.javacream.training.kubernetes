## get service classes, you should find local-storage
* kubectl get sc

## apply persistence volume claim and pod
* kubectl apply -f one_gig_local.yml
* kubectl apply -f app.yml

## connect to server
* kubectl exec -it volpod -- sh

# Ephemeral

## Pod erzeugen

* kubectl apply -f ephemeral.yml

## Check
* port-forward, Check im Browser

## Shell in die beiden Container
*  /usr/share/nginx/ -> Darin eine Datei anlegen
* /tmp/git -> Datei ist auch hier zu sehen

## Stoppen der Container entweder über Docker oder kubectl
* Kubernetes startet automatisch -> Check Dateien
* Löschen eines Containers (nginx) -> Kubernetes erzeugt und startet neuen -> Dateien sind immer noch da

## Persitence Volume

* kubectl apply -f one_gig_local.yml
* kubectl apply -f app.yml


## check
/data exists and is empty

## Use Windows file system

* \\wsl.localhost\rancher-desktop\var\lib\rancher\k3s\storage\pvc-..._one-gig
* create file

