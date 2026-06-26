# Installation von Prometheus und Grafana mit Helm

## Lernziel

Nach diesem Kapitel können Sie:

- Helm als Paketmanager für Kubernetes verwenden.
- Ein Helm Repository hinzufügen.
- Den Prometheus-Stack installieren.
- Den Installationsstatus überprüfen.
- Grafana über Port-Forwarding aufrufen.

---

# Voraussetzungen

Installiert sind:

- Rancher Desktop
- Kubernetes
- kubectl
- Helm

Helm-Version prüfen:

```bash
helm version
```

Cluster prüfen:

```bash
kubectl cluster-info
```

---

# 1. Helm Repository hinzufügen

Das Prometheus-Stack wird über das Repository **prometheus-community** bereitgestellt.

Repository hinzufügen:

```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
```

Repository aktualisieren:

```bash
helm repo update
```

Vorhandene Charts anzeigen:

```bash
helm search repo prometheus
```

---

# 2. Namespace anlegen

```bash
kubectl create namespace monitoring
```

Kontrolle:

```bash
kubectl get ns
```

---

# 3. kube-prometheus-stack installieren

Installation:

```bash
helm install monitoring prometheus-community/kube-prometheus-stack --namespace monitoring
```

Der Download kann einige Minuten dauern.

---

# 4. Installation prüfen

Helm Releases anzeigen:

```bash
helm list -A
```

Pods anzeigen:

```bash
kubectl get pods -n monitoring
```

Beispiel:

```
NAME

alertmanager-monitoring-kube-prometheus...

grafana-xxxxxxxx

prometheus-monitoring-kube-prometheus...

prometheus-operator-xxxxxxxx

node-exporter-xxxxxxxx
```

---

# 5. Services anzeigen

```bash
kubectl get svc -n monitoring
```

Beispiel:

```
NAME

monitoring-grafana

monitoring-kube-prometheus-prometheus

monitoring-kube-state-metrics
```

---

# 6. Grafana-Passwort ermitteln

Das Passwort wird als Kubernetes Secret gespeichert.

Benutzer:

```
admin
```

Passwort anzeigen:

```bash
kubectl get secret \
monitoring-grafana \
-n monitoring \
-o jsonpath="{.data.admin-password}" | base64 --decode
```

---

# 7. Grafana öffnen

Da Rancher Desktop keinen externen LoadBalancer besitzt, wird Port Forwarding verwendet.

```bash
kubectl port-forward svc/monitoring-grafana \
3000:80 \
-n monitoring
```

Browser öffnen:

```
http://localhost:3000
```

Benutzer:

```
admin
```

Passwort:

```
siehe vorheriger Schritt
```

---

# 8. Prometheus öffnen

```bash
kubectl port-forward svc/monitoring-kube-prometheus-prometheus 9090:9090 -n monitoring
```

Browser:

```
http://localhost:9090
```

---

# 9. Installation überprüfen

Pods:

```bash
kubectl get pods -n monitoring
```

Services:

```bash
kubectl get svc -n monitoring
```

Helm Release:

```bash
helm list -n monitoring
```

---

# 10. Installation entfernen

```bash
helm uninstall monitoring \
-n monitoring
```

Namespace löschen:

```bash
kubectl delete namespace monitoring
```

---

# Wichtige Komponenten

| Komponente | Aufgabe |
|------------|---------|
| Prometheus | Sammelt Metriken |
| Grafana | Visualisierung |
| Alertmanager | Alarmierung |
| Node Exporter | Liefert Betriebssystem-Metriken |
| kube-state-metrics | Liefert Kubernetes-Metriken |
| Prometheus Operator | Verwaltet Prometheus-Instanzen |

---

# Architektur

```
                Kubernetes Cluster

       +-------------------------------+

              kube-state-metrics
                     │

Node Exporter ───────┤

                     ▼

                Prometheus
                     │

              Zeitreihendaten
                     │

                     ▼

                 Grafana
                     │

              http://localhost:3000
```

---

# Hands-On

Installieren Sie den kompletten Monitoring-Stack.

Kontrollieren Sie anschließend:

```bash
helm list -A
```

```bash
kubectl get pods -n monitoring
```

```bash
kubectl get svc -n monitoring
```

Öffnen Sie Grafana über Port Forwarding.

---

# Zusammenfassung

Mit einem einzigen Helm-Befehl wird ein vollständiger Monitoring-Stack installiert.

Helm übernimmt dabei:

- Download
- Installation
- Konfiguration
- Upgrade
- Deinstallation

Der **kube-prometheus-stack** ist heute der Standard für Monitoring in Kubernetes und eignet sich hervorragend, um den praktischen Einsatz von Helm in einer Schulung zu demonstrieren.

---

# Merksatz

> **Helm ist der Paketmanager für Kubernetes.**

> **Der kube-prometheus-stack installiert mit einem einzigen Helm-Befehl einen vollständigen Monitoring-Stack aus Prometheus, Grafana und weiteren Komponenten.**