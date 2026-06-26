# Kubernetes Labels und Label Selector (matchSelector)

## Lernziel

Nach diesem Kapitel können Sie:

- den Zweck von Labels erklären,
- Labels zu Kubernetes-Ressourcen hinzufügen,
- Ressourcen anhand von Labels filtern,
- den Zusammenhang zwischen Labels und `matchSelector` verstehen.

---

# Was sind Labels?

**Labels** sind Schlüssel-Wert-Paare (Key-Value-Pairs), mit denen Kubernetes-Ressourcen eindeutig gekennzeichnet werden können.

Sie dienen zur Organisation, Gruppierung und Auswahl von Ressourcen.

Ein Label besteht immer aus:

```
Schlüssel: Wert
```

Beispiele:

```yaml
app: nginx
environment: development
tier: frontend
version: v1
```

Eine Ressource kann beliebig viele Labels besitzen.

---

# Warum Labels?

Stellen wir uns einen Cluster mit vielen Anwendungen vor.

```
Pod 1    nginx
Pod 2    nginx
Pod 3    mysql
Pod 4    redis
Pod 5    apache
```

Ohne Labels könnte Kubernetes nicht erkennen, welche Pods zu welcher Anwendung gehören.

Mit Labels sieht das deutlich strukturierter aus.

| Pod | Labels |
|------|---------|
| nginx-1 | app=web |
| nginx-2 | app=web |
| mysql | app=database |
| redis | app=cache |

Jetzt kann Kubernetes gezielt alle Pods einer Anwendung auswählen.

---

# Labels in einer YAML-Datei

Ein Label wird im Bereich `metadata` definiert.

```yaml
apiVersion: v1
kind: Pod

metadata:
  name: nginx
  labels:
    app: web
    environment: development

spec:
  containers:
  - name: nginx
    image: nginx
```

Hier besitzt der Pod zwei Labels:

- app = web
- environment = development

---

# Labels anzeigen

Alle Labels eines Pods können angezeigt werden:

```bash
kubectl get pods --show-labels
```

Beispiel:

```
NAME      READY   STATUS
nginx     1/1     Running

LABELS
app=web,environment=development
```

---

# Nach Labels filtern

Mit Labels können gezielt Ressourcen ausgewählt werden.

Beispiel:

```bash
kubectl get pods -l app=web
```

Ausgabe:

```
NAME
nginx-1
nginx-2
```

Weitere Beispiele:

```bash
kubectl get pods -l environment=development
```

oder

```bash
kubectl get pods -l app=database
```

---

# Labels nachträglich hinzufügen

Labels können jederzeit ergänzt werden.

```bash
kubectl label pod nginx version=v1
```

Kontrolle:

```bash
kubectl get pods --show-labels
```

---

# Labels ändern

Existiert das Label bereits:

```bash
kubectl label pod nginx version=v2 --overwrite
```

---

# Labels entfernen

```bash
kubectl label pod nginx version-
```

---

# Warum sind Labels so wichtig?

Viele Kubernetes-Ressourcen arbeiten ausschließlich über Labels.

Beispiele:

- Deployment
- ReplicaSet
- Service
- NetworkPolicy
- PodDisruptionBudget

Sie alle verwenden Label Selector.

---

# Was ist ein Label Selector?

Ein **Label Selector** wählt Ressourcen anhand ihrer Labels aus.

Der Selector sagt beispielsweise:

> "Verwende alle Pods mit dem Label `app=web`."

Ein Deployment oder Service sucht also nicht nach Pod-Namen, sondern nach Labels.

---

# matchSelector (genauer: matchLabels)

Innerhalb eines Deployments wird festgelegt, welche Pods zum Deployment gehören.

Dies geschieht über

```yaml
selector:
  matchLabels:
```

---

# Beispiel

```yaml
apiVersion: apps/v1
kind: Deployment

metadata:
  name: nginx

spec:

  replicas: 3

  selector:
    matchLabels:
      app: web

  template:

    metadata:
      labels:
        app: web

    spec:

      containers:

      - name: nginx
        image: nginx
```

---

# Wie funktioniert das?

```
Deployment

matchLabels

app = web
      │
      ▼

+--------------------+
| Pod                |
| app = web          |
+--------------------+

+--------------------+
| Pod                |
| app = web          |
+--------------------+

+--------------------+
| Pod                |
| app = web          |
+--------------------+
```

Das Deployment verwaltet alle Pods, deren Label

```
app = web
```

lautet.

---

# Warum müssen Labels übereinstimmen?

Der Selector muss exakt zu den Labels im Pod-Template passen.

Richtig:

```yaml
selector:

  matchLabels:
    app: web
```

und

```yaml
template:

  metadata:

    labels:
      app: web
```

---

# Falsches Beispiel

```yaml
selector:

  matchLabels:
    app: web
```

aber

```yaml
template:

  metadata:

    labels:
      app: nginx
```

Jetzt findet das Deployment seine eigenen Pods nicht.

Das Deployment kann dadurch nicht korrekt arbeiten.

---

# Service und Labels

Auch ein Service verwendet Labels.

```yaml
apiVersion: v1
kind: Service

metadata:
  name: web-service

spec:

  selector:
    app: web

  ports:

  - port: 80
    targetPort: 80
```

Der Service sendet Anfragen ausschließlich an Pods mit

```
app=web
```

Alle anderen Pods werden ignoriert.

---

# Best Practices

Verwenden Sie aussagekräftige Labels.

Beispiele:

```yaml
app: webshop
```

```yaml
environment: development
```

```yaml
environment: test
```

```yaml
environment: production
```

```yaml
tier: frontend
```

```yaml
tier: backend
```

```yaml
version: v1
```

```yaml
version: v2
```

---

# Hands-On 1

Erstellen Sie einen Pod.

```yaml
apiVersion: v1
kind: Pod

metadata:
  name: nginx

  labels:
    app: web
    version: v1

spec:

  containers:

  - name: nginx
    image: nginx
```

Deployment:

```bash
kubectl apply -f pod.yaml
```

Kontrolle:

```bash
kubectl get pods --show-labels
```

---

# Hands-On 2

Filtern Sie den Pod.

```bash
kubectl get pods -l app=web
```

```bash
kubectl get pods -l version=v1
```

---

# Hands-On 3

Fügen Sie ein weiteres Label hinzu.

```bash
kubectl label pod nginx environment=development
```

Kontrolle:

```bash
kubectl get pods --show-labels
```

---

# Hands-On 4

Ändern Sie das Label.

```bash
kubectl label pod nginx version=v2 --overwrite
```

Kontrolle:

```bash
kubectl get pods --show-labels
```

---

# Zusammenfassung

## Labels

- beschreiben Kubernetes-Ressourcen
- bestehen aus Schlüssel und Wert
- ermöglichen die Gruppierung von Ressourcen
- können beliebig kombiniert werden

## Label Selector

- wählen Ressourcen anhand ihrer Labels aus
- werden von Deployments und Services verwendet
- arbeiten unabhängig vom Namen eines Pods

## matchLabels

- ist die einfachste Form eines Label Selectors
- verbindet Deployments mit ihren Pods
- muss exakt zu den Labels des Pod-Templates passen

---

# Merksatz

> **Labels beschreiben Ressourcen.**
>
> **Label Selector wählen Ressourcen aus.**
>
> **`matchLabels` verbindet Deployments und Services mit den passenden Pods.**