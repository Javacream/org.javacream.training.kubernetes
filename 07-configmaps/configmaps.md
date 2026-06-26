# Kubernetes ConfigMaps

## Lernziel

Nach diesem Kapitel können Sie:

* erklären, wofür ConfigMaps verwendet werden,
* eine ConfigMap erstellen,
* Konfigurationswerte in Pods verwenden,
* Konfigurationsdaten als Umgebungsvariablen oder Dateien bereitstellen,
* den Unterschied zwischen ConfigMaps und Secrets erläutern.

---

# Was ist eine ConfigMap?

Eine **ConfigMap** speichert Konfigurationsdaten einer Anwendung.

Typische Inhalte sind:

* Konfigurationsparameter
* Umgebungsvariablen
* Dateiinhalte
* URLs
* Portnummern
* Feature-Flags

**Wichtig:**

Eine ConfigMap enthält **keine vertraulichen Daten** wie Passwörter oder API-Schlüssel.

---

# Warum ConfigMaps?

Ohne ConfigMaps werden Konfigurationswerte häufig direkt in der YAML-Datei hinterlegt.

Beispiel:

```yaml
env:
- name: SERVER_PORT
  value: "8080"

- name: LOG_LEVEL
  value: "INFO"
```

Ändert sich die Konfiguration, muss das Deployment angepasst werden.

Mit einer ConfigMap wird die Konfiguration von der Anwendung getrennt.

```
Deployment
      │
      ▼
 ConfigMap
      │
      ▼
 Konfigurationsdaten
```

---

# Vorteile

* Trennung von Anwendung und Konfiguration
* Wiederverwendbar
* Einfach zu ändern
* Mehrere Pods können dieselbe ConfigMap verwenden
* Keine Änderung des Container-Images erforderlich

---

# ConfigMap erstellen

## Variante 1: YAML

```yaml
apiVersion: v1
kind: ConfigMap

metadata:
  name: webshop-config

data:
  SERVER_PORT: "8080"
  LOG_LEVEL: "INFO"
  APP_NAME: "Webshop"
```

Erstellen:

```bash
kubectl apply -f configmap.yaml
```

---

## Variante 2: Imperativ

```bash
kubectl create configmap webshop-config \
  --from-literal=SERVER_PORT=8080 \
  --from-literal=LOG_LEVEL=INFO
```

---

# ConfigMaps anzeigen

Alle ConfigMaps:

```bash
kubectl get configmaps
```

oder

```bash
kubectl get cm
```

Details:

```bash
kubectl describe configmap webshop-config
```

YAML anzeigen:

```bash
kubectl get configmap webshop-config -o yaml
```

---

# ConfigMap als Umgebungsvariable

Eine ConfigMap kann einzelne Werte als Umgebungsvariablen bereitstellen.

```yaml
apiVersion: v1
kind: Pod

metadata:
  name: nginx

spec:
  containers:

  - name: nginx
    image: nginx

    env:

    - name: APP_NAME

      valueFrom:

        configMapKeyRef:
          name: webshop-config
          key: APP_NAME
```

Im Container steht anschließend die Variable

```text
APP_NAME=Webshop
```

zur Verfügung.

---

# Alle Werte als Umgebungsvariablen

```yaml
envFrom:

- configMapRef:
    name: webshop-config
```

Alle Schlüssel der ConfigMap werden automatisch als Umgebungsvariablen angelegt.

---

# ConfigMap als Datei bereitstellen

ConfigMaps können auch als Dateien eingebunden werden.

```yaml
volumes:

- name: config-volume

  configMap:
    name: webshop-config
```

Einbinden:

```yaml
volumeMounts:

- name: config-volume
  mountPath: /config
```

Im Container entstehen Dateien:

```
/config

├── APP_NAME
├── LOG_LEVEL
└── SERVER_PORT
```

Der Inhalt jeder Datei entspricht dem jeweiligen Wert der ConfigMap.

---

# Beispiel

ConfigMap

```yaml
data:

  APP_NAME: Webshop

  LOG_LEVEL: INFO
```

Im Container:

```
/config/APP_NAME
```

Inhalt:

```
Webshop
```

---

# ConfigMap aktualisieren

Änderung:

```yaml
data:

  LOG_LEVEL: DEBUG
```

Anschließend:

```bash
kubectl apply -f configmap.yaml
```

**Wichtig:**

Bereits laufende Anwendungen übernehmen Änderungen an Umgebungsvariablen **nicht automatisch**.

In vielen Fällen muss der Pod neu gestartet werden.

---

# ConfigMap löschen

```bash
kubectl delete configmap webshop-config
```

---

# ConfigMap oder Secret?

| ConfigMap                | Secret                                 |
| ------------------------ | -------------------------------------- |
| Allgemeine Konfiguration | Vertrauliche Daten                     |
| Klartext                 | Base64-kodiert (keine Verschlüsselung) |
| URLs                     | Passwörter                             |
| Ports                    | Zertifikate                            |
| Log-Level                | API-Keys                               |
| Feature-Flags            | Zugangsdaten                           |

---

# Hands-On 1

ConfigMap erstellen

```yaml
apiVersion: v1
kind: ConfigMap

metadata:
  name: demo-config

data:
  APP_NAME: Kubernetes Demo
  LOG_LEVEL: INFO
```

Deployment:

```bash
kubectl apply -f configmap.yaml
```

Kontrolle:

```bash
kubectl get configmaps
```

---

# Hands-On 2

Pod mit ConfigMap erstellen.

```yaml
envFrom:

- configMapRef:
    name: demo-config
```

Pod starten.

Im Container prüfen:

```bash
kubectl exec -it demo -- sh
```

```sh
printenv
```

Die Variablen sollten sichtbar sein.

---

# Hands-On 3

ConfigMap ändern.

```yaml
LOG_LEVEL: DEBUG
```

ConfigMap aktualisieren:

```bash
kubectl apply -f configmap.yaml
```

Pod neu starten.

Erneut prüfen:

```sh
printenv
```

---

# Best Practices

✅ Konfiguration von der Anwendung trennen.

✅ ConfigMaps mehrfach verwenden.

✅ Aussagekräftige Namen vergeben.

✅ Keine Passwörter oder Zugangsdaten speichern.

---

# Typische Fehler

❌ Schreibfehler im Namen der ConfigMap

```yaml
name: webshop-config
```

Deployment:

```yaml
name: webshopconfig
```

Der Pod startet möglicherweise nicht oder erhält keine Konfigurationswerte.

---

❌ Falscher Schlüssel

```yaml
key: SERVERPORT
```

statt

```yaml
key: SERVER_PORT
```

---

❌ Vertrauliche Daten in ConfigMaps speichern

Passwörter gehören in **Secrets**, nicht in ConfigMaps.

---

# Zusammenfassung

ConfigMaps speichern:

* Konfigurationswerte
* Umgebungsvariablen
* Dateiinhalte

Sie können:

* als Umgebungsvariablen
* oder als Dateien

in Pods eingebunden werden.

---

# Merksatz

> **ConfigMaps enthalten Konfigurationsdaten einer Anwendung.**
>
> **Sie trennen Konfiguration von der Anwendung und ermöglichen eine flexible Verwaltung ohne Änderung des Container-Images.**
>
> **Vertrauliche Daten gehören nicht in ConfigMaps, sondern in Secrets.**
