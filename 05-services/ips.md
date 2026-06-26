# Kubernetes – Die verschiedenen IP-Adressen

## Lernziel

Nach diesem Kapitel können Sie:

* die verschiedenen IP-Adressen in Kubernetes unterscheiden,
* erklären, wofür Pod-IP, ClusterIP, Node-IP und LoadBalancer-IP verwendet werden,
* erkennen, welche IP-Adresse innerhalb bzw. außerhalb des Clusters erreichbar ist.

---

# Warum gibt es mehrere IP-Adressen?

In Kubernetes existieren verschiedene Netzwerkebenen.

Jede Ebene besitzt ihre eigene IP-Adresse.

Ein typischer Kommunikationsweg sieht so aus:

```text
Internet
    │
    ▼
LoadBalancer-IP (optional)
    │
    ▼
Node-IP
    │
    ▼
Service (ClusterIP)
    │
    ▼
Pod-IP
```

Nicht jede dieser IP-Adressen ist von außen erreichbar.

---

# 1. Pod-IP

Jeder Pod erhält beim Start automatisch eine eigene IP-Adresse.

Beispiel:

```text
Pod
┌────────────────────────┐
│ Pod-IP: 10.42.0.15     │
└────────────────────────┘
```

Die Pod-IP dient der Kommunikation innerhalb des Clusters.

## Eigenschaften

* Jeder Pod besitzt eine eigene IP-Adresse.
* Die IP wird beim Start vergeben.
* Wird ein Pod gelöscht und neu erstellt, erhält er in der Regel eine neue IP-Adresse.
* Anwendungen sollten daher niemals direkt über die Pod-IP angesprochen werden.

### Anzeigen

```bash
kubectl get pods -o wide
```

Beispiel:

```text
NAME     READY   STATUS    IP
web      1/1     Running   10.42.0.15
```

---

# 2. ClusterIP

Ein Service besitzt eine feste IP-Adresse.

Diese nennt Kubernetes **ClusterIP**.

```text
Service
┌────────────────────────┐
│ ClusterIP              │
│ 10.43.134.106          │
└────────────────────────┘
           │
           ▼
      mehrere Pods
```

Der Service verteilt eingehende Anfragen auf die passenden Pods.

## Eigenschaften

* Stabile IP-Adresse
* Ändert sich nicht beim Austausch von Pods
* Nur innerhalb des Kubernetes-Clusters erreichbar

### Anzeigen

```bash
kubectl get services
```

Beispiel:

```text
NAME            TYPE        CLUSTER-IP
web-service     ClusterIP   10.43.134.106
```

---

# 3. Node-IP

Jeder Kubernetes-Node besitzt ebenfalls eine IP-Adresse.

```text
Node
┌────────────────────────┐
│ Node-IP                │
│ 192.168.178.25         │
└────────────────────────┘
```

Die Node-IP gehört zum Rechner oder zur virtuellen Maschine, auf der Kubernetes läuft.

## Eigenschaften

* Gehört zum Kubernetes-Node
* Kann von anderen Rechnern im Netzwerk erreichbar sein
* Wird für NodePort-Services verwendet

### Anzeigen

```bash
kubectl get nodes -o wide
```

Beispiel:

```text
NAME       INTERNAL-IP
worker-1   192.168.178.25
```

---

# 4. LoadBalancer-IP

Ein Service vom Typ `LoadBalancer` erhält – meist in einer Cloud – eine externe IP-Adresse.

```text
Internet
     │
     ▼
LoadBalancer-IP
35.199.12.15
     │
     ▼
Service
     │
     ▼
Pods
```

## Eigenschaften

* Öffentliche IP-Adresse
* Von Clients außerhalb des Clusters erreichbar
* Wird häufig automatisch vom Cloud-Anbieter bereitgestellt

### Anzeigen

```bash
kubectl get services
```

Beispiel:

```text
NAME         TYPE           EXTERNAL-IP
web-lb       LoadBalancer   35.199.12.15
```

---

# Vergleich der IP-Typen

| IP-Typ              | Gehört zu              | Beispiel         | Von außen erreichbar |
| ------------------- | ---------------------- | ---------------- | :------------------: |
| **Pod-IP**          | Pod                    | `10.42.0.15`     |           ✘          |
| **ClusterIP**       | Service                | `10.43.134.106`  |           ✘          |
| **Node-IP**         | Kubernetes-Node        | `192.168.178.25` | ✔ (je nach Netzwerk) |
| **LoadBalancer-IP** | Externer Load Balancer | `35.199.12.15`   |           ✔          |

---

# Beispiel einer Anfrage

```text
Browser
    │
    ▼
Node-IP:30090
    │
    ▼
NodePort-Service
    │
    ▼
ClusterIP
    │
    ▼
Pod-IP
```

Oder bei einem LoadBalancer:

```text
Browser
    │
    ▼
LoadBalancer-IP
    │
    ▼
ClusterIP
    │
    ▼
Pod-IP
```

---

# Rancher Desktop

In einem lokalen Cluster (z. B. Rancher Desktop) gilt:

* **Pod-IP** → nur innerhalb des Clusters erreichbar.
* **ClusterIP** → nur innerhalb des Clusters erreichbar.
* **Node-IP** → abhängig von der Netzwerkkonfiguration erreichbar.
* **LoadBalancer-IP** → häufig nicht vorhanden oder nur durch zusätzliche Komponenten (z. B. MetalLB) verfügbar.

Für Tests werden deshalb häufig verwendet:

* `kubectl port-forward`
* Services vom Typ `NodePort`
* (optional) `LoadBalancer`, sofern die lokale Umgebung dies unterstützt

---

# Hands-On

## Pod-IP anzeigen

```bash
kubectl get pods -o wide
```

---

## ClusterIP anzeigen

```bash
kubectl get services
```

---

## Node-IP anzeigen

```bash
kubectl get nodes -o wide
```

---

## Service untersuchen

```bash
kubectl describe service web-service
```

---

# Zusammenfassung

| IP                  | Zweck                                 |
| ------------------- | ------------------------------------- |
| **Pod-IP**          | Kommunikation mit einem einzelnen Pod |
| **ClusterIP**       | Feste interne Adresse eines Services  |
| **Node-IP**         | Adresse des Kubernetes-Nodes          |
| **LoadBalancer-IP** | Öffentliche Adresse eines Services    |

---

# Merksatz

> **Pod-IP** → gehört einem einzelnen Pod und ist nur intern erreichbar.

> **ClusterIP** → gehört einem Service und stellt eine stabile interne Adresse bereit.

> **Node-IP** → gehört dem Kubernetes-Node und dient unter anderem dem Zugriff auf NodePort-Services.

> **LoadBalancer-IP** → ist die öffentliche Adresse eines Services und ermöglicht den Zugriff von außerhalb des Clusters.
